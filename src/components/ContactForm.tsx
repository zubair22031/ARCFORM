"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full px-4 py-3 bg-arch-cream border border-gray-200 focus:border-arch-accent focus:outline-none transition-colors text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Your Name *"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
        />
        <input
          type="email"
          placeholder="Email Address *"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="tel"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className={inputClass}
        />
      </div>
      <textarea
        placeholder="Your Message *"
        required
        rows={6}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className={inputClass + " resize-none"}
      />

      {status === "sent" && (
        <div className="bg-green-50 text-green-700 p-4 text-sm">
          ✓ Thank you! Your message has been sent. We&apos;ll get back to you soon.
        </div>
      )}
      {status === "error" && (
        <div className="bg-red-50 text-red-700 p-4 text-sm">
          Something went wrong. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="px-8 py-4 bg-arch-black text-white font-medium tracking-wide hover:bg-arch-accent transition-colors disabled:opacity-50 w-full"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
