"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useDeviceTier } from "@/lib/useDeviceTier";

// three.js and the scene are one lazy chunk, fetched only on the full tier.
const EndpointConstellation = dynamic(
  () => import("@/components/three/EndpointConstellation"),
  { ssr: false },
);

interface HeroSceneProps {
  /** Static drawing of the same graph; shown until and unless 3D is up. */
  poster: React.ReactNode;
}

/**
 * Shows the poster first. On capable devices it loads the WebGL scene when
 * the browser is idle and cross-fades to it; if the context is lost, the
 * poster comes back.
 */
export function HeroScene({ poster }: HeroSceneProps) {
  const tier = useDeviceTier();
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [lost, setLost] = useState(false);
  const live = tier === "full" && !lost;

  useEffect(() => {
    if (!live) return;
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setLoad(true), {
        timeout: 3000,
      });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setLoad(true), 1200);
    return () => clearTimeout(id);
  }, [live]);

  return (
    <div className="relative">
      <div
        className={cn(
          "transition-opacity duration-700",
          live && ready && "opacity-0",
        )}
      >
        {poster}
      </div>
      {live && load ? (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <EndpointConstellation
            onReady={() => setReady(true)}
            onLost={() => setLost(true)}
          />
        </div>
      ) : null}
    </div>
  );
}
