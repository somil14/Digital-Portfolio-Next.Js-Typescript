import type { Project } from "./types";

/**
 * Only `included: true` projects are rendered, in this order. A project with
 * an open "include?" question stays false rather than showing a placeholder.
 */
export const projects: Project[] = [
  {
    slug: "whisperx",
    name: "WhisperX Transcriber",
    summary:
      "GPU batch transcription pipeline built on WhisperX, with speaker diarization, timestamps and CSV/Excel export through a Streamlit UI. Cut manual transcription effort by ~70%.",
    status: "Shipped",
    // TODO(somil): the public repo still holds an earlier CPU-only script
    // (no Streamlit, diarization or Docker) and session spreadsheets. Push the
    // current version and remove client material before launch.
    href: "https://github.com/somil14/Audio-to-Text-Transcriber",
    stack: [
      "Python",
      "WhisperX",
      "PyTorch",
      "CUDA",
      "FFmpeg",
      "Streamlit",
      "Docker",
    ],
    bullets: [],
    included: true,
  },
  {
    slug: "gorillahub-rbac",
    name: "RBAC & auth (GorillaHub)",
    summary:
      "Token-based authentication, protected routes and role-based access control for a UK client.",
    status: "Client work",
    // TODO(somil): were the tokens JWTs? Until confirmed the demo says "token claims".
    stack: ["React", "Node.js", "REST APIs"],
    bullets: [
      "Implemented token-based authentication, protected routes and role-based access control across the application.",
      "Turned business requirements into a reusable library of UI components and backend services.",
    ],
    included: true,
  },
  {
    slug: "doctor-leads",
    name: "doctor-leads",
    summary:
      "Node.js CLI that collects publicly listed doctors, clinics and hospitals from the Google Places API, then checks and scores how far each phone number and email can be trusted.",
    status: "Shipped",
    href: "https://github.com/somil14/doctor-leads",
    stack: ["Node.js", "Google Places API", "GitHub Actions"],
    bullets: [
      "Cleans, de-duplicates and classifies listings by specialty, type and outreach priority.",
      "Enriches contacts only from each practice's own website, and scores every phone and email from verified to low.",
      "Does not scrape directories, guess email addresses or contact anyone.",
    ],
    included: true,
  },
  {
    slug: "task-mgr",
    name: "Task Manager API",
    summary:
      "Task management backend as an Nx monorepo: NestJS modules for auth, users, tasks and analytics over MongoDB. Built as a take-home assignment.",
    status: "Shipped",
    // TODO(somil): the repo's only CI run failed. Fix it before this card links there.
    href: "https://github.com/somil14/task-mgr",
    stack: ["NestJS", "Nx", "TypeScript", "MongoDB", "Docker", "Jest"],
    bullets: [
      "JWT login and registration with bcrypt password hashing.",
      "Analytics for status counts, per-user totals and average completion time.",
    ],
    included: true,
  },
  {
    slug: "rankoraa",
    name: "Rankoraa",
    summary:
      "Agency website: a headless Next.js frontend over a WordPress CMS, with WordPress and MySQL self-hosted in Docker on Oracle Cloud.",
    status: "Shipped",
    // TODO(somil): rankoraa.com does not resolve (checked 30 Sep 2026). Add the
    // link back once the domain is live again.
    stack: ["Next.js", "WordPress REST API", "MySQL", "Docker", "Oracle Cloud"],
    bullets: [],
    included: true,
  },
  {
    slug: "branchhub",
    name: "BranchHub",
    summary:
      "Chrome extension that captures chat conversation branches and surfaces key decisions.",
    status: "Published",
    // TODO(somil): not on the resume or GitHub. Include? Chrome Web Store link?
    stack: [],
    bullets: [],
    included: false,
  },
  {
    slug: "sentinelparse",
    name: "SentinelParse",
    summary:
      "Security-focused AI chat parser and exporter with inline PII highlighting.",
    status: "In progress",
    // TODO(somil): not on the resume or GitHub. Include? Status? Link?
    stack: [],
    bullets: [],
    included: false,
  },
];

export const includedProjects = projects.filter((project) => project.included);
