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

// ─── Card brand detection ─────────────────────────────────────────────────────
type CardBrand = "visa" | "mastercard" | "arca" | "unknown";

function detectBrand(num: string): CardBrand {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^9/.test(n)) return "arca";
  return "unknown";
}

function formatCardNumber(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

// ─── Brand icons (inline SVG) ─────────────────────────────────────────────────
function VisaIcon() {
  return (
    <svg viewBox="0 0 40 14" className="h-4 w-auto" aria-label="Visa">
      <text x="0" y="12" fontSize="13" fontWeight="800" fontFamily="Arial,sans-serif" fill="#1A1F71" letterSpacing="-0.5">VISA</text>
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg viewBox="0 0 38 24" className="h-5 w-auto" aria-label="Mastercard">
      <circle cx="13" cy="12" r="10" fill="#EB001B" />
      <circle cx="25" cy="12" r="10" fill="#F79E1B" />
      <path d="M19 4.8a10 10 0 0 1 0 14.4A10 10 0 0 1 19 4.8z" fill="#FF5F00" />
    </svg>
  );
}

function ArcaIcon() {
  return (
    <svg viewBox="0 0 48 20" className="h-4 w-auto" aria-label="ARCA">
      <rect width="48" height="20" rx="3" fill="#003087" />
      <text x="5" y="14" fontSize="10" fontWeight="700" fontFamily="Arial,sans-serif" fill="white">ARCA</text>
    </svg>
  );
}

// ─── Payment method types ─────────────────────────────────────────────────────
type PayMethod = "card" | "gpay" | "applepay";

// ─── Main component ───────────────────────────────────────────────────────────
// Minimum hours from now before a delivery can be scheduled
const MIN_HOURS_AHEAD = 4;

function minDeliveryDatetime(): string {
  const d = new Date();
  d.setHours(d.getHours() + MIN_HOURS_AHEAD);
  // Round up to next half-hour
  d.setMinutes(d.getMinutes() >= 30 ? 60 : 30, 0, 0);
  // Format as datetime-local value (YYYY-MM-DDTHH:MM)
  return d.toISOString().slice(0, 16);
}

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
  const [deliveryDate, setDeliveryDate] = useState(minDeliveryDatetime());
  const [notes, setNotes]               = useState("");

  // Payment
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv]       = useState("");
  const [cardName, setCardName]     = useState("");

  // State
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [orderRef, setOrderRef] = useState("");

  const brand = detectBrand(cardNumber);

  const yandexKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY ?? "";

  // Derived cake info
  const spongeLabel  = SPONGES.find((s) => s.id === config.sponge)?.label.en ?? config.sponge;
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
    if (payMethod === "card" && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim() || !cardName.trim())) {
      setError(t.checkout.error_required);
      return false;
    }
    setError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cake_config:      config,
          delivery_address: address,
          delivery_date:    new Date(deliveryDate).toISOString(),
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
        return;
      }

      setOrderRef(data.order.id);
      setSuccess(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE_SMOOTH }}
          className="card-cream p-10 max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-gold-100 flex items-center justify-center mx-auto text-4xl">🎂</div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-semibold text-ink-900">{t.checkout.success_title}</h2>
            <p className="font-body text-sm text-ink-500 leading-relaxed">{t.checkout.success_desc}</p>
          </div>
          <div className="bg-cream-200 rounded-2xl px-5 py-3 text-sm font-mono text-ink-700 text-left space-y-1">
            <p>{t.checkout.success_ref}:</p>
            <p className="font-bold text-gold-400 text-xs break-all">{orderRef}</p>
          </div>
          <Link
            href={`/track/${orderRef}`}
            className="btn-gold w-full justify-center"
          >
            Track your order →
          </Link>
          <Link href="/" className="text-sm text-ink-400 hover:text-gold-400 transition-colors text-center">
            ← Back to home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-16">
      <div className="container-site py-12">

        {/* Back */}
        <Link href="/configurator" className="inline-flex items-center gap-1 text-xs text-ink-500 hover:text-gold-400 transition-colors mb-8">
          {t.checkout.back}
        </Link>

        {/* Heading */}
        <div className="mb-10">
          <h1 className="font-display text-display-sm text-ink-900">{t.checkout.title}</h1>
          <p className="font-body text-sm text-ink-500 mt-1">{t.checkout.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

            {/* ── Left: form ─────────────────────────────────────────── */}
            <div className="space-y-8">

              {/* Contact */}
              <Section title={t.checkout.contact_title}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field id={`${uid}-name`} label={t.checkout.name}>
                    <input id={`${uid}-name`} value={name} onChange={(e) => setName(e.target.value)}
                      placeholder={t.checkout.namePlaceholder} className="field-input" required />
                  </Field>
                  <Field id={`${uid}-phone`} label={t.checkout.phone}>
                    <input id={`${uid}-phone`} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder={t.checkout.phonePlaceholder} className="field-input" required />
                  </Field>
                  <Field id={`${uid}-email`} label={t.checkout.email} className="sm:col-span-2">
                    <input id={`${uid}-email`} type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.checkout.emailPlaceholder} className="field-input" required />
                  </Field>
                </div>
              </Section>

              {/* Delivery */}
              <Section title={t.checkout.delivery_title}>
                <div className="space-y-3">
                  {yandexKey ? (
                    <YandexMapPicker
                      apiKey={yandexKey}
                      onSelect={(addr) => setAddress(addr)}
                    />
                  ) : (
                    <p className="text-[10px] text-ink-300 italic">{t.checkout.map_hint}</p>
                  )}
                  <Field id={`${uid}-address`} label={t.checkout.address}>
                    <input id={`${uid}-address`} value={address} onChange={(e) => setAddress(e.target.value)}
                      placeholder={t.checkout.addressPlaceholder} className="field-input" required />
                  </Field>
                  {yandexKey && (
                    <p className="text-[10px] text-ink-300">{t.checkout.map_click_hint}</p>
                  )}
                  <Field id={`${uid}-date`} label="Delivery date & time">
                    <input
                      id={`${uid}-date`}
                      type="datetime-local"
                      value={deliveryDate}
                      min={minDeliveryDatetime()}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="field-input"
                      required
                    />
                    <p className="text-[10px] text-ink-300 mt-1">
                      Minimum {MIN_HOURS_AHEAD} hours from now. We work 08:00–20:00.
                    </p>
                  </Field>
                  <Field id={`${uid}-notes`} label="Notes for baker (optional)">
                    <textarea
                      id={`${uid}-notes`}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Allergies, special requests, building code…"
                      className="field-input resize-none"
                      rows={3}
                      maxLength={500}
                    />
                  </Field>
                </div>
              </Section>

              {/* Payment */}
              <Section title={t.checkout.payment_title}>
                {/* Method tabs */}
                <div className="flex gap-2 mb-5">
                  {(["card", "gpay", "applepay"] as PayMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayMethod(m)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 text-xs font-medium transition-all duration-200 ${
                        payMethod === m
                          ? "border-gold-300 bg-gold-100 text-ink-900"
                          : "border-cream-200 text-ink-500 hover:border-gold-200"
                      }`}
                    >
                      {m === "gpay" && <GooglePayIcon />}
                      {m === "applepay" && <ApplePayIcon />}
                      {m === "card" && <span className="text-base">💳</span>}
                      {m === "card" && t.checkout.pay_card}
                      {m === "gpay" && t.checkout.pay_gpay}
                      {m === "applepay" && t.checkout.pay_applepay}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {payMethod === "card" && (
                    <motion.div
                      key="card"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {/* Accepted cards row */}
                      <div className="flex items-center gap-3">
                        <VisaIcon />
                        <MastercardIcon />
                        <ArcaIcon />
                        {brand !== "unknown" && (
                          <span className="ml-auto text-[10px] text-gold-400 font-medium capitalize">{brand} detected</span>
                        )}
                      </div>

                      <Field id={`${uid}-cn`} label={t.checkout.card_number}>
                        <input
                          id={`${uid}-cn`}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="0000 0000 0000 0000"
                          inputMode="numeric"
                          className="field-input font-mono tracking-widest"
                          maxLength={19}
                        />
                      </Field>

                      <div className="grid grid-cols-2 gap-4">
                        <Field id={`${uid}-exp`} label={t.checkout.card_expiry}>
                          <input
                            id={`${uid}-exp`}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            placeholder="MM/YY"
                            inputMode="numeric"
                            className="field-input font-mono"
                            maxLength={5}
                          />
                        </Field>
                        <Field id={`${uid}-cvv`} label={t.checkout.card_cvv}>
                          <input
                            id={`${uid}-cvv`}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            placeholder="•••"
                            inputMode="numeric"
                            type="password"
                            className="field-input font-mono"
                            maxLength={4}
                          />
                        </Field>
                      </div>

                      <Field id={`${uid}-cname`} label={t.checkout.card_name}>
                        <input
                          id={`${uid}-cname`}
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          placeholder={t.checkout.card_namePlaceholder}
                          className="field-input font-mono uppercase tracking-widest"
                        />
                      </Field>
                    </motion.div>
                  )}

                  {payMethod === "gpay" && (
                    <motion.div
                      key="gpay"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="py-4 text-center space-y-3"
                    >
                      <p className="text-xs text-ink-500">Google Pay will open on submit</p>
                      <GooglePayButton total={price.total} />
                    </motion.div>
                  )}

                  {payMethod === "applepay" && (
                    <motion.div
                      key="applepay"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="py-4 text-center space-y-3"
                    >
                      <p className="text-xs text-ink-500">Apple Pay will open on submit</p>
                      <ApplePayButton />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Section>

              {/* Error */}
              {error && (
                <p className="text-xs text-red-500 font-medium">{error}</p>
              )}

              {/* Note */}
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
                loading={loading}
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

function OrderSummary({ config, price, spongeLabel, frostingLabel, sizeMeta, t, loading }: {
  config: ReturnType<typeof useCakeStore.getState>["config"];
  price: ReturnType<typeof useCakeStore.getState>["price"];
  spongeLabel: string;
  frostingLabel: string;
  sizeMeta: { serves: string };
  t: ReturnType<typeof useI18n>["t"];
  loading: boolean;
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

      {/* Cake visual summary */}
      <div className="flex items-center gap-4 pb-4 border-b border-cream-200">
        <div className="w-16 h-16 rounded-2xl bg-cream-200 flex items-center justify-center text-3xl flex-shrink-0">
          🎂
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-semibold text-ink-900">{config.size} · {config.tiers}T · {config.shape}</p>
          <p className="text-xs text-ink-500 truncate">{spongeLabel} · {frostingLabel}</p>
          <p className="text-xs text-ink-400">{t.checkout.serves_label}: {sizeMeta.serves}</p>
        </div>
      </div>

      {/* Price breakdown */}
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

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? t.checkout.processing : t.checkout.place_order}
      </button>
    </div>
  );
}

// ─── Google / Apple Pay branded buttons ──────────────────────────────────────

function GooglePayButton({ total }: { total: number }) {
  return (
    <button
      type="submit"
      className="inline-flex items-center gap-2.5 bg-black text-white rounded-xl px-8 py-3.5 font-medium text-sm shadow-md hover:bg-gray-900 transition-colors"
    >
      <GooglePayIcon white />
      <span>Pay {formatAMD(total)}</span>
    </button>
  );
}

function ApplePayButton() {
  return (
    <button
      type="submit"
      className="inline-flex items-center gap-2.5 bg-black text-white rounded-xl px-8 py-3.5 font-medium text-sm shadow-md hover:bg-gray-900 transition-colors"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <ApplePayIcon white />
      <span>Pay</span>
    </button>
  );
}

function GooglePayIcon({ white }: { white?: boolean }) {
  const fill = white ? "#fff" : undefined;
  return (
    <svg viewBox="0 0 41 17" className="h-4 w-auto" aria-label="Google Pay">
      <text x="0" y="13" fontSize="12" fontWeight="500" fontFamily="Arial,sans-serif" fill={fill ?? "#000"}>G</text>
      <text x="9" y="13" fontSize="12" fontWeight="500" fontFamily="Arial,sans-serif" fill={fill ?? "#4285F4"}>P</text>
      <text x="17" y="13" fontSize="12" fontWeight="500" fontFamily="Arial,sans-serif" fill={fill ?? "#EA4335"}>a</text>
      <text x="24" y="13" fontSize="12" fontWeight="500" fontFamily="Arial,sans-serif" fill={fill ?? "#FBBC04"}>y</text>
    </svg>
  );
}

function ApplePayIcon({ white }: { white?: boolean }) {
  return (
    <svg viewBox="0 0 50 20" className="h-4 w-auto" aria-label="Apple Pay">
      <text x="0" y="15" fontSize="14" fontFamily="-apple-system,sans-serif" fontWeight="600" fill={white ? "#fff" : "#000"}> Pay</text>
    </svg>
  );
}
