"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import SectionLabel from "@/components/ui/SectionLabel";
import { EASE_SMOOTH } from "@/lib/motion";

const FLOAT_ITEMS = [
  { emoji: "🍓", x: "8%",  y: "20%", delay: 0,   size: "text-3xl" },
  { emoji: "🌸", x: "88%", y: "15%", delay: 1.2, size: "text-2xl" },
  { emoji: "✨", x: "15%", y: "72%", delay: 0.8, size: "text-xl"  },
  { emoji: "🍋", x: "80%", y: "65%", delay: 2,   size: "text-2xl" },
  { emoji: "🌹", x: "50%", y: "85%", delay: 1.5, size: "text-xl"  },
];

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
      {/* Floating decorations */}
      {FLOAT_ITEMS.map((item, i) => (
        <motion.span
          key={i}
          className={`absolute ${item.size} select-none pointer-events-none`}
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ delay: item.delay + 1, duration: 0.5, type: "spring" }}
        >
          <motion.span
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
            className="block"
          >
            {item.emoji}
          </motion.span>
        </motion.span>
      ))}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(125,181,114,0.10) 0%, transparent 70%)" }}
      />

      <div className="container-site text-center z-10 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_SMOOTH }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          <SectionLabel label={t.hero.badge} />

          <h1 className="font-display text-display-xl text-ink-900 leading-[1.05]">
            {t.hero.title1}{" "}
            <span className="italic text-gold-400">{t.hero.title2}</span>
          </h1>

          <p className="font-body text-lg text-ink-500 leading-relaxed max-w-xl mx-auto">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/configurator" className="btn-gold text-base px-8 py-4">
              {t.hero.cta}
            </Link>
            <Link href="/menu" className="btn-ghost text-base px-8 py-4">
              {t.hero.explore}
            </Link>
          </div>
        </motion.div>

        {/* Cake illustration */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: EASE_SMOOTH }}
          className="mt-16 flex justify-center"
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            <div className="absolute inset-4 rounded-full bg-gold-200/30 blur-3xl" />
            <svg viewBox="0 0 200 220" className="relative w-full h-full drop-shadow-2xl animate-float" fill="none">
              {/* Shadow */}
              <ellipse cx="100" cy="205" rx="80" ry="10" fill="#C4D2BE" opacity="0.5" />
              {/* Bottom tier */}
              <rect x="30" y="100" width="140" height="100" rx="4" fill="#ECF0EA" />
              <path d="M30 108 Q50 95 70 108 Q90 95 110 108 Q130 95 150 108 Q165 97 170 108 V100 H30Z" fill="#F5F7F4" />
              {/* Filling stripe — dirty rose */}
              <rect x="30" y="145" width="140" height="10" fill="#E0C4BB" opacity="0.9" />
              {/* Top tier */}
              <rect x="55" y="50" width="90" height="55" rx="4" fill="#F5F7F4" />
              <path d="M55 57 Q70 45 90 57 Q110 45 130 57 Q140 48 145 57 V50 H55Z" fill="#fff" />
              {/* Pistachio decoration */}
              <circle cx="100" cy="38" r="12" fill="#7DB572" />
              <circle cx="100" cy="38" r="7"  fill="#AECFA4" />
              <text x="100" y="42" textAnchor="middle" fontSize="9" fill="#3A6B30">✦</text>
              {/* Rose berries */}
              <circle cx="70"  cy="48" r="5" fill="#A86A5A" />
              <circle cx="130" cy="48" r="5" fill="#A86A5A" />
              <circle cx="80"  cy="42" r="4" fill="#E0C4BB" />
              <circle cx="120" cy="42" r="4" fill="#E0C4BB" />
              {/* Candle */}
              <rect x="97" y="20" width="6" height="18" rx="2" fill="#ECF0EA" />
              <ellipse cx="100" cy="18" rx="4" ry="6" fill="#FFD580" opacity="0.9" />
            </svg>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16"
        >
          {[
            { value: "500+", label: t.hero.stat_cakes },
            { value: "100%", label: t.hero.stat_natural },
            { value: "4.9★", label: t.hero.stat_rating },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl font-semibold text-gold-400">{stat.value}</p>
              <p className="font-body text-xs tracking-widest uppercase text-ink-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
