"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCakeStore } from "@/store/cakeStore";
import { useI18n } from "@/lib/i18n";
import { formatAMD } from "@/types/cake";

export default function PriceCalculator() {
  const price = useCakeStore((s) => s.price);
  const config = useCakeStore((s) => s.config);
  const { t } = useI18n();

  const rows: { key: keyof typeof price; label: string }[] = [
    { key: "base",     label: t.price.base },
    { key: "sponge",   label: t.price.sponge },
    { key: "fillings", label: t.price.fillings },
    { key: "frosting", label: t.price.frosting },
    { key: "toppings", label: t.price.toppings },
    { key: "tiers",    label: t.price.extra_tiers },
  ];

  return (
    <div className="card-cream p-5 space-y-4">
      <h3 className="font-body text-xs font-semibold tracking-[0.12em] uppercase text-ink-500">
        {t.configurator.summary}
      </h3>

      {/* Breakdown */}
      <div className="space-y-2">
        {rows.map(({ key, label }) => {
          const val = price[key];
          if (val === 0) return null;
          return (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="flex justify-between items-center"
            >
              <span className="text-xs text-ink-500">{label}</span>
              <span className="text-xs font-medium text-ink-700">{formatAMD(val)}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="divider-gold mx-0 w-full" style={{ background: "linear-gradient(to right, transparent, #D4A853, transparent)" }} />

      {/* Total */}
      <AnimatePresence mode="wait">
        <motion.div
          key={price.total}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="flex justify-between items-center"
        >
          <span className="font-body text-sm font-semibold text-ink-900">{t.configurator.total}</span>
          <span className="font-display text-xl font-bold text-gold-400">{formatAMD(price.total)}</span>
        </motion.div>
      </AnimatePresence>

      {/* Serving note */}
      <p className="text-[10px] text-ink-300 text-center">
        {formatAMD(Math.round(price.total / 10))} / {t.configurator.serves}
      </p>

      {/* Order CTA */}
      <a
        href={`https://instagram.com/anare_cake`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-gold w-full justify-center"
      >
        {t.configurator.order} →
      </a>
    </div>
  );
}
