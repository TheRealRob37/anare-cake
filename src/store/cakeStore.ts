import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  CakeConfig,
  CakeTiers,
  CakeSize,
  CakeShape,
  SpongeId,
  FillingId,
  FrostingId,
  ToppingId,
  PriceBreakdown,
  InternalLayer,
  MessageFontId,
  SPONGES,
  FILLINGS,
  FROSTINGS,
  TOPPINGS,
  SIZE_BASE_PRICE,
  TIER_MULTIPLIER,
} from "@/types/cake";

// ─── Default Config ───────────────────────────────────────────────────────────
const DEFAULT_CONFIG: CakeConfig = {
  size: "15cm",
  tiers: 1,
  shape: "round",
  sponge: "vanilla",
  fillings: ["strawberry_cream"],
  frosting: "swiss_meringue",
  toppings: [],
  dedicationMessage: "",
  messageFont: "dancing_script" as MessageFontId,
  servingDate: "",
  showCutView: false,
  selectedTier: 0,
  isRotating: true,
};

// ─── Standard Cake Configs ────────────────────────────────────────────────────
const STANDARD_CAKES: Record<number, Partial<CakeConfig>> = {
  1: { sponge: "vanilla", fillings: ["berry_compote"], frosting: "swiss_meringue", toppings: ["fresh_berries"] }, // rose lychee
  2: { sponge: "vanilla", fillings: ["pistachio_cream"], frosting: "cream_cheese", toppings: ["gold_leaf"] }, // pistachio
  3: { sponge: "chocolate", fillings: ["salted_caramel"], frosting: "mirror_glaze_gold", toppings: ["chocolate_drip"] }, // dark velvet
  4: { sponge: "matcha", fillings: ["berry_compote"], frosting: "cream_cheese", toppings: ["edible_flowers"] }, // matcha sakura
};

// ─── Price Calculator ─────────────────────────────────────────────────────────
function calculatePrice(config: CakeConfig): PriceBreakdown {
  const base = SIZE_BASE_PRICE[config.size];

  const spongeData = SPONGES.find((s) => s.id === config.sponge);
  const sponge = (spongeData?.pricePerTier ?? 0) * config.tiers;

  const fillings = config.fillings.reduce((sum, id) => {
    const f = FILLINGS.find((x) => x.id === id);
    return sum + (f?.pricePerLayer ?? 0) * config.tiers;
  }, 0);

  const frostingData = FROSTINGS.find((f) => f.id === config.frosting);
  const frosting = frostingData?.price ?? 0;

  const toppings = config.toppings.reduce((sum, id) => {
    const t = TOPPINGS.find((x) => x.id === id);
    return sum + (t?.price ?? 0);
  }, 0);

  const tierMultiplier = TIER_MULTIPLIER[config.tiers];
  const tiers = base * (tierMultiplier - 1); // extra cost for additional tiers

  const total = Math.round((base + sponge + fillings + frosting + toppings + tiers) * 100) / 100;

  return { base, sponge, fillings, frosting, toppings, tiers, total };
}

// ─── Store Interface ──────────────────────────────────────────────────────────
interface CakeStore {
  config: CakeConfig;
  price: PriceBreakdown;

  // Structure
  setSize: (size: CakeSize) => void;
  setTiers: (tiers: CakeTiers) => void;
  setShape: (shape: CakeShape) => void;

  // Flavors
  setSponge: (sponge: SpongeId) => void;
  toggleFilling: (id: FillingId) => void;
  setFrosting: (frosting: FrostingId) => void;

  // Toppings
  toggleTopping: (id: ToppingId) => void;

  // Personalization
  setDedicationMessage: (msg: string) => void;
  setMessageFont: (font: MessageFontId) => void;
  setServingDate: (date: string) => void;

  // View
  toggleCutView: () => void;
  setSelectedTier: (tier: number) => void;
  toggleRotation: () => void;

  // Standard Cakes
  setStandardCake: (id: number) => void;

  // Reset
  resetConfig: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useCakeStore = create<CakeStore>()(
  subscribeWithSelector((set, get) => {
    const update = (partial: Partial<CakeConfig>) => {
      const next = { ...get().config, ...partial };
      set({ config: next, price: calculatePrice(next) });
    };

    return {
      config: DEFAULT_CONFIG,
      price: calculatePrice(DEFAULT_CONFIG),

      // ── Structure ──────────────────────────────────────────────
      setSize:  (size)  => update({ size }),
      setTiers: (tiers) => update({ tiers }),
      setShape: (shape) => update({ shape }),

      // ── Flavors ────────────────────────────────────────────────
      setSponge:   (sponge)   => update({ sponge }),
      setFrosting: (frosting) => update({ frosting }),

      toggleFilling: (id) => {
        const current = get().config.fillings;
        const next = current.includes(id)
          ? current.filter((f) => f !== id)
          : current.length < 3
          ? [...current, id]
          : current; // max 3 fillings
        update({ fillings: next });
      },

      // ── Toppings ───────────────────────────────────────────────
      toggleTopping: (id) => {
        const current = get().config.toppings;
        const next = current.includes(id)
          ? current.filter((t) => t !== id)
          : [...current, id];
        update({ toppings: next });
      },

      // ── Personalization ────────────────────────────────────────
      setDedicationMessage: (dedicationMessage) => update({ dedicationMessage }),
      setMessageFont:       (messageFont: MessageFontId) => update({ messageFont }),
      setServingDate:       (servingDate)       => update({ servingDate }),

      // ── View ───────────────────────────────────────────────────
      toggleCutView:    () => update({ showCutView: !get().config.showCutView }),
      setSelectedTier:  (selectedTier) => update({ selectedTier }),
      toggleRotation:   () => update({ isRotating: !get().config.isRotating }),

      // ── Standard Cakes ─────────────────────────────────────────
      setStandardCake: (id) => {
        const std = STANDARD_CAKES[id];
        if (std) update(std);
      },

      // ── Reset ──────────────────────────────────────────────────
      resetConfig: () => set({ config: DEFAULT_CONFIG, price: calculatePrice(DEFAULT_CONFIG) }),
    };
  })
);

// ─── Derived selectors ────────────────────────────────────────────────────────
export const selectInternalLayers = (config: CakeConfig): InternalLayer[] => {
  const spongeData  = SPONGES.find((s) => s.id === config.sponge)!;
  const frostingData = FROSTINGS.find((f) => f.id === config.frosting)!;

  const layers = [];
  const fillingsData = config.fillings.map((id) => FILLINGS.find((f) => f.id === id)!);

  // Build cross-section from bottom to top
  layers.push({ type: "sponge" as const,   color: spongeData.color,   label: spongeData.label.en,   heightPx: 40 });
  fillingsData.forEach((f) => {
    if (f) {
      layers.push({ type: "filling" as const,  color: f.color,            label: f.label.en,            heightPx: 24 });
      layers.push({ type: "sponge"  as const,  color: spongeData.color,   label: spongeData.label.en,   heightPx: 40 });
    }
  });
  layers.push({ type: "frosting" as const, color: frostingData.color, label: frostingData.label.en, heightPx: 16 });

  return layers;
};
