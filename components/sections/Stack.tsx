import { Panel } from "@/components/ui/Panel";
import { Section } from "@/components/ui/Section";
import { skills } from "@/content/skills";
import type { SkillTier } from "@/content/types";
import { usedInNames } from "@/lib/format";

const tiers: { tier: SkillTier; meaning: string }[] = [
  { tier: "dependencies", meaning: "production experience" },
  { tier: "devDependencies", meaning: "working knowledge" },
];

/** Punctuation that makes it look like JSON; noise for screen readers. */
function Json({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden="true" className="text-muted">
      {children}
    </span>
  );
}

export function Stack() {
  return (
    <Section
      id="stack"
      lede="Dependencies are what I have used in production. Dev dependencies are what I can work with."
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
        <Panel title="package.json" bodyClassName="overflow-x-auto">
          <div className="font-mono text-[0.8125rem] leading-7" data-stack>
            <p>
              <Json>{"{"}</Json>
            </p>
            <p className="pl-[2ch]">
              <Json>&quot;</Json>
              <span className="text-signal">name</span>
              <Json>&quot;: &quot;</Json>
              <span className="text-ok">somil</span>
              <Json>&quot;,</Json>
            </p>
            {tiers.map(({ tier, meaning }, tierIndex) => {
              const entries = skills.filter((skill) => skill.tier === tier);
              return (
                <div key={tier} className="pl-[2ch]">
                  <h3 className="font-normal">
                    <Json>&quot;</Json>
                    <span className="text-signal">{tier}</span>
                    <Json>&quot;: {"{"}</Json>
                    <span className="sr-only">: {meaning}</span>
                  </h3>
                  <ul className="pl-[2ch]">
                    {entries.map((skill, index) => {
                      const names = usedInNames(skill.usedIn);
                      return (
                        <li
                          key={skill.name}
                          data-skill={skill.name}
                          data-used-in={skill.usedIn.join(" ")}
                          tabIndex={names.length > 0 ? 0 : undefined}
                          className="whitespace-nowrap"
                        >
                          <Json>&quot;</Json>
                          <span>{skill.name}</span>
                          <Json>&quot;: &quot;</Json>
                          <span className="sr-only">, </span>
                          <span className="text-ok">{skill.level}</span>
                          <Json>
                            &quot;{index < entries.length - 1 ? "," : ""}
                          </Json>
                          {names.length > 0 ? (
                            <span className="text-muted">
                              <span aria-hidden="true">{"  // "}</span>
                              <span className="sr-only">, used at </span>
                              {names.join(", ")}
                            </span>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                  <p>
                    <Json>
                      {"}"}
                      {tierIndex < tiers.length - 1 ? "," : ""}
                    </Json>
                  </p>
                </div>
              );
            })}
            <p>
              <Json>{"}"}</Json>
            </p>
          </div>
        </Panel>

        <Panel title="zsh" bodyClassName="font-mono text-[0.8125rem] leading-7">
          <p>
            <span aria-hidden="true" className="text-signal">
              ${" "}
            </span>
            npm install somil
          </p>
          <p className="text-muted">
            added 1 engineer, <span className="text-ok">0 vulnerabilities</span>
          </p>
        </Panel>
      </div>
    </Section>
  );
}
