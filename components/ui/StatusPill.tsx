import { cn } from "@/lib/cn";

interface StatusPillProps {
  status: string;
  latencyMs?: number;
  tone?: "ok" | "warn" | "muted";
  className?: string;
}

const dot = { ok: "bg-ok", warn: "bg-warn", muted: "bg-muted" };

/**
 * Decorative response status. Shows "···" until its section is revealed
 * (CSS, see globals). The timing is styling, not a measurement.
 */
export function StatusPill({
  status,
  latencyMs,
  tone = "ok",
  className,
}: StatusPillProps) {
  return (
    <span
      className={cn(
        "label text-muted inline-flex items-center gap-2 whitespace-nowrap",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot[tone])} />
      <span className="status-pending">···</span>
      <span className="status-final">
        {status}
        {latencyMs ? ` · ${latencyMs}ms` : null}
      </span>
    </span>
  );
}
