import { Section } from "@/components/ui/Section";
import { includedProjects } from "@/content/projects";
import type { ProjectSlug } from "@/content/types";
import { ProjectCard } from "./ProjectCard";
import { RbacDemo } from "./RbacDemo";
import { WhisperDemo } from "./WhisperDemo";

/**
 * Column spans on a 6-column grid, by card count then position, so the grid
 * looks deliberate with anything from two to five cards.
 */
const layouts: Record<number, string[]> = {
  1: ["lg:col-span-6"],
  2: ["lg:col-span-3", "lg:col-span-3"],
  3: ["lg:col-span-4", "lg:col-span-2", "lg:col-span-6"],
  4: ["lg:col-span-4", "lg:col-span-2", "lg:col-span-2", "lg:col-span-4"],
  5: [
    "lg:col-span-3",
    "lg:col-span-3",
    "lg:col-span-2",
    "lg:col-span-2",
    "lg:col-span-2",
  ],
};

/** Mini demos, by project. A project without one renders as a plain card. */
const demos: Partial<Record<ProjectSlug, React.ReactNode>> = {
  whisperx: <WhisperDemo />,
  "gorillahub-rbac": <RbacDemo />,
};

export function Projects() {
  const spans = layouts[includedProjects.length] ?? [];
  return (
    <Section id="projects">
      <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-6">
        {includedProjects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            demo={demos[project.slug]}
            className={spans[index] ?? "lg:col-span-3"}
          />
        ))}
      </div>
    </Section>
  );
}
