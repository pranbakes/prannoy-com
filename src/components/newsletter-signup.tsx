"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterSignup() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email");

    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data: { ok: boolean; error?: string } = await res.json();

      if (data.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setMessage(data.error ?? "That didn't go through. Try again?");
      }
    } catch {
      setStatus("error");
      setMessage(
        "Couldn't reach the server just now. Check your connection and try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="border-t border-dashed border-rule pt-6">
        <p className="font-hand text-lg text-pen">
          you&apos;re in — check your inbox to confirm
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 border-t border-dashed border-rule pt-6 sm:flex-row sm:items-center"
    >
      <label htmlFor="bd-email" className="font-hand text-lg text-pen">
        get new essays by email
      </label>
      <div className="flex flex-1 flex-col gap-2 sm:flex-row">
        <div className="flex flex-1 gap-2">
          <input
            id="bd-email"
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            disabled={status === "loading"}
            className="flex-1 border border-rule bg-card px-3 py-2 font-sans text-sm text-ink placeholder:text-muted disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="border border-ink px-4 py-2 font-sans text-sm hover:bg-ink hover:text-paper disabled:opacity-60"
          >
            {status === "loading" ? "…" : "subscribe"}
          </button>
        </div>
        {status === "error" && (
          <p className="font-hand text-pen sm:ml-2 sm:self-center">
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
