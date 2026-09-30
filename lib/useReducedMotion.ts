"use client";

import { useMediaQuery } from "./useMediaQuery";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** True on the server, so the first render is always the static one. */
export function useReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION_QUERY, true);
}
