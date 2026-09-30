import { Section } from "@/components/ui/Section";
import { pipeline, pipelineDisclaimer } from "@/content/pipeline";
import { usedInNames } from "@/lib/format";

export function Pipeline() {
  return (
    <Section
      id="pipeline"
      lede="One request, edge to database and back. Each layer below is something I have built or operated."
    >
      <p className="label text-muted mb-8">{pipelineDisclaimer}</p>

      <ol className="border-line border-t" data-pipeline>
        {pipeline.map((layer, index) => {
          const names = usedInNames(layer.usedIn);
          return (
            <li
              key={layer.id}
              data-layer={layer.id}
              className="border-line grid grid-cols-1 gap-x-8 gap-y-2 border-b py-6 md:grid-cols-[3rem_minmax(0,16rem)_minmax(0,1fr)]"
            >
              <span aria-hidden="true" className="label text-signal pt-1">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-mono text-lg">{layer.name}</h3>
                {layer.detail ? (
                  <p className="label text-muted mt-1 normal-case">
                    {layer.detail}
                  </p>
                ) : null}
              </div>
              <div className="flex max-w-[40rem] flex-col gap-1.5 text-pretty">
                <p>{layer.does}</p>
                <p className="text-muted text-sm">
                  {layer.where ??
                    (names.length > 0
                      ? `Used at ${names.join(" and ")}.`
                      : null)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
