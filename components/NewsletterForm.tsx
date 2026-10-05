"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    setBusy(true);
    setMessage("");
    setHasError(false);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        const errorMessage = typeof result === "object" && result !== null && "error" in result && typeof result.error === "string" ? result.error : "Please try again.";
        throw new Error(errorMessage);
      }
      form.reset();
      setMessage("You're on the list. Thank you.");
    } catch (error) {
      setHasError(true);
      setMessage(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="newsletter-form" onSubmit={subscribe}>
      <label className="eyebrow" htmlFor="newsletter-email">NOTES FROM THE STUDIO</label>
      <p>Occasional thoughts on paper, spaces and the ideas in between.</p>
      <div className="newsletter-field"><input id="newsletter-email" type="email" name="email" placeholder="Your email address" required maxLength={254} aria-label="Your email address" /><button type="submit" disabled={busy}>{busy ? "Sending…" : "Subscribe"} <span>→</span></button></div>
      {message && <p className={`newsletter-message${hasError ? " is-error" : ""}`} role={hasError ? "alert" : "status"}>{message}</p>}
    </form>
  );
}
