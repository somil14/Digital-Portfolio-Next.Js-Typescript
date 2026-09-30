import { Chip } from "@/components/ui/Chip";
import { Section } from "@/components/ui/Section";
import { caseStudy } from "@/content/caseStudy";
import { experience } from "@/content/experience";
import { CapturePanel } from "./CapturePanel";
import { DiffPanel } from "./DiffPanel";
import { RemediatePanel } from "./RemediatePanel";
import { TriagePanel } from "./TriagePanel";

const role = experience.find(
  (entry) => entry.slug === caseStudy.experienceSlug,
);

const panels = {
  capture: <CapturePanel />,
  diff: <DiffPanel />,
  triage: <TriagePanel />,
  remediate: <RemediatePanel />,
};

export function CaseStudy() {
  return (
    <Section
      id="work"
      lede="At FTPC's Corefix unit I work on an API security platform. The panels below show the idea in four steps, recreated with invented data."
    >
      <ol className="flex flex-col gap-16 md:gap-24" data-case-study>
        {caseStudy.steps.map((step, index) => (
          <li
            key={step.id}
            data-step={step.id}
            className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12"
          >
            <div className="flex flex-col gap-3 lg:pt-2">
              <p className="label text-signal">
                {String(index + 1).padStart(2, "0")} · {step.label}
              </p>
              <h3 className="font-serif text-3xl leading-tight text-balance md:text-4xl">
                {step.title}
              </h3>
              <p className="text-muted text-pretty">{step.body}</p>
            </div>
            {panels[step.id]}
          </li>
        ))}
      </ol>

      {role ? (
        <div className="border-line mt-16 grid grid-cols-1 gap-8 border-t pt-10 md:mt-24 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12">
          <div>
            <h3 className="label text-muted mb-4">Stack</h3>
            <ul className="flex flex-wrap gap-2">
              {role.stack?.map((item) => (
                <li key={item}>
                  <Chip>{item}</Chip>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="label text-muted mb-4">What I owned</h3>
            <ul className="flex max-w-[46rem] flex-col gap-3 text-pretty">
              {role.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span aria-hidden="true" className="text-signal font-mono">
                    →
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </Section>
  );
}
