import type { Config } from "tailwindcss";

// Every palette the app uses reads from an "R G B" CSS variable defined in
// app/globals.css, so the light/dark theme is swapped there, not per class.
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const PALETTES = [
  "slate", "brand", "green", "amber", "rose", "emerald", "violet", "sky",
  "purple", "indigo", "orange", "blue", "yellow", "teal", "cyan", "red",
];
const themed = Object.fromEntries(
  PALETTES.map((name) => [
    name,
    Object.fromEntries(
      SHADES.map((s) => [s, `rgb(var(--c-${name}-${s}) / <alpha-value>)`])
    ),
  ])
);

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...themed,
        white: "rgb(var(--c-white) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
