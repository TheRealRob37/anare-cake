"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Stage from "./Stage";
import LayerController from "./LayerController";
import ToppingsEngine from "./ToppingsEngine";
import PriceCalculator from "./PriceCalculator";
import LanguageSwitcher from "./LanguageSwitcher";
import { useCakeStore } from "@/store/cakeStore";
import { useI18n } from "@/lib/i18n";
import { SPONGES, FILLINGS, FROSTINGS, TOPPINGS, SIZE_META } from "@/types/cake";
import { TAB_PANEL } from "@/lib/motion";

type Tab = "layers" | "toppings" | "personal";

const TABS: { id: Tab; icon: string }[] = [
  { id: "layers",   icon: "🎂" },
  { id: "toppings", icon: "✨" },
  { id: "personal", icon: "💌" },
];

export default function CakeConfigurator() {
  const [activeTab, setActiveTab] = useState<Tab>("layers");
  const { config, setDedicationMessage, setServingDate, resetConfig } = useCakeStore();
  const { t } = useI18n();

  const TAB_LABELS: Record<Tab, string> = {
    layers:   t.configurator.layers,
    toppings: t.configurator.toppings,
    personal: t.configurator.message,
  };

  return (
    <div className="min-h-screen bg-cream-gradient flex flex-col">
      {/* Top bar */}
      <div className="sticky top-16 z-30 bg-cream-50/80 backdrop-blur-xl border-b border-cream-200">
        <div className="container-site h-14 flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-semibold text-ink-900">
              {t.configurator.title}
            </h1>
            <p className="font-body text-[11px] text-ink-400">{t.configurator.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={resetConfig}
              className="text-[11px] text-ink-400 hover:text-gold-400 transition-colors"
            >
              ↺ Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row flex-1">

        {/* ── LEFT PANEL: options ───────────────────────────────── */}
        <aside className="config-panel w-full lg:w-80 xl:w-96 flex flex-col">
          {/* Tab bar */}
          <div className="flex border-b border-cream-200 bg-cream-50">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex-1 flex flex-col items-center gap-1 py-3 transition-colors duration-200"
              >
                <span className="text-lg">{tab.icon}</span>
                <span className={`text-[9px] font-semibold tracking-wider uppercase transition-colors ${
                  activeTab === tab.id ? "text-gold-400" : "text-ink-400"
                }`}>
                  {TAB_LABELS[tab.id]}
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-gold-300"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence mode="wait">
              {activeTab === "layers" && (
                <motion.div key="layers" {...TAB_PANEL}>
                  <LayerController />
                </motion.div>
              )}

              {activeTab === "toppings" && (
                <motion.div key="toppings" {...TAB_PANEL}>
                  <ToppingsEngine />
                </motion.div>
              )}

              {activeTab === "personal" && (
                <motion.div key="personal" {...TAB_PANEL} className="space-y-6">
                  {/* Dedication message */}
                  <div className="space-y-2">
                    <label className="font-body text-xs font-semibold tracking-[0.12em] uppercase text-ink-500">
                      {t.configurator.message}
                    </label>
                    <textarea
                      value={config.dedicationMessage}
                      onChange={(e) => setDedicationMessage(e.target.value)}
                      placeholder={t.configurator.messagePlaceholder}
                      rows={3}
                      className="w-full rounded-2xl border-2 border-cream-200 bg-cream-50 px-4 py-3
                                 text-sm text-ink-900 placeholder-ink-300 resize-none
                                 focus:outline-none focus:border-gold-300 transition-colors"
                    />
                  </div>

                  {/* Serving date */}
                  <div className="space-y-2">
                    <label className="font-body text-xs font-semibold tracking-[0.12em] uppercase text-ink-500">
                      {t.configurator.date}
                    </label>
                    <input
                      type="date"
                      value={config.servingDate}
                      onChange={(e) => setServingDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full rounded-2xl border-2 border-cream-200 bg-cream-50 px-4 py-3
                                 text-sm text-ink-900 focus:outline-none focus:border-gold-300 transition-colors"
                    />
                  </div>

                  {/* Instagram note */}
                  <div className="card-cream p-4 text-center space-y-2">
                    <p className="text-2xl">📸</p>
                    <p className="text-xs text-ink-500 leading-relaxed">
                      {t.configurator.instagram_note}
                    </p>
                    <a
                      href="https://instagram.com/anare_cake"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-gold-400 hover:text-gold-500 transition-colors"
                    >
                      @anare_cake ↗
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* ── CENTER: Stage (cake preview) ─────────────────────── */}
        <main className="flex-1 flex flex-col items-center justify-center
                          bg-hero-gradient min-h-[420px] lg:min-h-0 relative">
          {/* Decorative blobs */}
          <div className="absolute top-16 right-16 w-64 h-64 rounded-full
                           bg-gold-200/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-16 left-8 w-48 h-48 rounded-full
                           bg-blush-200/15 blur-3xl pointer-events-none" />

          <div className="w-full max-w-sm px-8">
            <Stage />
          </div>
        </main>

        {/* ── RIGHT PANEL: price + summary ─────────────────────── */}
        <aside className="w-full lg:w-72 xl:w-80 p-4 flex flex-col gap-4
                           bg-cream-50/60 border-t lg:border-t-0 lg:border-l border-cream-200">
          <PriceCalculator />

          {/* Config recap chips */}
          <div className="card-cream p-4 space-y-3">
            <h4 className="font-body text-[10px] font-semibold tracking-widest uppercase text-ink-400">
              {t.configurator.summary}
            </h4>
            <ConfigChips />
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── Config recap chips ───────────────────────────────────────────────────────
function ConfigChips() {
  const config = useCakeStore((s) => s.config);
  const { tl, t } = useI18n();

  return (
    <div className="flex flex-wrap gap-1.5">
      <Chip color="#F2E4C8">{SIZE_META[config.size].diameter}</Chip>
      <Chip color="#E8CB8A">{config.tiers} {config.tiers === 1 ? t.configurator.tier : t.configurator.tiers_word}</Chip>
      <Chip color="#F5EDD6">{config.shape}</Chip>

      {(() => {
        const s = SPONGES.find((x) => x.id === config.sponge);
        return s ? <Chip color={s.color}>{tl(s.label)}</Chip> : null;
      })()}

      {config.fillings.map((id) => {
        const f = FILLINGS.find((x) => x.id === id);
        return f ? <Chip key={id} color={f.color}>{tl(f.label)}</Chip> : null;
      })}

      {(() => {
        const f = FROSTINGS.find((x) => x.id === config.frosting);
        return f ? <Chip color={f.color}>{tl(f.label)}</Chip> : null;
      })()}

      {config.toppings.map((id) => {
        const top = TOPPINGS.find((x) => x.id === id);
        return top ? <Chip key={id} color="#F9F0E1">{top.emoji} {tl(top.label)}</Chip> : null;
      })}
    </div>
  );
}

function Chip({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium text-ink-700 border border-white/60"
      style={{ backgroundColor: color + "55" }}
    >
      {children}
    </span>
  );
}
