import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Anare Cake Design System — Pistachio · Dirty Rose · Silver ───
      colors: {
        // Backgrounds — light pistachio-silver tint (replaces cream)
        cream: {
          50:  "#F5F7F4",
          100: "#ECF0EA",
          200: "#DCE4D8",
          300: "#C4D2BE",
        },
        // Primary accent — pistachio green (replaces gold)
        gold: {
          100: "#D8EAD0",
          200: "#AECFA4",
          300: "#7DB572",
          400: "#559049",
          500: "#3A6B30",
        },
        // Secondary accent — dirty rose (replaces blush)
        blush: {
          100: "#F2E8E5",
          200: "#E0C4BB",
          300: "#C89888",
          400: "#A86A5A",
        },
        // Neutral silver
        silver: {
          50:  "#F8F9FA",
          100: "#EEF0F3",
          200: "#D4D9E0",
          300: "#A8B2BC",
          400: "#6E8090",
        },
        // Pastels for layer chips (keep pistachio, update rest to match)
        pistachio: "#AECFA4",
        lavender:  "#C8C4DC",
        caramel:   "#D8C0A0",
        chocolate: "#5A3828",
        vanilla:   "#EEE8D0",
        berry:     "#B87888",
        matcha:    "#90B888",
        // Text — slightly cooler
        ink: {
          900: "#181C16",
          700: "#2C3828",
          500: "#586050",
          300: "#98A090",
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
        "soft":       "0 2px 20px 0 rgba(80,140,70,0.08)",
        "glow":       "0 0 40px 0 rgba(125,181,114,0.22)",
        "card":       "0 4px 32px 0 rgba(40,80,30,0.10)",
        "inset-gold": "inset 0 1px 0 rgba(125,181,114,0.30)",
      },

      backgroundImage: {
        "grain":          "url('/noise.svg')",
        "gold-gradient":  "linear-gradient(135deg, #AECFA4 0%, #7DB572 50%, #559049 100%)",
        "cream-gradient": "linear-gradient(180deg, #F5F7F4 0%, #DCE4D8 100%)",
        "hero-gradient":  "radial-gradient(ellipse 80% 60% at 50% 0%, #DCE4D8 0%, #F5F7F4 100%)",
      },

      animation: {
        "float":     "float 6s ease-in-out infinite",
        "shimmer":   "shimmer 2.5s linear infinite",
        "fade-up":   "fadeUp 0.6s ease-out forwards",
        "scale-in":  "scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "cake-spin": "spin 20s linear infinite",
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
