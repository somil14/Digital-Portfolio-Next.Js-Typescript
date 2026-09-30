import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/content/profile";
import { sections } from "@/content/sections";

const [hero, ...rest] = sections;

/**
 * Phase 1 shell: the hero text and one landmark per section, so the layout,
 * tokens and navigation can be reviewed. Section bodies arrive in Phase 2.
 */
export default function Home() {
  return (
    <>
      <section
        id={hero.id}
        aria-labelledby="hero-title"
        className="mx-auto flex min-h-[calc(100svh-var(--nav-height))] max-w-[90rem] flex-col justify-center gap-8 px-4 py-16 md:px-8"
      >
        <Eyebrow {...hero} />
        <h1 id="hero-title" className="text-hero font-serif">
          Somil <span className="italic">Athole</span>
        </h1>
        <div className="flex max-w-[35rem] flex-col gap-5">
          <p className="label text-signal">{profile.headline}</p>
          <p className="font-serif text-3xl leading-tight text-balance md:text-4xl">
            {profile.oneLiner}
          </p>
          <p className="text-muted text-pretty">{profile.subLine}</p>
        </div>
      </section>

      {rest.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-label={section.label}
          className="border-line border-t"
        >
          <div className="mx-auto max-w-[90rem] px-4 py-24 md:px-8 md:py-32">
            <SectionHeading section={section} />
          </div>
        </section>
      ))}
    </>
  );
}
