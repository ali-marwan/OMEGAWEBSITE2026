import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        warmwhite: "#F8F6F1",
        sand: "#E8DED0",
        graphite: "#1E1E1E",
        muted: "#5F5A54",
        omega: "#F26A1B",
        line: "#D8CFC2",
      },
      fontFamily: {
        sans: [
          "Satoshi",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "IBM Plex Mono",
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      letterSpacing: {
        tightest: "-0.04em",
        technical: "0.14em",
      },
      fontSize: {
        eyebrow: ["0.72rem", { lineHeight: "1.1", letterSpacing: "0.18em" }],
      },
      maxWidth: {
        page: "1320px",
      },
      boxShadow: {
        dock: "0 20px 60px -20px rgba(30, 30, 30, 0.18), 0 6px 18px -6px rgba(30, 30, 30, 0.12)",
        elev: "0 24px 48px -28px rgba(30, 30, 30, 0.25)",
      },
      backgroundImage: {
        "sand-gradient":
          "linear-gradient(180deg, #F4EFE6 0%, #F6F2EA 55%, #F8F6F1 100%)",
        "grid-faint":
          "linear-gradient(to right, rgba(216,207,194,0.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(216,207,194,0.55) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "88px 88px",
      },
      transitionTimingFunction: {
        elegant: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
