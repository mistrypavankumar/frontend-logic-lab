"use client";

import { useState } from "react";
import { TestWritingSpec } from "@/lib/types";
import { runTestWriting, ImplResult } from "@/lib/runner";
import CodeEditor from "./CodeEditor";
import CodeBlock from "./CodeBlock";

// "Write the tests." The learner writes test cases; we run them against the
// correct implementation (their suite must accept it) and several buggy ones
// (a good suite catches each bug). Trains the verification skill: knowing what
// "correct" means and writing checks that prove it.
export default function TestWritingPanel({
  spec,
  onSolved,
}: {
  spec: TestWritingSpec;
  onSolved?: () => void;
}) {
  const defaultStarter = `// Write tests with test(name, condition).
// Use eq(a, b) to compare arrays/objects.
test("basic example", ${spec.functionName}(/* … */) === /* … */);
// Add edge cases — empty input, one element, weird values…`;

  const [code, setCode] = useState(spec.starterTests ?? defaultStarter);
  const [results, setResults] = useState<ImplResult[] | null>(null);
  const [reveal, setReveal] = useState<Record<number, boolean>>({});

  const run = () => {
    const r = runTestWriting(code, spec.correctImpl, spec.buggyImpls);
    setResults(r);
    setReveal({});
    const correct = r[0];
    const buggies = r.slice(1);
    const solid =
      correct.allPass && buggies.every((b) => !b.allPass && !b.fatalError);
    if (solid) onSolved?.();
  };

  const reset = () => {
    setCode(spec.starterTests ?? defaultStarter);
    setResults(null);
  };

  const correct = results?.[0];
  const buggies = results?.slice(1) ?? [];
  const caughtCount = buggies.filter((b) => !b.allPass && !b.fatalError).length;
  const solid = !!correct?.allPass && buggies.length > 0 && caughtCount === buggies.length;

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        <p className="font-medium text-slate-800">Your job: write tests, not the code.</p>
        <p className="mt-1 text-slate-600">
          Write checks with <code className="rounded bg-white px-1 font-mono">test(&quot;name&quot;, condition)</code>.
          For arrays/objects use <code className="rounded bg-white px-1 font-mono">eq(a, b)</code>.
          A great suite <strong>accepts</strong> the correct <code className="font-mono">{spec.functionName}</code> and{" "}
          <strong>catches every buggy</strong> version below.
        </p>
      </div>

      <CodeEditor value={code} onChange={setCode} />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={run}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          ▶ Run my tests
        </button>
        <button
          onClick={reset}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Reset
        </button>
        {results && (
          <span
            className={
              "ml-auto rounded-full px-3 py-1 text-sm font-semibold " +
              (solid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")
            }
          >
            {solid ? "🎉 Solid suite!" : `Caught ${caughtCount}/${buggies.length} bugs`}
          </span>
        )}
      </div>

      {results && correct && (
        <div className="space-y-3">
          {/* Against the correct solution */}
          <div
            className={
              "rounded-lg border p-3 text-sm " +
              (correct.allPass
                ? "border-green-200 bg-green-50"
                : "border-rose-200 bg-rose-50")
            }
          >
            <p className="font-semibold text-slate-800">
              {correct.fatalError
                ? "⚠️ Your tests have an error"
                : correct.allPass
                ? `✅ Accepts the correct solution (${correct.assertions.length} test${correct.assertions.length === 1 ? "" : "s"} pass)`
                : "❌ Your tests reject the CORRECT solution — fix these first:"}
            </p>
            {correct.fatalError && (
              <code className="mt-1 block font-mono text-xs text-rose-700">{correct.fatalError}</code>
            )}
            {!correct.fatalError &&
              !correct.allPass &&
              correct.assertions
                .filter((a) => !a.pass)
                .map((a, i) => (
                  <div key={i} className="mt-1 font-mono text-xs text-rose-700">
                    ✗ {a.name}
                    {a.error ? ` — ${a.error}` : ""}
                  </div>
                ))}
          </div>

          {/* Bugs the suite should catch */}
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <p className="mb-2 text-sm font-semibold text-slate-800">
              Buggy versions — did your tests catch them?
            </p>
            <ul className="space-y-2">
              {buggies.map((b, i) => {
                const caught = !b.allPass && !b.fatalError;
                return (
                  <li key={i} className="text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className={caught ? "text-green-700" : "text-amber-700"}>
                        {caught ? "✅ caught" : "⚠️ slipped through"} — {b.label}
                      </span>
                      <button
                        onClick={() => setReveal((r) => ({ ...r, [i]: !r[i] }))}
                        className="shrink-0 text-xs font-medium text-slate-400 hover:text-slate-700"
                      >
                        {reveal[i] ? "Hide code" : "Show code"}
                      </button>
                    </div>
                    {!caught && (
                      <p className="text-xs text-amber-600">
                        Every test passed on this buggy version — add a case that would expose it.
                      </p>
                    )}
                    {reveal[i] && (
                      <div className="mt-1">
                        <CodeBlock code={spec.buggyImpls[i].code} language="js" />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {solid && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
              🎉 Your suite accepts the correct code and catches every bug. That's exactly
              the skill that keeps AI-written code honest.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
