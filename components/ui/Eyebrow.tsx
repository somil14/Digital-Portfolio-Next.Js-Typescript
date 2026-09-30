import type { SiteSection } from "@/content/types";

type EyebrowProps = Pick<SiteSection, "index" | "method" | "path">;

/**
 * Request-log styling above a section heading. Decorative: the heading next
 * to it carries the meaning, so this is hidden from assistive tech.
 */
export function Eyebrow({ index, method, path }: EyebrowProps) {
  return (
    <p aria-hidden="true" className="label text-muted flex items-center gap-3">
      <span>{index}</span>
      <span className="bg-line h-px w-8" />
      <span>
        <span className="text-signal">{method}</span>{" "}
        <span className="normal-case">{path}</span>
      </span>
    </p>
  );
}
