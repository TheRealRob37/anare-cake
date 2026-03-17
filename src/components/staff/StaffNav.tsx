"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ROLES = [
  { label: "Manager",  href: "/staff",          icon: "📋" },
  { label: "Baker",    href: "/staff/baker",     icon: "👩‍🍳" },
  { label: "Designer", href: "/staff/designer",  icon: "🎨" },
  { label: "Driver",   href: "/staff/delivery",  icon: "🚗" },
];

export default function StaffNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 bg-cream-100 rounded-2xl p-1">
      {ROLES.map(({ label, href, icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              active
                ? "bg-white text-ink-900 shadow-sm"
                : "text-ink-500 hover:text-ink-700"
            }`}
          >
            <span>{icon}</span>
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
