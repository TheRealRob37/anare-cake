"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import SectionLabel from "@/components/ui/SectionLabel";
import { EASE_SMOOTH } from "@/lib/motion";

// ─── Director ─────────────────────────────────────────────────────────────────
function Director() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: EASE_SMOOTH }}
      className="mt-20 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-card"
    >
      {/* Left — gold card */}
      <div
        className="p-10 space-y-6 flex flex-col justify-center"
        style={{ background: "linear-gradient(135deg, #E8CB8A 0%, #B8862A 100%)" }}
      >
        <div className="space-y-1">
          <p className="text-white/70 text-xs font-semibold tracking-[0.2em] uppercase">Founder & Head Pastry Chef</p>
          <h3 className="font-display text-3xl font-bold text-white">Anna Hakobyan</h3>
        </div>

        <blockquote className="font-body text-white/90 text-sm leading-relaxed italic border-l-2 border-white/40 pl-4">
          "Every cake I create is a conversation between the baker and the person being celebrated.
          I put a piece of my heart in every layer."
        </blockquote>

        <div className="grid grid-cols-3 gap-4">
          {[
            { value: "15+", label: "Years" },
            { value: "500+", label: "Cakes" },
            { value: "Paris", label: "Trained" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-white/70 text-[10px] uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-3xl">👩‍🍳</div>
          <div>
            <p className="text-white text-xs font-medium">Certified Maître Pâtissier</p>
            <p className="text-white/60 text-[10px]">École Lenôtre, Paris · 2009</p>
          </div>
        </div>
      </div>

      {/* Right — decorative */}
      <div className="bg-cream-100 p-10 flex flex-col justify-center items-center gap-6 relative overflow-hidden">
        {/* Background circle */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <div className="w-96 h-96 rounded-full border-4 border-gold-400" />
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-xs">
          {[
            { emoji: "🏆", label: "Best Pastry\nYerevan 2022" },
            { emoji: "🌹", label: "Floral Cake\nSpecialist" },
            { emoji: "🍫", label: "Chocolate\nMaster Class" },
            { emoji: "⭐", label: "4.9 Average\nRating" },
          ].map((badge) => (
            <motion.div
              key={badge.label}
              whileHover={{ scale: 1.05 }}
              className="card-cream p-4 text-center space-y-2"
            >
              <div className="text-3xl">{badge.emoji}</div>
              <p className="font-body text-[10px] text-ink-500 leading-tight whitespace-pre-line">{badge.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Team ─────────────────────────────────────────────────────────────────────
const TEAM = [
  {
    name: "Anna Hakobyan",
    role: "Founder & Head Chef",
    specialty: "Floral & Wedding Cakes",
    years: 15,
    emoji: "👩‍🍳",
    bio: "Trained in Paris and Yerevan, Anna leads every custom order from concept to final decoration.",
    color: "#D4A853",
  },
  {
    name: "Mariam Grigoryan",
    role: "Lead Decorator",
    specialty: "Sugar Flowers",
    years: 8,
    emoji: "🎨",
    bio: "Mariam's hand-crafted sugar flowers are inspired by Armenia's alpine meadows.",
    color: "#EAB8B0",
  },
  {
    name: "Vartan Petrosyan",
    role: "Master Baker",
    specialty: "Sponge & Fermentation",
    years: 12,
    emoji: "👨‍🍳",
    bio: "Vartan's sourdough-leavened sponges give our cakes an unmatched lightness and depth.",
    color: "#A8C5A0",
  },
  {
    name: "Liana Mkrtchyan",
    role: "Quality & Taste",
    specialty: "Flavour Development",
    years: 6,
    emoji: "🔬",
    bio: "Liana ensures every batch meets our standards — tasting, adjusting, and perfecting before delivery.",
    color: "#D6CDE8",
  },
];

function Team() {
  return (
    <div className="mt-20">
      <div className="text-center mb-10 space-y-3">
        <SectionLabel label="Our Team" />
        <h3 className="font-display text-display-sm text-ink-900">The People Behind Every Cake</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {TEAM.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: EASE_SMOOTH }}
            className="card-cream p-6 space-y-4 group hover:shadow-glow transition-shadow duration-300"
          >
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: member.color + "33" }}
            >
              {member.emoji}
            </div>

            {/* Info */}
            <div className="space-y-1">
              <h4 className="font-display text-base font-semibold text-ink-900">{member.name}</h4>
              <p className="font-body text-xs text-ink-500">{member.role}</p>
            </div>

            {/* Specialty + years */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: member.color + "22", color: member.color }}
              >
                {member.specialty}
              </span>
              <span className="text-[10px] text-ink-400">{member.years}y exp.</span>
            </div>

            {/* Bio */}
            <p className="font-body text-xs text-ink-400 leading-relaxed">{member.bio}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Technologies ─────────────────────────────────────────────────────────────
const TECHS = [
  {
    icon: "🔥",
    title: "Convection Precision Ovens",
    desc: "Swiss-engineered Rational ovens with ±1°C accuracy ensure every sponge rises evenly — no hot spots, no guesswork.",
    color: "#E8CB8A",
  },
  {
    icon: "🌱",
    title: "Certified Organic Ingredients",
    desc: "All produce — eggs, butter, flour, fruit — is sourced from certified Armenian farms within 100 km of Yerevan.",
    color: "#A8C5A0",
  },
  {
    icon: "🎨",
    title: "Artisan Decorating Tools",
    desc: "French piping sets, Japanese fondant tools, and Belgian chocolate moulds let our decorators achieve gallery-quality results.",
    color: "#D6CDE8",
  },
  {
    icon: "❄️",
    title: "Temperature-Controlled Storage",
    desc: "Finished cakes rest in humidity-controlled cabinets at 4°C until the moment of delivery — preserving texture and freshness.",
    color: "#C8DBC2",
  },
];

function Technologies() {
  return (
    <div className="mt-20">
      <div className="text-center mb-10 space-y-3">
        <SectionLabel label="Our Standards" />
        <h3 className="font-display text-display-sm text-ink-900">Craft Meets Precision</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {TECHS.map((tech, i) => (
          <motion.div
            key={tech.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: EASE_SMOOTH }}
            className="card-cream p-6 flex gap-5"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: tech.color + "44" }}
            >
              {tech.icon}
            </div>
            <div className="space-y-1.5">
              <h4 className="font-body text-sm font-semibold text-ink-900">{tech.title}</h4>
              <p className="font-body text-xs text-ink-500 leading-relaxed">{tech.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── History timeline ─────────────────────────────────────────────────────────
const HISTORY = [
  {
    year: "2010",
    title: "Founded in Yerevan",
    desc: "Anna Hakobyan returned from Paris with a vision: bring world-class pastry craft to Armenia. The first Anare cakes were made in her home kitchen.",
  },
  {
    year: "2015",
    title: "Online & Custom Orders",
    desc: "We launched our first website and began accepting bespoke orders. Within months, Anare became the go-to cake for Yerevan weddings.",
  },
  {
    year: "2020",
    title: "Seasonal Collections",
    desc: "We introduced our now-iconic seasonal menus — spring blossoms, summer citrus, autumn caramel — celebrating Armenia's extraordinary produce.",
  },
  {
    year: "2024",
    title: "Digital Cake Configurator",
    desc: "We built our live 3D cake configurator so customers can design their dream cake from home and see every layer in real time.",
  },
];

function Timeline() {
  return (
    <div className="mt-20">
      <div className="text-center mb-12 space-y-3">
        <SectionLabel label="Our Story" />
        <h3 className="font-display text-display-sm text-ink-900">A Decade of Sweetness</h3>
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Central line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold-200 via-gold-400 to-gold-200 -translate-x-1/2 hidden sm:block" />

        <div className="space-y-8">
          {HISTORY.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: isLeft ? -32 : 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: EASE_SMOOTH }}
                className={`relative grid sm:grid-cols-2 gap-4 ${isLeft ? "" : "sm:dir-rtl"}`}
              >
                {/* Card */}
                <div className={`card-cream p-5 space-y-2 ${isLeft ? "sm:col-start-1 sm:text-right" : "sm:col-start-2"}`}>
                  <div
                    className={`inline-block font-display text-xl font-bold text-gold-400 mb-1 px-3 py-0.5 rounded-full bg-gold-100`}
                  >
                    {item.year}
                  </div>
                  <h4 className="font-body text-sm font-semibold text-ink-900">{item.title}</h4>
                  <p className="font-body text-xs text-ink-500 leading-relaxed">{item.desc}</p>
                </div>

                {/* Dot on timeline */}
                <div className="hidden sm:flex absolute left-1/2 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-gold-400 border-2 border-white shadow z-10" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main About section ───────────────────────────────────────────────────────
export default function About() {
  const { t } = useI18n();

  const values = [
    { icon: "🌾", title: t.about.val1_title, desc: t.about.val1_desc },
    { icon: "🎨", title: t.about.val2_title, desc: t.about.val2_desc },
    { icon: "💌", title: t.about.val3_title, desc: t.about.val3_desc },
  ];

  const steps = [
    { num: "01", label: t.about.step1_label, desc: t.about.step1_desc },
    { num: "02", label: t.about.step2_label, desc: t.about.step2_desc },
    { num: "03", label: t.about.step3_label, desc: t.about.step3_desc },
    { num: "04", label: t.about.step4_label, desc: t.about.step4_desc },
  ];

  return (
    <section className="py-24 bg-cream-gradient">
      <div className="container-site">

        {/* ── Values + Process ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — text + values */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_SMOOTH }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <SectionLabel label={t.about.badge} center={false} />
              <h2 className="font-display text-display-md text-ink-900 leading-tight">
                {t.about.title1}{" "}
                <span className="italic text-gold-400">{t.about.title2}</span>{" "}
                {t.about.title3}
              </h2>
              <p className="font-body text-ink-500 leading-relaxed">{t.about.p1}</p>
              <p className="font-body text-ink-500 leading-relaxed">{t.about.p2}</p>
            </div>

            <div className="space-y-4">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gold-100 flex items-center justify-center text-lg flex-shrink-0">
                    {v.icon}
                  </div>
                  <div>
                    <h4 className="font-body text-sm font-semibold text-ink-900 mb-1">{v.title}</h4>
                    <p className="font-body text-xs text-ink-500 leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/configurator" className="btn-gold inline-flex">{t.about.cta}</Link>
          </motion.div>

          {/* Right — process card */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_SMOOTH }}
            className="relative"
          >
            <div className="card-cream p-8 space-y-6">
              <h3 className="font-display text-lg font-semibold text-ink-900 text-center">
                {t.about.process_title}
              </h3>
              <div className="space-y-0">
                {steps.map((step) => (
                  <div key={step.num} className="flex gap-4 py-4 border-b border-cream-200 last:border-0">
                    <span className="font-display text-2xl font-bold text-gold-200 w-10 flex-shrink-0">{step.num}</span>
                    <div>
                      <p className="font-body text-sm font-semibold text-ink-900">{step.label}</p>
                      <p className="font-body text-xs text-ink-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gold-gradient flex flex-col items-center justify-center shadow-glow text-white text-center">
              <span className="font-display text-lg font-bold leading-none">4.9</span>
              <span className="text-[8px] font-medium tracking-wider uppercase opacity-90">{t.about.badge_stars}</span>
            </div>
          </motion.div>
        </div>

        {/* ── Director ─────────────────────────────────────────────── */}
        <Director />

        {/* ── Team ─────────────────────────────────────────────────── */}
        <Team />

        {/* ── Technologies ─────────────────────────────────────────── */}
        <Technologies />

        {/* ── History timeline ──────────────────────────────────────── */}
        <Timeline />

      </div>
    </section>
  );
}
