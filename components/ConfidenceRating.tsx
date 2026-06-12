"use client";

import { useState } from "react";

// Shown right after a challenge passes. The learner rates how confident they
// feel — which tunes the spaced-repetition schedule (low confidence → sooner
// review, high → later). Once rated it collapses to a compact confirmation.
const FACES = ["😣", "😕", "🙂", "😀", "😎"];
const LABELS = ["Guessed it", "Shaky", "OK", "Confident", "Nailed it"];

export default function ConfidenceRating({
  onRate,
}: {
  onRate: (confidence: number) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);

  const choose = (c: number) => {
    setPicked(c);
    onRate(c);
  };

  if (picked != null) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
        {FACES[picked - 1]} Logged — we&apos;ll bring this back for review at the
        right time. <span className="text-green-600">({LABELS[picked - 1]})</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold text-slate-800">
        🎉 Solved! How confident did that feel?
      </p>
      <p className="mb-3 text-xs text-slate-500">
        Honest answers schedule your reviews better — low confidence comes back sooner.
      </p>
      <div className="flex flex-wrap gap-2">
        {FACES.map((face, i) => {
          const c = i + 1;
          return (
            <button
              key={c}
              onClick={() => choose(c)}
              title={LABELS[i]}
              className="flex flex-col items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm transition hover:border-brand-300 hover:bg-brand-50"
            >
              <span className="text-xl">{face}</span>
              <span className="text-[11px] text-slate-500">{LABELS[i]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
