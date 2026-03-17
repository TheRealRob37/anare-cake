"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import SectionLabel from "@/components/ui/SectionLabel";
import { formatAMD } from "@/types/cake";
import { useCakeStore } from "@/store/cakeStore";
import { EASE_SMOOTH } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Tag = "bestseller" | "premium" | "signature" | "seasonal";

interface CakeEntry {
  id: number;
  name: { hy: string; en: string; ru: string };
  desc: { hy: string; en: string; ru: string };
  price: number;
  tag: Tag;
  emoji: string;
  layers: string[]; // [spongeBot, filling, spongeMid, frosting]
  allergens: string;
  serves: string;
}

const ALL_CAKES: CakeEntry[] = [
  {
    id: 1,
    name: { hy: "Վարդ ու Լիչի", en: "Rose & Lychee Dream", ru: "Роза и Личи" },
    desc: { hy: "Վարդաջուր բիսկվիտ, լիչիի մուս, ազնվամորու կոմպոտ, շվեյցարական մերինգ", en: "Rose sponge, lychee mousse, raspberry compote, Swiss meringue", ru: "Бисквит из роз, мусс личи, малиновый компот, меренга" },
    price: 26000, tag: "bestseller", emoji: "🌹", serves: "8–12",
    allergens: "Gluten, Dairy, Eggs",
    layers: ["#F5EDD6", "#F4C2C2", "#F5EDD6", "#FFFDF9"],
  },
  {
    id: 2,
    name: { hy: "Ֆիստաշկայի Թագ", en: "Pistachio Royale", ru: "Фисташковый Рояль" },
    desc: { hy: "Ֆիստաշկայի բիսկվիտ, սպիտակ շոկոլադի գանաշ, ոսկե թերթ", en: "Pistachio sponge, white chocolate ganache, edible gold leaf", ru: "Фисташковый бисквит, ганаш из белого шоколада, золото" },
    price: 32000, tag: "premium", emoji: "✨", serves: "8–12",
    allergens: "Gluten, Dairy, Eggs, Nuts",
    layers: ["#F5EDD6", "#C8DBC2", "#F5EDD6", "#D4A853"],
  },
  {
    id: 3,
    name: { hy: "Մուգ Թավիշ Նուար", en: "Dark Velvet Noir", ru: "Тёмный Бархат Нуар" },
    desc: { hy: "Շոկոլադի բիսկվիտ, աղի կարամել, հայելային գլազուր", en: "Dark chocolate sponge, salted caramel, mirror glaze", ru: "Шоколадный бисквит, солёная карамель, зеркальная глазурь" },
    price: 29000, tag: "signature", emoji: "🍫", serves: "8–12",
    allergens: "Gluten, Dairy, Eggs",
    layers: ["#6B3D2E", "#C88A4C", "#6B3D2E", "#D4A853"],
  },
  {
    id: 4,
    name: { hy: "Մաչա Ու Սակուրա", en: "Matcha Sakura", ru: "Матча и Сакура" },
    desc: { hy: "Մաչայի բիսկվիտ, բալի ծաղկի կրեմ, յուզուի կրեմ", en: "Matcha sponge, cherry blossom cream, yuzu curd", ru: "Бисквит матча, крем из цветов вишни, юдзу курд" },
    price: 28000, tag: "seasonal", emoji: "🌸", serves: "8–12",
    allergens: "Gluten, Dairy, Eggs",
    layers: ["#A8C5A0", "#C2768A", "#A8C5A0", "#F9F0E1"],
  },
  {
    id: 5,
    name: { hy: "Կարամել Ու Ընկույز", en: "Caramel Walnut", ru: "Карамель с Грецким орехом" },
    desc: { hy: "Վանիլային բիսկվիտ, աղի կարամելի կրեմ, ընկույզի քրամբ", en: "Vanilla sponge, salted caramel cream, walnut crumble", ru: "Ванильный бисквит, крем солёной карамели, ореховая крошка" },
    price: 27000, tag: "signature", emoji: "🍯", serves: "8–12",
    allergens: "Gluten, Dairy, Eggs, Nuts",
    layers: ["#F5EDD6", "#C88A4C", "#F5EDD6", "#F9F0E1"],
  },
  {
    id: 6,
    name: { hy: "Կիտրոն Բզեզ", en: "Lemon Elderflower", ru: "Лимон и Бузина" },
    desc: { hy: "Կիտրոնի բիսկվիտ, բզեզ-ծաղիկ կրեմ, վարդաջուր գլազուր", en: "Lemon sponge, elderflower cream, rose water glaze", ru: "Лимонный бисквит, крем из бузины, глазурь с розовой водой" },
    price: 30000, tag: "seasonal", emoji: "🍋", serves: "8–12",
    allergens: "Gluten, Dairy, Eggs",
    layers: ["#F9E87E", "#D6CDE8", "#F9E87E", "#FFFDF9"],
  },
  {
    id: 7,
    name: { hy: "Կարմիր Թավիշ Սիրո", en: "Red Velvet Romance", ru: "Красный Бархат Романтик" },
    desc: { hy: "Կարմիր թավիշ բիսկվիտ, կրեմ-չիզ, թարմ ելակ", en: "Red velvet sponge, cream cheese frosting, fresh strawberries", ru: "Красный бархат, крем чиз, свежая клубника" },
    price: 31000, tag: "bestseller", emoji: "❤️", serves: "8–12",
    allergens: "Gluten, Dairy, Eggs",
    layers: ["#C0392B", "#F4C2C2", "#C0392B", "#F9F0E1"],
  },
  {
    id: 8,
    name: { hy: "Շոկ. Ազնվամ. Լյուքս", en: "Choco Raspberry Luxe", ru: "Шоко-Малиновый Люкс" },
    desc: { hy: "Շոկոլադի բիսկվիտ, շոկոլադի գանաշ, ազնվամորու կոմպոտ", en: "Dark chocolate sponge, chocolate ganache, raspberry compote", ru: "Шоколадный бисквит, шоколадный ганаш, малиновый компот" },
    price: 35000, tag: "premium", emoji: "🫐", serves: "10–14",
    allergens: "Gluten, Dairy, Eggs",
    layers: ["#6B3D2E", "#3E1F10", "#6B3D2E", "#D4A853"],
  },
];

const TAG_COLORS: Record<Tag, string> = {
  bestseller: "bg-gold-100 text-gold-400 border-gold-200",
  premium:    "bg-ink-900 text-cream-100 border-ink-700",
  signature:  "bg-blush-100 text-blush-400 border-blush-200",
  seasonal:   "bg-green-50 text-green-700 border-green-200",
};

function CakeVisual({ layers, emoji }: { layers: string[]; emoji: string }) {
  const [spongeBot, filling, spongeMid, frosting] = layers;
  return (
    <div className="w-full h-full flex items-end justify-center pb-6 relative">
      <motion.div
        className="absolute top-6 left-1/2 -translate-x-1/2 text-6xl z-10 drop-shadow"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {emoji}
      </motion.div>
      <div className="w-36 rounded-t-3xl overflow-hidden shadow-card border border-white/50">
        <div className="h-5 rounded-t-full" style={{ backgroundColor: frosting, opacity: 0.92 }} />
        <div className="h-10" style={{ backgroundColor: spongeMid }} />
        <div className="h-4 border-y border-white/30" style={{ backgroundColor: filling }} />
        <div className="h-10" style={{ backgroundColor: spongeBot }} />
        <div className="h-2 bg-cream-300" />
      </div>
    </div>
  );
}

export default function MenuPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const setStandardCake = useCakeStore((s) => s.setStandardCake);

  const [activeFilter, setActiveFilter] = useState<Tag | "all">("all");

  const filters: { key: Tag | "all"; label: string }[] = [
    { key: "all",        label: t.menu.all },
    { key: "bestseller", label: t.menu.bestseller },
    { key: "premium",    label: t.menu.premium },
    { key: "signature",  label: t.menu.signature },
    { key: "seasonal",   label: t.menu.seasonal },
  ];

  const filtered = useMemo(
    () => activeFilter === "all" ? ALL_CAKES : ALL_CAKES.filter((c) => c.tag === activeFilter),
    [activeFilter]
  );

  function handleOrder(id: number) {
    setStandardCake(id);
    router.push("/checkout");
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-16">
      {/* Page header */}
      <section className="py-16 text-center bg-cream-gradient">
        <div className="container-site space-y-4">
          <SectionLabel label={t.menu.badge} />
          <h1 className="font-display text-display-md text-ink-900">
            {t.menu.title}
          </h1>
          <p className="font-body text-ink-500 max-w-md mx-auto">{t.menu.subtitle}</p>
          <p className="text-xs text-ink-400">{ALL_CAKES.length} {t.menu.count}</p>
        </div>
      </section>

      <div className="container-site pb-20">
        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 pt-8">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200",
                activeFilter === f.key
                  ? "bg-ink-900 text-cream-100 border-ink-900"
                  : "border-cream-200 text-ink-500 hover:border-gold-300 hover:text-gold-400"
              )}
            >
              {f.label}
              {f.key !== "all" && (
                <span className="ml-1.5 text-[10px] opacity-60">
                  ({ALL_CAKES.filter((c) => c.tag === f.key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Cake grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          <AnimatePresence mode="popLayout">
            {filtered.map((cake, i) => (
              <motion.div
                key={cake.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: EASE_SMOOTH }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="card-cream overflow-hidden group"
              >
                {/* Visual */}
                <div
                  className="h-64 relative"
                  style={{
                    background: `linear-gradient(160deg, ${cake.layers[0]}33 0%, ${cake.layers[1]}55 100%)`,
                  }}
                >
                  <CakeVisual layers={cake.layers} emoji={cake.emoji} />

                  {/* Tag badge */}
                  <span className={`absolute top-3 right-3 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border ${TAG_COLORS[cake.tag]}`}>
                    {t.menu[cake.tag]}
                  </span>
                </div>

                {/* Info */}
                <div className="p-6 space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-display text-lg font-semibold text-ink-900">
                      {cake.name[locale]}
                    </h3>
                    <p className="font-body text-xs text-ink-500 leading-relaxed">
                      {cake.desc[locale]}
                    </p>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 text-[10px] text-ink-400">
                    <span>🍽 {cake.serves} ppl</span>
                    <span>·</span>
                    <span>{cake.allergens}</span>
                  </div>

                  {/* Price + buttons */}
                  <div className="pt-2 space-y-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[10px] text-ink-400">{t.menu.from}</span>
                      <span className="font-display text-xl font-bold text-gold-400">
                        {formatAMD(cake.price)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOrder(cake.id)}
                        className="py-2.5 text-xs font-semibold rounded-full text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                        style={{ background: "linear-gradient(135deg, #E8CB8A, #B8862A)" }}
                      >
                        {t.menu.order}
                      </button>
                      <Link
                        href="/configurator"
                        className="py-2.5 text-xs font-medium rounded-full text-center border-2 border-gold-300 text-gold-400 hover:bg-gold-100 transition-colors duration-200"
                      >
                        {t.menu.customise}
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Design CTA */}
        <div className="mt-16 text-center space-y-4">
          <p className="font-body text-ink-500">Don't see exactly what you want?</p>
          <Link href="/configurator" className="btn-gold">
            Design Your Own Cake →
          </Link>
        </div>
      </div>
    </div>
  );
}
