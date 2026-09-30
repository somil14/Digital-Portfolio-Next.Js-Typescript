import { cn } from "@/lib/cn";

interface ChipProps {
  children: React.ReactNode;
  tone?: "default" | "signal" | "warn" | "ok" | "crit";
  className?: string;
}

const tones = {
  default: "border-line text-muted",
  signal: "border-signal/50 text-signal",
  warn: "border-warn/50 text-warn",
  ok: "border-ok/50 text-ok",
  crit: "border-crit/50 text-crit",
};

export function Chip({ children, tone = "default", className }: ChipProps) {
  return (
    <span
      className={cn(
        "label inline-flex items-center border px-2 py-1 whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
