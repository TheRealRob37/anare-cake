import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Wedding Cakes" };

export default function Page() {
  return (
    <div className="pt-24 pb-24 min-h-screen bg-cream-gradient">
      <div className="container-site max-w-3xl space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-400">Bespoke Creations</p>
          <h1 className="font-display text-display-md text-ink-900">
            Wedding <span className="italic text-gold-400">Cakes</span>
          </h1>
          <p className="text-sm text-ink-500 max-w-md mx-auto leading-relaxed">
            Your wedding cake is the centrepiece of your most important day. We craft each one by hand,
            layered with the flavours and memories that are uniquely yours.
          </p>
          <Link href="/configurator" className="btn-gold inline-flex">Start Designing</Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: "🎨", title: "Fully Bespoke", desc: "Design every tier, flavour, and decoration from scratch." },
            { icon: "🌸", title: "Floral Artistry", desc: "Sugar flowers hand-crafted by our lead decorator, Mariam." },
            { icon: "🍰", title: "Tasting Session", desc: "Book a tasting session to find your perfect flavour combination." },
          ].map((f) => (
            <div key={f.title} className="card-cream rounded-2xl p-6 text-center space-y-3">
              <div className="text-4xl">{f.icon}</div>
              <h3 className="font-body text-sm font-semibold text-ink-900">{f.title}</h3>
              <p className="text-xs text-ink-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Process */}
        <div className="card-cream rounded-2xl p-8 space-y-6">
          <h2 className="font-display text-lg font-semibold text-ink-900 text-center">Our Wedding Process</h2>
          <div className="space-y-0">
            {[
              { num: "01", label: "Initial Consultation", desc: "Share your vision, date, and guest count. We'll suggest tier options and flavours." },
              { num: "02", label: "Tasting Session", desc: "Sample up to 4 fillings and 2 frosting types in our studio." },
              { num: "03", label: "Design Approval", desc: "We share a detailed sketch and confirm all decorative elements." },
              { num: "04", label: "Delivery & Setup", desc: "We deliver and assemble your cake on-site on the wedding day." },
            ].map((step) => (
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

        <div className="text-center space-y-3">
          <p className="text-sm text-ink-500">Ready to start planning?</p>
          <Link href="/contact" className="btn-gold inline-flex">Book a Consultation</Link>
        </div>
      </div>
    </div>
  );
}
