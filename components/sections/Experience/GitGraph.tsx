import { Chip } from "@/components/ui/Chip";
import type { Experience } from "@/content/types";
import { cn } from "@/lib/cn";
import { formatRange, shortHash } from "@/lib/format";

interface GitGraphProps {
  entries: Experience[];
}

// Gutter geometry in px. Lane 0 is `main`; lane 1 carries side branches.
const LANE_X = [14, 42];
const NODE_Y = 16;
const CURVE = 22;

function Gutter({ entries, index }: { entries: Experience[]; index: number }) {
  const entry = entries[index];
  const onMain = entry.branch === "main";
  const mainAbove = entries.slice(0, index).some((e) => e.branch === "main");
  const mainBelow = entries.slice(index + 1).some((e) => e.branch === "main");
  const isLast = index === entries.length - 1;

  return (
    <div aria-hidden="true" className="relative w-14 shrink-0">
      {/* main lane */}
      {onMain ? (
        <>
          {index > 0 ? (
            <span
              className="bg-signal absolute w-0.5"
              style={{ left: LANE_X[0] - 1, top: 0, height: NODE_Y }}
            />
          ) : null}
          {isLast ? null : (
            <span
              className="bg-signal absolute bottom-0 w-0.5"
              style={{ left: LANE_X[0] - 1, top: NODE_Y }}
            />
          )}
        </>
      ) : mainAbove && mainBelow ? (
        <span
          className="bg-signal absolute inset-y-0 w-0.5"
          style={{ left: LANE_X[0] - 1 }}
        />
      ) : null}

      {/* side branch: merges into main above, branches off main below */}
      {onMain ? null : (
        <>
          {mainAbove ? (
            <svg
              className="text-muted absolute top-0 left-0"
              width="56"
              height={NODE_Y}
              viewBox={`0 0 56 ${NODE_Y}`}
              fill="none"
            >
              <path
                d={`M${LANE_X[1]} ${NODE_Y} C${LANE_X[1]} 4 ${LANE_X[0]} 12 ${LANE_X[0]} 0`}
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          ) : null}
          {mainBelow ? (
            <>
              <span
                className="bg-muted absolute w-0.5"
                style={{ left: LANE_X[1] - 1, top: NODE_Y, bottom: CURVE }}
              />
              <svg
                className="text-muted absolute bottom-0 left-0"
                width="56"
                height={CURVE}
                viewBox={`0 0 56 ${CURVE}`}
                fill="none"
              >
                <path
                  d={`M${LANE_X[1]} 0 C${LANE_X[1]} 14 ${LANE_X[0]} 8 ${LANE_X[0]} ${CURVE}`}
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </>
          ) : null}
        </>
      )}

      <span
        className={cn(
          "bg-bg absolute size-3.5 rounded-full border-2",
          onMain ? "border-signal" : "border-muted",
          entry.end === null && "bg-signal",
        )}
        style={{ left: LANE_X[onMain ? 0 : 1] - 7, top: NODE_Y - 7 }}
      />
    </div>
  );
}

function CommitLine({ entry }: { entry: Experience }) {
  return (
    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span aria-hidden="true" className="text-muted font-mono text-sm">
        {shortHash(entry.slug)}
      </span>
      <span className="text-lg leading-snug font-medium">
        {entry.role}{" "}
        <span className="text-muted font-normal">@ {entry.company}</span>
      </span>
    </span>
  );
}

function CommitMeta({ entry }: { entry: Experience }) {
  return (
    <span className="mt-2 flex flex-wrap items-center gap-2">
      <span className="label text-muted tabular-nums">
        {formatRange(entry.start, entry.end)}
      </span>
      <Chip tone={entry.type === "full-time" ? "signal" : "default"}>
        {entry.type}
      </Chip>
      {entry.arrangement ? <Chip>{entry.arrangement}</Chip> : null}
      <span className="label text-muted normal-case">
        <span aria-hidden="true">⎇ </span>
        {entry.branch}
      </span>
    </span>
  );
}

/**
 * Career as `git log --graph`, newest first. Each commit with bullets is a
 * native <details>, so expanding works from the keyboard and without JS.
 */
export function GitGraph({ entries }: GitGraphProps) {
  return (
    <ol>
      {entries.map((entry, index) => (
        <li key={entry.slug} data-commit={entry.slug} className="flex">
          <Gutter entries={entries} index={index} />
          <div className="min-w-0 flex-1 pb-10">
            {entry.bullets.length > 0 ? (
              <details open={index === 0} className="group">
                <summary className="hover:text-signal -m-2 cursor-pointer list-none p-2 transition-colors duration-150 [&::-webkit-details-marker]:hidden">
                  <CommitLine entry={entry} />
                  <CommitMeta entry={entry} />
                  <span className="label text-signal mt-3 block">
                    <span className="group-open:hidden">+ show diff</span>
                    <span className="hidden group-open:inline">
                      − hide diff
                    </span>
                  </span>
                </summary>
                <div className="border-line bg-surface mt-4 border">
                  <ul className="flex flex-col gap-2.5 p-4 text-pretty md:p-5">
                    {entry.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span aria-hidden="true" className="text-ok font-mono">
                          +
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  {entry.stack ? (
                    <ul className="border-line flex flex-wrap gap-2 border-t p-4 md:px-5">
                      {entry.stack.map((item) => (
                        <li key={item}>
                          <Chip>{item}</Chip>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {entry.note ? (
                    <p className="border-line text-muted border-t p-4 text-sm md:px-5">
                      {entry.note}
                    </p>
                  ) : null}
                </div>
              </details>
            ) : (
              <div>
                <CommitLine entry={entry} />
                <CommitMeta entry={entry} />
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
