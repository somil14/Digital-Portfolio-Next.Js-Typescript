"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/useMediaQuery";

/** Pin only where all four panels fit the viewport and motion is welcome. */
const PIN_QUERY =
  "(min-width: 80rem) and (min-height: 47.5rem) and (prefers-reduced-motion: no-preference)";
const WORD_MS = 28;

interface StepScrollerProps {
  labels: string[];
  children: React.ReactNode;
}

type LenisLike = { scrollTo: (target: number) => void };

function scrollToY(y: number) {
  const lenis = (window as Window & { __lenis?: LenisLike }).__lenis;
  if (lenis) lenis.scrollTo(y);
  else window.scrollTo({ top: y });
}

/** Replays pre-written text word by word, as if a model were streaming it. */
function streamText(root: HTMLElement) {
  const targets = [...root.querySelectorAll<HTMLElement>("[data-stream]")];
  const texts = targets.map((target) => target.textContent ?? "");
  // Hold each block at its final height so the panel does not grow as it types.
  targets.forEach((target) => {
    target.style.minHeight = `${target.offsetHeight}px`;
    target.textContent = "";
  });
  root.setAttribute("aria-busy", "true");

  let index = 0;
  let word = 0;
  const timer = window.setInterval(() => {
    const words = texts[index]?.split(" ");
    if (!words) {
      window.clearInterval(timer);
      root.removeAttribute("aria-busy");
      return;
    }
    targets[index].textContent = words.slice(0, ++word).join(" ");
    if (word >= words.length) {
      index++;
      word = 0;
    }
  }, WORD_MS);
  return () => {
    window.clearInterval(timer);
    targets.forEach((target, i) => (target.textContent = texts[i]));
    root.removeAttribute("aria-busy");
  };
}

/**
 * Scrollytelling for the case study. On large screens the four steps are
 * pinned and swap as you scroll; elsewhere they stay stacked and each one
 * animates as it enters. With reduced motion, or without JavaScript, it is
 * four static panels.
 */
export function StepScroller({ labels, children }: StepScrollerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinned = useMediaQuery(PIN_QUERY);
  const [step, setStep] = useState(0);

  // Pinned: scroll position picks the step.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !pinned) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      setStep(
        Math.min(labels.length - 1, Math.floor(progress * labels.length)),
      );
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned, labels.length]);

  // Mark steps as "in": the active one when pinned, else whatever scrolls in.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = [...root.querySelectorAll<HTMLElement>("[data-step-item]")];
    const stops: (() => void)[] = [];
    const motionOk = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    ).matches;

    const enter = (item: HTMLElement) => {
      if (item.dataset.in !== undefined) return;
      item.dataset.in = "";
      if (motionOk && item.querySelector("[data-stream]")) {
        stops.push(streamText(item));
      }
    };

    if (pinned) {
      enter(items[step]);
    } else if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) enter(entry.target as HTMLElement);
          }
        },
        { rootMargin: "0px 0px -25% 0px" },
      );
      items.forEach((item) => observer.observe(item));
      stops.push(() => observer.disconnect());
    } else {
      items.forEach(enter);
    }
    return () => stops.forEach((stop) => stop());
  }, [pinned, step]);

  // A control inside a hidden step can still take focus: bring its step up.
  function onFocus(event: React.FocusEvent<HTMLDivElement>) {
    if (!pinned) return;
    const item = (event.target as Element).closest("[data-step-item]");
    const root = rootRef.current;
    if (!item || !root) return;
    const index = [...root.querySelectorAll("[data-step-item]")].indexOf(item);
    if (index >= 0 && index !== step) jump(index);
  }

  function jump(index: number) {
    const root = rootRef.current;
    if (!root) return;
    const top = root.getBoundingClientRect().top + window.scrollY;
    const travel = root.offsetHeight - window.innerHeight;
    scrollToY(top + ((index + 0.3) / labels.length) * travel);
  }

  return (
    <div
      ref={rootRef}
      data-case-study
      data-pinned={pinned ? "" : undefined}
      data-step={step}
      onFocus={onFocus}
    >
      <div className="case-stage">
        <ol className="case-steps">{children}</ol>
        {pinned ? (
          <ol
            aria-label="Case study steps"
            className="absolute bottom-6 left-0 flex gap-2"
          >
            {labels.map((label, index) => (
              <li key={label}>
                <button
                  type="button"
                  aria-current={index === step ? "step" : undefined}
                  onClick={() => jump(index)}
                  className={cn(
                    "label flex min-h-9 items-center gap-2 border px-3 transition-colors duration-200",
                    index === step
                      ? "border-signal text-signal"
                      : "border-line text-muted hover:text-text",
                  )}
                >
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {label}
                </button>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </div>
  );
}
