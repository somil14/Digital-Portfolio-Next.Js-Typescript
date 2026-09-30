import { Color } from "three";

/** Scene colours, read from the CSS tokens so both themes stay in sync. */
export interface ScenePalette {
  signal: Color;
  warn: Color;
  muted: Color;
  ok: Color;
  line: Color;
  light: boolean;
}

export function readPalette(): ScenePalette {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  const token = (name: string) =>
    new Color(style.getPropertyValue(name).trim());
  return {
    signal: token("--signal"),
    warn: token("--warn"),
    muted: token("--muted"),
    ok: token("--ok"),
    line: token("--line"),
    light: root.dataset.theme === "light",
  };
}

/** Calls back with a fresh palette whenever the theme attribute changes. */
export function watchPalette(onChange: (palette: ScenePalette) => void) {
  const observer = new MutationObserver(() => onChange(readPalette()));
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}
