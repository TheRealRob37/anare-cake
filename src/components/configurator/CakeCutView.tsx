"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCakeStore, selectInternalLayers } from "@/store/cakeStore";
import { useI18n } from "@/lib/i18n";

export default function CakeCutView() {
  const config = useCakeStore((s) => s.config);
  const layers = selectInternalLayers(config);
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="label-section">{t.configurator.cutView}</p>

      {/* Cut cake container */}
      <div className="relative flex gap-2">
        {/* Left half */}
        <div
          className="w-28 overflow-hidden rounded-l-[40%] rounded-r-none border border-cream-300 shadow-card"
          style={{ clipPath: "ellipse(100% 100% at 100% 50%)" }}
        >
          <LayerStack layers={layers} side="left" />
        </div>

        {/* Right half (mirrored, slightly offset for depth) */}
        <div
          className="w-28 overflow-hidden rounded-r-[40%] rounded-l-none border border-cream-300 shadow-card translate-x-1"
          style={{ clipPath: "ellipse(100% 100% at 0% 50%)" }}
        >
          <LayerStack layers={layers} side="right" />
        </div>

        {/* Cut face — straight on view */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-5 z-10 shadow-[2px_0_12px_rgba(0,0,0,0.12)] flex flex-col">
          {layers.map((layer, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              style={{ height: layer.heightPx, backgroundColor: layer.imageUrl ? undefined : layer.color }}
              className="flex-shrink-0 w-full border-y border-white/10 relative overflow-hidden"
            >
              {layer.imageUrl && (
                <img src={layer.imageUrl} alt={layer.label} className="absolute inset-0 w-full h-full object-cover" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
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
          style={{ height: layer.heightPx, backgroundColor: layer.imageUrl ? undefined : layer.color }}
          className="w-full flex-shrink-0 border-y border-white/10 relative overflow-hidden"
          title={layer.label}
        >
          {layer.imageUrl && (
            <img
              src={layer.imageUrl}
              alt={layer.label}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
