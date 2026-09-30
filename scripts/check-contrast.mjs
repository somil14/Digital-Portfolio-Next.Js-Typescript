// Fails if any text-bearing colour token drops below WCAG AA (4.5:1) against
// any surface in its theme, or if the two light-theme blocks drift apart.
import { readFileSync } from "node:fs";

const MIN_RATIO = 4.5;
const SURFACES = ["bg", "surface", "surface-2"];
const TEXT_TOKENS = ["text", "muted", "signal", "warn", "crit", "ok"];

const css = readFileSync(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);

function block(selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`Selector not found: ${selector}`);
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  const tokens = {};
  for (const [, name, value] of css
    .slice(open + 1, close)
    .matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    tokens[name] = value.toLowerCase();
  }
  return tokens;
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const themes = {
  dark: block(":root {"),
  light: block(':root[data-theme="light"] {'),
};
const lightNoJs = block(":root:not([data-theme]) {");

let failed = false;

for (const [name, value] of Object.entries(themes.light)) {
  if (lightNoJs[name] !== value) {
    console.error(`✗ light --${name} differs between the two light blocks`);
    failed = true;
  }
}

for (const [theme, tokens] of Object.entries(themes)) {
  for (const token of TEXT_TOKENS) {
    for (const surface of SURFACES) {
      const value = ratio(tokens[token], tokens[surface]);
      const ok = value >= MIN_RATIO;
      if (!ok) failed = true;
      console.log(
        `${ok ? "✓" : "✗"} ${theme.padEnd(5)} --${token.padEnd(6)} on --${surface.padEnd(9)} ${value.toFixed(2)}:1`,
      );
    }
  }
}

if (failed) {
  console.error("\nContrast check failed.");
  process.exit(1);
}
console.log("\nAll token pairs pass WCAG AA.");
