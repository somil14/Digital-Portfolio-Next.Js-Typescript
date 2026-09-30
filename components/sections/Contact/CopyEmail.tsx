"use client";

import { copyText } from "@/lib/toast";

export function CopyEmail({ email }: { email: string }) {
  return (
    <button
      type="button"
      onClick={() => copyText(email, "Email")}
      className="js-only label text-muted hover:text-signal min-h-11 px-2 transition-colors duration-150"
    >
      copy<span className="sr-only"> email address</span>
    </button>
  );
}
