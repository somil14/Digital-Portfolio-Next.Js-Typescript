// Prints first-load JS (gzip, modern browsers) per exported page.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const out = fileURLToPath(new URL("../out", import.meta.url));
const BUDGET_KB = 200;

function pages(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory())
      return name === "_next" ? [] : pages(path);
    return name.endsWith(".html") && !name.startsWith("__") ? [path] : [];
  });
}

let failed = false;
for (const page of pages(out)) {
  const html = readFileSync(page, "utf8");
  const scripts = new Set(
    [...html.matchAll(/<script\b[^>]*>/g)]
      .map(([tag]) => tag)
      .filter((tag) => !/nomodule/i.test(tag))
      .map((tag) => tag.match(/src="([^"]+\.js)"/)?.[1])
      .filter(Boolean),
  );
  let bytes = 0;
  for (const src of scripts)
    bytes += gzipSync(readFileSync(join(out, src))).length;
  const kb = bytes / 1024;
  if (kb > BUDGET_KB) failed = true;
  console.log(
    `${kb > BUDGET_KB ? "✗" : "✓"} ${page.slice(out.length).padEnd(24)} ${kb.toFixed(1)} KB first-load JS`,
  );
}
if (failed) process.exit(1);
