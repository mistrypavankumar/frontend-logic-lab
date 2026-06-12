"use client";

import { useState } from "react";
import { ConceptVisualization } from "@/lib/types";

// A step-through visual model for execution-order concepts. Each frame is a
// snapshot of labeled "lanes" (Call stack / Microtasks / Console …) plus an
// optional highlighted code line. The learner steps Next/Prev and watches the
// machine's state change — far clearer than prose for the event loop etc.
export default function ConceptVisualizer({
  data,
}: {
  data: ConceptVisualization;
}) {
  const [i, setI] = useState(0);
  const frame = data.frames[i];
  const codeLines = data.code ? data.code.split("\n") : [];
  const atEnd = i >= data.frames.length - 1;

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Code with the active line highlighted */}
      {codeLines.length > 0 && (
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-sm leading-relaxed">
          {codeLines.map((ln, idx) => {
            const active = frame.line === idx + 1;
            return (
              <div
                key={idx}
                className={
                  "flex gap-3 rounded px-2 " +
                  (active ? "bg-brand-500/25" : "")
                }
              >
                <span className="select-none text-slate-600">{idx + 1}</span>
                <span className={active ? "text-white" : "text-slate-300"}>
                  {ln || " "}
                </span>
              </div>
            );
          })}
        </pre>
      )}

      {/* Lanes — current state of each queue/stack/output */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${data.lanes.length}, minmax(0, 1fr))` }}
      >
        {data.lanes.map((label) => {
          const items = frame.lanes?.[label] ?? [];
          return (
            <div key={label} className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-2">
              <p className="mb-1 truncate text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
              </p>
              <div className="space-y-1">
                {items.length === 0 ? (
                  <p className="text-xs italic text-slate-400">empty</p>
                ) : (
                  items.map((it, k) => (
                    <div
                      key={k}
                      className="truncate rounded bg-white px-2 py-1 font-mono text-xs text-slate-700 shadow-sm"
                      title={it}
                    >
                      {it}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* What's happening this step */}
      <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-slate-700">
        <span className="font-semibold text-brand-700">Step {i + 1}: </span>
        {frame.note}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setI((n) => Math.max(0, n - 1))}
          disabled={i === 0}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40"
        >
          ← Prev
        </button>
        <button
          onClick={() => setI((n) => (atEnd ? 0 : n + 1))}
          className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {atEnd ? "↺ Restart" : "Next step →"}
        </button>
        <span className="ml-auto text-xs text-slate-400">
          {i + 1} / {data.frames.length}
        </span>
      </div>
    </div>
  );
}
