import type { SiteSection } from "@/content/types";
import { StatusPill } from "./StatusPill";

type EyebrowProps = Pick<
  SiteSection,
  "index" | "method" | "path" | "status" | "latencyMs"
>;

/**
 * Request-log styling above a section heading. Decorative: the heading next
 * to it carries the meaning, so this is hidden from assistive tech.
 */
export function Eyebrow({
  index,
  method,
  path,
  status,
  latencyMs,
}: EyebrowProps) {
  return (
    <p
      aria-hidden="true"
      className="label text-muted flex flex-wrap items-center gap-x-3 gap-y-1"
    >
      <span>{index}</span>
      <span className="bg-line h-px w-8" />
      <span>
        <span className="text-signal">{method}</span>{" "}
        <span className="normal-case">{path}</span>
      </span>
      <StatusPill
        status={status}
        latencyMs={latencyMs}
        tone={status === "in progress" ? "warn" : "ok"}
        className="ml-auto"
      />
    </p>
  );
}
