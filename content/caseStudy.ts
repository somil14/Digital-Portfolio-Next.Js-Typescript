import type { CaseStudyStep } from "./types";

export const caseStudy = {
  /** Shown on every recreated panel. */
  disclaimer: "illustrative recreation · synthetic data",
  outcome: "Dashboards like this cut manual triage by ~35%.",
  /** Experience entry that supplies the stack chips and "what I owned" bullets. */
  experienceSlug: "ftpc",
  steps: [
    {
      id: "capture",
      label: "Capture",
      title: "See every request, not just the documented ones.",
      body: "HAR files and network logs are read into one table of what the API was actually asked to do: method, path, status and latency.",
    },
    {
      id: "diff",
      label: "Diff",
      title: "Spec vs reality.",
      body: "Observed traffic is diffed against the OpenAPI spec. Endpoints that are in the traffic but not in the spec are flagged as shadow APIs; endpoints that no longer match the spec are flagged as drift.",
    },
    {
      id: "triage",
      label: "Triage",
      title: "Triage in minutes, not meetings.",
      body: "Findings arrive with a CWE class and the evidence behind them, and each one can be sent to a fix, marked as a false positive, or accepted as a risk.",
    },
    {
      id: "remediate",
      label: "Remediate",
      title: "AI-written fixes, human-approved.",
      body: "An LLM drafts a summary of each finding, remediation guidance and a priority, which a person reviews before anything is acted on.",
    },
  ] satisfies CaseStudyStep[],
} as const;
