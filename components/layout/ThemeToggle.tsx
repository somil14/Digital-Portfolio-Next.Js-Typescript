"use client";

import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function toggleTheme() {
  const root = document.documentElement;
  const next: Theme = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Storage can be blocked; the choice then lasts for this page view only.
  }
}

/**
 * Which label shows is decided in CSS from `data-theme`, which the inline
 * head script sets before paint. No React state, so nothing to mismatch on
 * hydration.
 */
export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="js-only label text-muted hover:text-text inline-flex h-11 items-center gap-2 px-2 transition-colors duration-200"
    >
      <span aria-hidden="true">◐</span>
      <span className="theme-when-dark">
        <span className="sr-only">Switch to </span>light
        <span className="sr-only"> theme</span>
      </span>
      <span className="theme-when-light">
        <span className="sr-only">Switch to </span>dark
        <span className="sr-only"> theme</span>
      </span>
    </button>
  );
}
