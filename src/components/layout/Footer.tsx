import Link from "next/link";

const LINKS = {
  Explore:  [
    { href: "/",             label: "Home"         },
    { href: "/menu",         label: "Our Cakes"    },
    { href: "/configurator", label: "Design Yours" },
    { href: "/about",        label: "Our Story"    },
  ],
  Order: [
    { href: "/contact",    label: "Custom Orders" },
    { href: "/faq",        label: "FAQ"           },
    { href: "/delivery",   label: "Delivery Info" },
    { href: "/weddings",   label: "Weddings"      },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-cream-200 pt-16 pb-8">
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-ink-700">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <p className="font-display text-2xl font-semibold text-cream-50 leading-none">Anare</p>
              <p className="font-body text-[10px] font-medium tracking-[0.3em] uppercase text-gold-300 mt-0.5">Cake</p>
            </div>
            <p className="font-body text-sm text-ink-300 leading-relaxed max-w-xs">
              Handcrafted luxury pastries made with love in every layer.
              Each cake is a bespoke edible artwork, designed for your most cherished moments.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/anare_cake"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gold-300 hover:text-gold-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @anare_cake
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h4 className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-gold-300">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-300 hover:text-cream-100 transition-colors duration-200"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-ink-500">
          <p>© {new Date().getFullYear()} Anare Cake. All rights reserved.</p>
          <p>Made with love &amp; butter</p>
        </div>
      </div>
    </footer>
  );
}
