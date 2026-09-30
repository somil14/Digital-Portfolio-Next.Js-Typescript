"use client";

import { useSyncExternalStore } from "react";
import { REDUCED_MOTION_QUERY } from "./useReducedMotion";

/**
 * "full" gets live 3D. "static" gets poster images and never downloads the
 * 3D chunk (brief 2.4).
 */
export type DeviceTier = "full" | "static";

const COARSE_POINTER_QUERY = "(pointer: coarse)";

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

let webglSupport: boolean | undefined;

function hasWebGL(): boolean {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(
        canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
      );
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

function readTier(): DeviceTier {
  const nav: NavigatorWithMemory = navigator;
  const lowPower =
    (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;

  if (
    lowPower ||
    window.matchMedia(COARSE_POINTER_QUERY).matches ||
    window.matchMedia(REDUCED_MOTION_QUERY).matches ||
    !hasWebGL()
  ) {
    return "static";
  }
  return "full";
}

function subscribe(onChange: () => void) {
  const lists = [COARSE_POINTER_QUERY, REDUCED_MOTION_QUERY].map((query) =>
    window.matchMedia(query),
  );
  lists.forEach((list) => list.addEventListener("change", onChange));
  return () =>
    lists.forEach((list) => list.removeEventListener("change", onChange));
}

/** "static" on the server, so nothing heavy is assumed before hydration. */
export function useDeviceTier(): DeviceTier {
  return useSyncExternalStore(subscribe, readTier, () => "static");
}
