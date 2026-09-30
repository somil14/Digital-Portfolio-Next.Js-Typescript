import type { SiteSection } from "@/content/types";
import { Eyebrow } from "./Eyebrow";

interface SectionHeadingProps {
  section: SiteSection;
}

/** Eyebrow plus the serif-italic and mono title pairing (brief 3.3). */
export function SectionHeading({ section }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-5">
      <Eyebrow {...section} />
      <h2 id={`${section.id}-title`} className="text-title text-balance">
        <span className="font-serif italic">{section.title.serif}</span>{" "}
        {/* The mono half decodes on reveal. Screen readers get the plain
            text; the animated copy is hidden from them. */}
        <span className="sr-only">{section.title.mono}</span>
        <span
          aria-hidden="true"
          data-decode
          className="font-mono text-[0.62em] tracking-tight"
        >
          {section.title.mono}
        </span>
      </h2>
    </div>
  );
}
