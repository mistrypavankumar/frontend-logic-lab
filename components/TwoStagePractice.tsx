"use client";

import { useEffect, useState } from "react";
import { TestCase } from "@/lib/types";
import ChallengeWorkspace from "./ChallengeWorkspace";

// Two-stage practice for method lessons: solve the SAME task first WITH the
// built-in method, then again BY HAND. The lesson only counts as complete once
// BOTH stages pass. A small approach-guard (requireUse / forbidUse) makes sure
// stage 1 actually uses the built-in and stage 2 doesn't.
export default function TwoStagePractice({
  lessonId,
  builtInStarter,
  builtInTests,
  builtInIntro,
  manualStarter,
  manualTests,
  mustUse,
  onComplete,
}: {
  lessonId: string;
  builtInStarter: string;
  builtInTests?: TestCase[];
  builtInIntro?: string;
  manualStarter: string;
  manualTests?: TestCase[];
  /** Tokens required in stage 1 and forbidden in stage 2 (e.g. [".filter("]). */
  mustUse: string[];
  /** Called once, when BOTH stages have passed. */
  onComplete?: () => void;
}) {
  const [builtInPassed, setBuiltInPassed] = useState(false);
  const [manualPassed, setManualPassed] = useState(false);

  useEffect(() => {
    if (builtInPassed && manualPassed) onComplete?.();
    // onComplete is idempotent (guards on already-complete); deps kept minimal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builtInPassed, manualPassed]);

  const stages = [
    {
      key: "builtin",
      done: builtInPassed,
      unlocked: true,
      n: 1,
      title: "Solve it with the built-in method",
      sub: `Use the built-in so you know exactly what it does (your code must call ${mustUse.join(" / ")}…).`,
    },
    {
      key: "manual",
      done: manualPassed,
      unlocked: builtInPassed,
      n: 2,
      title: "Now solve it by hand",
      sub: `Same tests — but write the logic yourself with a loop, WITHOUT ${mustUse.join(" / ")}…).`,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Progress strip */}
      <div className="flex items-center gap-3 text-sm">
        {stages.map((s, i) => (
          <div key={s.key} className="flex items-center gap-3">
            <span
              className={
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold " +
                (s.done
                  ? "bg-green-600 text-white"
                  : "bg-slate-200 text-slate-600")
              }
            >
              {s.done ? "✓" : s.n}
            </span>
            <span className={s.done ? "font-medium text-green-700" : "text-slate-600"}>
              {s.key === "builtin" ? "Built-in" : "Manual"}
            </span>
            {i === 0 && <span className="text-slate-300">→</span>}
          </div>
        ))}
        {builtInPassed && manualPassed && (
          <span className="ml-auto rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
            🎉 Both done — lesson complete!
          </span>
        )}
      </div>

      {/* Stage 1 — built-in */}
      <StageCard stage={stages[0]}>
        {builtInIntro && (
          <p className="mb-2 text-sm text-slate-500">{builtInIntro}</p>
        )}
        <ChallengeWorkspace
          key={`${lessonId}:builtin`}
          persistKey={`lesson:${lessonId}:builtin`}
          starterCode={builtInStarter}
          tests={builtInTests}
          requireUse={mustUse}
          onResult={setBuiltInPassed}
        />
      </StageCard>

      {/* Stage 2 — manual (revealed after stage 1) */}
      <StageCard stage={stages[1]}>
        {stages[1].unlocked ? (
          <ChallengeWorkspace
            key={`${lessonId}:manual`}
            persistKey={`lesson:${lessonId}:manual`}
            starterCode={manualStarter}
            tests={manualTests}
            forbidUse={mustUse}
            onResult={setManualPassed}
          />
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            🔒 Pass the built-in step first — then write it by hand here.
          </p>
        )}
      </StageCard>
    </div>
  );
}

function StageCard({
  stage,
  children,
}: {
  stage: { n: number; title: string; sub: string; done: boolean };
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "rounded-xl border p-4 " +
        (stage.done ? "border-green-200 bg-green-50/40" : "border-slate-200 bg-white")
      }
    >
      <div className="mb-3 flex items-start gap-3">
        <span
          className={
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold " +
            (stage.done ? "bg-green-600 text-white" : "bg-brand-600 text-white")
          }
        >
          {stage.done ? "✓" : stage.n}
        </span>
        <div>
          <h3 className="font-semibold text-slate-900">
            Step {stage.n}: {stage.title}
          </h3>
          <p className="text-sm text-slate-500">{stage.sub}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
