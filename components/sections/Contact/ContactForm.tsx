"use client";

import { useEffect, useId, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";
import { CONTACT_FORM_ENDPOINT, CONTACT_FORM_NAME } from "@/lib/paths";

const fields = ["name", "email", "message"] as const;
type Field = (typeof fields)[number];
type Values = Record<Field, string>;
type FieldErrors = Partial<Record<Field, string>>;

type Response =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "created" }
  | { kind: "invalid"; errors: FieldErrors }
  | { kind: "failed" };

const empty: Values = { name: "", email: "", message: "" };

/** Zod is only needed on submit, so it loads then, not with the page. */
async function validate(values: Values): Promise<FieldErrors> {
  const { z } = await import("zod");
  const schema = z.object({
    name: z.string().trim().min(1, "Name is required").max(120),
    email: z.email("Enter a valid email address").max(200),
    message: z
      .string()
      .trim()
      .min(10, "Message must be at least 10 characters")
      .max(4000),
  });
  const result = schema.safeParse(values);
  if (result.success) return {};
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as Field;
    errors[field] ??= issue.message;
  }
  return errors;
}

function JsonLine({
  name,
  value,
  last,
}: {
  name: string;
  value: string;
  last?: boolean;
}) {
  return (
    <span className="block pl-[2ch] break-words whitespace-pre-wrap">
      <span className="text-signal">&quot;{name}&quot;</span>
      <span className="text-muted">: </span>
      <span className="text-ok">{JSON.stringify(value)}</span>
      {last ? null : <span className="text-muted">,</span>}
    </span>
  );
}

/**
 * Contact form dressed as an API client. The form is real and posts to
 * Netlify Forms (URL-encoded, to the static form definition). The JSON view
 * mirrors the fields as you type; responses are shown as 201 or 422.
 * Without JavaScript it submits as an ordinary POST with native validation.
 */
export function ContactForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(empty);
  const [tab, setTab] = useState<"body" | "headers">("body");
  const [response, setResponse] = useState<Response>({ kind: "idle" });
  // Native validation stays on until hydration, for the no-JS path.
  useEffect(() => {
    if (formRef.current) formRef.current.noValidate = true;
  }, []);

  const errors = response.kind === "invalid" ? response.errors : {};

  function update(field: Field, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setResponse({ kind: "sending" });

    const fieldErrors = await validate(values);
    const firstInvalid = fields.find((field) => fieldErrors[field]);
    if (firstInvalid) {
      setResponse({ kind: "invalid", errors: fieldErrors });
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const body = new URLSearchParams();
    new FormData(form).forEach((value, key) => {
      if (typeof value === "string") body.append(key, value);
    });

    try {
      const result = await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!result.ok) throw new Error(`Status ${result.status}`);
      setValues(empty);
      setResponse({ kind: "created" });
    } catch {
      setResponse({ kind: "failed" });
    }
  }

  const inputProps = (field: Field) => ({
    id: `${id}-${field}`,
    name: field,
    value: values[field],
    required: true,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${id}-${field}-error` : undefined,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => update(field, event.target.value),
    className: cn("field", errors[field] && "border-crit"),
  });

  const fieldError = (field: Field) =>
    errors[field] ? (
      <p id={`${id}-${field}-error`} className="text-crit font-mono text-xs">
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <form
        ref={formRef}
        name={CONTACT_FORM_NAME}
        method="POST"
        action={CONTACT_FORM_ENDPOINT}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <input type="hidden" name="form-name" value={CONTACT_FORM_NAME} />
        {/* Honeypot: hidden from people, tempting to bots. */}
        <p className="hidden">
          <label>
            Leave this empty
            <input
              type="text"
              name="bot-field"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </p>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-name`} className="label text-muted">
            name
          </label>
          <input
            {...inputProps("name")}
            type="text"
            autoComplete="name"
            maxLength={120}
          />
          {fieldError("name")}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-email`} className="label text-muted">
            email
          </label>
          <input
            {...inputProps("email")}
            type="email"
            autoComplete="email"
            spellCheck={false}
            maxLength={200}
          />
          {fieldError("email")}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-message`} className="label text-muted">
            message
          </label>
          <textarea
            {...inputProps("message")}
            maxLength={4000}
            className={cn(inputProps("message").className, "min-h-36 resize-y")}
          />
          {fieldError("message")}
        </div>

        <div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={response.kind === "sending"}
          >
            {response.kind === "sending" ? "Sending…" : "Send request"}
          </button>
        </div>
      </form>

      <div className="js-only flex min-w-0 flex-col gap-4">
        <div className="border-line bg-bg border">
          <div
            role="group"
            aria-label="Request preview"
            className="border-line flex border-b"
          >
            {(["body", "headers"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={tab === option}
                onClick={() => setTab(option)}
                className={cn(
                  "label min-h-10 px-4 transition-colors duration-150",
                  tab === option
                    ? "text-signal shadow-[inset_0_-2px_0_var(--signal)]"
                    : "text-muted hover:text-text",
                )}
              >
                {option}
              </button>
            ))}
          </div>
          <pre
            aria-hidden="true"
            className="min-h-40 overflow-x-auto p-4 font-mono text-xs leading-6"
          >
            {tab === "body" ? (
              <>
                <span className="text-muted">{"{"}</span>
                {fields.map((field, index) => (
                  <JsonLine
                    key={field}
                    name={field}
                    value={values[field]}
                    last={index === fields.length - 1}
                  />
                ))}
                <span className="text-muted">{"}"}</span>
              </>
            ) : (
              <>
                <span className="text-signal">Content-Type</span>
                <span className="text-muted">: </span>
                application/x-www-form-urlencoded{"\n"}
                <span className="text-signal">Accept</span>
                <span className="text-muted">: </span>
                */*
              </>
            )}
          </pre>
        </div>

        <div
          role="status"
          className="border-line bg-bg min-h-24 border p-4 font-mono text-xs leading-6"
        >
          {response.kind === "idle" ? (
            <span className="text-muted">Response appears here.</span>
          ) : null}
          {response.kind === "sending" ? (
            <span className="text-muted">Sending…</span>
          ) : null}
          {response.kind === "created" ? (
            <>
              <p className="text-ok">201 Created</p>
              <p>{'{ "status": "received" }'}</p>
              <p className="text-muted mt-2 font-sans text-sm">
                Thank you. Your message is in my inbox.
              </p>
            </>
          ) : null}
          {response.kind === "invalid" ? (
            <>
              <p className="text-crit">422 Unprocessable Entity</p>
              <ul>
                {fields.map((field) =>
                  response.errors[field] ? (
                    <li key={field}>
                      <span className="text-signal">{field}</span>
                      <span className="text-muted">: </span>
                      {response.errors[field]}
                    </li>
                  ) : null,
                )}
              </ul>
            </>
          ) : null}
          {response.kind === "failed" ? (
            <>
              <p className="text-crit">503 · the message did not send</p>
              <p className="mt-2 font-sans text-sm">
                Please email{" "}
                <a href={`mailto:${profile.email}`} className="link">
                  {profile.email}
                </a>{" "}
                instead.
              </p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
