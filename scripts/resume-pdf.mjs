// Prints the built /resume page to public/resume/Somil_Athole_Resume.pdf so
// the HTML resume and the PDF can never drift apart.
//
// Usage: npm run resume:pdf   (builds first; needs Google Chrome installed)
import { createServer } from "node:http";
import { mkdir, readFile, copyFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = fileURLToPath(new URL("../out", import.meta.url));
const target = fileURLToPath(
  new URL("../public/resume/Somil_Athole_Resume.pdf", import.meta.url),
);
const builtCopy = join(root, "resume", "Somil_Athole_Resume.pdf");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
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
const { port } = server.address();

const browser = await chromium.launch({ channel: "chrome" });
try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/resume/`, {
    waitUntil: "networkidle",
  });
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => document.fonts.ready);
  await mkdir(join(target, ".."), { recursive: true });
  await page.pdf({ path: target, format: "A4", preferCSSPageSize: true });
  await mkdir(join(builtCopy, ".."), { recursive: true });
  await copyFile(target, builtCopy);
  console.log(`Wrote ${target}`);
} finally {
  await browser.close();
  server.close();
}
