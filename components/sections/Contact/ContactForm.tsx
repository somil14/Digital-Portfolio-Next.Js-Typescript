"use client";

import { useId, useState } from "react";
import { profile } from "@/content/profile";
import { CONTACT_FORM_ENDPOINT, CONTACT_FORM_NAME } from "@/lib/paths";

type Status = "idle" | "sending" | "sent" | "failed";

/**
 * Real form, posted to Netlify Forms. Netlify only accepts URL-encoded bodies
 * and needs the POST to go to the static form definition, not to "/".
 * Without JavaScript the form still submits as a normal POST.
 */
export function ContactForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const body = new URLSearchParams();
    data.forEach((value, key) => {
      if (typeof value === "string") body.append(key, value);
    });

    setStatus("sending");
    try {
      const response = await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!response.ok) throw new Error(`Status ${response.status}`);
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <form
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-name`} className="label text-muted">
            name
          </label>
          <input
            id={`${id}-name`}
            className="field"
            type="text"
            name="name"
            autoComplete="name"
            required
            maxLength={120}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-email`} className="label text-muted">
            email
          </label>
          <input
            id={`${id}-email`}
            className="field"
            type="email"
            name="email"
            autoComplete="email"
            spellCheck={false}
            required
            maxLength={200}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-message`} className="label text-muted">
          message
        </label>
        <textarea
          id={`${id}-message`}
          className="field min-h-36 resize-y"
          name="message"
          required
          maxLength={4000}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Send request"}
        </button>
        <p role="status" className="min-w-0 flex-1 font-mono text-sm">
          {status === "sent" ? (
            <span className="text-ok">
              201 Created · message received. Thank you.
            </span>
          ) : null}
          {status === "failed" ? (
            <span className="text-crit">
              The message did not send. Please email{" "}
              <a href={`mailto:${profile.email}`} className="underline">
                {profile.email}
              </a>{" "}
              instead.
            </span>
          ) : null}
        </p>
      </div>
    </form>
  );
}
