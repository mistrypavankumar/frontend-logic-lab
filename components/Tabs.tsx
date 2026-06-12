"use client";

import { ReactNode, useState } from "react";

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number; // e.g. a count shown next to the label
  content: ReactNode;
}

/**
 * Self-contained tabbed panel. Callers pass only the tabs that have content
 * (e.g. hide "Internal" when a challenge has no internal implementation), so
 * the tab strip stays honest. Horizontally scrollable on small screens.
 */
export default function Tabs({
  tabs,
  initialId,
}: {
  tabs: TabItem[];
  initialId?: string;
}) {
  const [active, setActive] = useState(initialId ?? tabs[0]?.id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  if (tabs.length === 0) return null;

  return (
    <div>
      <div
        role="tablist"
        className="flex gap-1 overflow-x-auto border-b border-slate-200"
      >
        {tabs.map((t) => {
          const isActive = t.id === current.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(t.id)}
              className={
                "whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition " +
                (isActive
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-slate-500 hover:text-slate-700")
              }
            >
              {t.label}
              {t.badge !== undefined && (
                <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="pt-4">
        {current.content}
      </div>
    </div>
  );
}
