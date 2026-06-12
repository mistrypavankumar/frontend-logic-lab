"use client";

import { useState } from "react";
import { DebugChallenge } from "@/lib/types";
import CodeBlock from "./CodeBlock";

// "Fix the broken code." Shows broken code + expected vs actual output, lets
// the learner think, then reveals the bug, the fix, and the lesson learned.
export default function DebugChallengePanel({ data }: { data: DebugChallenge }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-rose-500">
          🐞 Broken code
        </p>
        <CodeBlock code={data.brokenCode} language={data.language ?? "js"} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
            Expected output
          </p>
          <code className="mt-1 block font-mono text-green-900">{data.expectedOutput}</code>
        </div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
            Actual output
          </p>
          <code className="mt-1 block font-mono text-rose-900">{data.actualOutput}</code>
        </div>
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Spot the bug? Reveal the fix
        </button>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <span className="font-semibold">🔍 The bug: </span>
            {data.bugExplanation}
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-green-600">
              ✅ Fixed code
            </p>
            <CodeBlock code={data.fixedCode} language={data.language ?? "js"} />
          </div>

          <div className="rounded-lg border border-brand-200 bg-brand-50 p-3 text-sm text-slate-700">
            <span className="font-semibold text-brand-700">💡 Lesson learned: </span>
            {data.lessonLearned}
          </div>
        </div>
      )}
    </div>
  );
}
