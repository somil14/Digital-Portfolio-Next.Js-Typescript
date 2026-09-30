import { Chip } from "@/components/ui/Chip";
import { Panel } from "@/components/ui/Panel";
import { Section } from "@/components/ui/Section";
import { repos } from "@/content/repos";
import type { RepoEntry } from "@/content/types";
import { profile } from "@/content/profile";

const groups: { id: RepoEntry["group"]; title: string; note: string }[] = [
  { id: "recent", title: "recent", note: "smaller builds" },
  { id: "early", title: "early", note: "first projects, plain JavaScript" },
];

const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

/** Finished public repositories that are not big enough for a project card. */
export function Repos() {
  return (
    <Section
      id="repos"
      lede="Finished public repositories that are not in the projects above. Forks, templates and course exercises are left out."
    >
      <div className="grid grid-cols-1 gap-5">
        {groups.map((group) => {
          const entries = repos.filter((repo) => repo.group === group.id);
          if (entries.length === 0) return null;
          return (
            <Panel
              key={group.id}
              title={`~/repos/${group.title}`}
              note={group.note}
              bodyClassName="p-0 md:p-0"
            >
              <ul>
                {entries.map((repo) => (
                  <li
                    key={repo.slug}
                    className="border-line grid grid-cols-1 gap-x-8 gap-y-2 border-b px-4 py-4 last:border-b-0 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_auto] md:items-baseline md:px-5"
                  >
                    <h3 className="font-mono text-[0.9375rem]">
                      {repo.name}
                      <span className="label text-muted ml-3 tabular-nums">
                        {repo.year}
                      </span>
                    </h3>
                    <div className="flex flex-col gap-2">
                      <p className="text-pretty">{repo.summary}</p>
                      <ul className="flex flex-wrap gap-1.5">
                        {repo.stack.map((item) => (
                          <li key={item}>
                            <Chip>{item}</Chip>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="flex gap-4 font-mono text-sm md:justify-end">
                      <a
                        href={repo.source}
                        className="link inline-flex min-h-6 items-center"
                      >
                        Source<span className="sr-only">: {repo.name}</span>
                        <span aria-hidden="true"> ↗</span>
                      </a>
                      {repo.live ? (
                        <a
                          href={repo.live}
                          className="link inline-flex min-h-6 items-center"
                        >
                          Live
                          <span className="sr-only">: {bare(repo.live)}</span>
                          <span aria-hidden="true"> ↗</span>
                        </a>
                      ) : null}
                    </p>
                  </li>
                ))}
              </ul>
            </Panel>
          );
        })}
        <p className="text-muted text-sm">
          Everything else is on{" "}
          <a href={profile.links.github.href} className="link">
            GitHub
          </a>
          .
        </p>
      </div>
    </Section>
  );
}
