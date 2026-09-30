import type { SyntheticEndpoint } from "@/content/types";

export interface ConstellationNode {
  endpoint: SyntheticEndpoint;
  clusterIndex: number;
  /** First node of a cluster; carries the cluster label. */
  hub: boolean;
  /** Roughly -1..1 on each axis. */
  x: number;
  y: number;
  z: number;
}

export interface Constellation {
  nodes: ConstellationNode[];
  /** Index pairs into `nodes`. */
  edges: [number, number][];
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/**
 * Deterministic layout shared by the SVG poster and the WebGL scene, so both
 * draw exactly the same graph. No randomness: positions depend only on order.
 */
export function buildConstellation(
  endpoints: readonly SyntheticEndpoint[],
  clusters: readonly string[],
): Constellation {
  const nodes: ConstellationNode[] = [];
  const edges: [number, number][] = [];
  const hubs: number[] = [];

  clusters.forEach((cluster, clusterIndex) => {
    const members = endpoints.filter(
      (endpoint) => endpoint.cluster === cluster,
    );
    const angle = (clusterIndex / clusters.length) * Math.PI * 2 - Math.PI / 2;
    const centreX = Math.cos(angle) * 0.6;
    const centreY = Math.sin(angle) * 0.52;
    const centreZ = clusterIndex % 2 === 0 ? 0.28 : -0.28;
    const spread = 0.12 + 0.2 * Math.sqrt(members.length / 30);
    const first = nodes.length;
    hubs.push(first);

    members.forEach((endpoint, i) => {
      const radius = spread * Math.sqrt(i / members.length);
      const theta = i * GOLDEN_ANGLE + clusterIndex;
      nodes.push({
        endpoint,
        clusterIndex,
        hub: i === 0,
        x: centreX + Math.cos(theta) * radius,
        y: centreY + Math.sin(theta) * radius,
        z: centreZ + Math.sin(i * 1.7 + clusterIndex) * 0.18,
      });
      // Each node links to an earlier one, giving a tree per cluster.
      if (i > 0) edges.push([first + Math.floor((i - 1) / 2), first + i]);
    });
  });

  // Hubs form a ring so the clusters read as one system.
  hubs.forEach((hub, i) => edges.push([hub, hubs[(i + 1) % hubs.length]]));

  return { nodes, edges };
}
