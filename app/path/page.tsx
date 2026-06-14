"use client";

import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import ContinuePath from "@/components/ContinuePath";
import { useProgress } from "@/lib/useProgress";
import { resolvePath, ResolvedStep } from "@/lib/path";

export default function RoadmapPage() {
  const { isLessonDone, isChallengeDone, loaded } = useProgress();
  const { stages, doneCount, total } = resolvePath(isLessonDone, isChallengeDone);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">🗺️ Your Roadmap</h1>
        <p className="mt-2 text-slate-600">
          One guided path from the basics to interview-ready. Do the highlighted step next —
          concepts and hands-on practice are woven together so each idea is learned then used.
        </p>
      </header>

      <div className="mb-6 max-w-md">
        <ProgressBar value={loaded ? doneCount : 0} total={total} label="Roadmap progress" />
      </div>

      <div className="mb-10">
        <ContinuePath />
      </div>

      <div className="space-y-8">
        {stages.map((stage) => (
          <section key={stage.slug} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                <span aria-hidden>{stage.icon}</span>
                {stage.title}
              </h2>
              <span className="shrink-0 text-xs text-slate-400">
                {stage.doneCount}/{stage.total}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{stage.goal}</p>

            <ol className="mt-4 space-y-2">
              {stage.steps.map((step) => (
                <StepRow key={step.key} step={step} />
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

function StepRow({ step }: { step: ResolvedStep }) {
  if (step.kind === "milestone") {
    return (
      <li className="flex gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
        <span aria-hidden>🚩</span>
        <span>{step.title}</span>
      </li>
    );
  }

  const mark =
    step.status === "done" ? "✅" : step.status === "current" ? "▶️" : "⬜";
  const rowCls =
    "flex items-start gap-3 rounded-lg border px-3 py-2.5 text-sm transition " +
    (step.status === "current"
      ? "border-brand-300 bg-brand-50"
      : "border-slate-200 hover:bg-slate-50");

  const inner = (
    <>
      <span aria-hidden className="mt-0.5">{mark}</span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span
            className={
              "font-medium " +
              (step.status === "done" ? "text-slate-400 line-through" : "text-slate-800")
            }
          >
            {step.title}
          </span>
          {step.badge && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
              {step.badge}
            </span>
          )}
          {step.status === "current" && (
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">
              Next
            </span>
          )}
        </span>
        {step.why && <span className="mt-0.5 block text-xs text-slate-500">{step.why}</span>}
      </span>
    </>
  );

  return (
    <li>
      {step.href ? (
        <Link href={step.href} className={rowCls}>
          {inner}
        </Link>
      ) : (
        <div className={rowCls}>{inner}</div>
      )}
    </li>
  );
}
