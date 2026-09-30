import { profile } from "@/content/profile";

// Evaluated once at build time: the site is a static export.
const builtOn = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
}).format(new Date());

export function StatusBar() {
  return (
    <footer className="border-line bg-surface border-t">
      <div className="label text-muted mx-auto flex max-w-[90rem] flex-wrap items-center gap-x-5 gap-y-1 px-4 py-3 md:px-8">
        <span>
          <span aria-hidden="true">⎇ </span>main
        </span>
        <span>built {builtOn}</span>
        <span>Next.js · Netlify</span>
        <a
          href={profile.repoUrl}
          className="text-signal ml-auto inline-flex min-h-6 items-center underline-offset-4 hover:underline"
        >
          view source<span aria-hidden="true"> ↗</span>
        </a>
      </div>
    </footer>
  );
}
