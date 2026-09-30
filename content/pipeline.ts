import type { PipelineLayer } from "./types";

export const pipelineDisclaimer =
  "illustrative architecture · a composite of patterns used across roles, not one real system";

/** In request order, edge first. */
export const pipeline: PipelineLayer[] = [
  {
    id: "edge",
    name: "Edge / CDN",
    does: "Serves cached static assets close to the visitor and terminates TLS before a request reaches the app.",
    where: "This site is served from Netlify's CDN.",
    usedIn: [],
  },
  {
    id: "next",
    name: "Next.js",
    does: "Renders the interface and hands API calls on to the backend.",
    usedIn: ["ftpc", "seagull"],
  },
  {
    id: "api",
    name: "Node / Express",
    detail: "validate · rate-limit · error model",
    does: "Validates every request, applies rate limits, and returns errors in one consistent shape.",
    usedIn: ["ftpc"],
  },
  {
    id: "cache",
    name: "Redis",
    does: "Answers repeated reads from cache, so the database is only queried on a miss.",
    usedIn: ["ftpc"],
  },
  {
    id: "db",
    name: "PostgreSQL / MongoDB",
    does: "Holds the data of record.",
    where:
      "PostgreSQL at Corefix and Seagull; MongoDB, through Prisma, at Seagull.",
    usedIn: ["ftpc", "seagull"],
  },
  {
    id: "infra",
    name: "Docker · Kubernetes",
    detail: "on AWS / GCP",
    does: "Each service ships as a container and runs on Kubernetes.",
    usedIn: ["ftpc"],
  },
];
