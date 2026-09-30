import { Panel } from "@/components/ui/Panel";
import { caseStudy } from "@/content/caseStudy";
import { requestLog } from "@/content/syntheticData";

export function CapturePanel() {
  return (
    <Panel
      title="capture.har"
      note={caseStudy.disclaimer}
      bodyClassName="overflow-x-auto p-0 md:p-0"
    >
      <table className="w-full min-w-[30rem] text-left font-mono text-[0.8125rem]">
        <caption className="sr-only">
          Captured requests: method, path, status and latency. Synthetic data.
        </caption>
        <thead className="label text-muted">
          <tr className="border-line border-b">
            <th scope="col" className="px-4 py-2.5 font-normal">
              Method
            </th>
            <th scope="col" className="px-4 py-2.5 font-normal">
              Path
            </th>
            <th scope="col" className="px-4 py-2.5 text-right font-normal">
              Status
            </th>
            <th scope="col" className="px-4 py-2.5 text-right font-normal">
              Latency
            </th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {requestLog.map((request) => (
            <tr
              key={`${request.method} ${request.path}`}
              className="border-line border-b last:border-b-0"
            >
              <td className="text-signal px-4 py-2">{request.method}</td>
              <td className="px-4 py-2">{request.path}</td>
              <td
                className={`px-4 py-2 text-right ${request.status < 400 ? "text-ok" : "text-warn"}`}
              >
                {request.status}
              </td>
              <td className="text-muted px-4 py-2 text-right">
                {request.latencyMs}&nbsp;ms
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
