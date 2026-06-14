"use client";

import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import { resolvePath } from "@/lib/path";

// The "one next thing to do" card — points at the next incomplete step on the
// Roadmap so a learner never has to wonder where to start or what's next.
export default function ContinuePath() {
  const { isLessonDone, isChallengeDone } = useProgress();
  const { next, doneCount, total } = resolvePath(isLessonDone, isChallengeDone);
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const fresh = doneCount === 0;

  return (
    <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          {fresh ? "🚀 Start here" : "📍 Continue your path"}
        </p>
        <span className="text-xs text-slate-500">{doneCount}/{total} done · {pct}%</span>
      </div>

      {next ? (
        <>
          <h3 className="mt-2 text-xl font-bold text-slate-900">{next.title}</h3>
          {next.why && <p className="mt-1 text-sm text-slate-600">{next.why}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {next.href && (
              <Link
                href={next.href}
                className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                {fresh ? "Begin →" : "Continue →"}
              </Link>
            )}
            <Link href="/path" className="text-sm font-medium text-brand-600 hover:underline">
              See the full roadmap
            </Link>
          </div>
        </>
      ) : (
        <>
          <h3 className="mt-2 text-xl font-bold text-slate-900">🎉 Roadmap complete!</h3>
          <p className="mt-1 text-sm text-slate-600">
            You've finished the guided path. Keep sharp with the Daily Mix and the challenge bank.
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/daily" className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
              Today's Mix →
            </Link>
            <Link href="/path" className="text-sm font-medium text-brand-600 hover:underline">
              Review the roadmap
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
