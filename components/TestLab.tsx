"use client";

import { useEffect, useState } from "react";
import { TestLabScenario, TestingLesson } from "@/lib/types";
import { runSuite, runMutants, SuiteOutcome, MutantOutcome } from "@/lib/testRunner";
import { INFINITE_LOOP_MESSAGE } from "@/lib/runner";
import { useSplit } from "@/lib/useSplit";
import { useProgress } from "@/lib/useProgress";
import CodeEditor from "./CodeEditor";
import CodeBlock from "./CodeBlock";

// The interactive Testing lab (right panel of a Testing lesson): pick an
// example scenario, write tests (or code, for TDD), run them in a sandbox and
// SEE the outcome — Jest-style results, a Bug hunt that runs your suite
// against deliberately broken versions, and a live Preview for UI components.

const GOAL_BADGE: Record<TestLabScenario["goal"], { label: string; cls: string }> = {
  pass: { label: "✍️ Write passing tests", cls: "bg-sky-100 text-sky-800" },
  catch: { label: "🐞 Catch every bug", cls: "bg-rose-100 text-rose-800" },
  implement: { label: "🔴→🟢 Make the tests pass", cls: "bg-violet-100 text-violet-800" },
};

export default function TestLab({ lesson }: { lesson: TestingLesson }) {
  const { isTestingDone, loaded } = useProgress();
  const [idx, setIdx] = useState(0);
  const sc = lesson.scenarios[idx];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Example picker — try the same skill on different code */}
      <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50 px-2 py-1.5">
        <span className="mr-1 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">Examples</span>
        {lesson.scenarios.map((s, i) => {
          const done = loaded && isTestingDone(`${lesson.slug}:${s.id}`);
          return (
            <button
              key={s.id}
              onClick={() => setIdx(i)}
              className={
                "shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold transition " +
                (i === idx
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-500 hover:bg-slate-200/60 hover:text-slate-700")
              }
            >
              {done ? "✅" : `${i + 1}.`} {s.title}
            </button>
          );
        })}
      </div>
      <ScenarioLab key={sc.id} lesson={lesson} sc={sc} />
    </div>
  );
}

// ---------------------------------------------------------------------------

type ConsoleTab = "results" | "bugs" | "preview";
type FileKey = "tests" | "code";

interface Outcome {
  suite: SuiteOutcome;
  mutants?: MutantOutcome[];
  ms: number;
}

const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

function ScenarioLab({ lesson, sc }: { lesson: TestingLesson; sc: TestLabScenario }) {
  const { markTestingDone, isTestingDone, loaded } = useProgress();
  const doneKey = `${lesson.slug}:${sc.id}`;
  const isImplement = sc.goal === "implement";

  // The editable file: tests normally, the implementation for TDD.
  const editable: FileKey = isImplement ? "code" : "tests";
  const starter = isImplement ? sc.starterCode ?? "" : sc.starterTests;
  const storeKey = `fll-test:${doneKey}:${editable}`;

  const [text, setTextRaw] = useState(starter);
  const [file, setFile] = useState<FileKey>(editable);
  const [running, setRunning] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [tab, setTab] = useState<ConsoleTab>(sc.preview ? "preview" : "results");
  const [showHint, setShowHint] = useState(false);
  const split = useSplit("fll-split-y", 60, 20, 85, "y");

  // Restore in-progress work after mount.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storeKey);
      if (saved != null && saved !== starter) setTextRaw(saved);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeKey]);

  const setText = (next: string) => {
    setTextRaw(next);
    try {
      if (next === starter) window.localStorage.removeItem(storeKey);
      else window.localStorage.setItem(storeKey, next);
    } catch {
      /* ignore */
    }
  };

  const code = isImplement ? text : sc.code;
  const tests = isImplement ? sc.starterTests : text;

  // ---- goal evaluation ------------------------------------------------------
  const results = outcome?.suite.run?.results ?? [];
  const passedCount = results.filter((r) => r.pass).length;
  const allPass = !outcome?.suite.fatalError && results.length > 0 && passedCount === results.length;
  const warnCount = results.reduce((n, r) => n + r.warnings.length, 0);
  const caught = outcome?.mutants?.filter((m) => m.caught).length ?? 0;
  const totalMutants = sc.mutants?.length ?? 0;
  const strippedTests = stripComments(tests);

  const checklist: { ok: boolean; text: string }[] = !outcome
    ? []
    : sc.goal === "pass"
    ? [
        { ok: allPass, text: "All your tests pass" },
        { ok: results.length >= (sc.minTests ?? 1), text: `At least ${sc.minTests ?? 1} test${(sc.minTests ?? 1) > 1 ? "s" : ""} (${results.length})` },
        ...(sc.mustUse ?? []).map((t) => ({ ok: strippedTests.includes(t), text: `Uses ${t.replace("(", "()")}` })),
        { ok: warnCount === 0, text: "No tests that can never fail" },
      ]
    : sc.goal === "catch"
    ? [
        { ok: allPass, text: "All your tests pass on the real code" },
        { ok: allPass && caught === totalMutants, text: `Bugs caught: ${caught} / ${totalMutants}` },
      ]
    : [{ ok: allPass, text: `All given tests pass (${passedCount} / ${results.length || "?"})` }];
  const goalMet = checklist.length > 0 && checklist.every((c) => c.ok);

  useEffect(() => {
    if (goalMet && loaded && !isTestingDone(doneKey)) markTestingDone(doneKey);
  }, [goalMet, loaded, doneKey, isTestingDone, markTestingDone]);

  // ---- run ----------------------------------------------------------------
  const run = async () => {
    setRunning(true);
    try {
      const t0 = performance.now();
      const suite = await runSuite(code, tests, lesson.env);
      const suitePasses =
        !suite.fatalError && !!suite.run && suite.run.results.length > 0 && suite.run.results.every((r) => r.pass);
      // Mutants only mean something once the suite passes on the real code.
      const mutants =
        sc.goal === "catch" && suitePasses && sc.mutants ? await runMutants(sc.mutants, tests, lesson.env) : undefined;
      setOutcome({ suite, mutants, ms: Math.round(performance.now() - t0) });
      setTab(sc.goal === "catch" && suitePasses ? "bugs" : "results");
    } finally {
      setRunning(false);
    }
  };

  const reset = () => {
    setText(starter);
    setOutcome(null);
  };
  const loadSolution = () => {
    setText(isImplement ? sc.code : sc.solutionTests ?? starter);
    setFile(editable);
    setOutcome(null);
  };

  const btn = "rounded-md px-3 py-1 text-xs font-semibold transition disabled:opacity-50";
  const toolbar =
    file === editable ? (
      <>
        <button type="button" onClick={reset} className={`${btn} text-slate-300 hover:bg-slate-700`} title="Back to the starter">
          ↺ Reset
        </button>
        <button type="button" onClick={loadSolution} className={`${btn} text-amber-300 hover:bg-slate-700`} title="Load a model answer">
          💡 Solution
        </button>
        <button type="button" onClick={run} disabled={running} className={`${btn} bg-green-600 text-white hover:bg-green-500`}>
          {running ? "Running…" : "▶ Run tests"}
        </button>
      </>
    ) : (
      <span className="text-xs text-slate-400">read-only</span>
    );

  const files: { key: FileKey; label: string }[] = [
    { key: "tests", label: isImplement ? "🧪 tests.spec.js (given)" : "🧪 tests.spec.js" },
    { key: "code", label: isImplement ? "📄 code.js (yours)" : "📄 code under test" },
  ];
  if (isImplement) files.reverse();

  const consoleTabs: { key: ConsoleTab; label: string }[] = [
    {
      key: "results",
      label: outcome
        ? outcome.suite.fatalError
          ? "🧪 Results ✕"
          : `🧪 Results ${passedCount}/${results.length}`
        : "🧪 Results",
    },
    ...(sc.goal === "catch" ? [{ key: "bugs" as const, label: `🐞 Bug hunt${outcome?.mutants ? ` ${caught}/${totalMutants}` : ""}` }] : []),
    ...(sc.preview ? [{ key: "preview" as const, label: "👀 Preview" }] : []),
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Task */}
      <div className="shrink-0 space-y-1 border-b border-slate-200 px-3 py-2 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 font-semibold ${GOAL_BADGE[sc.goal].cls}`}>{GOAL_BADGE[sc.goal].label}</span>
          {loaded && isTestingDone(doneKey) && <span className="font-semibold text-green-700">✓ Completed</span>}
          {sc.hint && (
            <button onClick={() => setShowHint((h) => !h)} className="ml-auto font-medium text-amber-700 hover:underline">
              💡 {showHint ? "Hide hint" : "Hint"}
            </button>
          )}
        </div>
        <p className="leading-relaxed">{sc.description}</p>
        {showHint && sc.hint && <p className="rounded bg-amber-50 px-2 py-1 text-amber-900">{sc.hint}</p>}
      </div>

      <div ref={split.ref} className="flex min-h-0 flex-1 flex-col">
        {/* Editor with file tabs */}
        <div
          className="flex h-[22rem] flex-col lg:h-auto lg:min-h-0 lg:shrink-0 lg:basis-[var(--top)]"
          style={{ ["--top" as string]: `${split.pct}%` }}
        >
          <div className="flex shrink-0 gap-1 bg-slate-800 px-2 pt-1.5">
            {files.map((f) => (
              <button
                key={f.key}
                onClick={() => setFile(f.key)}
                className={
                  "rounded-t-md px-3 py-1 font-mono text-xs transition " +
                  (file === f.key ? "bg-slate-900 text-slate-100" : "text-slate-400 hover:text-slate-200")
                }
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1">
            {file === editable ? (
              <CodeEditor value={text} onChange={setText} fill flush toolbar={toolbar} />
            ) : (
              <CodeEditor
                value={isImplement ? sc.starterTests : sc.code}
                onChange={() => {}}
                readOnly
                fill
                flush
                toolbar={toolbar}
              />
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize editor and results"
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
                  (tab === t.key
                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                    : "text-slate-500 hover:text-slate-700")
                }
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="min-h-[12rem] flex-1 overflow-y-auto overscroll-contain p-4 text-sm">
            {tab === "preview" && sc.preview ? (
              <Preview code={sc.code} mount={sc.preview} />
            ) : tab === "bugs" ? (
              <BugHunt sc={sc} outcome={outcome} allPass={allPass} />
            ) : (
              <Results outcome={outcome} checklist={checklist} goalMet={goalMet} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Console panes
// ---------------------------------------------------------------------------

function Checklist({ items, goalMet }: { items: { ok: boolean; text: string }[]; goalMet: boolean }) {
  if (!items.length) return null;
  return (
    <div className={"rounded-lg border p-3 " + (goalMet ? "border-green-200 bg-green-50" : "border-slate-200 bg-slate-50")}>
      <p className={"mb-1 text-xs font-semibold " + (goalMet ? "text-green-700" : "text-slate-600")}>
        {goalMet ? "🎉 Goal complete — try another example!" : "🎯 Goal"}
      </p>
      <ul className="space-y-0.5 text-xs">
        {items.map((c, i) => (
          <li key={i} className={c.ok ? "text-green-700" : "text-slate-600"}>
            {c.ok ? "✓" : "○"} {c.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Results({
  outcome,
  checklist,
  goalMet,
}: {
  outcome: Outcome | null;
  checklist: { ok: boolean; text: string }[];
  goalMet: boolean;
}) {
  if (!outcome) return <p className="text-slate-400">Press ▶ Run tests to see the results.</p>;
  const { suite, ms } = outcome;

  if (suite.fatalError) {
    const title =
      suite.fatalError === INFINITE_LOOP_MESSAGE
        ? "Time Limit Exceeded"
        : suite.fatalError.startsWith("SyntaxError")
        ? "Syntax error"
        : "The test file crashed";
    return (
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-rose-600">{title}</h3>
        <pre className="whitespace-pre-wrap break-all rounded-md bg-rose-50 px-3 py-2 font-mono text-xs text-rose-700">{suite.fatalError}</pre>
      </div>
    );
  }

  const results = suite.run?.results ?? [];
  const failed = results.filter((r) => !r.pass).length;
  const passed = results.length - failed;

  return (
    <div className="space-y-3">
      <Checklist items={checklist} goalMet={goalMet} />
      {results.length === 0 ? (
        <p className="text-amber-700">No tests found — write one with it(&quot;…&quot;, () =&gt; {"{ … }"}).</p>
      ) : (
        <>
          <p className="font-mono text-xs">
            <span className="font-semibold">Tests: </span>
            {failed > 0 && <span className="font-semibold text-rose-600">{failed} failed, </span>}
            <span className="font-semibold text-green-600">{passed} passed</span>, {results.length} total
            <span className="text-slate-400"> · {ms} ms</span>
          </p>
          <ul className="space-y-2">
            {results.map((r, i) => (
              <li key={i} className={"rounded-md border px-3 py-2 " + (r.pass ? "border-green-100 bg-green-50/50" : "border-rose-200 bg-rose-50")}>
                <div className="flex items-start gap-2 text-xs">
                  <span className={r.pass ? "text-green-600" : "text-rose-600"}>{r.pass ? "✓" : "✕"}</span>
                  <span className={"flex-1 font-medium " + (r.pass ? "text-slate-700" : "text-rose-800")}>{r.name}</span>
                  <span className="text-slate-400">{r.ms} ms</span>
                </div>
                {!r.pass && (
                  <div className="mt-2 space-y-1 font-mono text-xs">
                    <pre className="whitespace-pre-wrap break-all text-rose-700">{r.error}</pre>
                    {r.expected !== undefined && (
                      <div className="rounded bg-white/70 px-2 py-1">
                        <div className="text-green-700">Expected: {r.expected}</div>
                        <div className="text-rose-700">Received: {r.received}</div>
                      </div>
                    )}
                  </div>
                )}
                {r.warnings.map((w, j) => (
                  <p key={j} className="mt-2 rounded bg-amber-100 px-2 py-1 text-xs text-amber-900">⚠️ {w}</p>
                ))}
              </li>
            ))}
          </ul>
        </>
      )}
      {(suite.run?.logs.length ?? 0) > 0 && (
        <div>
          <p className="mb-1 text-xs font-medium text-slate-500">Console</p>
          <pre className="whitespace-pre-wrap rounded-md bg-slate-100 px-3 py-2 font-mono text-xs text-slate-800">{suite.run?.logs.join("\n")}</pre>
        </div>
      )}
    </div>
  );
}

function BugHunt({ sc, outcome, allPass }: { sc: TestLabScenario; outcome: Outcome | null; allPass: boolean }) {
  const total = sc.mutants?.length ?? 0;
  if (!outcome) {
    return (
      <div className="space-y-2 text-slate-600">
        <p>
          We&apos;ve hidden <strong>{total} buggy versions</strong> of the code. When you run your tests, we also run them
          against each broken version. A good test suite <strong>fails</strong> on every one of them.
        </p>
        <p className="text-slate-400">Press ▶ Run tests to start the hunt.</p>
      </div>
    );
  }
  if (!allPass || !outcome.mutants) {
    return (
      <p className="rounded-md bg-amber-50 px-3 py-2 text-amber-900">
        Your tests must pass on the <strong>real</strong> code first (see 🧪 Results) — otherwise we can&apos;t tell a
        caught bug from a broken test.
      </p>
    );
  }
  const caught = outcome.mutants.filter((m) => m.caught).length;
  return (
    <div className="space-y-3">
      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <h3 className="text-base font-semibold text-slate-800">
            Bugs caught: <span className={caught === total ? "text-green-600" : "text-rose-600"}>{caught} / {total}</span>
          </h3>
          <span className="text-xs text-slate-500">mutation score {Math.round((caught / Math.max(total, 1)) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${(caught / Math.max(total, 1)) * 100}%` }} />
        </div>
      </div>
      <ul className="space-y-2">
        {outcome.mutants.map((m, i) => (
          <li key={i} className={"rounded-md border px-3 py-2 " + (m.caught ? "border-green-200 bg-green-50" : "border-rose-200 bg-rose-50")}>
            <div className="flex items-center gap-2 text-xs">
              <span className={"rounded-full px-2 py-0.5 font-semibold " + (m.caught ? "bg-green-600 text-white" : "bg-rose-600 text-white")}>
                {m.caught ? "🟢 caught" : "🔴 survived"}
              </span>
              <span className="font-medium text-slate-800">Bug {i + 1}: {m.label}</span>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              {m.caught
                ? <>Caught by: <span className="font-medium">{m.caughtBy}</span></>
                : "All your tests passed against this broken version — add a test that would fail for it."}
            </p>
            {m.warnings.map((w, j) => (
              <p key={j} className="mt-1 rounded bg-amber-100 px-2 py-1 text-xs text-amber-900">⚠️ {w}</p>
            ))}
            <details className="mt-1">
              <summary className="cursor-pointer text-xs font-medium text-slate-500">Show the buggy code</summary>
              <div className="mt-1">
                <CodeBlock code={m.code} language="js" />
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Live, clickable render of the component under test (sandboxed).
function Preview({ code, mount }: { code: string; mount: string }) {
  const [n, setN] = useState(0);
  const doc = `<!doctype html><html><head><meta charset="utf-8"><style>
body{font:14px/1.5 system-ui,-apple-system,sans-serif;color:#0f172a;margin:16px}
button{font:inherit;padding:4px 12px;border-radius:6px;border:1px solid #94a3b8;background:#fff;cursor:pointer;margin:4px 4px 4px 0}
button:disabled{opacity:.45;cursor:not-allowed}
input{font:inherit;padding:4px 8px;border:1px solid #94a3b8;border-radius:6px;margin:4px 0}
label{margin-right:6px} [role=alert]{color:#be123c} li{margin:2px 0}
</style></head><body><script>
${code.replace(/<\/script/gi, "<\\/script")}
;document.body.appendChild(${mount.replace(/<\/script/gi, "<\\/script")});
<\/script></body></html>`;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>The real component — click and type to see what your tests should check.</span>
        <button onClick={() => setN((x) => x + 1)} className="rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100">
          ↻ Reset
        </button>
      </div>
      <iframe
        key={n}
        title="Component preview"
        sandbox="allow-scripts"
        srcDoc={doc}
        className="h-56 w-full rounded-md border border-slate-200 bg-white"
      />
    </div>
  );
}
