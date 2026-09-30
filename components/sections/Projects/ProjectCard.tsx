import { Chip } from "@/components/ui/Chip";
import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";

interface ProjectCardProps {
  project: Project;
  className?: string;
  /** Mini demo shown at the top of the card. */
  demo?: React.ReactNode;
}

const statusTone = {
  Shipped: "ok",
  Live: "ok",
  Published: "ok",
  "In progress": "warn",
  "Client work": "default",
} as const;

export function ProjectCard({ project, className, demo }: ProjectCardProps) {
  const titleId = `project-${project.slug}`;
  return (
    <article
      aria-labelledby={titleId}
      data-project={project.slug}
      className={cn(
        "border-line bg-surface flex min-w-0 flex-col border",
        className,
      )}
    >
      {demo ? <div className="border-line border-b">{demo}</div> : null}
      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 id={titleId} className="font-serif text-3xl leading-tight">
            {project.name}
          </h3>
          <Chip tone={statusTone[project.status]}>{project.status}</Chip>
        </div>
        <p className="text-pretty">{project.summary}</p>
        {project.bullets.length > 0 ? (
          <ul className="text-muted flex flex-col gap-1.5 text-sm text-pretty">
            {project.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2.5">
                <span aria-hidden="true" className="text-signal font-mono">
                  →
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          {project.stack.map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
          {project.href ? (
            <a href={project.href} className="link ml-auto font-mono text-sm">
              {project.href.includes("github.com") ? "Source" : "Visit"}
              <span className="sr-only">: {project.name}</span>
              <span aria-hidden="true"> ↗</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
