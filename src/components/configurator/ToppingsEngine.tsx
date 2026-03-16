"use client";

import { motion } from "framer-motion";
import { useCakeStore } from "@/store/cakeStore";
import { TOPPINGS } from "@/types/cake";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { formatAMD } from "@/types/cake";

export default function ToppingsEngine() {
  const { config, toggleTopping } = useCakeStore();
  const { tl, t } = useI18n();

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="font-body text-xs font-semibold tracking-[0.12em] uppercase text-ink-500">
          {t.configurator.toppings}
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {TOPPINGS.map((topping, i) => {
          const selected = config.toppings.includes(topping.id);
          return (
            <motion.button
              key={topping.id}
              whileTap={{ scale: 0.93 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => toggleTopping(topping.id)}
              className={cn(
                "relative flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border-2",
                "transition-all duration-200 text-center",
                selected
                  ? "border-gold-300 bg-gold-100 shadow-soft"
                  : "border-cream-200 hover:border-gold-200 bg-cream-50"
              )}
            >
              {/* Checkmark badge */}
              {selected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gold-400
                             flex items-center justify-center text-[8px] text-white font-bold z-10"
                >
                  ✓
                </motion.span>
              )}

              <span className="text-2xl">{topping.emoji}</span>
              <span className="text-[9px] font-medium text-ink-700 leading-tight">
                {tl(topping.label)}
              </span>
              <span className="text-[8px] text-gold-400 font-medium">
                +{formatAMD(topping.price)}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Selected summary chips */}
      {config.toppings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex flex-wrap gap-1.5 pt-1"
        >
          {config.toppings.map((id) => {
            const t = TOPPINGS.find((x) => x.id === id)!;
            return (
              <button
                key={id}
                onClick={() => toggleTopping(id)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-100
                           border border-gold-200 text-[9px] font-medium text-gold-500
                           hover:bg-red-50 hover:border-red-200 hover:text-red-400
                           transition-colors duration-200"
              >
                {t.emoji} {tl(t.label)} ×
              </button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
