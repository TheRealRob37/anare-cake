"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import SectionLabel from "@/components/ui/SectionLabel";
import { EASE_SMOOTH } from "@/lib/motion";
import { TOPPINGS, formatAMD } from "@/types/cake";

const POS_COLORS = {
  top:  "bg-gold-100 text-gold-400",
  side: "bg-blush-100 text-blush-400",
  drip: "bg-ink-900 text-cream-100",
};

export default function ToppingsSection() {
  const { t, locale } = useI18n();

  const posLabel = (pos?: string) => {
    if (pos === "top")  return { label: t.toppings_section.pos_top,  cls: POS_COLORS.top  };
    if (pos === "side") return { label: t.toppings_section.pos_side, cls: POS_COLORS.side };
    if (pos === "drip") return { label: t.toppings_section.pos_drip, cls: POS_COLORS.drip };
    return null;
  };

  return (
    <section className="py-24 bg-cream-100">
      <div className="container-site">
        {/* Header */}
        <div className="text-center mb-14 space-y-4">
          <SectionLabel label={t.toppings_section.badge} />
          <h2 className="font-display text-display-md text-ink-900">
            {t.toppings_section.title}
          </h2>
          <p className="font-body text-ink-500 max-w-md mx-auto">
            {t.toppings_section.subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOPPINGS.map((topping, i) => {
            const pos = posLabel(topping.position);
            return (
              <motion.div
                key={topping.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: EASE_SMOOTH }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="card-cream p-5 flex items-start gap-4 group"
              >
                {/* Emoji bubble */}
                <div className="w-14 h-14 rounded-2xl bg-cream-200 flex items-center justify-center text-3xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  {topping.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-sm font-semibold text-ink-900 leading-snug">
                      {topping.label[locale]}
                    </h3>
                    {pos && (
                      <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${pos.cls}`}>
                        {pos.label}
                      </span>
                    )}
                  </div>

                  {/* Price pill */}
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold-400 bg-gold-100 px-2.5 py-0.5 rounded-full">
                    + {formatAMD(topping.price)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
