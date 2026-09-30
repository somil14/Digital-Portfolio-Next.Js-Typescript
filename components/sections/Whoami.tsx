import { Chip } from "@/components/ui/Chip";
import { CodePanel } from "@/components/ui/CodePanel";
import { Section } from "@/components/ui/Section";
import { profile } from "@/content/profile";

const list = (items: readonly string[]) =>
  items.map((item) => `"${item}"`).join(", ");

/** The same facts as the prose, as a typed object. Built from the content. */
const profileAsCode = `const somil: Engineer = {
  name: "${profile.name}",
  role: "${profile.role}",
  focus: [${list(profile.focus)}],
  experience: "${profile.experienceYears} years",
  location: "${profile.locationShort}",
  path: [${list(profile.careerPath.split(" → "))}],
  education: "${profile.education.degree}, ${profile.education.school}",
  interests: [
${profile.interests.map((interest) => `    "${interest}",`).join("\n")}
  ],
  status: "${profile.availability}",
};`;

const facts = [
  `${profile.experienceYears} yrs`,
  profile.locationShort,
  profile.careerPath,
];

export function Whoami() {
  return (
    <Section id="whoami">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5 font-serif text-xl leading-snug text-pretty md:text-2xl">
            {profile.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="flex flex-wrap gap-2">
            {facts.map((fact) => (
              <li key={fact}>
                <Chip>{fact}</Chip>
              </li>
            ))}
          </ul>
          <p className="text-muted text-sm">
            {profile.education.degree} · {profile.education.school} ·{" "}
            {profile.education.years}
            <br />
            {profile.location}. {profile.openTo}.
          </p>
        </div>

        <CodePanel
          title="somil.ts"
          note="same facts, typed"
          lang="typescript"
          code={profileAsCode}
          className="self-start"
        />
      </div>
    </Section>
  );
}
