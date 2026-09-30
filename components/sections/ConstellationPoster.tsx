import { clusters, endpoints } from "@/content/syntheticData";
import { buildConstellation } from "@/lib/constellation";
import { cn } from "@/lib/cn";

const { nodes, edges } = buildConstellation(endpoints, clusters);
const round = (value: number) => Math.round(value * 1000) / 1000;

/** The shadow endpoint that gets a written callout. */
const CALLOUT_ID = "GET /internal/v0/export";

interface ConstellationPosterProps {
  className?: string;
  /** Hide labels for small renderings such as the 404 page. */
  compact?: boolean;
}

/**
 * Static drawing of the endpoint constellation, built from the same data and
 * layout as the WebGL scene. Used where live 3D is not shown. Decorative: a
 * text equivalent sits next to it wherever it is used.
 */
export function ConstellationPoster({
  className,
  compact = false,
}: ConstellationPosterProps) {
  const callout = nodes.find((node) => node.endpoint.id === CALLOUT_ID);

  return (
    <svg
      aria-hidden="true"
      viewBox="-1.05 -0.95 2.1 1.9"
      className={cn("h-auto w-full", className)}
    >
      <g stroke="var(--signal)" strokeOpacity="0.22" strokeWidth="0.0035">
        {edges.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={round(nodes[a].x)}
            y1={round(nodes[a].y)}
            x2={round(nodes[b].x)}
            y2={round(nodes[b].y)}
          />
        ))}
      </g>

      {nodes.map((node) => {
        const { documented, id } = node.endpoint;
        const x = round(node.x);
        const y = round(node.y);
        return documented ? (
          <circle
            key={id}
            cx={x}
            cy={y}
            r={node.hub ? 0.02 : 0.011}
            fill="var(--signal)"
            fillOpacity={node.hub ? 1 : 0.8}
          />
        ) : (
          <g key={id}>
            <circle
              cx={x}
              cy={y}
              r="0.036"
              fill="none"
              stroke="var(--warn)"
              strokeOpacity="0.45"
              strokeWidth="0.004"
            />
            <circle cx={x} cy={y} r="0.015" fill="var(--warn)" />
          </g>
        );
      })}

      {compact ? null : (
        <g
          fill="var(--muted)"
          fontFamily="var(--font-mono)"
          fontSize="0.042"
          letterSpacing="0.004"
        >
          {nodes
            .filter((node) => node.hub)
            .map((node) => (
              <text
                key={node.endpoint.cluster}
                x={round(node.x + 0.035)}
                y={round(node.y - 0.035)}
              >
                {node.endpoint.cluster}
              </text>
            ))}
          {callout ? (
            <text
              x={round(callout.x - 0.16)}
              y={round(callout.y + 0.085)}
              fill="var(--warn)"
              fontSize="0.038"
            >
              ⚠ not in spec
            </text>
          ) : null}
        </g>
      )}
    </svg>
  );
}
