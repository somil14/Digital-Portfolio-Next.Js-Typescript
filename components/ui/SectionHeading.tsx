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
      <h2 className="text-title text-balance">
        <span className="font-serif italic">{section.title.serif}</span>{" "}
        <span className="font-mono text-[0.62em] tracking-tight">
          {section.title.mono}
        </span>
      </h2>
    </div>
  );
}
