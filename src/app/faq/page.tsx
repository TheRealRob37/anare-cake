import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "FAQ" };

const FAQS = [
  { q: "How far in advance should I order?", a: "We recommend ordering at least 3–5 days in advance for standard cakes, and 7–10 days for large or tiered wedding cakes." },
  { q: "Do you deliver across Yerevan?", a: "Yes — we deliver to all districts of Yerevan. Delivery fee depends on your location and will be confirmed at checkout." },
  { q: "Can I customise flavours and fillings?", a: "Absolutely. Use our online cake configurator to choose from 14 signature recipes, frosting types, toppings and more." },
  { q: "Are your ingredients fresh and natural?", a: "All ingredients are sourced from certified Armenian farms within 100 km of Yerevan. We use no artificial preservatives." },
  { q: "Can I add a dedication message to my cake?", a: "Yes — you can add a personalised message with your choice of calligraphy font in our configurator." },
  { q: "What payment methods do you accept?", a: "We accept card payments, Apple Pay, Google Pay, and cash on delivery." },
];

export default function Page() {
  return (
    <div className="pt-24 pb-24 min-h-screen bg-cream-gradient">
      <div className="container-site max-w-2xl">
        <h1 className="font-display text-display-md text-ink-900 mb-2">Frequently Asked Questions</h1>
        <p className="text-sm text-ink-500 mb-12">Everything you need to know before ordering.</p>

        <div className="space-y-4">
          {FAQS.map((faq) => (
            <details key={faq.q} className="card-cream rounded-2xl px-6 py-4 group cursor-pointer">
              <summary className="font-body text-sm font-semibold text-ink-900 list-none flex items-center justify-between gap-4">
                {faq.q}
                <span className="text-gold-400 text-lg transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-ink-500 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-ink-500 mb-4">Still have questions?</p>
          <Link href="/contact" className="btn-gold">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
