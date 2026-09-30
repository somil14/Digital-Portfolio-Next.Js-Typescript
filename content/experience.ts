import type { Experience } from "./types";

/** Newest first. */
export const experience: Experience[] = [
  {
    slug: "ftpc",
    company: "FTPC — Fusion Technologies Process Consulting",
    shortName: "Corefix",
    unit: "Corefix unit",
    role: "Full Stack Developer",
    type: "full-time",
    arrangement: "Remote",
    start: "2025-11",
    end: null,
    bullets: [
      "Built vulnerability dashboards (CVE/CWE mapping, evidence, false-positive marking, risk acceptance) that cut manual triage by ~35%.",
      "Built shadow-API and API-drift detection by diffing HAR / network logs against OpenAPI specs.",
      "Added LLM-generated finding summaries, remediation guidance and prioritisation (OpenAI APIs).",
      "Hardened services with request validation, rate limiting, Redis caching and a consistent error model; containerised with Docker and deployed on Kubernetes across AWS/GCP.",
    ],
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Kubernetes",
      "OpenAI",
    ],
    note: "Joined FTPC's DeepTraq AI team on a pre-hire engagement in Sep–Oct 2025 before moving to Corefix.",
    branch: "main",
  },
  {
    slug: "gorillahub",
    company: "GorillaHub (UK)",
    shortName: "GorillaHub",
    role: "Software Developer",
    type: "freelance",
    start: "2025-04",
    end: "2025-08",
    bullets: [
      "Implemented token-based auth and role-based access control (RBAC).",
      "Built a library of reusable UI components.",
    ],
    branch: "freelance",
  },
  {
    slug: "seagull",
    company: "Seagull (UK)",
    shortName: "Seagull",
    role: "Full Stack Developer",
    type: "contract",
    arrangement: "Remote",
    start: "2024-01",
    end: "2025-03",
    bullets: [
      "Built product features across React, Next.js, TypeScript and Node.js with Prisma on PostgreSQL and MongoDB.",
      "Structured a modular backend.",
      // TODO(somil): 1–2 more factual bullets, no percentages unless on the resume.
    ],
    branch: "main",
  },
  {
    slug: "seagull-intern",
    company: "Seagull (UK)",
    shortName: "Seagull",
    role: "Web Developer Intern",
    type: "internship",
    arrangement: "Remote",
    start: "2023-07",
    end: "2024-01",
    bullets: [
      // TODO(somil): 1–2 factual bullets.
    ],
    branch: "main",
  },
  {
    slug: "cbnits",
    company: "CBNITS",
    shortName: "CBNITS",
    role: "UX Design Intern",
    type: "internship",
    start: "2022-02",
    end: "2022-09",
    bullets: [
      "Ran user research and usability testing to inform design decisions.",
      // TODO(somil): confirm whether the client name can be shown. The old site named it publicly.
      "Contributed to UX for a large enterprise security product.",
    ],
    branch: "ux",
  },
];
