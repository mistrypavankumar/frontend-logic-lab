"use client";

import { useState } from "react";
import { ProgressiveHint } from "@/lib/types";

// Leveled hints that never reveal the answer at once:
// Hint 1 (understand the goal) → … → Hint 5 (almost the solution).
// Calls onReveal each time a new level is opened so the page can record that
// hints were used (feeds the Logic Score).
export default function ProgressiveHints({
  hints,
  onReveal,
}: {
  hints: ProgressiveHint[];
  onReveal?: (level: number) => void;
}) {
  const ordered = [...hints].sort((a, b) => a.level - b.level);
  const [shown, setShown] = useState(0);

  const revealNext = () => {
    const next = shown + 1;
    setShown(next);
    onReveal?.(ordered[next - 1]?.level ?? next);
  };

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <h3 className="mb-2 font-semibold text-amber-800">💡 Progressive hints</h3>

      {shown === 0 ? (
        <p className="text-sm text-amber-700">
          Try on your own first. Each hint nudges a little more — reveal one only
          when you're stuck.
        </p>
      ) : (
        <ol className="space-y-2">
          {ordered.slice(0, shown).map((h) => (
            <li key={h.level} className="rounded-lg bg-white/70 p-3 text-sm">
              <span className="font-semibold text-amber-800">
                Hint {h.level}: {h.label}
              </span>
              <p className="mt-0.5 text-amber-900">{h.text}</p>
            </li>
          ))}
        </ol>
      )}

      {shown < ordered.length && (
        <button
          onClick={revealNext}
          className="mt-3 rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600"
        >
          {shown === 0 ? "Reveal hint 1" : `Reveal hint ${shown + 1} of ${ordered.length}`}
        </button>
      )}
    </div>
  );
}
