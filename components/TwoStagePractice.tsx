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
      sub: `Same tests — but write it yourself the manual way, WITHOUT ${mustUse.join(" / ")}…).`,
    },
  ];

  const [active, setActive] = useState<"builtin" | "manual">("builtin");
  // Jump to the manual stage the moment the built-in one passes.
  useEffect(() => {
    if (builtInPassed) setActive("manual");
  }, [builtInPassed]);
  const current = stages.find((s) => s.key === active) ?? stages[0];

  // Stage tabs above one LeetCode-style workspace. Both workspaces stay mounted
  // (only the active one is shown) so switching tabs keeps each stage's results.
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-10 shrink-0 items-center gap-1 border-b border-slate-200 bg-slate-50 px-2">
        {stages.map((st) => (
          <button
            key={st.key}
            onClick={() => st.unlocked && setActive(st.key as "builtin" | "manual")}
            disabled={!st.unlocked}
            title={st.unlocked ? undefined : "Pass the built-in step first"}
            className={
              "flex items-center gap-2 rounded-md px-3 py-1 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 " +
              (st.key === active
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:bg-slate-200/60")
            }
          >
            <span
              className={
                "flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold " +
                (st.done ? "bg-green-600 text-white" : "bg-slate-200 text-slate-600")
              }
            >
              {st.done ? "✓" : st.unlocked ? st.n : "🔒"}
            </span>
            {st.key === "builtin" ? "Built-in" : "By hand"}
          </button>
        ))}
        {builtInPassed && manualPassed && (
          <span className="ml-auto rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">
            🎉 Both done — lesson complete!
          </span>
        )}
      </div>
      <p className="shrink-0 border-b border-slate-200 px-3 py-2 text-xs text-slate-600">
        <span className="font-semibold text-slate-800">Step {current.n}: {current.title}.</span>{" "}
        {current.sub}
        {active === "builtin" && builtInIntro ? ` ${builtInIntro}` : ""}
      </p>

      <div className={active === "builtin" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
        <ChallengeWorkspace
          key={`${lessonId}:builtin`}
          persistKey={`lesson:${lessonId}:builtin`}
          starterCode={builtInStarter}
          tests={builtInTests}
          requireUse={mustUse}
          onResult={setBuiltInPassed}
        />
      </div>
      {stages[1].unlocked && (
        <div className={active === "manual" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
          <ChallengeWorkspace
            key={`${lessonId}:manual`}
            persistKey={`lesson:${lessonId}:manual`}
            starterCode={manualStarter}
            tests={manualTests}
            forbidUse={mustUse}
            onResult={setManualPassed}
          />
        </div>
      )}
    </div>
  );
}
