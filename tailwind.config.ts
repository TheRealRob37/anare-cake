import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Anare Cake Design System ───────────────────────────────
      colors: {
        // Backgrounds
        cream: {
          50:  "#FFFDF9",
          100: "#FFF8EE",
          200: "#F9F0E1",
          300: "#F2E4C8",
        },
        // Signature gold
        gold: {
          100: "#F5E6C8",
          200: "#E8CB8A",
          300: "#D4A853",
          400: "#B8862A",
          500: "#9A6F1E",
        },
        // Warm rose / blush
        blush: {
          100: "#FAF0EE",
          200: "#F5D9D3",
          300: "#EAB8B0",
          400: "#D98F84",
        },
        // Pastels for layer chips
        pistachio: "#C8DBC2",
        lavender:  "#D6CDE8",
        caramel:   "#E8C89A",
        chocolate: "#6B3D2E",
        vanilla:   "#F5EDD6",
        berry:     "#C2768A",
        matcha:    "#A8C5A0",
        // Text
        ink: {
          900: "#1A1410",
          700: "#3D2E26",
          500: "#7A6458",
          300: "#B5A89E",
        },
      },

      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body:    ["Inter", "system-ui", "sans-serif"],
      },

      fontSize: {
        "display-xl": ["4.5rem",  { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["3.5rem",  { lineHeight: "1.1",  letterSpacing: "-0.02em" }],
        "display-md": ["2.5rem",  { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        "display-sm": ["1.75rem", { lineHeight: "1.2",  letterSpacing: "-0.01em" }],
      },

      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      boxShadow: {
        "soft":   "0 2px 20px 0 rgba(180,140,80,0.08)",
        "glow":   "0 0 40px 0 rgba(212,168,83,0.20)",
        "card":   "0 4px 32px 0 rgba(90,60,30,0.10)",
        "inset-gold": "inset 0 1px 0 rgba(212,168,83,0.30)",
      },

      backgroundImage: {
        "grain":         "url('/noise.svg')",
        "gold-gradient": "linear-gradient(135deg, #E8CB8A 0%, #D4A853 50%, #B8862A 100%)",
        "cream-gradient":"linear-gradient(180deg, #FFFDF9 0%, #F9F0E1 100%)",
        "hero-gradient": "radial-gradient(ellipse 80% 60% at 50% 0%, #F9F0E1 0%, #FFFDF9 100%)",
      },

      animation: {
        "float":      "float 6s ease-in-out infinite",
        "shimmer":    "shimmer 2.5s linear infinite",
        "fade-up":    "fadeUp 0.6s ease-out forwards",
        "scale-in":   "scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "cake-spin":  "spin 20s linear infinite",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0"  },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)"    },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.85)" },
          "100%": { opacity: "1", transform: "scale(1)"    },
        },
      },
    },
  },
  plugins: [],
};

export default config;
