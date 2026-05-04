import { type Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{astro,md,mdx,jsx,tsx,html}",
    "./src/content/docs/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "Segoe UI", "Helvetica Neue", "sans-serif"],
      },
      colors: {
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5f5",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        sky: {
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
        },
      },
      boxShadow: {
        "nav-glass": "0 20px 45px -25px rgba(8, 12, 29, 0.6)",
      },
      backdropBlur: {
        18: "18px",
        26: "26px",
      },
    },
  },
} satisfies Config;
