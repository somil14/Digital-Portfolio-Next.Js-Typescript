import { Chip } from "@/components/ui/Chip";
import { Panel } from "@/components/ui/Panel";
import { caseStudy } from "@/content/caseStudy";
import { remediation } from "@/content/syntheticData";

export function RemediatePanel() {
  return (
    <Panel
      title={`remediation · ${remediation.findingId}`}
      note={caseStudy.disclaimer}
      bodyClassName="flex flex-col gap-5"
    >
      <div>
        <p className="label text-muted mb-2">Summary</p>
        <p data-stream="summary" className="text-pretty">
          {remediation.summary}
        </p>
      </div>
      <div>
        <p className="label text-muted mb-2">Suggested fix</p>
        <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-pretty">
          {remediation.steps.map((step) => (
            <li key={step} data-stream="step">
              {step}
            </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Chip tone="crit">{remediation.priority}</Chip>
        <span className="text-muted text-sm">
          Pre-written example text. A person approves every fix.
        </span>
      </div>
    </Panel>
  );
}
