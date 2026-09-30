import { Section } from "@/components/ui/Section";
import { pipeline, pipelineDisclaimer } from "@/content/pipeline";
import { usedInNames } from "@/lib/format";
import { PipelineTrace, type TraceLayer } from "./PipelineTrace";

/** Attribution text comes from `where`, or else from the layer's `usedIn`. */
const layers: TraceLayer[] = pipeline.map((layer) => {
  const names = usedInNames(layer.usedIn);
  return {
    id: layer.id,
    name: layer.name,
    detail: layer.detail,
    does: layer.does,
    where:
      layer.where ??
      (names.length > 0 ? `Used at ${names.join(" and ")}.` : null),
  };
});

export function Pipeline() {
  return (
    <Section
      id="pipeline"
      lede="One request, edge to database and back, through the layers I work with."
    >
      <p className="label text-muted mb-8">{pipelineDisclaimer}</p>
      <PipelineTrace layers={layers} />
    </Section>
  );
}
