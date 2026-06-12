"use client";

import { useEffect, useState } from "react";

// Self-explanation prompt — one of the most evidence-backed learning moves.
// The learner writes WHY their code works in their own words before peeking at
// the solution. Saved per challenge (persisted) and shown back in Review.
export default function SelfExplain({
  value,
  onSave,
}: {
  value: string;
  onSave: (text: string) => void;
}) {
  const [text, setText] = useState(value);
  const [saved, setSaved] = useState(false);

  // Keep local text in sync if the stored value loads/changes underneath us.
  useEffect(() => setText(value), [value]);

  const save = () => {
    onSave(text.trim());
    if (text.trim()) {
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 1500);
      return () => clearTimeout(t);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <label htmlFor="self-explain" className="text-sm font-semibold text-slate-800">
        ✍️ Explain it in your own words
      </label>
      <p className="mb-2 text-xs text-slate-500">
        Before you peek: in one or two sentences, why does your solution work?
        Putting it into words is where the understanding sticks.
      </p>
      <textarea
        id="self-explain"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={save}
        rows={3}
        placeholder="e.g. filter keeps each item where the test is true, and returns a new array so the original is untouched…"
        className="w-full resize-y rounded-lg border border-slate-300 p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={save}
          className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          Save note
        </button>
        {saved && <span className="text-xs text-green-600">Saved ✓</span>}
      </div>
    </div>
  );
}
