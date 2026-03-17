"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FILLINGS } from "@/types/cake";
import { EASE_SMOOTH } from "@/lib/motion";
import SectionLabel from "@/components/ui/SectionLabel";

const GALLERY_ITEMS = FILLINGS.filter((f) => f.photoUrl).map((f) => ({
  src: f.photoUrl!,
  name: f.label.en,
  sponge: f.sponge,
}));

export default function Gallery() {
  const [lightbox, setLightbox] = useState<typeof GALLERY_ITEMS[0] | null>(null);

  return (
    <section className="py-24 bg-cream-50">
      <div className="container-site">
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <SectionLabel label="Filling Gallery" />
          <h2 className="font-display text-display-md text-ink-900">
            Inside Every{" "}
            <span className="italic text-gold-400">Layer</span>
          </h2>
          <p className="font-body text-ink-500 max-w-md mx-auto text-sm leading-relaxed">
            A cross-section glimpse into our signature recipes — each cake a world of its own.
          </p>
        </div>

        {/* Masonry grid */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {GALLERY_ITEMS.map((item, i) => (
            <motion.button
              key={item.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.5, ease: EASE_SMOOTH }}
              onClick={() => setLightbox(item)}
              className="break-inside-avoid w-full block rounded-2xl overflow-hidden relative group shadow-card border border-cream-200 hover:border-gold-300 transition-all duration-300"
            >
              <img
                src={item.src}
                alt={item.name}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ aspectRatio: i % 3 === 1 ? "2/3" : "3/4" }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3"
                style={{ background: "linear-gradient(to top, rgba(30,16,8,0.72) 0%, transparent 60%)" }}
              >
                <p className="font-display text-sm font-semibold text-white leading-tight">{item.name}</p>
                <p className="text-[10px] text-white/70 mt-0.5">{item.sponge}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(20,10,5,0.85)", backdropFilter: "blur(8px)" }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE_SMOOTH }}
              className="relative max-w-sm w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.src}
                alt={lightbox.name}
                className="w-full object-cover"
                style={{ aspectRatio: "2/3" }}
              />
              <div
                className="absolute bottom-0 inset-x-0 px-6 py-5"
                style={{ background: "linear-gradient(to top, rgba(20,10,5,0.85) 0%, transparent 100%)" }}
              >
                <p className="font-display text-xl font-bold text-white">{lightbox.name}</p>
                <p className="text-xs text-white/60 mt-1">{lightbox.sponge} sponge</p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center text-lg hover:bg-black/70 transition-colors"
                aria-label="Close"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
