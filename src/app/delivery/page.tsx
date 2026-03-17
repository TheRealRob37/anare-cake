import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Delivery" };

export default function Page() {
  return (
    <div className="pt-24 pb-24 min-h-screen bg-cream-gradient">
      <div className="container-site max-w-2xl space-y-10">
        <div>
          <h1 className="font-display text-display-md text-ink-900 mb-2">Delivery</h1>
          <p className="text-sm text-ink-500">We deliver fresh cakes across Yerevan, carefully packaged to arrive in perfect condition.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: "🚗", title: "Same-day delivery", desc: "Available for orders placed before 12:00 noon, subject to availability." },
            { icon: "📦", title: "Secure packaging", desc: "Every cake travels in a temperature-controlled box with anti-slip inserts." },
            { icon: "📍", title: "Coverage area", desc: "All districts of Yerevan. Contact us for deliveries outside the city." },
            { icon: "💳", title: "Delivery fee", desc: "Calculated at checkout based on your address. Typically 1,000–2,500 ֏." },
          ].map((item) => (
            <div key={item.title} className="card-cream rounded-2xl p-5 flex gap-4">
              <div className="text-3xl">{item.icon}</div>
              <div>
                <h3 className="font-body text-sm font-semibold text-ink-900">{item.title}</h3>
                <p className="text-xs text-ink-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card-cream rounded-2xl p-6 space-y-2">
          <h2 className="font-body text-sm font-semibold text-ink-900">Order timeline</h2>
          <ul className="space-y-2 text-sm text-ink-500">
            <li>• Standard cakes: order 3–5 days in advance</li>
            <li>• Tiered / wedding cakes: order 7–10 days in advance</li>
            <li>• Same-day orders: subject to availability — call us first</li>
          </ul>
        </div>

        <div className="text-center">
          <Link href="/configurator" className="btn-gold">Design Your Cake</Link>
        </div>
      </div>
    </div>
  );
}
