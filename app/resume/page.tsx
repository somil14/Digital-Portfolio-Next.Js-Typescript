import type { Metadata } from "next";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { includedProjects } from "@/content/projects";
import { skills } from "@/content/skills";
import { formatRange } from "@/lib/format";
import { RESUME_PDF_PATH } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${profile.name}, ${profile.role}.`,
  alternates: { canonical: "/resume/" },
};

const bare = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const contact = [
  { text: profile.email, href: `mailto:${profile.email}` },
  {
    text: bare(profile.links.linkedin.href),
    href: profile.links.linkedin.href,
  },
  { text: bare(profile.links.github.href), href: profile.links.github.href },
  { text: bare(profile.siteUrl), href: profile.siteUrl },
];

const skillLine = (tier: "dependencies" | "devDependencies") =>
  skills
    .filter((skill) => skill.tier === tier)
    .map((skill) => skill.name)
    .join(", ");

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-line label text-muted mt-7 mb-3 border-b pb-1.5 print:mt-3.5 print:mb-2 print:pb-1">
      {children}
    </h2>
  );
}

/**
 * Print-optimised resume, generated from the same content as the site. The
 * downloadable PDF is this page printed by scripts/resume-pdf.mjs.
 */
export default function ResumePage() {
  return (
    <div className="shell max-w-[50rem]! py-12 text-[0.9375rem] leading-relaxed print:max-w-none! print:p-0 print:text-[9.5pt] print:leading-snug">
      <p className="mb-8 print:hidden">
        <a href={RESUME_PDF_PATH} download className="btn btn-primary">
          Download PDF <span aria-hidden="true">↓</span>
        </a>
      </p>

      <header>
        <h1 className="font-serif text-5xl leading-none print:text-[24pt]">
          {profile.name}
        </h1>
        <p className="mt-2 font-medium">{profile.headline}</p>
        <p className="text-muted mt-1.5 text-sm print:text-[8.5pt]">
          {profile.location}
          {contact.map((item) => (
            <span key={item.href}>
              {" · "}
              <a href={item.href} className="whitespace-nowrap">
                {item.text}
              </a>
            </span>
          ))}
        </p>
      </header>

      <Heading>Summary</Heading>
      <p className="text-pretty">{profile.subLine}</p>

      <Heading>Experience</Heading>
      <div className="flex flex-col gap-4 print:gap-2">
        {experience.map((entry) => (
          <section key={entry.slug} className="break-inside-avoid">
            <div className="flex items-baseline justify-between gap-x-6">
              <h3 className="font-semibold">
                {entry.role} · {entry.company}
                {entry.unit ? `, ${entry.unit}` : ""}
              </h3>
              <p className="text-muted shrink-0 text-sm tabular-nums print:text-[8.5pt]">
                {formatRange(entry.start, entry.end)}
              </p>
            </div>
            <p className="text-muted text-sm first-letter:uppercase print:text-[8.5pt]">
              {[entry.type, entry.arrangement].filter(Boolean).join(" · ")}
            </p>
            {entry.bullets.length > 0 ? (
              <ul className="mt-1.5 flex list-disc flex-col gap-1 pl-5 text-pretty">
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <Heading>Projects</Heading>
      <ul className="flex flex-col gap-2">
        {includedProjects.map((project) => (
          <li key={project.slug} className="break-inside-avoid text-pretty">
            <span className="font-semibold">{project.name}</span>
            {" — "}
            {project.summary}
            {project.href ? (
              <>
                {" "}
                <a href={project.href} className="text-muted">
                  {bare(project.href)}
                </a>
              </>
            ) : null}
          </li>
        ))}
      </ul>

      <Heading>Skills</Heading>
      <p className="text-pretty">
        <span className="font-semibold">Production: </span>
        {skillLine("dependencies")}
      </p>
      <p className="mt-1.5 text-pretty">
        <span className="font-semibold">Working knowledge: </span>
        {skillLine("devDependencies")}
      </p>

      <Heading>Education</Heading>
      <p>
        <span className="font-semibold">{profile.education.degree}</span> ·{" "}
        {profile.education.school} · {profile.education.years}
      </p>
    </div>
  );
}
