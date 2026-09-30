"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { Panel } from "@/components/ui/Panel";
import { caseStudy } from "@/content/caseStudy";
import { findings as allFindings } from "@/content/syntheticData";
import type { Severity } from "@/content/types";
import { cn } from "@/lib/cn";

/** Four fit the pinned stage without scrolling. */
const findings = allFindings.slice(0, 4);
const decisions = ["Fix", "False positive", "Accept risk"] as const;
type Decision = (typeof decisions)[number];

const severityTone: Record<Severity, "crit" | "warn" | "default"> = {
  critical: "crit",
  high: "warn",
  medium: "default",
  low: "default",
};

/** Triage board. Buttons are the primary interaction; all keyboard-operable. */
export function TriagePanel() {
  const [chosen, setChosen] = useState<Record<string, Decision | undefined>>(
    {},
  );
  const triaged = findings.filter((finding) => chosen[finding.id]).length;

  return (
    <Panel
      title="findings"
      note={caseStudy.disclaimer}
      bodyClassName="flex flex-col gap-4"
    >
      <p className="label text-muted tabular-nums" aria-live="polite">
        {triaged} of {findings.length} triaged
      </p>

      <ul className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {findings.map((finding, index) => {
          const decision = chosen[finding.id];
          return (
            <li
              key={finding.id}
              data-row
              style={{ "--row": index } as React.CSSProperties}
              className={cn(
                "border-line bg-bg flex flex-col gap-3 border p-3.5 transition-opacity duration-200",
                decision && "opacity-75",
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Chip tone={severityTone[finding.severity]}>
                  {finding.severity}
                </Chip>
                <span className="label text-muted">{finding.id}</span>
                <span className="label text-muted">{finding.cwe.id}</span>
              </div>
              <div>
                <h4 className="leading-snug font-medium">{finding.title}</h4>
                <p className="text-muted mt-1 text-sm">{finding.cwe.name}</p>
              </div>
              <p className="border-line text-muted border-l-2 pl-3 font-mono text-xs leading-5 break-words">
                <span className="text-text">{finding.endpoint}</span>
                <br />
                {finding.evidence}
              </p>
              <div
                role="group"
                aria-label={`Decision for ${finding.id}`}
                className="mt-auto flex flex-wrap gap-2"
              >
                {decisions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={decision === option}
                    onClick={() =>
                      setChosen((current) => ({
                        ...current,
                        [finding.id]:
                          current[finding.id] === option ? undefined : option,
                      }))
                    }
                    className={cn(
                      "label border-line hover:border-signal hover:text-signal min-h-9 border px-2.5 transition-colors duration-150",
                      decision === option
                        ? "border-signal bg-signal text-bg hover:text-bg"
                        : "text-muted",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-sm">{caseStudy.outcome}</p>
    </Panel>
  );
}
