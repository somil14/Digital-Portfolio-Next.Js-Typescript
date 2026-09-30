import type { Project } from "./types";

/**
 * Only `included: true` projects are rendered. A project with an open
 * "include?" question stays false rather than showing a placeholder.
 */
export const projects: Project[] = [
  {
    slug: "whisperx",
    name: "WhisperX Transcriber",
    summary:
      "Audio-to-text transcription pipeline built on WhisperX; cut manual transcription effort by ~70%.",
    status: "Shipped",
    // TODO(somil): review the linked repo before launch (see PREREQUISITES.md, P3).
    href: "https://github.com/somil14/Audio-to-Text-Transcriber",
    stack: ["Python", "WhisperX"],
    bullets: [
      // TODO(somil): confirm these three bullets, drafted from transcribe.py:
      //  - Word-level timestamps using WhisperX transcription plus forced alignment, with automatic language detection.
      //  - Automatic annotation: filler words tagged, pauses over 0.5 s marked, numerals normalised to words.
      //  - Exports an annotation-ready Excel sheet (word, start, end, speaker, annotation).
    ],
    included: true,
  },
  {
    slug: "rankoraa",
    name: "Rankoraa",
    summary: "Marketing website for a Shopify-focused SEO agency.",
    // TODO(somil): confirm status and link before including (see PREREQUISITES.md, P3).
    status: "Live",
    href: "https://rankoraa.com",
    // TODO(somil): your exact role (design, build, or both) and the stack.
    stack: [],
    bullets: [],
    included: false,
  },
  {
    slug: "branchhub",
    name: "BranchHub",
    summary:
      "Chrome extension that captures chat conversation branches and surfaces key decisions.",
    status: "Published",
    // TODO(somil): confirm to include, and supply the Chrome Web Store link.
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
    // TODO(somil): include? status? link?
    stack: [],
    bullets: [],
    included: false,
  },
  {
    slug: "gorillahub-rbac",
    name: "RBAC & auth (GorillaHub)",
    summary:
      "Token-based auth and role-based access control, shown through an interactive role switcher.",
    status: "Client work",
    // TODO(somil): were the tokens JWTs? If not, the demo says "token claims".
    stack: [],
    bullets: [
      "Implemented token-based auth and role-based access control (RBAC).",
      "Built a library of reusable UI components.",
    ],
    included: true,
  },
];

export const includedProjects = projects.filter((project) => project.included);
