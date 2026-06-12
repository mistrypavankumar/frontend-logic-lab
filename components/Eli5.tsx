"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// "Explain Like I'm New" mode — a global toggle (persisted) that surfaces the
// plain-language explanation on every lesson/challenge. Kept independent of the
// progress store so it can wrap the whole app from the root layout.

const KEY = "fll-eli5";

interface Eli5Ctx {
  on: boolean;
  toggle: () => void;
  loaded: boolean;
}

const Ctx = createContext<Eli5Ctx>({ on: false, toggle: () => {}, loaded: false });

export function Eli5Provider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      setOn(window.localStorage.getItem(KEY) === "1");
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  const toggle = useCallback(() => {
    setOn((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return <Ctx.Provider value={{ on, toggle, loaded }}>{children}</Ctx.Provider>;
}

export function useEli5() {
  return useContext(Ctx);
}

// Header toggle button (used in the Navbar).
export function Eli5Toggle() {
  const { on, toggle, loaded } = useEli5();
  return (
    <button
      onClick={toggle}
      aria-pressed={loaded && on}
      title="Explain like I'm new — simpler language everywhere"
      className={
        "rounded-md px-2.5 py-1.5 text-xs font-medium transition " +
        (loaded && on
          ? "bg-emerald-100 text-emerald-700"
          : "border border-slate-300 text-slate-600 hover:bg-slate-100")
      }
    >
      🧒 ELI-new {loaded && on ? "on" : "off"}
    </button>
  );
}

// Renders a beginner-friendly explanation. Always visible when ELI5 is on; when
// off it collapses behind a small inline reveal so the page stays clean.
export function Eli5Block({ text }: { text: string }) {
  const { on, loaded } = useEli5();
  const [open, setOpen] = useState(false);
  const show = (loaded && on) || open;

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
          🧒 Explain like I'm new
        </p>
        {!(loaded && on) && (
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-xs font-medium text-emerald-700 hover:underline"
          >
            {open ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {show && <p className="mt-2 leading-relaxed text-emerald-900">{text}</p>}
    </div>
  );
}
