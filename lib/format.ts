import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import type { UsedInSlug } from "@/content/types";

const monthYear = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "2025-11" → "Nov 2025". */
export function formatMonth(isoMonth: string): string {
  return monthYear.format(new Date(`${isoMonth}-01T00:00:00Z`));
}

export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
}

/** Deterministic 7-character "commit hash" for a slug. Decorative. */
export function shortHash(slug: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < slug.length; i++) {
    hash ^= slug.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

/** Display names for a skill's `usedIn` slugs, de-duplicated, in order. */
export function usedInNames(slugs: readonly UsedInSlug[]): string[] {
  const names = slugs.map((slug) => {
    const role = experience.find((entry) => entry.slug === slug);
    if (role) return role.shortName;
    return projects.find((project) => project.slug === slug)?.name ?? slug;
  });
  return [...new Set(names)];
}
