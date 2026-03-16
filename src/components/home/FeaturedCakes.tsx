"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CAKES = [
  {
    id: 1,
    name: "Rose & Lychee Dream",
    description: "Rose sponge, lychee mousse, raspberry compote, Swiss meringue",
    price: "$95",
    tag: "Bestseller",
    color: "#F4C2C2",
    emoji: "🌹",
  },
  {
    id: 2,
    name: "Pistachio Royale",
    description: "Pistachio sponge, white chocolate ganache, edible gold leaf",
    price: "$120",
    tag: "Premium",
    color: "#C8DBC2",
    emoji: "✨",
  },
  {
    id: 3,
    name: "Dark Velvet Noir",
    description: "Dark chocolate sponge, salted caramel, mirror glaze",
    price: "$110",
    tag: "Signature",
    color: "#6B3D2E",
    emoji: "🍫",
  },
  {
    id: 4,
    name: "Matcha Sakura",
    description: "Matcha sponge, cherry blossom cream, yuzu curd",
    price: "$105",
    tag: "Seasonal",
    color: "#A8C5A0",
    emoji: "🌸",
  },
];

const CARD_VARIANTS = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function FeaturedCakes() {
  return (
    <section className="py-24 bg-cream-50">
      <div className="container-site">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="divider-gold" />
            <span className="label-section">Our Collection</span>
            <div className="divider-gold" />
          </div>
          <h2 className="font-display text-display-md text-ink-900">
            Featured <span className="italic text-gold-400">Creations</span>
          </h2>
          <p className="font-body text-ink-500 max-w-md mx-auto">
            Each cake is an original — crafted in small batches with seasonal
            ingredients and obsessive attention to flavour.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAKES.map((cake, i) => (
            <motion.div
              key={cake.id}
              custom={i}
              variants={CARD_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="card-cream overflow-hidden group cursor-pointer"
            >
              {/* Illustration area */}
              <div
                className="h-48 flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: cake.color + "22" }}
              >
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center text-6xl
                              shadow-soft transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundColor: cake.color + "44" }}
                >
                  {cake.emoji}
                </div>
                {/* Tag */}
                <span className="absolute top-3 right-3 text-[10px] font-semibold tracking-widest uppercase
                                  px-2.5 py-1 rounded-full bg-white/80 text-gold-400 border border-gold-200">
                  {cake.tag}
                </span>
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <h3 className="font-display text-base font-semibold text-ink-900">{cake.name}</h3>
                <p className="font-body text-xs text-ink-500 leading-relaxed">{cake.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-display text-lg font-semibold text-gold-400">{cake.price}</span>
                  <Link
                    href="/configurator"
                    className="text-xs font-medium text-ink-700 hover:text-gold-400 transition-colors underline underline-offset-2"
                  >
                    Customise →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/menu" className="btn-ghost">
            View Full Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
