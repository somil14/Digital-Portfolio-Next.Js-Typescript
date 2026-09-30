import type { Metadata } from "next";
import Link from "next/link";
import { ConstellationPoster } from "@/components/sections/ConstellationPoster";

export const metadata: Metadata = {
  title: "404 · Endpoint not in spec",
};

export default function NotFound() {
  return (
    <div className="shell grid min-h-[calc(100svh-var(--nav-height)-3rem)] grid-cols-1 items-center gap-10 py-16 md:grid-cols-2">
      <div className="flex flex-col gap-6">
        <p className="label text-warn">404 · Endpoint not in spec</p>
        <h1 className="text-title font-serif text-balance">
          You found a <span className="italic">shadow route.</span>
        </h1>
        <p className="text-muted max-w-[28rem] text-pretty">
          Reporting it to the triage queue… In the meantime, this page does not
          exist.
        </p>
        <div>
          <Link href="/" className="btn btn-primary">
            Back to the documented routes
          </Link>
        </div>
      </div>
      <ConstellationPoster
        compact
        className="mx-auto max-w-[24rem] opacity-80"
      />
    </div>
  );
}
