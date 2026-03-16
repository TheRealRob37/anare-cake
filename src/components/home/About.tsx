"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const VALUES = [
  { icon: "🌾", title: "Natural Ingredients",    desc: "Every sponge, cream and filling starts with premium, locally-sourced ingredients." },
  { icon: "🎨", title: "Artisan Craft",          desc: "Each cake is hand-decorated — no moulds, no shortcuts, just skill and patience." },
  { icon: "💌", title: "Personal Touch",          desc: "From the first consultation to final delivery, your vision guides every decision." },
];

export default function About() {
  return (
    <section className="py-24 bg-cream-gradient">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="divider-gold" />
                <span className="label-section">Our Story</span>
              </div>
              <h2 className="font-display text-display-md text-ink-900 leading-tight">
                Born from a{" "}
                <span className="italic text-gold-400">Passion</span>{" "}
                for Beautiful Things
              </h2>
              <p className="font-body text-ink-500 leading-relaxed">
                Anare Cake was founded with a simple belief: a truly special cake should taste
                as extraordinary as it looks. Every recipe is developed over months of
                testing until each flavour combination is perfectly balanced.
              </p>
              <p className="font-body text-ink-500 leading-relaxed">
                We work exclusively with bespoke orders — because the best cakes are
                the ones designed around you.
              </p>
            </div>

            <div className="space-y-4">
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gold-100 flex items-center justify-center text-lg flex-shrink-0">
                    {v.icon}
                  </div>
                  <div>
                    <h4 className="font-body text-sm font-semibold text-ink-900 mb-1">{v.title}</h4>
                    <p className="font-body text-xs text-ink-500 leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/configurator" className="btn-gold inline-flex">
              Start Designing Your Cake
            </Link>
          </motion.div>

          {/* Right — visual */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="card-cream p-8 space-y-6">
              {/* Process steps */}
              <h3 className="font-display text-lg font-semibold text-ink-900 text-center">
                How It Works
              </h3>
              <div className="space-y-0">
                {[
                  { num: "01", label: "Design",  desc: "Use our configurator to choose flavours, fillings & decorations." },
                  { num: "02", label: "Consult",  desc: "We review your design and confirm details via WhatsApp or email." },
                  { num: "03", label: "Create",   desc: "Our pastry artists handcraft your cake fresh on your chosen date." },
                  { num: "04", label: "Deliver",  desc: "Same-day delivery in a bespoke keepsake box." },
                ].map((step, i) => (
                  <div key={step.num} className="flex gap-4 py-4 border-b border-cream-200 last:border-0">
                    <span className="font-display text-2xl font-bold text-gold-200 w-10 flex-shrink-0">{step.num}</span>
                    <div>
                      <p className="font-body text-sm font-semibold text-ink-900">{step.label}</p>
                      <p className="font-body text-xs text-ink-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gold-gradient
                            flex flex-col items-center justify-center shadow-glow text-white text-center">
              <span className="font-display text-lg font-bold leading-none">4.9</span>
              <span className="text-[8px] font-medium tracking-wider uppercase opacity-90 leading-tight">Stars</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
