import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { profile } from "@/content/profile";
import { sections } from "@/content/sections";
import { clusters, endpointStats, requestLog } from "@/content/syntheticData";
import { RESUME_PDF_PATH } from "@/lib/paths";
import { ConstellationPoster } from "./ConstellationPoster";
import { HeroScene } from "./HeroScene";

const hero = sections[0];
const [firstName, lastName] = profile.name.split(" ");

export function Hero() {
  return (
    <section
      id={hero.id}
      aria-labelledby="hero-title"
      className="relative flex min-h-[calc(100svh-var(--nav-height))] flex-col overflow-hidden"
    >
      <div className="shell grid flex-1 grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:py-10">
        <div className="relative z-10 flex flex-col gap-6">
          <Eyebrow {...hero} />
          <h1
            id="hero-title"
            className="text-hero font-serif lg:whitespace-nowrap"
          >
            {firstName} <span className="italic">{lastName}</span>
          </h1>
          <div className="flex max-w-[35rem] flex-col gap-5">
            <p className="label text-signal">
              <span className="sr-only">{profile.headline}</span>
              <span aria-hidden="true" data-decode-now>
                {profile.headline}
              </span>
            </p>
            <p className="font-serif text-3xl leading-tight text-balance md:text-4xl">
              {profile.oneLiner}
            </p>
            <p className="text-muted text-pretty">{profile.subLine}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/#work" className="btn btn-primary">
              See the work
            </Link>
            <a href={RESUME_PDF_PATH} download className="btn">
              Download resume
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="relative lg:-mr-8">
          <p className="sr-only">
            Illustration: a map of {endpointStats.total} simulated API endpoints
            in {clusters.length} groups. {endpointStats.shadow} of them are
            missing from the documentation and are highlighted.
          </p>
          <div className="mx-auto max-w-[26rem] lg:max-w-none">
            <HeroScene poster={<ConstellationPoster />} />
          </div>
        </div>
      </div>

      <div className="shell flex flex-wrap items-end justify-between gap-x-10 gap-y-5 pb-8">
        <div aria-hidden="true" className="min-w-0 font-mono text-xs leading-6">
          <p className="label text-muted mb-1">request log · simulated</p>
          <div className="h-24 overflow-hidden">
            <ul className="text-muted ticker-track">
              {[...requestLog, ...requestLog].map((request, index) => (
                <li key={index} className="h-6 truncate tabular-nums">
                  <span className="text-signal">{request.method}</span>{" "}
                  {request.path}{" "}
                  <span className="text-ok">{request.status}</span>{" "}
                  {request.latencyMs}ms
                  {request.inSpec ? null : (
                    <span className="text-warn"> ⚠ not in spec</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="label text-muted tabular-nums">
          endpoints {endpointStats.total} · documented{" "}
          {endpointStats.documented} ·{" "}
          <span className="text-warn">shadow {endpointStats.shadow}</span> ·
          simulated
        </p>
      </div>
    </section>
  );
}
