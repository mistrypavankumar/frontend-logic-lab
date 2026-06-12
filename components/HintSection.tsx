"use client";

import { useState } from "react";

// Reveal hints one at a time so learners try before they peek.
export default function HintSection({ hints }: { hints: string[] }) {
  const [shown, setShown] = useState(0);

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <h3 className="mb-2 font-semibold text-amber-800">💡 Hints</h3>

      {shown === 0 ? (
        <p className="text-sm text-amber-700">
          Stuck? Try on your own first. Reveal a hint only when you need it.
        </p>
      ) : (
        <ol className="ml-5 list-decimal space-y-1 text-sm text-amber-900">
          {hints.slice(0, shown).map((hint, i) => (
            <li key={i}>{hint}</li>
          ))}
        </ol>
      )}

      {shown < hints.length && (
        <button
          onClick={() => setShown((s) => s + 1)}
          className="mt-3 rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600"
        >
          {shown === 0 ? "Show a hint" : "Show next hint"}
        </button>
      )}
    </div>
  );
}
