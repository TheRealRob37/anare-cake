"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";
import { EASE_SMOOTH } from "@/lib/motion";
import { cn } from "@/lib/cn";

const INFO = [
  {
    icon: "📍",
    title: "Address",
    lines: ["Yerevan, Armenia", "Delivery across the city"],
  },
  {
    icon: "📞",
    title: "Phone / WhatsApp",
    lines: ["+374 XX XXX XXX"],
    href: "tel:+374XXXXXXXX",
  },
  {
    icon: "📸",
    title: "Instagram",
    lines: ["@anare_cake"],
    href: "https://instagram.com/anare_cake",
  },
  {
    icon: "🕐",
    title: "Working Hours",
    lines: ["Mon–Sat: 10:00 – 20:00", "Sun: by appointment"],
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  }

  return (
    <div className="pt-24 pb-24 bg-cream-gradient min-h-screen">
      <div className="container-site">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <SectionLabel label="Contact Us" />
          <h1 className="font-display text-display-md text-ink-900">
            Let&apos;s Create{" "}
            <span className="italic text-gold-400">Something Sweet</span>
          </h1>
          <p className="font-body text-ink-500 max-w-md mx-auto text-sm leading-relaxed">
            Ready to order a custom cake or have a question? Reach out — we'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE_SMOOTH }}
            className="card-cream p-8 rounded-3xl"
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-8 space-y-4"
              >
                <div className="text-5xl">🎂</div>
                <h3 className="font-display text-xl font-semibold text-ink-900">Message Sent!</h3>
                <p className="text-sm text-ink-500">We&apos;ll get back to you within a few hours.</p>
                <Link href="/" className="btn-gold inline-flex mt-4">Back to Home</Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-display text-lg font-semibold text-ink-900 mb-2">Send a Message</h2>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink-500 tracking-wide uppercase">Your Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Anna Vardanyan"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-cream-200 bg-white text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:border-gold-300 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink-500 tracking-wide uppercase">Phone / WhatsApp</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+374 XX XXX XXX"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-cream-200 bg-white text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:border-gold-300 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink-500 tracking-wide uppercase">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your dream cake — occasion, size, flavour preferences..."
                    className="w-full px-4 py-3 rounded-2xl border-2 border-cream-200 bg-white text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:border-gold-300 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={cn("btn-gold w-full py-3 text-sm font-semibold transition-all", loading && "opacity-70 cursor-not-allowed")}
                >
                  {loading ? "Sending…" : "Send Message"}
                </button>

                <p className="text-[11px] text-ink-400 text-center">
                  Or order directly through our{" "}
                  <Link href="/configurator" className="text-gold-400 hover:underline">cake configurator</Link>
                </p>
              </form>
            )}
          </motion.div>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE_SMOOTH }}
            className="space-y-4"
          >
            {INFO.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: EASE_SMOOTH }}
                className="card-cream p-5 flex gap-4 items-start rounded-2xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {item.icon}
                </div>
                <div className="space-y-0.5">
                  <p className="font-body text-xs font-semibold tracking-widest uppercase text-ink-400">{item.title}</p>
                  {item.lines.map((line) =>
                    item.href ? (
                      <a key={line} href={item.href} target="_blank" rel="noopener noreferrer"
                        className="block font-body text-sm font-medium text-ink-900 hover:text-gold-400 transition-colors">
                        {line}
                      </a>
                    ) : (
                      <p key={line} className="font-body text-sm text-ink-700">{line}</p>
                    )
                  )}
                </div>
              </motion.div>
            ))}

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: EASE_SMOOTH }}
              className="rounded-2xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #E8CB8A 0%, #B8862A 100%)" }}
            >
              <div className="p-6 space-y-3">
                <p className="font-body text-white/80 text-xs font-semibold tracking-wider uppercase">Skip the wait</p>
                <h3 className="font-display text-lg font-bold text-white">Design your cake online</h3>
                <p className="text-sm text-white/80">Use our 3D configurator to build your order layer by layer.</p>
                <Link href="/configurator" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
                  Open Configurator →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
