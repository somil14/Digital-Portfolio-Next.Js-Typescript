import { Panel } from "@/components/ui/Panel";
import { Section } from "@/components/ui/Section";
import { profile } from "@/content/profile";
import { RESUME_PDF_PATH } from "@/lib/paths";
import { ContactForm } from "./ContactForm";
import { CopyEmail } from "./CopyEmail";

const links = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  {
    label: profile.links.linkedin.label,
    value: "in/somil-athole",
    href: profile.links.linkedin.href,
  },
  {
    label: profile.links.github.label,
    value: "somil14",
    href: profile.links.github.href,
  },
  { label: "Resume", value: "PDF", href: RESUME_PDF_PATH },
];

export function Contact() {
  return (
    <Section
      id="contact"
      lede="A role, a project, or a question about anything on this page. The form goes straight to my inbox."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start lg:gap-10">
        <Panel title={`POST ${profile.siteUrl}/contact`} note="display only">
          <ContactForm />
        </Panel>

        <ul className="border-line border-t">
          {links.map((link) => (
            <li
              key={link.label}
              className="border-line flex items-center border-b"
            >
              {link.label === "Email" ? (
                <CopyEmail email={profile.email} />
              ) : null}
              <a
                href={link.href}
                className="group flex min-h-14 min-w-0 flex-1 items-center justify-between gap-4 py-3"
              >
                <span className="label text-muted">{link.label}</span>
                <span className="group-hover:text-signal truncate font-mono text-sm transition-colors duration-150">
                  {link.value}
                  <span aria-hidden="true"> ↗</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
