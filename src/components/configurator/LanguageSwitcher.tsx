"use client";

import { useI18n } from "@/lib/i18n";
import { Locale } from "@/types/cake";
import { cn } from "@/lib/cn";

const LANGS: { id: Locale; label: string }[] = [
  { id: "hy", label: "ՀԱՅ" },
  { id: "en", label: "ENG" },
  { id: "ru", label: "РУС" },
];

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  return (
    <div className={cn("flex items-center gap-1 p-1 bg-cream-100 rounded-full border border-cream-200", className)}>
      {LANGS.map((l) => (
        <button
          key={l.id}
          onClick={() => setLocale(l.id)}
          className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider transition-all duration-200",
            locale === l.id
              ? "bg-gold-300 text-white shadow-sm"
              : "text-ink-500 hover:text-ink-900"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
