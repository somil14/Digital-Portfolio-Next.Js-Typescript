"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { pipelineLatency } from "@/content/syntheticData";
import { cn } from "@/lib/cn";
import { useDeviceTier } from "@/lib/useDeviceTier";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Shares the three.js chunk with the hero; mounted only on the full tier.
const RequestPipeline = dynamic(
  () => import("@/components/three/RequestPipeline"),
  { ssr: false },
);

export interface TraceLayer {
  id: string;
  name: string;
  detail?: string;
  does: string;
  where: string | null;
}

interface PipelineTraceProps {
  layers: TraceLayer[];
}

const STEP_MS = 560;
/** Layers a request passes through. The last layer is the platform, not a hop. */
const HOPS = 5;
/** Index of the cache layer: a hit turns the request around here. */
const CACHE = 3;

function route(cacheHit: boolean): number[] {
  const last = cacheHit ? CACHE : HOPS - 1;
  const out = Array.from({ length: last + 1 }, (_, i) => i);
  return [...out, ...out.slice(0, -1).reverse()];
}

/**
 * The request pipeline as an interactive trace. A packet walks the layers and
 * back; a cache hit turns it around at Redis. The layer list underneath is
 * the full content and reads fine on its own.
 */
export function PipelineTrace({ layers }: PipelineTraceProps) {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [cacheHit, setCacheHit] = useState(false);
  const [step, setStep] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [near, setNear] = useState(false);
  const [lost, setLost] = useState(false);
  const live = useDeviceTier() === "full" && near && !lost;

  const hops = route(cacheHit);
  const playing = step !== null && step < hops.length - 1;
  const finished = step === hops.length - 1;
  const packetAt = step === null ? null : hops[step];
  const returning = step !== null && step > hops.length / 2 - 0.5;
  const active = selected ?? packetAt;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(
      () => setStep((current) => (current === null ? null : current + 1)),
      STEP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [playing, step]);

  // Play once when the section scrolls into view.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setStep(0);
        observer.disconnect();
      },
      { threshold: 0.6 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [reducedMotion]);

  // The canvas is only created once the section is close to the viewport.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "500px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  function play(nextCacheHit = cacheHit) {
    setCacheHit(nextCacheHit);
    setSelected(null);
    // Reduced motion: jump straight to the result, no walking packet.
    setStep(reducedMotion ? route(nextCacheHit).length - 1 : 0);
  }

  return (
    <div>
      <div
        ref={rootRef}
        className="border-line bg-surface js-only mb-10 border"
      >
        <div className="border-line flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label="Cache"
              className="border-line inline-flex border"
            >
              {[false, true].map((hit) => (
                <button
                  key={String(hit)}
                  type="button"
                  aria-pressed={cacheHit === hit}
                  onClick={() => play(hit)}
                  className={cn(
                    "label min-h-9 px-3 transition-colors duration-150",
                    cacheHit === hit
                      ? "bg-signal text-bg"
                      : "text-muted hover:text-text",
                  )}
                >
                  cache: {hit ? "hit" : "miss"}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => play()}
              className="label border-line text-muted hover:border-signal hover:text-signal min-h-9 border px-3 transition-colors duration-150"
            >
              <span aria-hidden="true">↻ </span>replay
            </button>
          </div>
          <p role="status" className="label text-muted tabular-nums">
            {finished ? (
              <>
                <span className="text-ok">200 OK</span> · ~
                {cacheHit ? pipelineLatency.hitMs : pipelineLatency.missMs}
                &nbsp;ms · simulated
              </>
            ) : playing ? (
              "tracing…"
            ) : (
              "ready · simulated"
            )}
          </p>
        </div>

        <div className="overflow-x-auto px-4 pt-8 pb-5 md:px-8">
          <div className="relative min-w-[30rem]">
            {live ? (
              <div className="relative h-44">
                <RequestPipeline
                  packetAt={packetAt}
                  returning={returning}
                  active={active}
                  onLost={() => setLost(true)}
                />
                <span
                  aria-hidden="true"
                  className="label text-muted absolute top-0 right-0 normal-case"
                >
                  runs on {layers[HOPS]?.name}
                </span>
              </div>
            ) : (
              <div
                aria-hidden="true"
                className="bg-line absolute top-2 right-[10%] left-[10%] h-px"
              />
            )}
            {!live && packetAt !== null ? (
              <span
                aria-hidden="true"
                className={cn(
                  "packet absolute top-2 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full",
                  returning ? "bg-ok" : "bg-signal",
                )}
                style={{ left: `${10 + packetAt * 20}%` }}
              />
            ) : null}
            <ol className="grid grid-cols-5">
              {layers.slice(0, HOPS).map((layer, index) => (
                <li key={layer.id} className="flex justify-center">
                  <button
                    type="button"
                    aria-pressed={active === index}
                    onClick={() =>
                      setSelected((current) =>
                        current === index ? null : index,
                      )
                    }
                    className="group flex min-h-11 w-full flex-col items-center justify-center gap-3"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        live && "hidden",
                        "bg-surface size-4 rounded-full border-2 transition-colors duration-200",
                        active === index
                          ? "border-signal"
                          : "border-line group-hover:border-muted",
                      )}
                    />
                    <span
                      className={cn(
                        "label text-center normal-case transition-colors duration-200",
                        active === index ? "text-text" : "text-muted",
                      )}
                    >
                      {layer.name}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <ol className="border-line border-t">
        {layers.map((layer, index) => (
          <li
            key={layer.id}
            data-active={active === index ? "" : undefined}
            className="border-line data-active:bg-surface grid grid-cols-1 gap-x-8 gap-y-2 border-b px-0 py-6 transition-colors duration-200 md:grid-cols-[3rem_minmax(0,16rem)_minmax(0,1fr)] md:px-4"
          >
            <span aria-hidden="true" className="label text-signal pt-1">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-mono text-lg">{layer.name}</h3>
              {layer.detail ? (
                <p className="label text-muted mt-1 normal-case">
                  {layer.detail}
                </p>
              ) : null}
            </div>
            <div className="flex max-w-[40rem] flex-col gap-1.5 text-pretty">
              <p>{layer.does}</p>
              {layer.where ? (
                <p className="text-muted text-sm">{layer.where}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
