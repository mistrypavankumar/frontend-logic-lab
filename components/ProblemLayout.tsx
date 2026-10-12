"use client";

import { ReactNode, useState } from "react";
import { useSplit } from "@/lib/useSplit";

// LeetCode-style problem layout. On desktop it fills the screen under the
// navbar (no page scroll): a tabbed reading panel on the left and a workspace
// panel on the right, separated by a draggable divider. Each panel scrolls on
// its own. On small screens the panels simply stack.
//
// globals.css hides the footer and page scrollbar on desktop whenever a
// [data-ide-layout] element is on the page.

export interface PanelTab {
  key: string;
  label: ReactNode;
  content: ReactNode;
}

export default function ProblemLayout({
  tabs,
  tab,
  onTabChange,
  right,
  topBar,
}: {
  tabs: PanelTab[];
  /** Controlled active tab (optional — uncontrolled by default). */
  tab?: string;
  onTabChange?: (key: string) => void;
  /** The right panel (editor + console). Omit for a single full-width panel. */
  right?: ReactNode;
  /** Optional slim bar above both panels (navigation, filters, timer…). */
  topBar?: ReactNode;
}) {
  const [ownTab, setOwnTab] = useState(tabs[0]?.key);
  const active = tab ?? ownTab;
  const current = tabs.find((t) => t.key === active) ?? tabs[0];
  const select = (key: string) => {
    setOwnTab(key);
    onTabChange?.(key);
  };

  const split = useSplit("fll-split-x", 45, 25, 75, "x");

  return (
    <div data-ide-layout className="flex flex-col bg-slate-100 lg:h-[calc(100vh-57px)]">
      {topBar && (
        <div className="shrink-0 border-b border-slate-200 bg-white px-3 py-2">{topBar}</div>
      )}

      <div
        ref={split.ref}
        className="flex min-h-0 flex-1 flex-col gap-2 p-2 lg:flex-row lg:gap-0"
        style={{ ["--left" as string]: `${split.pct}%` }}
      >
        {/* Left: tabbed reading panel */}
        <section
          className={
            "flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white " +
            (right ? "lg:shrink-0 lg:basis-[var(--left)]" : "lg:flex-1")
          }
        >
          <nav
            role="tablist"
            className="flex h-10 shrink-0 items-center gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50 px-2"
          >
            {tabs.map((t) => {
              const on = t.key === current?.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => select(t.key)}
                  className={
                    "shrink-0 whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition " +
                    (on
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-500 hover:bg-slate-200/60 hover:text-slate-700")
                  }
                >
                  {t.label}
                </button>
              );
            })}
          </nav>
          {/* Keyed by tab so each tab opens scrolled to the top. */}
          <div key={current?.key} role="tabpanel" className="min-h-0 flex-1 p-5 lg:overflow-y-auto">
            {current?.content}
          </div>
        </section>

        {right && (
          <>
            {/* Draggable divider */}
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize panels"
              aria-valuenow={Math.round(split.pct)}
              aria-valuemin={split.min}
              aria-valuemax={split.max}
              tabIndex={0}
              onPointerDown={split.onPointerDown}
              onKeyDown={split.onKeyDown}
              className="group hidden w-2 shrink-0 cursor-col-resize items-center justify-center outline-none lg:flex"
            >
              <span className="h-10 w-1 rounded-full bg-slate-300 transition group-hover:bg-brand-500 group-focus-visible:bg-brand-500" />
            </div>

            {/* Right: workspace panel */}
            <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
              {right}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
