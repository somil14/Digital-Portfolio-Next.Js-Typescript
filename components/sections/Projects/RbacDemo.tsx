"use client";

import { useState } from "react";
import { rbacDemo } from "@/content/syntheticData";
import { cn } from "@/lib/cn";

type Role = keyof typeof rbacDemo.roles;
const roles = Object.keys(rbacDemo.roles) as Role[];

/** Switch role; the actions and the token claims follow. Synthetic data. */
export function RbacDemo() {
  const [role, setRole] = useState<Role>("Editor");
  const granted: readonly string[] = rbacDemo.roles[role];

  return (
    <div className="bg-bg flex flex-col gap-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Role"
          className="border-line inline-flex border"
        >
          {roles.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={role === option}
              onClick={() => setRole(option)}
              className={cn(
                "label min-h-9 px-3 transition-colors duration-150",
                role === option
                  ? "bg-signal text-bg"
                  : "text-muted hover:text-text",
              )}
            >
              {option}
            </button>
          ))}
        </div>
        <span className="label text-muted">simulated</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ul className="flex flex-col gap-1.5 text-sm" aria-label="Actions">
          {rbacDemo.actions.map((action) => {
            const allowed = granted.includes(action.id);
            return (
              <li
                key={action.id}
                className={cn(
                  "border-line flex items-center justify-between gap-3 border px-3 py-1.5",
                  !allowed && "text-muted",
                )}
              >
                <span className={allowed ? "" : "line-through"}>
                  {action.label}
                </span>
                <span
                  className={cn("label", allowed ? "text-ok" : "text-muted")}
                >
                  {allowed ? "allowed" : "403"}
                </span>
              </li>
            );
          })}
        </ul>

        <pre
          aria-label="Token claims"
          aria-live="polite"
          className="border-line overflow-x-auto border p-3 font-mono text-xs leading-5"
        >
          <span className="text-muted">{"// token claims\n"}</span>
          {JSON.stringify(
            {
              sub: rbacDemo.subject,
              role: role.toLowerCase(),
              permissions: granted,
            },
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  );
}
