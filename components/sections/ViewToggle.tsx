"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

const views = [
  { id: "human", label: "Human" },
  { id: "json", label: "JSON" },
] as const;
type View = (typeof views)[number]["id"];

interface ViewToggleProps {
  human: React.ReactNode;
  json: React.ReactNode;
}

/**
 * Human ⇄ JSON. Wide screens show both columns; narrower ones show one at a
 * time. Without JavaScript both are simply stacked.
 */
export function ViewToggle({ human, json }: ViewToggleProps) {
  const [view, setView] = useState<View>("human");

  return (
    <div data-view={view}>
      <div
        role="group"
        aria-label="Show as"
        className="js-only border-line mb-8 inline-flex border lg:hidden"
      >
        {views.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={view === option.id}
            onClick={() => setView(option.id)}
            className={cn(
              "label min-h-11 px-4 transition-colors duration-150",
              view === option.id
                ? "bg-signal text-bg"
                : "text-muted hover:text-text",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="view-human">{human}</div>
        <div className="view-json">{json}</div>
      </div>
    </div>
  );
}
