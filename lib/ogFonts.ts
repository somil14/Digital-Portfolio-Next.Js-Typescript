import { readFile } from "node:fs/promises";
import { join } from "node:path";

const fontsource = join(process.cwd(), "node_modules", "@fontsource");

/** Fonts for build-time images (OG card, touch icon). Build only. */
export async function loadImageFonts() {
  const [serif, serifItalic, mono] = await Promise.all([
    readFile(
      join(
        fontsource,
        "instrument-serif/files/instrument-serif-latin-400-normal.woff",
      ),
    ),
    readFile(
      join(
        fontsource,
        "instrument-serif/files/instrument-serif-latin-400-italic.woff",
      ),
    ),
    readFile(
      join(fontsource, "geist-mono/files/geist-mono-latin-400-normal.woff"),
    ),
  ]);
  return [
    {
      name: "Instrument Serif",
      data: serif,
      style: "normal" as const,
      weight: 400 as const,
    },
    {
      name: "Instrument Serif",
      data: serifItalic,
      style: "italic" as const,
      weight: 400 as const,
    },
    {
      name: "Geist Mono",
      data: mono,
      style: "normal" as const,
      weight: 400 as const,
    },
  ];
}

/** Dark-theme token values, for images that cannot read CSS variables. */
export const imageColors = {
  bg: "#0a0c0f",
  line: "#1f2630",
  text: "#e6eaf0",
  muted: "#8892b0",
  signal: "#00d4ff",
  warn: "#ffb224",
};
