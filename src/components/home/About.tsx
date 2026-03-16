"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import SectionLabel from "@/components/ui/SectionLabel";
import { EASE_SMOOTH } from "@/lib/motion";

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
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
              <span className="text-[8px] font-medium tracking-wider uppercase opacity-90 leading-tight">
                {t.about.badge_stars}
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
