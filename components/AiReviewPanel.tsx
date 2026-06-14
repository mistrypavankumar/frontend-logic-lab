"use client";

import { useState } from "react";
import { AiReview } from "@/lib/types";
import CodeBlock from "./CodeBlock";

// "Review the AI's code." The learner reads AI-generated code and commits to a
// call — ship it, or flag it — BEFORE running anything. Then the verdict, the
// real issue, and the review lesson are revealed. (They verify & fix it in the
// editor below.) This trains the core AI-era skill: judging code you didn't write.
const VERDICT_LABEL: Record<string, string> = {
  buggy: "🚩 It has a real bug",
  "works-but-flawed": "⚠️ Works on the happy path, but flawed",
  correct: "✅ It's actually correct",
};

export default function AiReviewPanel({
  review,
  code,
}: {
  review: AiReview;
  code: string;
}) {
  // The learner's call: did they think it should ship?
  const [call, setCall] = useState<"ship" | "flag" | null>(null);
  const shouldShip = review.verdict === "correct";
  const wasRight = call !== null && (call === "ship") === shouldShip;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          🤖 A teammate prompted the AI
        </p>
        <p className="mt-1 italic text-slate-700">“{review.prompt}”</p>
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          The AI produced
        </p>
        <CodeBlock code={code} language="js" />
      </div>

      {call === null ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-800">
            Your call — read it carefully. Would you ship this?
          </p>
          <p className="mb-3 text-xs text-slate-500">
            Decide before you run it. Reviewing AI output is judgment, not a test pass.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCall("ship")}
              className="rounded-lg border border-green-500 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
            >
              ✅ Ship it
            </button>
            <button
              onClick={() => setCall("flag")}
              className="rounded-lg border border-rose-400 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
            >
              🚩 Don&apos;t ship — something&apos;s off
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p
            className={
              "rounded-lg px-3 py-2 text-sm font-semibold " +
              (wasRight ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800")
            }
          >
            {wasRight ? "✅ Good call!" : "🤔 Worth a closer look."}{" "}
            <span className="font-normal">Verdict: {VERDICT_LABEL[review.verdict]}</span>
          </p>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <span className="font-semibold">🔍 The issue: </span>
            {review.issue}
          </div>
          <div className="rounded-lg border border-brand-200 bg-brand-50 p-3 text-sm text-slate-700">
            <span className="font-semibold text-brand-700">🧭 Review lesson: </span>
            {review.reviewLesson}
          </div>
          <p className="text-sm text-slate-500">
            Now run it in the editor below to see it for yourself — then fix it.
          </p>
        </div>
      )}
    </div>
  );
}
