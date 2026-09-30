import { experience } from "@/content/experience";
import { profile } from "@/content/profile";

const current = experience.find((entry) => entry.end === null);

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description: profile.subLine,
  url: profile.siteUrl,
  email: `mailto:${profile.email}`,
  sameAs: Object.values(profile.links).map((link) => link.href),
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: profile.education.school,
  },
  ...(current
    ? { worksFor: { "@type": "Organization", name: current.company } }
    : {}),
};

/** schema.org Person, built from the same content as the page. */
export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(person).replace(/</g, "\\u003c"),
      }}
    />
  );
}
