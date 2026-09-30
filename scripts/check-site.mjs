// End-to-end checks against the built site in out/:
//   - axe-core accessibility rules on every page, in both themes
//   - no horizontal overflow at 360, 768, 1024 and 1440 px
//   - all content visible with JavaScript disabled and with reduced motion
//   - keyboard: skip link first, every section reachable from the nav menu
//
// Usage: npm run check:site   (run `npm run build` first; needs Google Chrome)
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = fileURLToPath(new URL("../out", import.meta.url));
const axePath = createRequire(import.meta.url).resolve("axe-core/axe.min.js");
const PAGES = ["/", "/tldr/", "/resume/", "/404.html"];
const WIDTHS = [360, 768, 1024, 1440];
const THEMES = ["dark", "light"];

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".pdf": "application/pdf",
};

const server = createServer(async (request, response) => {
  try {
    const path = normalize(
      decodeURIComponent(new URL(request.url, "http://x").pathname),
    );
    let file = join(root, path);
    if (!file.startsWith(root)) throw new Error("outside root");
    if (!extname(file)) file = join(file, "index.html");
    const body = await readFile(file);
    response.writeHead(200, {
      "Content-Type": types[extname(file)] ?? "application/octet-stream",
    });
    response.end(body);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const failures = [];
const fail = (message) => {
  failures.push(message);
  console.log(`✗ ${message}`);
};
const pass = (message) => console.log(`✓ ${message}`);

/** Scrolls the whole page so every reveal has a chance to run. */
async function scrollThrough(page) {
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
}

/** Text-bearing elements that are still invisible. */
const hiddenText = () =>
  [...document.querySelectorAll("main *")]
    .filter((element) => {
      if (
        element.closest(
          "[aria-hidden=true], .sr-only, [hidden], dialog, [popover]",
        )
      )
        return false;
      const ownText = [...element.childNodes].some(
        (node) => node.nodeType === 3 && node.textContent.trim(),
      );
      if (!ownText) return false;
      let node = element;
      while (node && node !== document.body) {
        const style = getComputedStyle(node);
        if (style.opacity === "0" || style.visibility === "hidden") return true;
        if (style.display === "none") return false;
        node = node.parentElement;
      }
      return false;
    })
    .map((element) => element.textContent.trim().slice(0, 50));

const browser = await chromium.launch({ channel: "chrome" });
try {
  // 1. axe + overflow, per page, theme and width
  for (const theme of THEMES) {
    const context = await browser.newContext({ colorScheme: theme });
    const page = await context.newPage();
    for (const path of PAGES) {
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(base + path, { waitUntil: "networkidle" });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        if (overflow > 0)
          fail(`${path} ${theme} ${width}px overflows by ${overflow}px`);
      }
      pass(`${path} ${theme}: no horizontal overflow at ${WIDTHS.join(", ")}`);

      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(base + path, { waitUntil: "networkidle" });
      await scrollThrough(page);
      await page.addScriptTag({ path: axePath });
      const violations = await page.evaluate(async () => {
        const result = await window.axe.run(document, {
          runOnly: [
            "wcag2a",
            "wcag2aa",
            "wcag21a",
            "wcag21aa",
            "best-practice",
          ],
        });
        return result.violations.map(
          (violation) =>
            `${violation.id} (${violation.nodes.length}): ${violation.nodes[0].html.slice(0, 120)}`,
        );
      });
      if (violations.length === 0) pass(`${path} ${theme}: axe clean`);
      else
        violations.forEach((violation) =>
          fail(`${path} ${theme} axe: ${violation}`),
        );
    }
    await context.close();
  }

  // 2. JavaScript disabled: everything readable
  {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(base + "/", { waitUntil: "load" });
    const hidden = await page.evaluate(hiddenText);
    if (hidden.length === 0) pass("no-JS: all content visible");
    else
      fail(`no-JS: ${hidden.length} hidden text blocks, e.g. "${hidden[0]}"`);
    await context.close();
  }

  // 3. Reduced motion: final states, no WebGL
  {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(4000);
    const state = await page.evaluate((fn) => {
      const hidden = new Function(`return (${fn})()`)();
      return {
        hidden,
        canvases: document.querySelectorAll("canvas").length,
        pinned: document
          .querySelector("[data-case-study]")
          ?.hasAttribute("data-pinned"),
        lenis: document.documentElement.classList.contains("lenis"),
      };
    }, hiddenText.toString());
    if (state.hidden.length)
      fail(`reduced motion: hidden text, e.g. "${state.hidden[0]}"`);
    else pass("reduced motion: all content visible without scrolling");
    if (state.canvases) fail("reduced motion: WebGL canvas was created");
    else pass("reduced motion: no WebGL canvas");
    if (state.pinned) fail("reduced motion: case study is pinned");
    else pass("reduced motion: case study not pinned");
    if (state.lenis) fail("reduced motion: smooth scroll active");
    else pass("reduced motion: native scrolling");
    await context.close();
  }

  // 4. Keyboard
  {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    const first = await page.evaluate(() =>
      document.activeElement?.textContent?.trim(),
    );
    if (first === "Skip to content")
      pass("keyboard: skip link is the first stop");
    else fail(`keyboard: first stop is "${first}"`);

    const { ids, links } = await page.evaluate(() => ({
      ids: [...document.querySelectorAll("main section[id]")].map(
        (section) => section.id,
      ),
      links: [...document.querySelectorAll(".section-menu a")].map((a) =>
        a.getAttribute("href"),
      ),
    }));
    const missing = ids.filter((id) => !links.includes(`/#${id}`));
    if (missing.length === 0)
      pass(`keyboard: all ${ids.length} sections linked from the nav menu`);
    else
      fail(`keyboard: sections missing from nav menu: ${missing.join(", ")}`);

    const unfocusable = await page.evaluate(() =>
      [...document.querySelectorAll("a[href], button")]
        .filter((element) => element.offsetParent !== null)
        // Links inside a sentence are exempt (WCAG 2.5.8, inline exception).
        .filter((element) => {
          const parent = element.parentElement;
          const inline =
            element.tagName === "A" &&
            parent?.tagName === "P" &&
            parent.textContent.trim().length >
              element.textContent.trim().length + 5;
          return !inline;
        })
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && (rect.height < 24 || rect.width < 24);
        })
        .map((element) => element.textContent.trim().slice(0, 30)),
    );
    if (unfocusable.length === 0)
      pass("targets: every visible control is at least 24px");
    else
      fail(
        `targets smaller than 24px: ${[...new Set(unfocusable)].join(" | ")}`,
      );
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.log(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll site checks passed.");
