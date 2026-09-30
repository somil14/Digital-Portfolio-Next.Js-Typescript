import { cn } from "@/lib/cn";

interface PanelProps {
  /** Mono title in the panel header, e.g. a file name. */
  title: string;
  /** Right-aligned header note, e.g. "simulated". */
  note?: string;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}

/** Console-style framed surface with a header bar. */
export function Panel({
  title,
  note,
  className,
  bodyClassName,
  children,
}: PanelProps) {
  return (
    <div className={cn("border-line bg-surface min-w-0 border", className)}>
      <div className="border-line label text-muted flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b px-4 py-2.5">
        <span className="normal-case">{title}</span>
        {note ? <span>{note}</span> : null}
      </div>
      {/* relative: keeps sr-only children inside any scrolling body */}
      <div className={cn("relative p-4 md:p-5", bodyClassName)}>{children}</div>
    </div>
  );
}
