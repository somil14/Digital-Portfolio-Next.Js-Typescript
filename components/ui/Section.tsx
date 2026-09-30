import { sections } from "@/content/sections";
import { SectionHeading } from "./SectionHeading";

interface SectionProps {
  id: string;
  /** Short intro paragraph under the title. */
  lede?: string;
  children: React.ReactNode;
}

export function Section({ id, lede, children }: SectionProps) {
  const section = sections.find((entry) => entry.id === id);
  if (!section) throw new Error(`Unknown section id: ${id}`);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="border-line border-t"
    >
      <div className="shell py-20 md:py-28">
        <SectionHeading section={section} />
        {lede ? (
          <p className="text-muted mt-6 max-w-[38rem] text-pretty">{lede}</p>
        ) : null}
        <div className="mt-12 md:mt-16">{children}</div>
      </div>
    </section>
  );
}
