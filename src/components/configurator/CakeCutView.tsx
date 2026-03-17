"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCakeStore, selectInternalLayers } from "@/store/cakeStore";
import { useI18n } from "@/lib/i18n";
import { FILLINGS } from "@/types/cake";

export default function CakeCutView() {
  const config = useCakeStore((s) => s.config);
  const layers = selectInternalLayers(config);
  const { t, tl } = useI18n();

  // Find the active recipe photo (first selected filling with a photoUrl)
  const activeRecipe = FILLINGS.find(
    (f) => config.fillings.includes(f.id) && f.photoUrl
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="label-section">{t.configurator.cutView}</p>

      <AnimatePresence mode="wait">
        {activeRecipe?.photoUrl ? (
          /* ── Real recipe photo ─────────────────────────── */
          <motion.div
            key={activeRecipe.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[260px] rounded-2xl overflow-hidden shadow-card border border-cream-200"
          >
            <img
              src={activeRecipe.photoUrl}
              alt={activeRecipe.label.en}
              className="w-full object-cover"
              style={{ aspectRatio: "2/3" }}
            />
            {/* Recipe name overlay */}
            <div className="absolute bottom-0 inset-x-0 px-4 py-3"
              style={{ background: "linear-gradient(to top, rgba(30,16,8,0.75) 0%, transparent 100%)" }}
            >
              <p className="font-display text-sm font-semibold text-cream-100 leading-tight">
                {tl(activeRecipe.label)}
              </p>
              <p className="text-[10px] text-cream-200/70 mt-0.5">
                anare — filling collection
              </p>
            </div>
          </motion.div>
        ) : (
          /* ── Fallback: colored band cross-section ──────── */
          <motion.div
            key="bands"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex gap-2"
          >
            {/* Left half */}
            <div
              className="w-28 overflow-hidden rounded-l-[40%] rounded-r-none border border-cream-300 shadow-card"
              style={{ clipPath: "ellipse(100% 100% at 100% 50%)" }}
            >
              <LayerStack layers={layers} side="left" />
            </div>

            {/* Right half */}
            <div
              className="w-28 overflow-hidden rounded-r-[40%] rounded-l-none border border-cream-300 shadow-card translate-x-1"
              style={{ clipPath: "ellipse(100% 100% at 0% 50%)" }}
            >
              <LayerStack layers={layers} side="right" />
            </div>

            {/* Cut face */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-5 z-10 shadow-[2px_0_12px_rgba(0,0,0,0.12)] flex flex-col">
              {layers.map((layer, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  style={{ height: layer.heightPx, backgroundColor: layer.color }}
                  className="flex-shrink-0 w-full border-y border-white/10"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      {!activeRecipe?.photoUrl && (
        <div className="flex flex-wrap justify-center gap-2 max-w-xs">
          {layers
            .filter((l, i, arr) => arr.findIndex((x) => x.label === l.label) === i)
            .map((layer) => (
              <div key={layer.label} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-sm flex-shrink-0 border border-white/40"
                  style={{ backgroundColor: layer.color }}
                />
                <span className="text-[10px] text-ink-500 capitalize">{layer.label}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

function LayerStack({
  layers,
  side,
}: {
  layers: ReturnType<typeof selectInternalLayers>;
  side: "left" | "right";
}) {
  return (
    <div className="flex flex-col w-full">
      {layers.map((layer, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: side === "left" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
          style={{ backgroundColor: layer.color, height: layer.heightPx }}
          className="w-full flex-shrink-0 border-y border-white/10"
          title={layer.label}
        />
      ))}
    </div>
  );
}
