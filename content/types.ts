export type ExperienceSlug =
  "ftpc" | "gorillahub" | "seagull" | "seagull-intern" | "cbnits";

export type ProjectSlug =
  "whisperx" | "rankoraa" | "branchhub" | "sentinelparse" | "gorillahub-rbac";

/** Anything a skill can be attributed to. */
export type UsedInSlug = ExperienceSlug | ProjectSlug;

export type EmploymentType =
  "full-time" | "contract" | "freelance" | "internship";

/** Which line of the git graph a role sits on (see brief 5.6). */
export type CareerBranch = "main" | "ux" | "freelance";

export interface SocialLink {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  monogram: string;
  headline: string;
  role: string;
  focus: string[];
  oneLiner: string;
  subLine: string;
  experienceYears: string;
  careerPath: string;
  location: string;
  locationShort: string;
  openTo: string;
  availability: string;
  email: string;
  siteUrl: string;
  repoUrl: string;
  links: {
    github: SocialLink;
    linkedin: SocialLink;
    leetcode: SocialLink;
    hackerrank: SocialLink;
    x: SocialLink;
    behance: SocialLink;
  };
  education: {
    degree: string;
    school: string;
    years: string;
  };
  about: string[];
  interests: string[];
  /** Experience slug whose bullets are used as the /tldr summary. */
  tldrBulletsFrom: ExperienceSlug;
}

export interface Experience {
  slug: ExperienceSlug;
  company: string;
  /** Shorter name for tight spaces ("used in: Corefix"). */
  shortName: string;
  unit?: string;
  role: string;
  type: EmploymentType;
  arrangement?: string;
  /** ISO year-month. */
  start: string;
  /** ISO year-month, or null while current. */
  end: string | null;
  bullets: string[];
  stack?: string[];
  note?: string;
  branch: CareerBranch;
}

export type ProjectStatus =
  "Shipped" | "Live" | "Published" | "In progress" | "Client work";

export interface Project {
  slug: ProjectSlug;
  name: string;
  summary: string;
  status: ProjectStatus;
  href?: string;
  stack: string[];
  bullets: string[];
  /** Only projects marked true are rendered. Unresolved TODOs stay false. */
  included: boolean;
}

export type SkillTier = "dependencies" | "devDependencies";

export interface Skill {
  name: string;
  tier: SkillTier;
  /** The string shown as the package.json value. */
  level: string;
  /** Empty means "no attribution shown". Never infer one. */
  usedIn: UsedInSlug[];
}

export interface NowItem {
  label: string;
  detail: string;
  state: "ongoing" | "planned";
}

export interface CaseStudyStep {
  id: "capture" | "diff" | "triage" | "remediate";
  label: string;
  title: string;
  body: string;
}

export interface SectionTitle {
  serif: string;
  mono: string;
}

export interface SiteSection {
  id: string;
  index: string;
  /** Request-log styling for the eyebrow; decorative. */
  method: string;
  path: string;
  /** Plain name used for links and headings' accessible text. */
  label: string;
  /** Decorative status pill text and timing; styling, not a measurement. */
  status: string;
  latencyMs: number;
  title: SectionTitle;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface SyntheticEndpoint {
  id: string;
  cluster: string;
  method: HttpMethod;
  path: string;
  documented: boolean;
}

export interface SyntheticRequest {
  method: HttpMethod;
  path: string;
  status: number;
  latencyMs: number;
  inSpec: boolean;
}

export type Severity = "critical" | "high" | "medium" | "low";

export interface SyntheticFinding {
  /** Obviously synthetic ID. Never a CVE-style identifier. */
  id: string;
  severity: Severity;
  title: string;
  cwe: { id: string; name: string };
  endpoint: string;
  evidence: string;
}

export type DiffState = "match" | "drift" | "shadow";

export interface SyntheticDiffRow {
  spec: string | null;
  observed: string;
  state: DiffState;
  note?: string;
}

export interface SyntheticRemediation {
  findingId: string;
  summary: string;
  steps: string[];
  priority: string;
}

export interface PipelineLayer {
  id: string;
  name: string;
  detail?: string;
  does: string;
  /** Where Somil used it. Omitted when no role can be attributed. */
  where?: string;
  usedIn: UsedInSlug[];
}
