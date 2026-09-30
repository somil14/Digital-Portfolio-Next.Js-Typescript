import type { Metadata } from "next";
import Link from "next/link";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { includedProjects } from "@/content/projects";
import { skills } from "@/content/skills";
import { formatRange } from "@/lib/format";
import { RESUME_PDF_PATH } from "@/lib/paths";

export const metadata: Metadata = {
  title: "TL;DR",
  description: `${profile.name} in 30 seconds: ${profile.headline}.`,
  alternates: { canonical: "/tldr/" },
};

const summaryRole = experience.find(
  (entry) => entry.slug === profile.tldrBulletsFrom,
);
const production = skills
  .filter((skill) => skill.tier === "dependencies")
  .map((skill) => skill.name);

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="label text-muted mb-4">{children}</h2>;
}

/** Recruiter summary: one column, no 3D, no animation. */
export default function TldrPage() {
  return (
    <div className="shell max-w-[46rem]! py-14 md:py-20">
      <p className="label text-muted flex items-center gap-2">
        <span className="pulse-dot" aria-hidden="true" />
        {profile.availability}
      </p>
      <h1 className="mt-5 font-serif text-6xl leading-none md:text-7xl">
        {profile.name}
      </h1>
      <p className="label text-signal mt-5">{profile.headline}</p>
      <p className="mt-5 text-lg text-pretty">{profile.subLine}</p>
      <p className="text-muted mt-3">
        {profile.experienceYears} years · {profile.location} · {profile.openTo}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <a href={RESUME_PDF_PATH} download className="btn btn-primary">
          Download resume <span aria-hidden="true">↓</span>
        </a>
        <a href={`mailto:${profile.email}`} className="btn">
          {profile.email}
        </a>
        <Link href="/" className="btn">
          Full site <span aria-hidden="true">→</span>
        </Link>
      </div>

      {summaryRole ? (
        <section className="border-line mt-12 border-t pt-8">
          <Heading>Recent work · {summaryRole.shortName}</Heading>
          <ul className="flex list-disc flex-col gap-2.5 pl-5 text-pretty">
            {summaryRole.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="border-line mt-10 border-t pt-8">
        <Heading>Experience</Heading>
        <ul className="flex flex-col gap-4">
          {experience.map((entry) => (
            <li
              key={entry.slug}
              className="flex flex-wrap items-baseline justify-between gap-x-6"
            >
              <span>
                <span className="font-medium">{entry.role}</span>
                <span className="text-muted"> · {entry.company}</span>
              </span>
              <span className="label text-muted tabular-nums">
                {formatRange(entry.start, entry.end)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-line mt-10 border-t pt-8">
        <Heading>Skills</Heading>
        <p className="text-pretty">{production.join(" · ")}</p>
      </section>

      <section className="border-line mt-10 border-t pt-8">
        <Heading>Projects</Heading>
        <ul className="flex flex-col gap-4">
          {includedProjects.map((project) => (
            <li key={project.slug}>
              {project.href ? (
                <a href={project.href} className="link font-medium">
                  {project.name}
                </a>
              ) : (
                <span className="font-medium">{project.name}</span>
              )}
              <span className="text-muted"> · {project.summary}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-line mt-10 border-t pt-8">
        <Heading>Education</Heading>
        <p>
          {profile.education.degree} · {profile.education.school} ·{" "}
          {profile.education.years}
        </p>
      </section>
    </div>
  );
}
