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
    usedIn: ["ftpc", "gorillahub", "seagull"],
  },
  {
    name: "Next.js",
    tier: "dependencies",
    level: production,
    usedIn: ["ftpc", "seagull", "rankoraa"],
  },
  {
    name: "TypeScript",
    tier: "dependencies",
    level: production,
    usedIn: ["ftpc", "seagull", "task-mgr"],
  },
  {
    name: "JavaScript",
    tier: "dependencies",
    level: production,
    usedIn: ["seagull-intern", "doctor-leads"],
  },
  {
    name: "Node.js",
    tier: "dependencies",
    level: production,
    usedIn: ["ftpc", "gorillahub", "seagull", "doctor-leads"],
  },
  {
    name: "Express",
    tier: "dependencies",
    level: production,
    usedIn: ["seagull"],
  },
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
    usedIn: ["seagull", "task-mgr"],
  },
  {
    name: "Prisma",
    tier: "dependencies",
    level: production,
    usedIn: ["seagull"],
  },
  { name: "Redis", tier: "dependencies", level: production, usedIn: ["ftpc"] },
  {
    name: "REST APIs",
    tier: "dependencies",
    level: production,
    usedIn: ["gorillahub", "task-mgr"],
  },
  {
    name: "JWT / RBAC",
    tier: "dependencies",
    level: production,
    usedIn: ["gorillahub", "task-mgr"],
  },
  {
    name: "Docker",
    tier: "dependencies",
    level: production,
    usedIn: ["ftpc", "whisperx", "rankoraa", "task-mgr"],
  },
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
  // TODO(somil): which role or project used Tailwind CSS.
  { name: "Tailwind CSS", tier: "devDependencies", level: working, usedIn: [] },
  {
    name: "MySQL",
    tier: "devDependencies",
    level: working,
    usedIn: ["seagull-intern", "rankoraa"],
  },
  {
    name: "ShadCN / Material UI",
    tier: "devDependencies",
    level: working,
    usedIn: [],
  },
  {
    name: "Git · Linux · CI/CD",
    tier: "devDependencies",
    level: working,
    usedIn: ["doctor-leads", "task-mgr"],
  },
  { name: "OWASP ZAP", tier: "devDependencies", level: working, usedIn: [] },
  // TODO(somil): the resume lists these without a level. They sit in working
  // knowledge until you say otherwise.
  // TODO(somil): confirm. Attributed to BranchHub only once that project is included.
  {
    name: "Chrome Extension APIs",
    tier: "devDependencies",
    level: working,
    usedIn: [],
  },
];
