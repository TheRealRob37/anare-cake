"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "@/components/configurator/LanguageSwitcher";

export default function Header() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();

  const NAV_LINKS = [
    { href: "/",             label: t.nav.home    },
    { href: "/menu",         label: t.nav.cakes   },
    { href: "/configurator", label: t.nav.design  },
    { href: "/about",        label: t.nav.story   },
    { href: "/contact",      label: t.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-cream-50/90 backdrop-blur-xl shadow-soft border-b border-cream-200"
            : "bg-transparent"
        )}
      >
        <div className="container-site h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="group flex-shrink-0" aria-label="Anare Cake — Home">
            <div className="h-10 w-auto overflow-hidden rounded-xl border border-cream-200 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Image src="/logo.jpg" alt="Anare Cake" width={80} height={40} className="h-full w-auto object-cover" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  link.href === "/configurator"
                    ? "btn-gold ml-2"
                    : "text-ink-500 hover:text-ink-900 hover:bg-cream-200"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: language switcher + mobile toggle */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <LanguageSwitcher className="hidden sm:flex" />

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Toggle menu"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{
                    rotate:  mobileOpen ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0,
                    y:       mobileOpen ? (i === 0 ? 8  : i === 2 ? -8  : 0) : 0,
                    opacity: mobileOpen && i === 1 ? 0 : 1,
                  }}
                  transition={{ duration: 0.25 }}
                  className="block h-0.5 w-5 bg-ink-700 rounded-full origin-center"
                />
              ))}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-16 z-40 bg-cream-50/95 backdrop-blur-xl border-b border-cream-200 shadow-card md:hidden"
          >
            <nav className="container-site py-6 flex flex-col gap-1">
              {/* Language switcher in mobile menu */}
              <div className="flex justify-center mb-4">
                <LanguageSwitcher />
              </div>

              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-2xl text-sm font-medium transition-colors",
                      link.href === "/configurator"
                        ? "bg-gold-gradient text-white text-center mt-2"
                        : "text-ink-700 hover:bg-cream-200"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
