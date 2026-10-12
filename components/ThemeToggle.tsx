"use client";

import { useEffect, useState } from "react";

// Dark / light switch. Dark is the default; the choice is remembered in
// localStorage and applied before first paint by the script in app/layout.tsx.
const KEY = "fll-theme";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  // Read the real state after mount (the server can't know the saved choice).
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      window.localStorage.setItem(KEY, next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-md border border-slate-200 px-2 py-1 text-sm hover:bg-slate-100"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
