"use client";

import { useEffect } from "react";
import { REDUCED_MOTION_QUERY } from "@/lib/useReducedMotion";

const GLYPHS = "!<>-_\\/[]{}=+*^?#";

/** Characters resolve left to right from random glyphs. Runs once. */
function decode(element: HTMLElement) {
  const final = element.textContent ?? "";
  const duration = 450 + final.length * 22;
  const start = performance.now();

  function frame(now: number) {
    const progress = Math.min(1, (now - start) / duration);
    const resolved = Math.floor(progress * final.length);
    let text = final.slice(0, resolved);
    for (let i = resolved; i < final.length; i++) {
      text +=
        final[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    element.textContent = text;
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/**
 * One small script for page-wide enhancements: section reveals, text decode,
 * card tilt and the stack cross-highlight. It only toggles attributes and
 * CSS variables on server-rendered markup; the CSS does the rest.
 */
export function Interactions() {
  useEffect(() => {
    const motionOk = !window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const cleanups: (() => void)[] = [];

    // Section reveals
    const reveal = (section: HTMLElement) => {
      if (section.dataset.revealed) return;
      section.dataset.revealed = "true";
      if (motionOk) {
        section.querySelectorAll<HTMLElement>("[data-decode]").forEach(decode);
      }
    };
    const sections = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            reveal(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -12% 0px" },
      );
      sections.forEach((section) => observer.observe(section));
      cleanups.push(() => observer.disconnect());
    } else {
      sections.forEach(reveal);
    }

    // Hero role line decodes on load
    if (motionOk) {
      document
        .querySelectorAll<HTMLElement>("[data-decode-now]")
        .forEach(decode);
    }

    // Card tilt
    if (motionOk && finePointer) {
      const onMove = (event: PointerEvent) => {
        const card = (event.target as Element).closest<HTMLElement>(
          "[data-tilt]",
        );
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
        card.style.setProperty("--tilt-y", `${(x - 0.5) * 5}deg`);
        card.style.setProperty("--tilt-mx", `${x * 100}%`);
        card.style.setProperty("--tilt-my", `${y * 100}%`);
        card.style.setProperty("--tilt-glow", "1");
      };
      const onLeave = (event: PointerEvent) => {
        const card = (event.target as Element).closest<HTMLElement>(
          "[data-tilt]",
        );
        if (!card || card.contains(event.relatedTarget as Node | null)) return;
        for (const name of ["--tilt-x", "--tilt-y", "--tilt-glow"]) {
          card.style.removeProperty(name);
        }
      };
      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerout", onLeave, { passive: true });
      cleanups.push(() => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerout", onLeave);
      });
    }

    // Stack cross-highlight
    const stack = document.querySelector<HTMLElement>("[data-stack]");
    if (stack) {
      const clear = () =>
        document
          .querySelectorAll("[data-highlight]")
          .forEach((element) => element.removeAttribute("data-highlight"));
      const highlight = (event: Event) => {
        const skill = (event.target as Element).closest<HTMLElement>(
          "[data-used-in]",
        );
        clear();
        for (const slug of skill?.dataset.usedIn?.split(" ") ?? []) {
          if (!slug) continue;
          document
            .querySelectorAll(
              `[data-commit="${slug}"], [data-project="${slug}"]`,
            )
            .forEach((element) => element.setAttribute("data-highlight", ""));
        }
      };
      stack.addEventListener("pointerover", highlight);
      stack.addEventListener("focusin", highlight);
      stack.addEventListener("pointerleave", clear);
      stack.addEventListener("focusout", clear);
      cleanups.push(() => {
        stack.removeEventListener("pointerover", highlight);
        stack.removeEventListener("focusin", highlight);
        stack.removeEventListener("pointerleave", clear);
        stack.removeEventListener("focusout", clear);
      });
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
