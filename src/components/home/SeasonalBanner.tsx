"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { EASE_SMOOTH } from "@/lib/motion";

const SPRING_ITEMS = [
  {
    emoji: "🌸",
    color: "#F5D9D3",
    accentColor: "#D98F84",
    key: "item1" as const,
  },
  {
    emoji: "🍓",
    color: "#F4C2C2",
    accentColor: "#C2768A",
    key: "item2" as const,
  },
  {
    emoji: "🍋",
    color: "#F9E87E",
    accentColor: "#B8862A",
    key: "item3" as const,
  },
];

const PETALS = ["🌸", "🌺", "🌼", "🪷", "🌷"];

export default function SeasonalBanner() {
  const { t } = useI18n();

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blush-100 via-cream-200 to-silver-100">
      {/* Floating petal decorations */}
      {PETALS.map((petal, i) => (
        <motion.span
          key={i}
          className="absolute pointer-events-none select-none text-2xl"
          style={{
            left:  `${10 + i * 20}%`,
            top:   `${10 + (i % 3) * 25}%`,
            opacity: 0.25,
          }}
          animate={{
            y: [0, -14, 0],
            rotate: [0, i % 2 === 0 ? 12 : -12, 0],
          }}
          transition={{
            duration: 3 + i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          {petal}
        </motion.span>
      ))}

      <div className="container-site relative z-10">
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE_SMOOTH }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blush-300 bg-white/60 backdrop-blur-sm"
          >
            <span className="text-sm">🌸</span>
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-blush-400">
              {t.seasonal.badge}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: EASE_SMOOTH }}
            className="font-display text-display-md text-ink-900"
          >
            {t.seasonal.title}{" "}
            <span className="italic text-blush-400">Bloom</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-body text-ink-500 max-w-md mx-auto"
          >
            {t.seasonal.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-xs font-medium text-blush-400 tracking-widest uppercase"
          >
            🗓 {t.seasonal.dates}
          </motion.p>
        </div>

        {/* Spring cake cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {SPRING_ITEMS.map((item, i) => {
            const nameKey = `${item.key}_name` as "item1_name" | "item2_name" | "item3_name";
            const descKey = `${item.key}_desc` as "item1_desc" | "item2_desc" | "item3_desc";

            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.13, duration: 0.6, ease: EASE_SMOOTH }}
                whileHover={{ y: -5, transition: { duration: 0.22 } }}
                className="bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/80 shadow-soft group cursor-pointer"
              >
                {/* Visual */}
                <div
                  className="h-36 flex items-center justify-center relative"
                  style={{ backgroundColor: item.color + "66" }}
                >
                  <motion.div
                    className="text-6xl"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  >
                    {item.emoji}
                  </motion.div>
                  {/* "Limited" tag */}
                  <span
                    className="absolute top-3 left-3 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: item.accentColor }}
                  >
                    Limited
                  </span>
                </div>

                {/* Text */}
                <div className="p-4 space-y-1">
                  <h3 className="font-display text-sm font-semibold text-ink-900">
                    {t.seasonal[nameKey]}
                  </h3>
                  <p className="font-body text-xs text-ink-500 leading-relaxed">
                    {t.seasonal[descKey]}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center"
        >
          <Link
            href="/menu?filter=seasonal"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium text-sm text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg bg-gradient-to-r from-blush-300 to-blush-400"
          >
            {t.seasonal.cta} →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
