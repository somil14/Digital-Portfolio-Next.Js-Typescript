"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

// cmdk and its dialog only load the first time the palette is opened.
const CommandPalette = dynamic(() => import("./CommandPalette"), {
  ssr: false,
});

const SHORTCUTS_STORAGE_KEY = "shortcuts";

const shortcuts = [
  { keys: ["⌘", "K"], label: "Open the command palette" },
  { keys: ["g", "p"], label: "Go to projects" },
  { keys: ["g", "e"], label: "Go to experience" },
  { keys: ["g", "c"], label: "Go to contact" },
  { keys: ["t"], label: "Toggle theme" },
  { keys: ["?"], label: "Show this list" },
];

const goTo: Record<string, string> = {
  p: "projects",
  e: "experience",
  c: "contact",
};

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

function readShortcutsEnabled() {
  try {
    return localStorage.getItem(SHORTCUTS_STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Storage can be blocked; the choice then lasts for this page view only.
  }
}

/** Scrolls to a section, or routes to the home page when it is not here. */
export function goToSection(id: string, navigate: (url: string) => void) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView();
    history.replaceState(null, "", `#${id}`);
  } else {
    navigate(`/#${id}`);
  }
}

/**
 * Nav button, global keyboard shortcuts and the shortcuts dialog. Single-key
 * shortcuts never fire while typing and can be switched off (WCAG 2.1.4).
 */
export function CommandMenu() {
  const router = useRouter();
  const [paletteLoaded, setPaletteLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const helpRef = useRef<HTMLDialogElement>(null);
  const enabledRef = useRef(true);
  const pendingG = useRef(0);

  const openPalette = useCallback(() => {
    setPaletteLoaded(true);
    setOpen(true);
  }, []);

  const showHelp = useCallback(() => {
    const dialog = helpRef.current;
    if (!dialog || dialog.open) return;
    const box = dialog.querySelector<HTMLInputElement>("input[type=checkbox]");
    if (box) box.checked = enabledRef.current;
    dialog.showModal();
  }, []);

  useEffect(() => {
    enabledRef.current = readShortcutsEnabled();

    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteLoaded(true);
        setOpen((current) => !current);
        return;
      }
      if (
        !enabledRef.current ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isTyping(event.target) ||
        document.querySelector("dialog[open], [cmdk-dialog]")
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      if (Date.now() - pendingG.current < 1200 && goTo[key]) {
        pendingG.current = 0;
        goToSection(goTo[key], router.push);
      } else if (key === "g") {
        pendingG.current = Date.now();
      } else if (key === "t") {
        toggleTheme();
      } else if (event.key === "?") {
        showHelp();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, showHelp]);

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        className="js-only label text-muted hover:text-text hidden h-11 items-center gap-1.5 px-2 transition-colors duration-200 md:inline-flex"
      >
        <span className="sr-only">Open command palette</span>
        <span aria-hidden="true" className="kbd">
          ⌘K
        </span>
      </button>

      {paletteLoaded ? (
        <CommandPalette open={open} onOpenChange={setOpen} onHelp={showHelp} />
      ) : null}

      <dialog
        ref={helpRef}
        className="dialog"
        aria-labelledby="shortcuts-title"
      >
        <h2 id="shortcuts-title" className="label text-muted mb-4">
          Keyboard shortcuts
        </h2>
        <ul className="flex flex-col gap-2.5">
          {shortcuts.map((shortcut) => (
            <li
              key={shortcut.label}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span>{shortcut.label}</span>
              <span className="flex shrink-0 gap-1">
                {shortcut.keys.map((key) => (
                  <kbd key={key} className="kbd">
                    {key}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <label className="border-line mt-5 flex min-h-11 cursor-pointer items-center gap-3 border-t pt-4 text-sm">
          <input
            type="checkbox"
            defaultChecked
            className="accent-signal size-4"
            onChange={(event) => {
              enabledRef.current = event.target.checked;
              try {
                localStorage.setItem(
                  SHORTCUTS_STORAGE_KEY,
                  event.target.checked ? "on" : "off",
                );
              } catch {
                // Not persisted; applies to this page view.
              }
            }}
          />
          Single-key shortcuts (g, t, ?)
        </label>
        <form method="dialog" className="mt-4">
          <button type="submit" className="btn w-full">
            Close
          </button>
        </form>
      </dialog>
    </>
  );
}
