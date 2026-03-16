"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Locale, I18nLabel } from "@/types/cake";

// ─── UI Strings ───────────────────────────────────────────────────────────────
type UIStrings = {
  nav: { home: string; cakes: string; design: string; story: string; contact: string };
  hero: { badge: string; title1: string; title2: string; subtitle: string; cta: string; explore: string };
  configurator: {
    title: string; subtitle: string;
    size: string; shape: string; tiers: string;
    sponge: string; fillings: string; fillingsHint: string;
    frosting: string; toppings: string;
    message: string; messagePlaceholder: string;
    date: string; cutView: string; view3d: string;
    pause: string; rotate: string; included: string;
    order: string; summary: string; total: string;
    serves: string; people: string;
    tier: string; tiers_word: string;
  };
  price: { base: string; sponge: string; fillings: string; frosting: string; toppings: string; extra_tiers: string; total: string };
  footer: { tagline: string; explore: string; order: string; rights: string; madeWith: string };
};

const STRINGS: Record<Locale, UIStrings> = {
  // ─── ARMENIAN ────────────────────────────────────────────────────────────────
  hy: {
    nav: { home: "Գլխավոր", cakes: "Տորթեր", design: "Ձևավորել", story: "Մեր Պատմությունը", contact: "Կապ" },
    hero: {
      badge: "Անհատական Հրուշակ",
      title1: "Ամեն Տորթ",
      title2: "Պատմություն Ունի",
      subtitle: "Ձեռագործ շքեղ տորթեր ձեր ամենաթանկ պահերի համար",
      cta: "Ձևավորել Տորթ",
      explore: "Դիտել Հավաքածուն",
    },
    configurator: {
      title: "Ձևավորեք Ձեր Տորթը",
      subtitle: "Ընտրեք շերտ առ շերտ",
      size: "Չափս", shape: "Ձև", tiers: "Հարկեր",
      sponge: "Բիսկվիի Համ", fillings: "Լցոնումներ", fillingsHint: "Մինչ 3 ընտրել",
      frosting: "Ծածկույթ", toppings: "Զարդարանք",
      message: "Ձոնագիր", messagePlaceholder: "Օր.՝ Շնորհ. Ծննդյան...",
      date: "Առաքման Ամսաթիվ",
      cutView: "Կտրվածք", view3d: "3D Դիտում",
      pause: "Դադար", rotate: "Պտտել",
      included: "Ներառված",
      order: "Պատվիրել",
      summary: "Ամփոփ",
      total: "Ընդամենը",
      serves: "Չափաբաժին",
      people: "հոգ.",
      tier: "Հարկ",
      tiers_word: "Հարկ",
    },
    price: { base: "Հիմք", sponge: "Բիսկվի", fillings: "Լցոնում", frosting: "Ծածկույթ", toppings: "Զարդ", extra_tiers: "Հարկ+", total: "Ընդամենը" },
    footer: { tagline: "Ձեռք բերված սիրով ամեն շերտ", explore: "Ուսումնասիրել", order: "Պատվիրել", rights: "Բոլոր իրավունքները պաhպ.", madeWith: "Պատրաստ. սիրով ու կարագով" },
  },

  // ─── ENGLISH ──────────────────────────────────────────────────────────────────
  en: {
    nav: { home: "Home", cakes: "Our Cakes", design: "Design Yours", story: "Our Story", contact: "Contact" },
    hero: {
      badge: "Bespoke Pastry Art",
      title1: "Every Cake",
      title2: "Tells a Story",
      subtitle: "Handcrafted luxury cakes for your most cherished moments",
      cta: "Design Your Cake",
      explore: "Explore Collection",
    },
    configurator: {
      title: "Design Your Cake",
      subtitle: "Choose layer by layer",
      size: "Size", shape: "Shape", tiers: "Tiers",
      sponge: "Sponge Flavour", fillings: "Fillings", fillingsHint: "Choose up to 3",
      frosting: "Frosting", toppings: "Decorations",
      message: "Dedication Message", messagePlaceholder: "e.g. Happy Birthday...",
      date: "Serving Date",
      cutView: "Cut View", view3d: "3D View",
      pause: "Pause", rotate: "Rotate",
      included: "Included",
      order: "Place Order",
      summary: "Summary",
      total: "Total",
      serves: "Serves",
      people: "ppl",
      tier: "Tier",
      tiers_word: "Tiers",
    },
    price: { base: "Base", sponge: "Sponge", fillings: "Fillings", frosting: "Frosting", toppings: "Toppings", extra_tiers: "Extra Tiers", total: "Total" },
    footer: { tagline: "Made with love in every layer", explore: "Explore", order: "Order", rights: "All rights reserved.", madeWith: "Made with love & butter" },
  },

  // ─── RUSSIAN ──────────────────────────────────────────────────────────────────
  ru: {
    nav: { home: "Главная", cakes: "Торты", design: "Создать", story: "О нас", contact: "Контакт" },
    hero: {
      badge: "Авторские Торты на Заказ",
      title1: "Каждый Торт",
      title2: "Рассказывает Историю",
      subtitle: "Торты ручной работы для самых особенных моментов",
      cta: "Создать Торт",
      explore: "Смотреть Коллекцию",
    },
    configurator: {
      title: "Создайте Свой Торт",
      subtitle: "Выбирайте слой за слоем",
      size: "Размер", shape: "Форма", tiers: "Ярусы",
      sponge: "Вкус Бисквита", fillings: "Начинки", fillingsHint: "Выберите до 3",
      frosting: "Покрытие", toppings: "Украшения",
      message: "Надпись на Торте", messagePlaceholder: "Напр.: С Днём Рождения...",
      date: "Дата Подачи",
      cutView: "Разрез", view3d: "3D Вид",
      pause: "Пауза", rotate: "Вращать",
      included: "Включено",
      order: "Оформить Заказ",
      summary: "Итого",
      total: "Итого",
      serves: "Порций",
      people: "чел.",
      tier: "Ярус",
      tiers_word: "Яруса",
    },
    price: { base: "База", sponge: "Бисквит", fillings: "Начинки", frosting: "Покрытие", toppings: "Украшения", extra_tiers: "Доп. ярусы", total: "Итого" },
    footer: { tagline: "С любовью в каждом слое", explore: "Каталог", order: "Заказать", rights: "Все права защищены.", madeWith: "Сделано с любовью и маслом" },
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────
interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: UIStrings;
  /** Resolve an I18nLabel to current locale string */
  tl: (label: I18nLabel) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("hy");

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: STRINGS[locale],
    tl: (label) => label[locale],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
