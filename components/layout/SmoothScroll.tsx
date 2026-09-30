"use client";

import { useEffect } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Lenis smooth scroll for fine-pointer devices only. Touch devices and
 * reduced-motion visitors keep native scrolling and never download Lenis.
 */
export function SmoothScroll() {
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const enabled = finePointer && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let destroy: (() => void) | undefined;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ autoRaf: true, anchors: true });
      destroy = () => lenis.destroy();
    });

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [enabled]);

  return null;
}
