"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { SiteSection } from "@/content/types";
import { cn } from "@/lib/cn";
import { RESUME_PDF_PATH } from "@/lib/paths";

interface SectionMenuProps {
  sections: SiteSection[];
}

/**
 * Shows the section in view as a request path and opens a menu of real anchor
 * links. This is the keyboard route between sections, so it uses the native
 * popover: it opens, light-dismisses and closes on Escape without JavaScript.
 */
export function SectionMenu({ sections }: SectionMenuProps) {
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(sections[0].id);

  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) return;

    // A thin band just under the nav decides which section is "current".
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [sections]);

  const active =
    sections.find((section) => section.id === activeId) ?? sections[0];

  return (
    <>
      <button
        type="button"
        popoverTarget={menuId}
        className="label border-line bg-surface text-text hover:border-signal inline-flex h-11 max-w-full items-center gap-2 border px-3 transition-colors duration-200"
      >
        <span className="sr-only">Sections. Current: {active.label}. </span>
        <span aria-hidden="true" className="text-signal">
          {active.method}
        </span>
        <span aria-hidden="true" className="truncate normal-case">
          {active.path}
        </span>
        <span aria-hidden="true" className="text-muted">
          ▾
        </span>
      </button>

      <div id={menuId} ref={menuRef} popover="auto" className="section-menu">
        <nav aria-label="Sections">
          <ul>
            {sections.map((section) => (
              <li key={section.id}>
                <Link
                  href={`/#${section.id}`}
                  onClick={() => menuRef.current?.hidePopover()}
                  aria-current={section.id === activeId ? "true" : undefined}
                  className={cn(
                    "hover:bg-surface-2 flex min-h-11 items-center gap-3 px-3 py-2 transition-colors duration-150",
                    section.id === activeId && "bg-surface-2",
                  )}
                >
                  <span aria-hidden="true" className="label text-muted w-6">
                    {section.index}
                  </span>
                  <span className="flex-1">{section.label}</span>
                  <span
                    aria-hidden="true"
                    className="label text-muted normal-case"
                  >
                    {section.method} {section.path}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-line mt-1.5 flex gap-2 border-t pt-2">
            <Link
              href="/tldr/"
              onClick={() => menuRef.current?.hidePopover()}
              className="btn flex-1"
            >
              TL;DR
            </Link>
            <a href={RESUME_PDF_PATH} download className="btn flex-1">
              Resume <span aria-hidden="true">↓</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
