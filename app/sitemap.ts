import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ["/", "/tldr/", "/resume/"].map((path) => ({
    url: `${profile.siteUrl}${path}`,
    lastModified,
    priority: path === "/" ? 1 : 0.6,
  }));
}
