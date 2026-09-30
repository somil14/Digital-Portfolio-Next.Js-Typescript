import type { Skill } from "./types";

const production = "production";
const working = "working knowledge";

/**
 * `usedIn` comes only from the experience and project content. An empty list
 * means no "used in" attribution is shown for that skill.
 */
export const skills: Skill[] = [
  // dependencies: production experience
  {
    name: "React",
    tier: "dependencies",
    level: production,
    usedIn: ["ftpc", "seagull"],
  },
  {
    name: "Next.js",
    tier: "dependencies",
    level: production,
    usedIn: ["ftpc", "seagull"],
  },
  {
    name: "TypeScript",
    tier: "dependencies",
    level: production,
    usedIn: ["ftpc", "seagull"],
  },
  // TODO(somil): which roles used JavaScript and REST APIs.
  { name: "JavaScript", tier: "dependencies", level: production, usedIn: [] },
  {
    name: "Node.js",
    tier: "dependencies",
    level: production,
    usedIn: ["ftpc", "seagull"],
  },
  // TODO(somil): which role used Express. It is not in any experience bullet.
  { name: "Express", tier: "dependencies", level: production, usedIn: [] },
  {
    name: "PostgreSQL",
    tier: "dependencies",
    level: production,
    usedIn: ["ftpc", "seagull"],
  },
  {
    name: "MongoDB",
    tier: "dependencies",
    level: production,
    usedIn: ["seagull"],
  },
  {
    name: "Prisma",
    tier: "dependencies",
    level: production,
    usedIn: ["seagull"],
  },
  { name: "Redis", tier: "dependencies", level: production, usedIn: ["ftpc"] },
  { name: "REST APIs", tier: "dependencies", level: production, usedIn: [] },
  {
    name: "JWT / RBAC",
    tier: "dependencies",
    level: production,
    usedIn: ["gorillahub"],
  },
  { name: "Docker", tier: "dependencies", level: production, usedIn: ["ftpc"] },
  // TODO(somil): which role used these specific AWS services. Drop any not used in production.
  {
    name: "AWS (S3, EC2, IAM, CloudWatch)",
    tier: "dependencies",
    level: production,
    usedIn: [],
  },
  {
    name: "OpenAI APIs",
    tier: "dependencies",
    level: production,
    usedIn: ["ftpc"],
  },
  {
    name: "API security (OWASP, CVE/CWE, OpenAPI, HAR analysis)",
    tier: "dependencies",
    level: production,
    usedIn: ["ftpc"],
  },
  {
    name: "Figma / UX research",
    tier: "dependencies",
    level: production,
    usedIn: ["cbnits"],
  },

  // devDependencies: working knowledge
  // TODO(somil): the FTPC bullet says "deployed on Kubernetes across AWS/GCP".
  // Confirm Kubernetes and GCP belong in this tier rather than production.
  {
    name: "Kubernetes",
    tier: "devDependencies",
    level: "deploy + debug",
    usedIn: ["ftpc"],
  },
  { name: "GCP", tier: "devDependencies", level: working, usedIn: ["ftpc"] },
  {
    name: "Python",
    tier: "devDependencies",
    level: "scripting",
    usedIn: ["whisperx"],
  },
  // TODO(somil): which roles or projects used Tailwind CSS and MySQL.
  { name: "Tailwind CSS", tier: "devDependencies", level: working, usedIn: [] },
  { name: "MySQL", tier: "devDependencies", level: working, usedIn: [] },
  // TODO(somil): confirm. Attributed to BranchHub only once that project is included.
  {
    name: "Chrome Extension APIs",
    tier: "devDependencies",
    level: working,
    usedIn: [],
  },
];
