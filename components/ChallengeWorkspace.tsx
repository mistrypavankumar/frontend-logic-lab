"use client";

import { useEffect, useState } from "react";
import { TestCase } from "@/lib/types";
import { runChallenge, RunResult } from "@/lib/runner";
import CodeEditor from "./CodeEditor";
import LiveTrace from "./LiveTrace";

// Targeted nudge for a failing test, by its kind — turns a red X into a hint.
const KIND_HINT: Record<string, string> = {
  empty: "Empty-input case failed — what should an empty input return (e.g. [] or 0), instead of crashing?",
  mutation: "Mutation check failed — you're changing the input. Return a NEW value (copy first) instead.",
  nullish: "Null/undefined case failed — guard against missing values before using them.",
  invalid: "Invalid-input case failed — handle unexpected input instead of assuming it's well-formed.",
  duplicate: "Duplicates case failed — make sure repeated values are handled correctly.",
  large: "Large-input case failed — check for an off-by-one or an O(n²) step that breaks at scale.",
  performance: "Performance case failed — your approach is likely too slow; aim for a lower complexity.",
};

const codeKey = (k: string) => `fll-code:${k}`;

// The interactive code box used by both challenges and lessons.
// - With tests: runs the learner's code and grades each case.
// - Runnable without tests ("console mode"): runs JS and shows console output.
// - Not runnable (HTML/CSS/React): editable, with a friendly hint instead.
export default function ChallengeWorkspace({
  starterCode,
  tests,
  runnable: runnableProp,
  notRunnableHint = "This is a React component — build & run it in your own project.",
  onAllPassed,
  onResult,
  persistKey,
  requireUse,
  forbidUse,
}: {
  starterCode: string;
  tests?: TestCase[];
  runnable?: boolean;
  notRunnableHint?: string;
  onAllPassed?: () => void;
  /** Fired after every graded run with whether all tests passed (guard included). */
  onResult?: (allPassed: boolean) => void;
  /** If set, the in-progress code is autosaved/restored under this key. */
  persistKey?: string;
  /** Code MUST contain every one of these substrings (e.g. [".filter("]). */
  requireUse?: string[];
  /** Code must contain NONE of these substrings (forces a by-hand solution). */
  forbidUse?: string[];
}) {
  const [code, setCodeRaw] = useState(starterCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [guardError, setGuardError] = useState<string | null>(null);

  // Strip comments before checking, so a token mentioned in a // comment or a
  // /* block */ doesn't count as "using" (or violating) the method.
  const guardCheck = (src: string): string | null => {
    const stripped = src
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");
    for (const token of requireUse ?? []) {
      if (!stripped.includes(token)) {
        return `Use the built-in here — your code must call ${token}…). That's the point of this first step.`;
      }
    }
    for (const token of forbidUse ?? []) {
      if (stripped.includes(token)) {
        return `Solve it WITHOUT ${token}…) this time — write the logic by hand with a loop.`;
      }
    }
    return null;
  };

  // Restore any in-progress code on mount (after hydration → no mismatch).
  useEffect(() => {
    if (!persistKey) return;
    try {
      const saved = window.localStorage.getItem(codeKey(persistKey));
      if (saved != null && saved !== starterCode) setCodeRaw(saved);
    } catch {
      /* ignore */
    }
    // Only on mount / when the challenge changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistKey]);

  // Autosave on every edit (or clear the entry when back at the starter).
  const setCode = (next: string) => {
    setCodeRaw(next);
    if (!persistKey) return;
    try {
      if (next === starterCode) window.localStorage.removeItem(codeKey(persistKey));
      else window.localStorage.setItem(codeKey(persistKey), next);
    } catch {
      /* ignore */
    }
  };

  const hasTests = !!tests && tests.length > 0;
  // Runnable if it has tests, or explicitly marked runnable (console mode).
  const runnable = runnableProp ?? hasTests;

  const run = async () => {
    setRunning(true);
    try {
      const gErr = guardCheck(code);
      setGuardError(gErr);
      const r = await runChallenge(code, tests ?? []);
      setResult(r);
      const testsPassed =
        hasTests && r.cases.length > 0 && r.cases.every((c) => c.passed) && !r.fatalError;
      const allPassed = testsPassed && !gErr;
      if (hasTests) onResult?.(allPassed);
      if (allPassed) onAllPassed?.();
    } finally {
      setRunning(false);
    }
  };

  const reset = () => {
    setCode(starterCode);
    setResult(null);
    setGuardError(null);
  };

  const passedCount = result?.cases.filter((c) => c.passed).length ?? 0;
  const testsAllPassed =
    !!result &&
    !result.fatalError &&
    result.cases.length > 0 &&
    passedCount === result.cases.length;
  const allPassed = testsAllPassed && !guardError;

  return (
    <div className="space-y-3">
      <CodeEditor value={code} onChange={setCode} />

      <div className="flex flex-wrap items-center gap-2">
        {runnable ? (
          <button
            onClick={run}
            disabled={running}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {running ? "Running…" : "▶ Run code"}
          </button>
        ) : (
          <span className="text-sm text-slate-500">{notRunnableHint}</span>
        )}
        <button
          onClick={reset}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Reset code
        </button>
        {result && hasTests && (
          <span
            className={
              "ml-auto rounded-full px-3 py-1 text-sm font-semibold " +
              (allPassed
                ? "bg-green-100 text-green-700"
                : "bg-rose-100 text-rose-700")
            }
          >
            {allPassed
              ? "🎉 All tests passed!"
              : testsAllPassed && guardError
              ? "Almost — wrong approach"
              : `${passedCount}/${result.cases.length} passed`}
          </span>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-2">
          {/* Approach guard: tests pass but the required/forbidden method rule isn't met */}
          {guardError && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <span className="font-semibold">✋ {testsAllPassed ? "Tests pass, but: " : ""}</span>
              {guardError}
            </div>
          )}

          {result.fatalError && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <span className="font-semibold">Error: </span>
              {result.fatalError}
            </div>
          )}

          {result.cases.map((c, i) => (
            <div
              key={i}
              className={
                "rounded-lg border p-3 text-sm " +
                (c.passed
                  ? "border-green-200 bg-green-50"
                  : "border-rose-200 bg-rose-50")
              }
            >
              <div className="flex items-center gap-2 font-medium">
                <span>{c.passed ? "✅" : "❌"}</span>
                <span className={c.passed ? "text-green-800" : "text-rose-800"}>
                  {c.name}
                </span>
              </div>
              <code className="mt-1 block text-xs text-slate-500">{c.call}</code>
              {!c.passed && (
                <>
                  <div className="mt-2 space-y-0.5 font-mono text-xs">
                    {c.error ? (
                      <div className="text-rose-700">threw: {c.error}</div>
                    ) : (
                      <>
                        <div className="text-slate-600">
                          expected: <span className="text-green-700">{c.expected}</span>
                        </div>
                        <div className="text-slate-600">
                          got: <span className="text-rose-700">{c.actual}</span>
                        </div>
                      </>
                    )}
                  </div>
                  {c.kind && KIND_HINT[c.kind] && (
                    <p className="mt-2 rounded bg-amber-100 px-2 py-1 text-xs text-amber-900">
                      💡 {KIND_HINT[c.kind]}
                    </p>
                  )}
                </>
              )}
            </div>
          ))}

          {/* Console output — always show in console mode, even with no logs */}
          {(result.logs.length > 0 || !hasTests) && !result.fatalError && (
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
              <p className="mb-1 text-xs font-semibold uppercase text-slate-400">
                Console output
              </p>
              <pre className="overflow-x-auto font-mono text-xs text-slate-200">
                {result.logs.length > 0
                  ? result.logs.join("\n")
                  : "(nothing logged yet — use console.log to print)"}
              </pre>
            </div>
          )}

          {/* Live execution trace — built from the learner's own run */}
          {!result.fatalError && result.trace.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-sm font-semibold text-slate-800">
                👣 Execution trace <span className="font-normal text-slate-400">(your code, step by step)</span>
              </p>
              <p className="mb-2 text-xs text-slate-500">
                Loops are traced automatically. Add{" "}
                <code className="rounded bg-slate-100 px-1 font-mono">trace(&quot;label&quot;, {"{ value }"})</code>{" "}
                anywhere in your code to log your own values.
              </p>
              <LiveTrace steps={result.trace} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
