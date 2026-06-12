"use client";

import { useState } from "react";
import { DryRunStep } from "@/lib/types";

// Walks the learner through execution one step at a time (each iteration,
// condition check, variable update, final result). Step-through by default so
// they predict the next step; "Show all" reveals the full trace.
export default function DryRun({ steps }: { steps: DryRunStep[] }) {
  const [shown, setShown] = useState(1);
  const all = shown >= steps.length;

  return (
    <div className="space-y-3">
      <ol className="space-y-2">
        {steps.slice(0, shown).map((s, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {i + 1}
            </span>
            <div className="min-w-0">
              {s.label && (
                <p className="font-semibold text-slate-800">{s.label}</p>
              )}
              {s.code && (
                <code className="mt-0.5 block overflow-x-auto rounded bg-slate-900 px-2 py-1 font-mono text-xs text-slate-100">
                  {s.code}
                </code>
              )}
              <p className="mt-1 text-slate-600">{s.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex gap-2">
        {!all && (
          <button
            onClick={() => setShown((n) => n + 1)}
            className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            Next step →
          </button>
        )}
        <button
          onClick={() => setShown(all ? 1 : steps.length)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          {all ? "Restart" : "Show all steps"}
        </button>
        <span className="ml-auto self-center text-xs text-slate-400">
          {Math.min(shown, steps.length)} / {steps.length}
        </span>
      </div>
    </div>
  );
}
