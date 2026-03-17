"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCakeStore } from "@/store/cakeStore";
import { useI18n } from "@/lib/i18n";
import { formatAMD, SPONGES, FROSTINGS, SIZE_META } from "@/types/cake";
import { EASE_SMOOTH } from "@/lib/motion";
import YandexMapPicker from "./YandexMapPicker";

// Minimum hours from now before a delivery can be scheduled
const MIN_HOURS_AHEAD = 4;

function minDeliveryDatetime(): string {
  const d = new Date();
  d.setHours(d.getHours() + MIN_HOURS_AHEAD);
  d.setMinutes(d.getMinutes() >= 30 ? 60 : 30, 0, 0);
  return d.toISOString().slice(0, 16);
}

type Phase = "form" | "flying" | "success";

// ─── Main component ───────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { config, price } = useCakeStore();
  const { t } = useI18n();
  const uid = useId();
  const router = useRouter();

  // Contact
  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Delivery
  const [address, setAddress]           = useState("");
  const [deliveryLat, setDeliveryLat]   = useState<number | null>(null);
  const [deliveryLng, setDeliveryLng]   = useState<number | null>(null);
  const [deliveryDate, setDeliveryDate] = useState(minDeliveryDatetime());
  const [notes, setNotes]               = useState("");

  // UI state
  const [error, setError]   = useState("");
  const [phase, setPhase]   = useState<Phase>("form");
  const [orderId, setOrderId] = useState("");

  const yandexKey    = process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY ?? "";
  const spongeLabel  = SPONGES.find((s) => s.id === config.sponge)?.label.en  ?? config.sponge;
  const frostingLabel = FROSTINGS.find((f) => f.id === config.frosting)?.label.en ?? config.frosting;
  const sizeMeta     = SIZE_META[config.size];

  function validate(): boolean {
    if (!name.trim() || !phone.trim() || !address.trim() || !deliveryDate) {
      setError(t.checkout.error_required);
      return false;
    }
    if (new Date(deliveryDate) <= new Date()) {
      setError("Delivery date must be in the future.");
      return false;
    }
    setError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // Start fly animation immediately for snappiness
    setPhase("flying");

    try {
      const res = await fetch("/api/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cake_config:      config,
          delivery_address: address,
          delivery_lat:     deliveryLat ?? undefined,
          delivery_lng:     deliveryLng ?? undefined,
          delivery_date:    new Date(deliveryDate).toISOString(),
          complexity_score: Math.round(
            (config.tiers === 3 ? 5 : config.tiers === 2 ? 3 : 0) +
            Math.min(config.toppings.length, 3) +
            (config.size === "25cm" ? 2 : 0)
          ),
          customer_name:    name,
          customer_phone:   phone,
          customer_email:   email || undefined,
          notes:            notes || undefined,
          total_price:      price.total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to place order. Please try again.");
        setPhase("form");
        return;
      }

      setOrderId(data.order.id);
      // Small delay so the fly animation completes before success shows
      setTimeout(() => setPhase("success"), 900);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setPhase("form");
    }
  }

  // ── Success screen ─────────────────────────────────────────────────────────

  if (phase === "success") {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_SMOOTH }}
          className="card-cream p-10 max-w-md w-full text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.5 }}
            className="w-20 h-20 rounded-full bg-gold-100 flex items-center justify-center mx-auto text-4xl"
          >
            🎂
          </motion.div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-semibold text-ink-900">
              {t.checkout.success_title}
            </h2>
            <p className="font-body text-sm text-ink-500 leading-relaxed">
              Your order is being reviewed by our team. We'll email you once it's confirmed!
            </p>
          </div>

          <div className="bg-cream-100 rounded-2xl px-5 py-4 text-left space-y-1">
            <p className="text-[10px] text-ink-400 uppercase tracking-widest font-medium">Order ID</p>
            <p className="text-xs font-mono font-bold text-gold-400 break-all">{orderId}</p>
          </div>

          <div className="space-y-3">
            <Link
              href={`/track/${orderId}`}
              className="btn-gold w-full justify-center"
            >
              Track your order →
            </Link>
            <Link href="/" className="block text-sm text-ink-400 hover:text-gold-400 transition-colors">
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-16">
      {/* Flying cake overlay */}
      <AnimatePresence>
        {phase === "flying" && (
          <motion.div
            key="fly"
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 1, y: 0, opacity: 1 }}
              animate={{ scale: [1, 1.4, 0.8], y: -window.innerHeight, opacity: [1, 1, 0] }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-8xl drop-shadow-2xl"
            >
              🎂
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`container-site py-12 transition-opacity duration-300 ${phase === "flying" ? "opacity-30 pointer-events-none" : "opacity-100"}`}>

        <Link href="/configurator" className="inline-flex items-center gap-1 text-xs text-ink-500 hover:text-gold-400 transition-colors mb-8">
          {t.checkout.back}
        </Link>

        <div className="mb-10">
          <h1 className="font-display text-display-sm text-ink-900">{t.checkout.title}</h1>
          <p className="font-body text-sm text-ink-500 mt-1">{t.checkout.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

            {/* ── Left: form ─────────────────────────────────────────── */}
            <div className="space-y-6">

              {/* Contact */}
              <Section title={t.checkout.contact_title}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field id={`${uid}-name`} label={t.checkout.name}>
                    <input
                      id={`${uid}-name`} value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.checkout.namePlaceholder}
                      className="field-input" required
                    />
                  </Field>
                  <Field id={`${uid}-phone`} label={t.checkout.phone}>
                    <input
                      id={`${uid}-phone`} type="tel" value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t.checkout.phonePlaceholder}
                      className="field-input" required
                    />
                  </Field>
                  <Field id={`${uid}-email`} label={`${t.checkout.email} (for order updates)`} className="sm:col-span-2">
                    <input
                      id={`${uid}-email`} type="email" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.checkout.emailPlaceholder}
                      className="field-input"
                    />
                  </Field>
                </div>
              </Section>

              {/* Delivery */}
              <Section title={t.checkout.delivery_title}>
                <div className="space-y-4">
                  {yandexKey ? (
                    <YandexMapPicker
                      apiKey={yandexKey}
                      onSelect={(addr, coords) => {
                        setAddress(addr);
                        setDeliveryLat(coords[0]);
                        setDeliveryLng(coords[1]);
                      }}
                    />
                  ) : (
                    <p className="text-[10px] text-ink-300 italic">{t.checkout.map_hint}</p>
                  )}

                  <Field id={`${uid}-address`} label={t.checkout.address}>
                    <input
                      id={`${uid}-address`} value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t.checkout.addressPlaceholder}
                      className="field-input" required
                    />
                  </Field>

                  {yandexKey && (
                    <p className="text-[10px] text-ink-300">{t.checkout.map_click_hint}</p>
                  )}

                  <Field id={`${uid}-date`} label="Delivery date & time">
                    <input
                      id={`${uid}-date`} type="datetime-local"
                      value={deliveryDate} min={minDeliveryDatetime()}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="field-input" required
                    />
                    <p className="text-[10px] text-ink-300 mt-1">
                      Minimum {MIN_HOURS_AHEAD} hours from now. We work 08:00–20:00.
                    </p>
                  </Field>

                  <Field id={`${uid}-notes`} label="Notes for baker (optional)">
                    <textarea
                      id={`${uid}-notes`} value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Allergies, special requests, building code…"
                      className="field-input resize-none" rows={3} maxLength={500}
                    />
                  </Field>
                </div>
              </Section>

              {/* Payment notice */}
              <div className="card-cream p-5 flex items-start gap-3 border-gold-200">
                <span className="text-2xl mt-0.5">💳</span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-ink-900">Payment after confirmation</p>
                  <p className="text-xs text-ink-500 leading-relaxed">
                    We review your order first. Once confirmed, you'll receive an email with a secure payment link. You can pay by card, Google Pay, or Apple Pay.
                  </p>
                </div>
              </div>

              {error && (
                <p className="text-xs text-blush-400 font-medium bg-blush-100 px-4 py-3 rounded-2xl">{error}</p>
              )}

              <p className="text-[10px] text-ink-300 leading-relaxed">{t.checkout.note}</p>
            </div>

            {/* ── Right: Order summary ────────────────────────────────── */}
            <div className="lg:sticky lg:top-24">
              <OrderSummary
                config={config}
                price={price}
                spongeLabel={spongeLabel}
                frostingLabel={frostingLabel}
                sizeMeta={sizeMeta}
                t={t}
                loading={phase === "flying"}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-cream p-6 space-y-5">
      <h2 className="font-body text-xs font-semibold tracking-[0.14em] uppercase text-ink-500">{title}</h2>
      {children}
    </div>
  );
}

function Field({ id, label, children, className }: { id: string; label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <label htmlFor={id} className="block text-xs font-medium text-ink-700">{label}</label>
      {children}
    </div>
  );
}

function OrderSummary({
  config, price, spongeLabel, frostingLabel, sizeMeta, t, loading,
}: {
  config:        ReturnType<typeof useCakeStore.getState>["config"];
  price:         ReturnType<typeof useCakeStore.getState>["price"];
  spongeLabel:   string;
  frostingLabel: string;
  sizeMeta:      { serves: string };
  t:             ReturnType<typeof useI18n>["t"];
  loading:       boolean;
}) {
  const rows = [
    { label: t.price.base,        value: price.base },
    { label: t.price.sponge,      value: price.sponge },
    { label: t.price.fillings,    value: price.fillings },
    { label: t.price.frosting,    value: price.frosting },
    { label: t.price.toppings,    value: price.toppings },
    { label: t.price.extra_tiers, value: price.tiers },
  ].filter((r) => r.value > 0);

  return (
    <div className="card-cream p-6 space-y-5">
      <h2 className="font-body text-xs font-semibold tracking-[0.14em] uppercase text-ink-500">
        {t.checkout.order_summary}
      </h2>

      <div className="flex items-center gap-4 pb-4 border-b border-cream-200">
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl bg-cream-200 flex items-center justify-center text-3xl flex-shrink-0"
        >
          🎂
        </motion.div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-semibold text-ink-900">{config.size} · {config.tiers}T · {config.shape}</p>
          <p className="text-xs text-ink-500 truncate">{spongeLabel} · {frostingLabel}</p>
          <p className="text-xs text-ink-400">{t.checkout.serves_label}: {sizeMeta.serves}</p>
        </div>
      </div>

      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between text-xs">
            <span className="text-ink-500">{r.label}</span>
            <span className="text-ink-700 font-medium">{formatAMD(r.value)}</span>
          </div>
        ))}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent" />

      <div className="flex justify-between items-center">
        <span className="font-body text-sm font-semibold text-ink-900">{t.price.total}</span>
        <span className="font-display text-2xl font-bold text-gold-400">{formatAMD(price.total)}</span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin text-sm">🎂</span> Sending your order…
          </span>
        ) : t.checkout.place_order}
      </button>
    </div>
  );
}
