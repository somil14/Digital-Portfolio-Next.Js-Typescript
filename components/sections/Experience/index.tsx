import { Section } from "@/components/ui/Section";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { GitGraph } from "./GitGraph";

export function Experience() {
  return (
    <Section id="experience">
      <p className="label text-muted mb-10 tabular-nums">
        <span aria-hidden="true">$ git log --graph · </span>
        {profile.experienceYears} years · {experience.length} roles
      </p>
      <GitGraph entries={experience} />
    </Section>
  );
}
