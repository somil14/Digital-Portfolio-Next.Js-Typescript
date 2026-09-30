"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { profile } from "@/content/profile";
import { sections } from "@/content/sections";
import { RESUME_PDF_PATH } from "@/lib/paths";
import { REDUCED_MOTION_QUERY } from "@/lib/useReducedMotion";
import { copyText, toast } from "@/lib/toast";
import { goToSection, toggleTheme } from "./CommandMenu";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHelp: () => void;
}

/** A burst of "200 OK" tokens. Skipped under reduced motion. */
function celebrate() {
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
  for (let i = 0; i < 28; i++) {
    const token = document.createElement("span");
    token.textContent = "200 OK";
    token.setAttribute("aria-hidden", "true");
    token.style.cssText =
      "position:fixed;left:50%;top:40%;z-index:95;pointer-events:none;color:var(--ok);font:0.75rem var(--font-mono);white-space:nowrap";
    document.body.append(token);
    const angle = (i / 28) * Math.PI * 2;
    const distance = 140 + Math.random() * 260;
    token
      .animate(
        [
          { transform: "translate(-50%, -50%) scale(0.6)", opacity: 1 },
          {
            transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance + 120}px)) scale(1)`,
            opacity: 0,
          },
        ],
        {
          duration: 1100 + Math.random() * 500,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        },
      )
      .finished.then(() => token.remove());
  }
}

export default function CommandPalette({
  open,
  onOpenChange,
  onHelp,
}: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  /** Close first, then act, so focus is not trapped in a closing dialog. */
  const run = (action: () => void) => () => {
    onOpenChange(false);
    setSearch("");
    action();
  };
  const openUrl = (url: string) => () => window.open(url, "_blank", "noopener");

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      loop
    >
      <Command.Input
        value={search}
        onValueChange={setSearch}
        placeholder="Type a command or search…"
      />
      <Command.List>
        <Command.Empty>No matching command.</Command.Empty>

        {/* Easter eggs: only listed once you start typing them. */}
        {query.startsWith("sudo") ? (
          <Command.Item
            value="sudo hire somil"
            onSelect={run(() => {
              celebrate();
              toast("Permission granted. Opening contact…");
              goToSection("contact", router.push);
            })}
          >
            sudo hire somil
          </Command.Item>
        ) : null}
        {query.startsWith("who") ? (
          <Command.Item
            value="whoami"
            onSelect={run(() => goToSection("whoami", router.push))}
          >
            whoami
          </Command.Item>
        ) : null}
        {query.startsWith("ls") ? (
          <Command.Item
            value="ls projects"
            onSelect={run(() => goToSection("projects", router.push))}
          >
            ls projects
          </Command.Item>
        ) : null}

        <Command.Group heading="Go to">
          {sections.map((section) => (
            <Command.Item
              key={section.id}
              value={`${section.label} ${section.path}`}
              onSelect={run(() => goToSection(section.id, router.push))}
            >
              <span>{section.label}</span>
              <span className="label text-muted normal-case">
                {section.method} {section.path}
              </span>
            </Command.Item>
          ))}
          <Command.Item
            value="TL;DR recruiter summary"
            onSelect={run(() => router.push("/tldr/"))}
          >
            TL;DR summary
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Actions">
          <Command.Item
            value="Download resume PDF"
            onSelect={run(() => window.location.assign(RESUME_PDF_PATH))}
          >
            Download resume
          </Command.Item>
          <Command.Item
            value="Copy email address"
            onSelect={run(() => copyText(profile.email, "Email"))}
          >
            Copy email
          </Command.Item>
          <Command.Item
            value="Toggle theme dark light"
            onSelect={run(toggleTheme)}
          >
            Toggle theme
          </Command.Item>
          <Command.Item value="Keyboard shortcuts help" onSelect={run(onHelp)}>
            Keyboard shortcuts
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Links">
          <Command.Item
            value="Open GitHub"
            onSelect={run(openUrl(profile.links.github.href))}
          >
            GitHub
          </Command.Item>
          <Command.Item
            value="Open LinkedIn"
            onSelect={run(openUrl(profile.links.linkedin.href))}
          >
            LinkedIn
          </Command.Item>
          <Command.Item
            value="View source repository"
            onSelect={run(openUrl(profile.repoUrl))}
          >
            View source
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
