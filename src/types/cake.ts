// ─── Cake Configurator Type System ───────────────────────────────────────────

// Sizes in centimeters (metric)
export type CakeSize = "10cm" | "15cm" | "20cm" | "25cm";
export type CakeTiers = 1 | 2 | 3;
export type CakeShape = "round" | "heart" | "square";

// ─── Language ─────────────────────────────────────────────────────────────────
export type Locale = "hy" | "en" | "ru";

export interface I18nLabel {
  hy: string; // Armenian (primary)
  en: string; // English
  ru: string; // Russian
}

// ─── Sponge (base layer) ──────────────────────────────────────────────────────
export type SpongeId =
  | "vanilla"
  | "chocolate"
  | "redvelvet"
  | "matcha"
  | "lemon"
  | "strawberry";

export interface Sponge {
  id: SpongeId;
  label: I18nLabel;
  color: string; // hex — rendered in CakeCutView
  pricePerTier: number; // AMD
}

// ─── Filling / Mousse ─────────────────────────────────────────────────────────
export type FillingId =
  | "strawberry_cream"
  | "mango_mousse"
  | "pistachio_cream"
  | "dark_chocolate_ganache"
  | "salted_caramel"
  | "vanilla_custard"
  | "berry_compote"
  | "lavender_honey";

export interface Filling {
  id: FillingId;
  label: I18nLabel;
  color: string;
  pricePerLayer: number; // AMD
}

// ─── Frosting ─────────────────────────────────────────────────────────────────
export type FrostingId =
  | "swiss_meringue"
  | "whipped_cream"
  | "cream_cheese"
  | "mirror_glaze_gold"
  | "mirror_glaze_rose"
  | "naked"
  | "semi_naked";

export interface Frosting {
  id: FrostingId;
  label: I18nLabel;
  color: string;
  price: number; // AMD
}

// ─── Toppings / Decorations ───────────────────────────────────────────────────
export type ToppingId =
  | "fresh_berries"
  | "macaron_tower"
  | "edible_flowers"
  | "gold_leaf"
  | "chocolate_drip"
  | "caramel_drip"
  | "fondant_roses"
  | "pistachio_dust"
  | "custom_lettering";

export interface Topping {
  id: ToppingId;
  label: I18nLabel;
  emoji: string;
  price: number; // AMD
  position?: "top" | "side" | "drip";
}

// ─── Shape catalogue (replaces scattered SHAPE_LABELS) ───────────────────────
export interface Shape {
  id: CakeShape;
  label: I18nLabel;
  emoji: string;
}

export const SHAPES: Shape[] = [
  { id: "round",  label: { hy: "Կլոր",   en: "Round",  ru: "Круглый" }, emoji: "⭕" },
  { id: "heart",  label: { hy: "Սրտաձև", en: "Heart",  ru: "Сердце"  }, emoji: "❤️" },
  { id: "square", label: { hy: "Քառ.",   en: "Square", ru: "Квадрат" }, emoji: "◼️" },
];

// ─── Internal Filling Layers (cross-section view) ────────────────────────────
export interface InternalLayer {
  type: "sponge" | "filling" | "frosting";
  color: string;
  label: string;
  heightPx: number;
  /** Optional photo of the filling cross-section — will replace solid color band when provided */
  imageUrl?: string;
}

// ─── Main Cake Config State ───────────────────────────────────────────────────
export interface CakeConfig {
  size: CakeSize;
  tiers: CakeTiers;
  shape: CakeShape;
  sponge: SpongeId;
  fillings: FillingId[];
  frosting: FrostingId;
  toppings: ToppingId[];
  dedicationMessage: string;
  servingDate: string;
  showCutView: boolean;
  selectedTier: number;
  isRotating: boolean;
}

// ─── Price Breakdown ──────────────────────────────────────────────────────────
export interface PriceBreakdown {
  base: number;
  sponge: number;
  fillings: number;
  frosting: number;
  toppings: number;
  tiers: number;
  total: number; // AMD
}

// ─── Catalogue Data ───────────────────────────────────────────────────────────
export const SPONGES: Sponge[] = [
  { id: "vanilla",    label: { hy: "Վանիլ",        en: "Vanilla Bean",    ru: "Ваниль"          }, color: "#F5EDD6", pricePerTier: 0    },
  { id: "chocolate",  label: { hy: "Մուգ Շոկոլադ", en: "Dark Chocolate",  ru: "Тёмный шоколад"  }, color: "#6B3D2E", pricePerTier: 1500 },
  { id: "redvelvet",  label: { hy: "Կարմիր Թավիշ", en: "Red Velvet",      ru: "Красный бархат"  }, color: "#C0392B", pricePerTier: 2000 },
  { id: "matcha",     label: { hy: "Մաչա",          en: "Matcha",          ru: "Матча"            }, color: "#A8C5A0", pricePerTier: 2500 },
  { id: "lemon",      label: { hy: "Կիտրոն",        en: "Lemon Zest",      ru: "Лимон"            }, color: "#F9E87E", pricePerTier: 1500 },
  { id: "strawberry", label: { hy: "Ելակ",          en: "Strawberry",      ru: "Клубника"         }, color: "#E8A0A0", pricePerTier: 2000 },
];

export const FILLINGS: Filling[] = [
  { id: "strawberry_cream",       label: { hy: "Ելակի Կրեմ",        en: "Strawberry Cream",    ru: "Клубничный крем"   }, color: "#F4C2C2", pricePerLayer: 1500 },
  { id: "mango_mousse",           label: { hy: "Մանգոյի Մուս",      en: "Mango Mousse",         ru: "Манговый мусс"     }, color: "#FFD580", pricePerLayer: 2000 },
  { id: "pistachio_cream",        label: { hy: "Ֆիստաշկայի Կրեմ",  en: "Pistachio Cream",      ru: "Фисташковый крем"  }, color: "#C8DBC2", pricePerLayer: 2500 },
  { id: "dark_chocolate_ganache", label: { hy: "Շոկոլադի Գանաշ",   en: "Chocolate Ganache",    ru: "Шоколадный ганаш"  }, color: "#3E1F10", pricePerLayer: 2200 },
  { id: "salted_caramel",         label: { hy: "Աղի Կարամել",       en: "Salted Caramel",       ru: "Солёная карамель"  }, color: "#C88A4C", pricePerLayer: 2000 },
  { id: "vanilla_custard",        label: { hy: "Վանիլի կրեմ",       en: "Vanilla Custard",      ru: "Ванильный крем"    }, color: "#FAF0C8", pricePerLayer: 1200 },
  { id: "berry_compote",          label: { hy: "Հատապտուղ",         en: "Berry Compote",        ru: "Ягодный компот"    }, color: "#C2768A", pricePerLayer: 1800 },
  { id: "lavender_honey",         label: { hy: "Լավանդա Ու Մեղր",  en: "Lavender Honey",       ru: "Лаванда с мёдом"   }, color: "#D6CDE8", pricePerLayer: 3000 },
];

export const FROSTINGS: Frosting[] = [
  { id: "swiss_meringue",    label: { hy: "Շվեյցարական Մերինգ",  en: "Swiss Meringue",      ru: "Швейцарская меренга"        }, color: "#FFFDF9", price: 0    },
  { id: "whipped_cream",     label: { hy: "Հարած Սերուցք",       en: "Whipped Cream",       ru: "Взбитые сливки"             }, color: "#FFF8EE", price: 0    },
  { id: "cream_cheese",      label: { hy: "Կրեմ Չիզ",            en: "Cream Cheese",        ru: "Крем чиз"                   }, color: "#F9F0E1", price: 1200 },
  { id: "mirror_glaze_gold", label: { hy: "Ոսկե Հայելային Գաղ",  en: "Mirror Glaze — Gold", ru: "Зеркальная глазурь — Золото"}, color: "#D4A853", price: 4500 },
  { id: "mirror_glaze_rose", label: { hy: "Վարդ. Հայելային",     en: "Mirror Glaze — Rose", ru: "Зеркальная глазурь — Роза"  }, color: "#EAB8B0", price: 4500 },
  { id: "naked",             label: { hy: "Բաց Բիսկվիտ",         en: "Naked Cake",          ru: "Голый торт"                 }, color: "#F2E4C8", price: 0    },
  { id: "semi_naked",        label: { hy: "Կիսաբաց Բիսկվիտ",     en: "Semi Naked",          ru: "Полуголый торт"             }, color: "#F5EDD6", price: 1200 },
];

export const TOPPINGS: Topping[] = [
  { id: "fresh_berries",    label: { hy: "Թարմ Հատապտուղ",    en: "Fresh Berries",    ru: "Свежие ягоды"       }, emoji: "🍓", price: 3000, position: "top"  },
  { id: "macaron_tower",    label: { hy: "Մակարոնե Աշտ.",     en: "Macaron Tower",    ru: "Башня макарон"      }, emoji: "🎀", price: 5000, position: "top"  },
  { id: "edible_flowers",   label: { hy: "Ուտելի Ծաղիկներ",  en: "Edible Flowers",   ru: "Съедобные цветы"    }, emoji: "🌸", price: 4000, position: "top"  },
  { id: "gold_leaf",        label: { hy: "Ոսկե Թերթ",        en: "Gold Leaf",        ru: "Золотой лист"       }, emoji: "✨", price: 4500, position: "side" },
  { id: "chocolate_drip",   label: { hy: "Շոկ. Կաթիլ",       en: "Chocolate Drip",   ru: "Шоколадный потёк"   }, emoji: "🍫", price: 2500, position: "drip" },
  { id: "caramel_drip",     label: { hy: "Կարամ. Կաթիլ",     en: "Caramel Drip",     ru: "Карамельный потёк"  }, emoji: "🍯", price: 2500, position: "drip" },
  { id: "fondant_roses",    label: { hy: "Ֆոնդան Վարդեր",    en: "Fondant Roses",    ru: "Розы из мастики"    }, emoji: "🌹", price: 5500, position: "top"  },
  { id: "pistachio_dust",   label: { hy: "Ֆիստ. Փոշի",       en: "Pistachio Dust",   ru: "Фисташковая крошка" }, emoji: "💚", price: 2000, position: "side" },
  { id: "custom_lettering", label: { hy: "Ձեր Գրառումը",     en: "Custom Lettering", ru: "Надпись на торте"   }, emoji: "✍️", price: 3500, position: "top"  },
];

// Prices in AMD (Armenian Dram)
export const SIZE_BASE_PRICE: Record<CakeSize, number> = {
  "10cm": 8500,
  "15cm": 14000,
  "20cm": 20000,
  "25cm": 28000,
};

export const SIZE_META: Record<CakeSize, { label: I18nLabel; serves: string; diameter: string }> = {
  "10cm": { label: { hy: "10 սմ", en: "10 cm", ru: "10 см" }, serves: "4–6",   diameter: "10 cm" },
  "15cm": { label: { hy: "15 սմ", en: "15 cm", ru: "15 см" }, serves: "8–12",  diameter: "15 cm" },
  "20cm": { label: { hy: "20 սմ", en: "20 cm", ru: "20 см" }, serves: "14–18", diameter: "20 cm" },
  "25cm": { label: { hy: "25 սմ", en: "25 cm", ru: "25 см" }, serves: "22–28", diameter: "25 cm" },
};

export const TIER_MULTIPLIER: Record<CakeTiers, number> = { 1: 1, 2: 1.8, 3: 2.5 };

// ─── Currency helper ──────────────────────────────────────────────────────────
// Uses a manual formatter (no Intl locale) to produce identical output on
// server and client, avoiding Next.js hydration mismatches.
export function formatAMD(amount: number): string {
  const grouped = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0"); // narrow no-break space
  return `${grouped} ֏`;
}
