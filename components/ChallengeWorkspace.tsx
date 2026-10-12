"use client";

import { ReactNode, useEffect, useState } from "react";
import { TestCase } from "@/lib/types";
import { runChallenge, RunResult, INFINITE_LOOP_MESSAGE } from "@/lib/runner";
import { useSplit } from "@/lib/useSplit";
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

const KIND_LABEL: Record<string, string> = {
  normal: "Normal", empty: "Empty input", invalid: "Invalid input",
  duplicate: "Duplicates", large: "Large input", nullish: "Null/undefined",
  mutation: "No mutation", performance: "Performance",
};

const codeKey = (k: string) => `fll-code:${k}`;

type ConsoleTab = "testcase" | "result" | "trace";

interface Run {
  mode: "run" | "submit";
  result: RunResult;
  ms: number;
  /** How many leading cases are visible tests (the rest are hidden ones). */
  visibleCount: number;
  guardError: string | null;
}

// LeetCode-style workspace: code editor on top, a console underneath with
// Testcase / Test Result / Trace tabs, and a draggable divider between them.
//
// - Run    → the visible tests only (fast feedback, never counts as solved).
// - Submit → visible + hidden edge-case tests; fires onResult / onAllPassed.
// - Runnable without tests ("console mode"): Run shows console output.
// - Not runnable (HTML/CSS/React): editable, with a friendly hint instead.
export default function ChallengeWorkspace({
  starterCode,
  tests,
  hiddenTests,
  runnable: runnableProp,
  notRunnableHint = "This is a React component — build & run it in your own project.",
  onAllPassed,
  onResult,
  onRun,
  persistKey,
  requireUse,
  forbidUse,
  afterAccepted,
}: {
  starterCode: string;
  /** Visible test cases (shown in the Testcase tab, checked by Run). */
  tests?: TestCase[];
  /** Hidden edge-case tests — only checked on Submit. */
  hiddenTests?: TestCase[];
  runnable?: boolean;
  notRunnableHint?: string;
  onAllPassed?: () => void;
  /** Fired after every Submit with whether all tests passed (guard included). */
  onResult?: (allPassed: boolean) => void;
  /** Fired on every Run or Submit (any real attempt). */
  onRun?: () => void;
  /** If set, the in-progress code is autosaved/restored under this key. */
  persistKey?: string;
  /** Code MUST contain every one of these substrings (e.g. [".filter("]). */
  requireUse?: string[];
  /** Code must contain NONE of these substrings (forces a by-hand solution). */
  forbidUse?: string[];
  /** Shown under an "Accepted" Submit (e.g. a confidence rating). */
  afterAccepted?: ReactNode;
}) {
  const [code, setCodeRaw] = useState(starterCode);
  const [run, setRun] = useState<Run | null>(null);
  const [running, setRunning] = useState<"run" | "submit" | null>(null);
  const [tab, setTab] = useState<ConsoleTab>("testcase");
  const [caseIdx, setCaseIdx] = useState(0);
  const [resultIdx, setResultIdx] = useState(0);

  const split = useSplit("fll-split-y", 60, 20, 85, "y");

  const visible = tests ?? [];
  const hidden = hiddenTests ?? [];
  const graded = visible.length + hidden.length > 0;
  // Runnable if it has tests, or explicitly marked runnable (console mode).
  const runnable = runnableProp ?? graded;

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
        return `Solve it WITHOUT ${token}…) this time — write it yourself the manual way.`;
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

  const execute = async (mode: "run" | "submit") => {
    setRunning(mode);
    try {
      const gErr = guardCheck(code);
      // Run checks the visible tests (or the hidden ones if that's all there is).
      const cases = mode === "submit" || visible.length === 0 ? [...visible, ...hidden] : visible;
      const t0 = performance.now();
      const result = await runChallenge(code, cases);
      const ms = Math.round(performance.now() - t0);
      setRun({ mode, result, ms, visibleCount: visible.length, guardError: gErr });
      setTab("result");
      const firstFail = result.cases.findIndex((c) => !c.passed);
      setResultIdx(firstFail === -1 ? 0 : firstFail);

      onRun?.();
      if (mode === "submit") {
        const allPassed =
          result.cases.length > 0 && result.cases.every((c) => c.passed) && !result.fatalError && !gErr;
        onResult?.(allPassed);
        if (allPassed) onAllPassed?.();
      }
    } finally {
      setRunning(null);
    }
  };

  const reset = () => {
    setCode(starterCode);
    setRun(null);
    setTab("testcase");
  };

  const btn = "rounded-md px-3 py-1 text-xs font-semibold transition disabled:opacity-50";
  const toolbar = (
    <>
      <button type="button" onClick={reset} title="Reset to the starter code" className={`${btn} text-slate-300 hover:bg-slate-700`}>
        ↺ Reset
      </button>
      {runnable && (
        <button
          type="button"
          onClick={() => execute("run")}
          disabled={running !== null}
          className={`${btn} bg-slate-700 text-slate-100 hover:bg-slate-600`}
        >
          {running === "run" ? "Running…" : "▶ Run"}
        </button>
      )}
      {runnable && graded && (
        <button
          type="button"
          onClick={() => execute("submit")}
          disabled={running !== null}
          className={`${btn} bg-green-600 text-white hover:bg-green-500`}
        >
          {running === "submit" ? "Submitting…" : "Submit"}
        </button>
      )}
    </>
  );

  const consoleTabs: { key: ConsoleTab; label: string }[] = [
    ...(graded ? [{ key: "testcase" as const, label: "✅ Testcase" }] : []),
    { key: "result", label: graded ? "▶ Test Result" : "▶ Console" },
    ...(run && !run.result.fatalError && run.result.trace.length > 0
      ? [{ key: "trace" as const, label: "👣 Trace" }]
      : []),
  ];
  const activeTab = consoleTabs.some((t) => t.key === tab) ? tab : consoleTabs[0].key;

  return (
    <div ref={split.ref} className="flex min-h-0 flex-1 flex-col">
      {/* Editor */}
      <div
        className="h-[22rem] lg:h-auto lg:min-h-0 lg:shrink-0 lg:basis-[var(--top)]"
        style={{ ["--top" as string]: `${split.pct}%` }}
      >
        <CodeEditor value={code} onChange={setCode} fill flush toolbar={toolbar} />
      </div>

      {/* Draggable divider */}
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize editor and console"
        aria-valuenow={Math.round(split.pct)}
        aria-valuemin={split.min}
        aria-valuemax={split.max}
        tabIndex={0}
        onPointerDown={split.onPointerDown}
        onKeyDown={split.onKeyDown}
        className="group hidden h-2 shrink-0 cursor-row-resize items-center justify-center bg-slate-100 outline-none lg:flex"
      >
        <span className="h-1 w-10 rounded-full bg-slate-300 transition group-hover:bg-brand-500 group-focus-visible:bg-brand-500" />
      </div>

      {/* Console */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex h-9 shrink-0 items-center gap-1 border-b border-slate-200 bg-slate-50 px-2">
          {consoleTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "rounded-md px-2.5 py-1 text-xs font-semibold transition " +
                (activeTab === t.key
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-700")
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="min-h-[10rem] flex-1 overflow-y-auto overscroll-contain p-4 text-sm">
          {!runnable ? (
            <p className="text-slate-500">{notRunnableHint}</p>
          ) : activeTab === "testcase" ? (
            <TestcasePane
              visible={visible}
              hiddenCount={hidden.length}
              idx={Math.min(caseIdx, Math.max(visible.length - 1, 0))}
              setIdx={setCaseIdx}
            />
          ) : activeTab === "trace" && run ? (
            <div>
              <p className="mb-2 text-xs text-slate-500">
                Your code, step by step (first test). Loops are traced automatically — add{" "}
                <code className="rounded bg-slate-100 px-1 font-mono">trace(&quot;label&quot;, {"{ value }"})</code>{" "}
                anywhere to log your own values.
              </p>
              <LiveTrace steps={run.result.trace} />
            </div>
          ) : (
            <ResultPane
              run={run}
              graded={graded}
              hasHidden={hidden.length > 0}
              idx={resultIdx}
              setIdx={setResultIdx}
              afterAccepted={afterAccepted}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Console panes
// ---------------------------------------------------------------------------

function CaseButton({
  active,
  tone,
  onClick,
  children,
}: {
  active: boolean;
  tone?: "pass" | "fail";
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition " +
        (active ? "bg-slate-200 text-slate-900" : "bg-slate-100 text-slate-600 hover:bg-slate-200")
      }
    >
      {tone && (
        <span
          aria-hidden
          className={"h-1.5 w-1.5 rounded-full " + (tone === "pass" ? "bg-green-500" : "bg-rose-500")}
        />
      )}
      {children}
    </button>
  );
}

function Field({ label, children, tone }: { label: string; children: ReactNode; tone?: "good" | "bad" }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>
      <pre
        className={
          "overflow-x-auto whitespace-pre-wrap break-all rounded-md px-3 py-2 font-mono text-xs " +
          (tone === "bad"
            ? "bg-rose-50 text-rose-700"
            : tone === "good"
            ? "bg-green-50 text-green-800"
            : "bg-slate-100 text-slate-800")
        }
      >
        {children}
      </pre>
    </div>
  );
}

function TestcasePane({
  visible,
  hiddenCount,
  idx,
  setIdx,
}: {
  visible: TestCase[];
  hiddenCount: number;
  idx: number;
  setIdx: (i: number) => void;
}) {
  const t = visible[idx];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {visible.map((_, i) => (
          <CaseButton key={i} active={i === idx} onClick={() => setIdx(i)}>
            Case {i + 1}
          </CaseButton>
        ))}
        {hiddenCount > 0 && (
          <span className="text-xs text-slate-400">+ {hiddenCount} hidden (checked on Submit)</span>
        )}
      </div>
      {t ? (
        <div className="space-y-3">
          <p className="flex items-center gap-2 text-xs text-slate-500">
            {t.name}
            {t.kind && (
              <span className="rounded bg-slate-100 px-1.5 py-0.5">{KIND_LABEL[t.kind] ?? t.kind}</span>
            )}
          </p>
          <Field label="Input">{t.call}</Field>
          <Field label="Expected">{JSON.stringify(t.expected)}</Field>
        </div>
      ) : (
        <p className="text-slate-500">Only hidden tests here — hit Submit to check them.</p>
      )}
    </div>
  );
}

function ResultPane({
  run,
  graded,
  hasHidden,
  idx,
  setIdx,
  afterAccepted,
}: {
  run: Run | null;
  graded: boolean;
  hasHidden: boolean;
  idx: number;
  setIdx: (i: number) => void;
  afterAccepted?: ReactNode;
}) {
  if (!run) {
    return <p className="text-slate-400">You must run your code first.</p>;
  }
  const { result, mode, ms, visibleCount, guardError } = run;

  const logs =
    result.logs.length > 0 ? <Field label="Stdout">{result.logs.join("\n")}</Field> : null;

  // Errors that stopped everything.
  if (result.fatalError) {
    const title =
      result.fatalError === INFINITE_LOOP_MESSAGE
        ? "Time Limit Exceeded"
        : result.fatalError.startsWith("SyntaxError")
        ? "Compile Error"
        : "Runtime Error";
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-rose-600">{title}</h3>
        <Field label="Error" tone="bad">{result.fatalError}</Field>
        {logs}
      </div>
    );
  }

  // Console mode: no tests, just output.
  if (!graded) {
    return (
      <div className="space-y-3">
        <p className="text-xs text-slate-500">Finished in {ms} ms</p>
        {logs ?? <p className="text-slate-400">(nothing logged — use console.log to print)</p>}
      </div>
    );
  }

  const passed = result.cases.filter((c) => c.passed).length;
  const total = result.cases.length;
  const testsAllPassed = total > 0 && passed === total;
  const accepted = testsAllPassed && !guardError;

  const verdict = accepted
    ? { text: "Accepted", cls: "text-green-600" }
    : testsAllPassed
    ? { text: "Wrong Approach", cls: "text-amber-600" }
    : { text: "Wrong Answer", cls: "text-rose-600" };

  const sel = Math.min(idx, total - 1);
  const c = result.cases[sel];
  const isHidden = (i: number) => mode === "submit" && i >= visibleCount;
  const label = (i: number) => (isHidden(i) ? `Hidden ${i - visibleCount + 1}` : `Case ${i + 1}`);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className={`text-lg font-semibold ${verdict.cls}`}>{verdict.text}</h3>
        <span className="text-xs text-slate-500">
          {passed} / {total} testcases passed · {ms} ms
          {mode === "run" && hasHidden && " · visible tests only"}
        </span>
      </div>

      {guardError && (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">✋ {guardError}</p>
      )}
      {mode === "run" && accepted && (
        <p className="rounded-md bg-brand-50 px-3 py-2 text-xs text-brand-700">
          {hasHidden
            ? "Visible tests pass. Hit Submit to run the hidden edge-case tests and mark it solved."
            : "All tests pass. Hit Submit to mark it solved."}
        </p>
      )}
      {mode === "submit" && accepted && afterAccepted}

      <div className="flex flex-wrap gap-2">
        {result.cases.map((r, i) => (
          <CaseButton key={i} active={i === sel} tone={r.passed ? "pass" : "fail"} onClick={() => setIdx(i)}>
            {label(i)}
          </CaseButton>
        ))}
      </div>

      {c &&
        (isHidden(sel) && c.passed ? (
          <p className="text-xs text-slate-500">✓ Hidden test passed — its details stay hidden.</p>
        ) : (
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-xs text-slate-500">
              {c.name}
              {c.kind && (
                <span className="rounded bg-slate-100 px-1.5 py-0.5">{KIND_LABEL[c.kind] ?? c.kind}</span>
              )}
            </p>
            <Field label="Input">{c.call}</Field>
            <Field label="Output" tone={c.passed ? "good" : "bad"}>
              {c.error ? `threw: ${c.error}` : c.actual}
            </Field>
            <Field label="Expected">{c.expected}</Field>
            {!c.passed && c.kind && KIND_HINT[c.kind] && (
              <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">💡 {KIND_HINT[c.kind]}</p>
            )}
          </div>
        ))}

      {logs}
    </div>
  );
}
