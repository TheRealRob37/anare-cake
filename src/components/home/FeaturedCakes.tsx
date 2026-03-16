"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import SectionLabel from "@/components/ui/SectionLabel";
import { EASE_SMOOTH } from "@/lib/motion";
import { formatAMD } from "@/types/cake";

// Tag keys map to i18n featured.tag_* strings
type TagKey = "bestseller" | "premium" | "signature" | "seasonal";

const CAKES: { id: number; nameKey: string; descKey: string; price: number; tag: TagKey; color: string; emoji: string }[] = [
  { id: 1, nameKey: "rose_lychee",   descKey: "rose_lychee_desc",   price: 26000, tag: "bestseller", color: "#F4C2C2", emoji: "🌹" },
  { id: 2, nameKey: "pistachio",     descKey: "pistachio_desc",     price: 32000, tag: "premium",    color: "#C8DBC2", emoji: "✨" },
  { id: 3, nameKey: "dark_velvet",   descKey: "dark_velvet_desc",   price: 29000, tag: "signature",  color: "#6B3D2E", emoji: "🍫" },
  { id: 4, nameKey: "matcha_sakura", descKey: "matcha_sakura_desc", price: 28000, tag: "seasonal",   color: "#A8C5A0", emoji: "🌸" },
];

// Cake names and descriptions per locale — kept co-located with the data
const CAKE_NAMES: Record<string, { hy: string; en: string; ru: string }> = {
  rose_lychee:        { hy: "Վարդ ու Լիչի",       en: "Rose & Lychee Dream",  ru: "Роза и Личи"         },
  pistachio:          { hy: "Ֆիստաշկայի Թագ.",    en: "Pistachio Royale",     ru: "Фисташковый Рояль"  },
  dark_velvet:        { hy: "Մուգ Թ. Նուար",       en: "Dark Velvet Noir",     ru: "Тёмный Бархат Нуар" },
  matcha_sakura:      { hy: "Մաչա Ու Սակուրա",    en: "Matcha Sakura",        ru: "Матча и Сакура"      },
};

const CAKE_DESCS: Record<string, { hy: string; en: string; ru: string }> = {
  rose_lychee_desc:        { hy: "Վ. բ., լիչի մ., ազ. կ., շ. մ.",        en: "Rose sponge, lychee mousse, raspberry compote, Swiss meringue", ru: "Бисквит из роз, мусс личи, малиновый компот, меренга" },
  pistachio_desc:          { hy: "Ֆ. բ., ս. շ. գ., ոսկ. թ.",             en: "Pistachio sponge, white chocolate ganache, edible gold leaf",   ru: "Фисташковый бисквит, ганаш из белого шоколада, золото" },
  dark_velvet_desc:        { hy: "Շ. բ., ա. կ., հ. գ.",                  en: "Dark chocolate sponge, salted caramel, mirror glaze",           ru: "Шоколадный бисквит, солёная карамель, зеркальная глазурь" },
  matcha_sakura_desc:      { hy: "Մ. բ., բ. ծ. կ., յ. կ.",               en: "Matcha sponge, cherry blossom cream, yuzu curd",               ru: "Бисквит матча, крем из цветов вишни, юдзу курд"          },
};

export default function FeaturedCakes() {
  const { t, locale } = useI18n();

  const tagLabel: Record<TagKey, string> = {
    bestseller: t.featured.tag_bestseller,
    premium:    t.featured.tag_premium,
    signature:  t.featured.tag_signature,
    seasonal:   t.featured.tag_seasonal,
  };

  return (
    <section className="py-24 bg-cream-50">
      <div className="container-site">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
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
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="card-cream overflow-hidden group cursor-pointer"
            >
              <div
                className="h-48 flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: cake.color + "22" }}
              >
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-soft transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundColor: cake.color + "44" }}
                >
                  {cake.emoji}
                </div>
                <span className="absolute top-3 right-3 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/80 text-gold-400 border border-gold-200">
                  {tagLabel[cake.tag]}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-display text-base font-semibold text-ink-900">
                  {CAKE_NAMES[cake.nameKey][locale]}
                </h3>
                <p className="font-body text-xs text-ink-500 leading-relaxed">
                  {CAKE_DESCS[cake.descKey][locale]}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-display text-lg font-semibold text-gold-400">
                    {formatAMD(cake.price)}
                  </span>
                  <Link
                    href="/configurator"
                    className="text-xs font-medium text-ink-700 hover:text-gold-400 transition-colors underline underline-offset-2"
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
