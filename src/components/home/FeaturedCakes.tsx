"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import SectionLabel from "@/components/ui/SectionLabel";
import { EASE_SMOOTH } from "@/lib/motion";
import { formatAMD } from "@/types/cake";
import { useCakeStore } from "@/store/cakeStore";

type TagKey = "bestseller" | "premium" | "signature" | "seasonal";

// Layered color preview: [sponge, filling, sponge, frosting]
const CAKES: {
  id: number;
  nameKey: string;
  descKey: string;
  price: number;
  tag: TagKey;
  emoji: string;
  layers: string[];  // bottom-to-top hex colors
}[] = [
  {
    id: 1, nameKey: "rose_lychee", descKey: "rose_lychee_desc", price: 26000, tag: "bestseller",
    emoji: "🌹",
    layers: ["#F5EDD6", "#F4C2C2", "#F5EDD6", "#FFFDF9"],
  },
  {
    id: 2, nameKey: "pistachio", descKey: "pistachio_desc", price: 32000, tag: "premium",
    emoji: "✨",
    layers: ["#F5EDD6", "#C8DBC2", "#F5EDD6", "#D4A853"],
  },
  {
    id: 3, nameKey: "dark_velvet", descKey: "dark_velvet_desc", price: 29000, tag: "signature",
    emoji: "🍫",
    layers: ["#6B3D2E", "#C88A4C", "#6B3D2E", "#D4A853"],
  },
  {
    id: 4, nameKey: "matcha_sakura", descKey: "matcha_sakura_desc", price: 28000, tag: "seasonal",
    emoji: "🌸",
    layers: ["#A8C5A0", "#C2768A", "#A8C5A0", "#F9F0E1"],
  },
];

const CAKE_NAMES: Record<string, { hy: string; en: string; ru: string }> = {
  rose_lychee:   { hy: "Վարդ ու Լիչի",     en: "Rose & Lychee Dream",  ru: "Роза и Личи"         },
  pistachio:     { hy: "Ֆիստաշկայի Թագ",   en: "Pistachio Royale",     ru: "Фисташковый Рояль"  },
  dark_velvet:   { hy: "Մուգ Թավիշ Նուար", en: "Dark Velvet Noir",     ru: "Тёмный Бархат Нуар" },
  matcha_sakura: { hy: "Մաչա Ու Սակուրա",  en: "Matcha Sakura",        ru: "Матча и Сакура"      },
};

const CAKE_DESCS: Record<string, { hy: string; en: string; ru: string }> = {
  rose_lychee_desc:   {
    hy: "Վարդաջուր բիսկվիտ, լիչիի մուս, ազնվամորու կոմպոտ, շվեյցարական մերինգ",
    en: "Rose sponge, lychee mousse, raspberry compote, Swiss meringue",
    ru: "Бисквит из роз, мусс личи, малиновый компот, меренга",
  },
  pistachio_desc:     {
    hy: "Ֆիստաշկայի բիսկվիտ, սպիտակ շոկոլադի գանաշ, ոսկե թերթ",
    en: "Pistachio sponge, white chocolate ganache, edible gold leaf",
    ru: "Фисташковый бисквит, ганаш из белого шоколада, золото",
  },
  dark_velvet_desc:   {
    hy: "Շոկոլադի բիսկվիտ, աղի կարամել, հայելային գլազուր",
    en: "Dark chocolate sponge, salted caramel, mirror glaze",
    ru: "Шоколадный бисквит, солёная карамель, зеркальная глазурь",
  },
  matcha_sakura_desc: {
    hy: "Մաչայի բիսկվիտ, բալի ծաղկի կրեմ, յուզուի կրեմ",
    en: "Matcha sponge, cherry blossom cream, yuzu curd",
    ru: "Бисквит матча, крем из цветов вишни, юдзу курд",
  },
};

// Mini layered cake SVG preview
function CakeMini({ layers, emoji }: { layers: string[]; emoji: string }) {
  const [spongeBot, filling, spongeMid, frosting] = layers;
  return (
    <div className="relative w-full h-full flex items-end justify-center pb-4">
      {/* Floating emoji */}
      <motion.div
        className="absolute top-4 left-1/2 -translate-x-1/2 text-5xl z-10 drop-shadow-sm"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {emoji}
      </motion.div>

      {/* Cake cross-section */}
      <div className="w-28 rounded-t-2xl overflow-hidden shadow-card border border-white/60">
        {/* Frosting dome */}
        <div className="h-4 rounded-t-full" style={{ backgroundColor: frosting, opacity: 0.9 }} />
        {/* Top sponge */}
        <div className="h-8" style={{ backgroundColor: spongeMid }} />
        {/* Filling stripe */}
        <div className="h-3 border-y border-white/30" style={{ backgroundColor: filling }} />
        {/* Bottom sponge */}
        <div className="h-8" style={{ backgroundColor: spongeBot }} />
        {/* Plate */}
        <div className="h-2 bg-cream-300 rounded-b" />
      </div>
    </div>
  );
}

export default function FeaturedCakes() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const setStandardCake = useCakeStore((s) => s.setStandardCake);

  const tagLabel: Record<TagKey, string> = {
    bestseller: t.featured.tag_bestseller,
    premium:    t.featured.tag_premium,
    signature:  t.featured.tag_signature,
    seasonal:   t.featured.tag_seasonal,
  };

  const tagColor: Record<TagKey, string> = {
    bestseller: "bg-gold-100 text-gold-400 border-gold-200",
    premium:    "bg-ink-900 text-cream-100 border-ink-700",
    signature:  "bg-blush-100 text-blush-400 border-blush-200",
    seasonal:   "bg-green-50 text-green-700 border-green-200",
  };

  function handleOrder(id: number) {
    setStandardCake(id);
    router.push("/checkout");
  }

  return (
    <section className="py-24 bg-cream-50">
      <div className="container-site">
        {/* Header */}
        <div className="text-center mb-14 space-y-4">
          <SectionLabel label={t.featured.badge} />
          <h2 className="font-display text-display-md text-ink-900">
            {t.featured.title1}{" "}
            <span className="italic text-gold-400">{t.featured.title2}</span>
          </h2>
          <p className="font-body text-ink-500 max-w-md mx-auto">{t.featured.subtitle}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAKES.map((cake, i) => (
            <motion.div
              key={cake.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: EASE_SMOOTH }}
              whileHover={{ y: -6, transition: { duration: 0.22 } }}
              className="card-cream overflow-hidden group"
            >
              {/* Visual area */}
              <div
                className="h-52 relative"
                style={{ background: `linear-gradient(160deg, ${cake.layers[0]}33 0%, ${cake.layers[1]}44 100%)` }}
              >
                <CakeMini layers={cake.layers} emoji={cake.emoji} />

                {/* Tag */}
                <span className={`absolute top-3 right-3 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border ${tagColor[cake.tag]}`}>
                  {tagLabel[cake.tag]}
                </span>
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <h3 className="font-display text-base font-semibold text-ink-900">
                  {CAKE_NAMES[cake.nameKey][locale]}
                </h3>
                <p className="font-body text-xs text-ink-500 leading-relaxed line-clamp-2">
                  {CAKE_DESCS[cake.descKey][locale]}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-display text-lg font-semibold text-gold-400">
                    {formatAMD(cake.price)}
                  </span>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleOrder(cake.id)}
                    className="text-xs font-semibold py-2 rounded-full text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                    style={{ background: "linear-gradient(135deg, #E8CB8A, #B8862A)" }}
                  >
                    {t.menu.order}
                  </button>
                  <Link
                    href="/configurator"
                    className="text-xs font-medium py-2 rounded-full text-center border border-gold-300 text-gold-400 hover:bg-gold-100 transition-colors duration-200"
                  >
                    {t.featured.customise}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/menu" className="btn-ghost">{t.featured.viewAll}</Link>
        </div>
      </div>
    </section>
  );
}
