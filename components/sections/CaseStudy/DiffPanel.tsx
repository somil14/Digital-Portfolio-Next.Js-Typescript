import { Chip } from "@/components/ui/Chip";
import { Panel } from "@/components/ui/Panel";
import { caseStudy } from "@/content/caseStudy";
import { specDiff } from "@/content/syntheticData";
import type { DiffState } from "@/content/types";

const tone: Record<DiffState, "default" | "warn"> = {
  match: "default",
  drift: "warn",
  shadow: "warn",
};

export function DiffPanel() {
  return (
    <Panel
      title="openapi.yaml ⇄ observed traffic"
      note={caseStudy.disclaimer}
      bodyClassName="overflow-x-auto p-0 md:p-0"
    >
      <table className="w-full min-w-[34rem] text-left font-mono text-[0.8125rem]">
        <caption className="sr-only">
          Each observed endpoint compared with the API specification. Synthetic
          data.
        </caption>
        <thead className="label text-muted">
          <tr className="border-line border-b">
            <th scope="col" className="px-4 py-2.5 font-normal">
              In the spec
            </th>
            <th scope="col" className="px-4 py-2.5 font-normal">
              Observed
            </th>
            <th scope="col" className="px-4 py-2.5 font-normal">
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          {specDiff.map((row, index) => (
            <tr
              key={row.observed}
              data-diff-state={row.state}
              data-row
              style={{ "--row": index } as React.CSSProperties}
              className="border-line border-b last:border-b-0"
            >
              <td className="text-muted px-4 py-2">
                {row.spec ?? (
                  <>
                    <span aria-hidden="true">—</span>
                    <span className="sr-only">Not in the spec</span>
                  </>
                )}
              </td>
              <td
                className={`px-4 py-2 ${row.state === "match" ? "" : "text-warn"}`}
              >
                {row.observed}
              </td>
              <td className="px-4 py-2">
                <Chip tone={tone[row.state]}>{row.state}</Chip>
                {row.note ? (
                  <span className="text-muted ml-2 text-xs">{row.note}</span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
