import Link from "next/link";
import { profile } from "@/content/profile";
import { sections } from "@/content/sections";
import { SectionMenu } from "./SectionMenu";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  return (
    <header className="border-line bg-bg/85 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto grid h-(--nav-height) max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/"
            className="text-text hover:text-signal inline-flex h-11 items-center font-mono text-sm font-medium tracking-widest transition-colors duration-200"
          >
            <span aria-hidden="true">{profile.monogram}</span>
            <span className="sr-only">{profile.name}, home</span>
          </Link>
          <p className="label text-muted hidden items-center gap-2 sm:flex">
            <span className="pulse-dot" aria-hidden="true" />
            {profile.availability}
          </p>
        </div>

        <SectionMenu sections={sections} />

        <div className="flex items-center justify-end gap-1 md:gap-3">
          <ThemeToggle />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="scroll-progress bg-signal absolute inset-x-0 -bottom-px h-px"
      />
    </header>
  );
}
