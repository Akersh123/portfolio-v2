import type { Config } from "tailwindcss";

/* Every value points at a CSS variable from src/styles/tokens.css,
   so the design system stays the single source and themes switch for free. */
const v = (name: string) => `var(--${name})`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    screens: { md: "721px", lg: "1280px", xl: "1440px" },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      bg: { DEFAULT: v("bg"), raised: v("bg-raised"), sunken: v("bg-sunken") },
      line: { DEFAULT: v("line"), strong: v("line-strong") },
      fg: { DEFAULT: v("fg"), muted: v("fg-muted"), faint: v("fg-faint") },
      accent: { DEFAULT: v("accent"), fg: v("accent-fg"), on: v("on-accent") },
      focus: v("focus"),
    },
    fontFamily: { sans: v("font-sans"), serif: v("font-serif"), mono: v("font-mono") },
    fontSize: {
      hero: [v("fs-hero"), { lineHeight: "0.86", letterSpacing: "-0.055em" }],
      display: [v("fs-display"), { lineHeight: "0.92", letterSpacing: "-0.045em" }],
      h1: [v("fs-h1"), { lineHeight: "0.98", letterSpacing: "-0.035em" }],
      h2: [v("fs-h2"), { lineHeight: "1.04", letterSpacing: "-0.025em" }],
      statement: [v("fs-statement"), { lineHeight: "1.18", letterSpacing: "-0.02em" }],
      "body-lg": ["20px", { lineHeight: "30px", letterSpacing: "-0.01em" }],
      body: ["16px", { lineHeight: "25px" }],
      "body-sm": ["14px", { lineHeight: "21px" }],
      label: ["12px", { lineHeight: "16px", letterSpacing: "0.06em" }],
      micro: ["11px", { lineHeight: "14px", letterSpacing: "0.04em" }],
    },
    spacing: {
      0: "0px", px: "1px",
      1: v("space-1"), 2: v("space-2"), 3: v("space-3"), 4: v("space-4"), 6: v("space-6"),
      8: v("space-8"), 12: v("space-12"), 16: v("space-16"), 24: v("space-24"), 40: v("space-40"),
      gutter: v("gutter"), section: v("section-y"),
    },
    borderRadius: { none: v("radius-0"), sm: v("radius-sm"), full: v("radius-pill") },
    extend: {
      maxWidth: { content: v("content-max") },
      zIndex: { nav: v("z-nav"), menu: v("z-menu"), cursor: v("z-cursor") },
      boxShadow: { float: v("shadow-float") },
      transitionTimingFunction: { out: "cubic-bezier(0.16, 1, 0.3, 1)", io: "cubic-bezier(0.65, 0, 0.35, 1)" },
      transitionDuration: { fast: "160ms", base: "320ms", slow: "640ms", reveal: "900ms" },
    },
  },
  plugins: [],
} satisfies Config;
