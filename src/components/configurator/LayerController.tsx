"use client";

import { motion } from "framer-motion";
import { useCakeStore } from "@/store/cakeStore";
import { SPONGES, FILLINGS, FROSTINGS, SHAPES, CakeTiers, SIZE_META, FillingId } from "@/types/cake";
import { formatAMD } from "@/types/cake";
import { useI18n } from "@/lib/i18n";
import { TAP_SCALE } from "@/lib/motion";
import { cn } from "@/lib/cn";

const SELECTED = "border-gold-300 bg-gold-100 shadow-soft";
const IDLE     = "border-cream-200 hover:border-gold-200";

export default function LayerController() {
  const { config, setSize, setTiers, setShape, setSponge, setRecipe, setFrosting } = useCakeStore();
  const { t, tl } = useI18n();

  return (
    <div className="space-y-8 pb-4">

      {/* ── SIZE ──────────────────────────────────────────────────── */}
      <Section label={t.configurator.size}>
        <div className="grid grid-cols-4 gap-2">
          {(Object.entries(SIZE_META) as [import("@/types/cake").CakeSize, typeof SIZE_META[keyof typeof SIZE_META]][]).map(([id, meta]) => (
            <button
              key={id}
              onClick={() => setSize(id)}
              className={cn("flex flex-col items-center p-2.5 rounded-2xl border-2 transition-all duration-200 text-center",
                config.size === id ? SELECTED : IDLE)}
            >
              <span className="font-display text-sm font-semibold text-ink-900">{meta.diameter}</span>
              <span className="text-[9px] text-ink-500 mt-0.5">{meta.serves} {t.configurator.people}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* ── SHAPE ─────────────────────────────────────────────────── */}
      <Section label={t.configurator.shape}>
        <div className="grid grid-cols-3 gap-2">
          {SHAPES.map((sh) => (
            <button
              key={sh.id}
              onClick={() => setShape(sh.id)}
              className={cn("flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200",
                config.shape === sh.id ? SELECTED : IDLE)}
            >
              <span className="text-xl">{sh.emoji}</span>
              <span className="text-[10px] font-medium text-ink-700">{tl(sh.label)}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* ── TIERS ─────────────────────────────────────────────────── */}
      <Section label={t.configurator.tiers}>
        <div className="grid grid-cols-3 gap-2">
          {([1, 2, 3] as CakeTiers[]).map((n) => (
            <button
              key={n}
              onClick={() => setTiers(n)}
              className={cn("flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all duration-200",
                config.tiers === n ? SELECTED : IDLE)}
            >
              <TierIcon count={n} active={config.tiers === n} />
              <span className="text-[10px] font-medium text-ink-700">
                {n} {n === 1 ? t.configurator.tier : t.configurator.tiers_word}
              </span>
            </button>
          ))}
        </div>
      </Section>

      {/* ── SPONGE ────────────────────────────────────────────────── */}
      <Section label={t.configurator.sponge}>
        <div className="grid grid-cols-3 gap-2">
          {SPONGES.map((s) => (
            <motion.button
              key={s.id}
              whileTap={{ scale: TAP_SCALE }}
              onClick={() => setSponge(s.id)}
              className={cn("layer-chip", config.sponge === s.id && "selected")}
            >
              <span className="w-8 h-8 rounded-xl border-2 border-white shadow-sm" style={{ backgroundColor: s.color }} />
              <span className="text-[9px] font-medium text-ink-700 leading-tight text-center">{tl(s.label)}</span>
              {s.pricePerTier > 0 && (
                <span className="text-[8px] text-gold-400">+{formatAMD(s.pricePerTier)}</span>
              )}
            </motion.button>
          ))}
        </div>
      </Section>

      {/* ── FILLINGS (signature recipes with photos) ──────────────── */}
      <Section label={t.configurator.fillings}>
        <div className="grid grid-cols-2 gap-2">
          {FILLINGS.map((f) => {
            const selected = config.fillings[0] === f.id;
            return (
              <motion.button
                key={f.id}
                whileTap={{ scale: TAP_SCALE }}
                onClick={() => setRecipe(f.id as FillingId)}
                className={cn(
                  "relative flex flex-col rounded-2xl border-2 overflow-hidden text-left transition-all duration-200",
                  selected ? "border-gold-400 shadow-soft" : "border-cream-200 hover:border-gold-200"
                )}
              >
                {/* Photo thumbnail */}
                {f.photoUrl ? (
                  <div className="w-full h-20 overflow-hidden bg-cream-200">
                    <img
                      src={f.photoUrl}
                      alt={f.label.en}
                      className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-full h-20 flex-shrink-0" style={{ backgroundColor: f.color }} />
                )}

                {/* Name + price */}
                <div className="px-2.5 py-2 bg-cream-50">
                  <p className="text-[10px] font-semibold text-ink-900 leading-tight truncate">{tl(f.label)}</p>
                  <p className="text-[9px] text-gold-400 mt-0.5">+{formatAMD(f.pricePerLayer)}</p>
                </div>

                {/* Selected checkmark */}
                {selected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-gold-400 flex items-center justify-center text-[9px] text-white font-bold shadow"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
      </Section>

      {/* ── FROSTING ──────────────────────────────────────────────── */}
      <Section label={t.configurator.frosting}>
        <div className="space-y-1.5">
          {FROSTINGS.map((f) => (
            <motion.button
              key={f.id}
              whileTap={{ scale: TAP_SCALE }}
              onClick={() => setFrosting(f.id)}
              className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl border-2 transition-all duration-200",
                config.frosting === f.id ? SELECTED : IDLE)}
            >
              <span className="w-6 h-6 rounded-lg flex-shrink-0 border border-cream-300 shadow-sm" style={{ backgroundColor: f.color }} />
              <span className="text-xs font-medium text-ink-900 flex-1 text-left">{tl(f.label)}</span>
              <span className="text-[10px] text-gold-400">
                {f.price > 0 ? `+${formatAMD(f.price)}` : t.configurator.included}
              </span>
            </motion.button>
          ))}
        </div>
      </Section>

    </div>
  );
}

function Section({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="font-body text-xs font-semibold tracking-[0.12em] uppercase text-ink-500">{label}</h3>
        {hint && <span className="text-[10px] text-ink-300">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function TierIcon({ count, active }: { count: number; active: boolean }) {
  const fill = active ? "#D4A853" : "#D1C5BB";
  return (
    <svg viewBox="0 0 32 32" className="w-8 h-8">
      {count >= 3 && <rect x="10" y="4"  width="12" height="8"  rx="2" fill={fill} opacity="0.5"  />}
      {count >= 2 && <rect x="6"  y="13" width="20" height="8"  rx="2" fill={fill} opacity="0.75" />}
      <rect          x="2"  y="22" width="28" height="8"  rx="2" fill={fill} />
    </svg>
  );
}
