"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const FLOAT_ITEMS = [
  { emoji: "🍓", x: "8%",  y: "20%", delay: 0,   size: "text-3xl" },
  { emoji: "🌸", x: "88%", y: "15%", delay: 1.2, size: "text-2xl" },
  { emoji: "✨", x: "15%", y: "72%", delay: 0.8, size: "text-xl"  },
  { emoji: "🍋", x: "80%", y: "65%", delay: 2,   size: "text-2xl" },
  { emoji: "🌹", x: "50%", y: "85%", delay: 1.5, size: "text-xl"  },
];

export default function Hero() {
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

      {/* Soft radial blob */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(212,168,83,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="container-site text-center z-10 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="divider-gold" />
            <span className="label-section">Bespoke Pastry Art</span>
            <div className="divider-gold" />
          </div>

          <h1 className="font-display text-display-xl text-ink-900 leading-[1.05]">
            Every Cake{" "}
            <span className="italic text-gold-400">Tells a Story</span>
          </h1>

          <p className="font-body text-lg text-ink-500 leading-relaxed max-w-xl mx-auto">
            Handcrafted luxury cakes made to celebrate your most cherished
            moments — designed by you, perfected by us.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/configurator" className="btn-gold text-base px-8 py-4">
              Design Your Cake
            </Link>
            <Link href="/menu" className="btn-ghost text-base px-8 py-4">
              Explore Collection
            </Link>
          </div>
        </motion.div>

        {/* Cake illustration placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 flex justify-center"
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            {/* Glow */}
            <div className="absolute inset-4 rounded-full bg-gold-200/30 blur-3xl" />
            {/* Cake SVG illustration */}
            <svg
              viewBox="0 0 200 220"
              className="relative w-full h-full drop-shadow-2xl animate-float"
              fill="none"
            >
              {/* Plate */}
              <ellipse cx="100" cy="205" rx="80" ry="10" fill="#F2E4C8" />

              {/* Cake body */}
              <rect x="30" y="100" width="140" height="100" rx="4" fill="#F5EDD6" />
              {/* Frosting drip */}
              <path d="M30 108 Q50 95 70 108 Q90 95 110 108 Q130 95 150 108 Q165 97 170 108 V100 H30Z" fill="#FFF8EE" />
              {/* Filling layer stripe */}
              <rect x="30" y="145" width="140" height="10" fill="#F4C2C2" opacity="0.8" />

              {/* Top tier */}
              <rect x="55" y="50" width="90" height="55" rx="4" fill="#FFF8EE" />
              <path d="M55 57 Q70 45 90 57 Q110 45 130 57 Q140 48 145 57 V50 H55Z" fill="#FFFFFF" />

              {/* Decorations */}
              <circle cx="100" cy="38" r="12" fill="#D4A853" />
              <circle cx="100" cy="38" r="7"  fill="#E8CB8A" />
              <text x="100" y="42" textAnchor="middle" fontSize="9" fill="#9A6F1E">✦</text>

              {/* Berries */}
              <circle cx="70"  cy="48" r="5" fill="#C2768A" />
              <circle cx="130" cy="48" r="5" fill="#C2768A" />
              <circle cx="80"  cy="42" r="4" fill="#E8A0A0" />
              <circle cx="120" cy="42" r="4" fill="#E8A0A0" />

              {/* Candle */}
              <rect x="97" y="20" width="6" height="18" rx="2" fill="#F5EDD6" />
              <ellipse cx="100" cy="18" rx="4" ry="6" fill="#FFD580" opacity="0.9" />
            </svg>
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16"
        >
          {[
            { value: "500+", label: "Cakes Crafted" },
            { value: "100%", label: "Natural Ingredients" },
            { value: "4.9★", label: "Customer Rating" },
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
