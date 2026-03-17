"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCakeStore } from "@/store/cakeStore";
import { SPONGES, FROSTINGS, TOPPINGS } from "@/types/cake";
import { useI18n } from "@/lib/i18n";
import CakeCutView from "./CakeCutView";

// ─── Helper: pick a display frosting color ───────────────────────────────────
function getFrostingColor(frostingId: string) {
  return FROSTINGS.find((f) => f.id === frostingId)?.color ?? "#FFF8EE";
}
function getSpongeColor(spongeId: string) {
  return SPONGES.find((s) => s.id === spongeId)?.color ?? "#F5EDD6";
}

// ─── Cake SVG Preview ────────────────────────────────────────────────────────
function CakeSVG() {
  const config  = useCakeStore((s) => s.config);
  const frosting = useMemo(() => getFrostingColor(config.frosting), [config.frosting]);
  const sponge   = useMemo(() => getSpongeColor(config.sponge), [config.sponge]);
  const hasDrip  = config.toppings.includes("chocolate_drip") || config.toppings.includes("caramel_drip");
  const dripColor = config.toppings.includes("caramel_drip") ? "#C88A4C" : "#3E1F10";
  const hasBerries = config.toppings.includes("fresh_berries");
  const hasFlowers = config.toppings.includes("edible_flowers");
  const hasGold    = config.toppings.includes("gold_leaf");
  const hasMacarons= config.toppings.includes("macaron_tower");
  const tiers      = config.tiers;

  return (
    <motion.svg
      viewBox="0 0 220 300"
      className="w-full h-full drop-shadow-2xl"
      fill="none"
    >
      {/* Shadow / plate */}
      <ellipse cx="110" cy="292" rx="85" ry="8" fill="#E8CB8A" opacity="0.25" />
      <ellipse cx="110" cy="286" rx="80" ry="8" fill="#F2E4C8" opacity="0.6" />

      {/* ── Bottom Tier ──────────────────────────────────────────── */}
      <motion.g
        key={`tier1-${sponge}-${frosting}`}
        initial={{ scaleY: 0.8, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "110px 280px" }}
      >
        {/* Sponge visible at base */}
        <rect x="30" y="200" width="160" height="80" rx="6" fill={sponge} />
        {/* Frosting coat */}
        <rect x="30" y="200" width="160" height="80" rx="6" fill={frosting} opacity="0.85" />
        {/* Top frosting swoop */}
        <path
          d={`M30 210 Q50 ${hasDrip ? 195 : 200} 70 208 Q90 ${hasDrip ? 193 : 200} 110 208 Q130 ${hasDrip ? 195 : 200} 150 208 Q170 ${hasDrip ? 196 : 200} 190 210 V200 H30Z`}
          fill={frosting}
        />
        {/* Drip */}
        {hasDrip && (
          <>
            {[50, 80, 110, 140, 165].map((x, i) => (
              <motion.path
                key={x}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
                style={{ transformOrigin: `${x}px 210px` }}
                d={`M${x - 4} 208 Q${x} 208 ${x + 4} 208 L${x + 3} ${218 + (i % 3) * 6} Q${x} ${228 + (i % 2) * 5} ${x - 3} ${218 + (i % 3) * 6} Z`}
                fill={dripColor}
                opacity="0.9"
              />
            ))}
          </>
        )}
        {/* Gold shimmer */}
        {hasGold && (
          <rect x="30" y="200" width="160" height="80" rx="6" fill="url(#goldShimmer)" opacity="0.15" />
        )}
      </motion.g>

      {/* ── Middle Tier (tiers >= 2) ──────────────────────────────── */}
      <AnimatePresence>
        {tiers >= 2 && (
          <motion.g
            key="tier2"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "110px 200px" }}
          >
            <rect x="52" y="130" width="116" height="70" rx="5" fill={sponge} />
            <rect x="52" y="130" width="116" height="70" rx="5" fill={frosting} opacity="0.85" />
            <path
              d="M52 140 Q72 130 92 138 Q112 130 132 138 Q152 131 168 140 V130 H52Z"
              fill={frosting}
            />
          </motion.g>
        )}
      </AnimatePresence>

      {/* ── Top Tier (tiers >= 3) ─────────────────────────────────── */}
      <AnimatePresence>
        {tiers >= 3 && (
          <motion.g
            key="tier3"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{ transformOrigin: "110px 130px" }}
          >
            <rect x="74" y="72" width="72" height="58" rx="4" fill={sponge} />
            <rect x="74" y="72" width="72" height="58" rx="4" fill={frosting} opacity="0.85" />
            <path
              d="M74 82 Q90 72 110 80 Q126 72 146 82 V72 H74Z"
              fill={frosting}
            />
          </motion.g>
        )}
      </AnimatePresence>

      {/* ── Decorations ───────────────────────────────────────────── */}
      <AnimatePresence>
        {hasBerries && (
          <motion.g key="berries" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 300 }}>
            {[[ 90, 195], [110, 192], [130, 196]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="6" fill="#C2768A" />
            ))}
            {[[100, 189], [120, 188]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="5" fill="#E8A0A0" />
            ))}
          </motion.g>
        )}
        {hasFlowers && (
          <motion.g key="flowers" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring" }}>
            {[[85, 196], [115, 193], [142, 197]].map(([x, y], i) => (
              <text key={i} x={x} y={y} fontSize="14" textAnchor="middle" dominantBaseline="middle">🌸</text>
            ))}
          </motion.g>
        )}
        {hasMacarons && (
          <motion.g key="macarons" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {[["#EAB8B0", 88, 190], ["#C8DBC2", 110, 187], ["#D6CDE8", 132, 190]].map(([c, x, y]) => (
              <g key={String(x)}>
                <ellipse cx={Number(x)} cy={Number(y) - 5} rx="8" ry="5" fill={String(c)} />
                <rect x={Number(x) - 7} y={Number(y) - 5} width="14" height="3" fill={String(c)} opacity="0.6" />
                <ellipse cx={Number(x)} cy={Number(y)} rx="8" ry="5" fill={String(c)} />
              </g>
            ))}
          </motion.g>
        )}
      </AnimatePresence>

      {/* ── Candle (always shown) ─────────────────────────────────── */}
      <motion.g
        key={`candle-${tiers}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <rect
          x="107" y={tiers === 3 ? 56 : tiers === 2 ? 116 : 186}
          width="6" height="16" rx="2" fill="#F2E4C8"
        />
        <ellipse
          cx="110" cy={tiers === 3 ? 55 : tiers === 2 ? 115 : 185}
          rx="4" ry="6" fill="#FFD580" opacity="0.9"
        />
        <ellipse
          cx="110" cy={tiers === 3 ? 53 : tiers === 2 ? 113 : 183}
          rx="2" ry="3" fill="#FFFFFF" opacity="0.6"
        />
      </motion.g>

      {/* Gold shimmer gradient def */}
      <defs>
        <linearGradient id="goldShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#D4A853" stopOpacity="0" />
          <stop offset="50%"  stopColor="#E8CB8A" stopOpacity="1" />
          <stop offset="100%" stopColor="#D4A853" stopOpacity="0" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}

// ─── Stage ────────────────────────────────────────────────────────────────────
export default function Stage() {
  const { config, toggleCutView, toggleRotation, setSelectedTier } = useCakeStore();
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center gap-6 h-full py-8">
      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleCutView}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border
            ${config.showCutView
              ? "bg-gold-300 text-white border-gold-400"
              : "bg-cream-100 text-ink-500 border-cream-200 hover:border-gold-200"
            }`}
        >
          {config.showCutView ? t.configurator.view3d : t.configurator.cutView}
        </button>
        <button
          onClick={toggleRotation}
          className="px-4 py-1.5 rounded-full text-xs font-medium bg-cream-100 text-ink-500
                     border border-cream-200 hover:border-gold-200 transition-all duration-200"
        >
          {config.isRotating ? t.configurator.pause : t.configurator.rotate}
        </button>
      </div>

      {/* Preview area */}
      <div className="relative flex items-center justify-center w-full flex-1">
        {/* Glow */}
        <div className="absolute w-56 h-56 rounded-full bg-gold-200/20 blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {config.showCutView ? (
            <motion.div
              key="cut"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-xs"
            >
              <CakeCutView />
            </motion.div>
          ) : (
            <motion.div
              key="3d"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: config.isRotating ? [0, 360] : 0,
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={
                config.isRotating
                  ? { rotate: { duration: 24, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.4 } }
                  : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
              }
              className="w-full max-w-xs h-72"
            >
              <CakeSVG />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tier indicator */}
      <div className="flex gap-2">
        {Array.from({ length: config.tiers }).map((_, i) => (
          <button
            key={i}
            onClick={() => setSelectedTier(i)}
            className={`w-2 h-2 rounded-full transition-all duration-200
              ${config.selectedTier === i ? "w-5 bg-gold-400" : "bg-cream-300"}`}
          />
        ))}
      </div>
    </div>
  );
}
