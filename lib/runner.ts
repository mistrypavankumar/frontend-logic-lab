import { TestCase, BuggyImpl } from "./types";
import { instrumentLoops } from "./instrument";

export interface CaseResult {
  name: string;
  call: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
  kind?: TestCase["kind"];
}

/** One recorded step of the live execution trace (the learner's own run). */
export interface TraceStep {
  n: number;
  label: string;
  /** Variable name → stringified value at this step. */
  vars: Record<string, string>;
}

export interface RunResult {
  logs: string[];
  cases: CaseResult[];
  /** Live execution trace: loop iterations + any trace() calls the learner made. */
  trace: TraceStep[];
  /** A top-level error (e.g. syntax error) that stopped everything. */
  fatalError?: string;
}

// Per-test wall-clock cap so a buggy promise that never settles can't hang the
// page. Async challenges (retry/timeout/race) use tiny real delays well under this.
const TEST_TIMEOUT_MS = 2000;
// Hard cap on recorded steps so a huge/infinite loop can't flood the UI.
const MAX_TRACE_STEPS = 300;

// Stable stringify so { a:1, b:2 } and { b:2, a:1 } compare equal,
// and so output is readable in the results panel.
function show(value: unknown): string {
  const seen = new WeakSet();
  const sorter = (_key: string, val: unknown) => {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      if (seen.has(val as object)) return "[Circular]";
      seen.add(val as object);
      return Object.keys(val as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>((acc, k) => {
          acc[k] = (val as Record<string, unknown>)[k];
          return acc;
        }, {});
    }
    return val;
  };
  try {
    return JSON.stringify(value, sorter);
  } catch {
    return String(value);
  }
}

interface RawRun {
  results: { index: number; ok: boolean; value?: string; error?: string }[];
  logs: string[];
  trace: TraceStep[];
}

// Builds the sandbox harness around the learner's code. `learnerCode` may be the
// loop-instrumented version (which adds trace() calls) or the original.
function buildBody(learnerCode: string, tests: TestCase[]): string {
  return `
    "use strict";
    const __logs = [];
    const __sink = (...args) => __logs.push(args.map(__show).join(" "));
    const console = {
      log: __sink, error: __sink, warn: __sink,
      info: __sink, debug: __sink, table: __sink,
    };

    // ---- live execution trace ----
    const __trace = [];
    // Tracing is on for the top-level body and the FIRST test only, so the
    // table shows one representative run instead of every test concatenated.
    let __traceOn = true;
    const __tracePush = (label, vars) => {
      if (!__traceOn || __trace.length >= ${MAX_TRACE_STEPS}) return;
      const v = vars || {};
      const out = {};
      for (const k in v) {
        try { out[k] = __show(v[k]); } catch (_e) { out[k] = String(v[k]); }
      }
      __trace.push({ n: __trace.length + 1, label: String(label == null ? "" : label), vars: out });
    };
    // Friendly alias for learners: trace({ x }) or trace("label", { x }).
    const trace = (a, b) => (b === undefined ? __tracePush("", a) : __tracePush(a, b));

    // ---- learner code ----
    ${learnerCode}
    // ---- test cases (async-aware) ----
    return (async () => {
      const __results = [];
      const __timeout = (p) => Promise.race([
        p,
        new Promise((_, rej) =>
          setTimeout(() => rej(new Error("Timed out (${TEST_TIMEOUT_MS}ms)")), ${TEST_TIMEOUT_MS}))
      ]);
      ${tests
        .map(
          (t, i) => `
        __traceOn = (${i} === 0);
        try {
          const __raw = (${t.call});
          const __v = (__raw && typeof __raw.then === "function")
            ? await __timeout(__raw)
            : __raw;
          __results.push({ index: ${i}, ok: true, value: __show(__v) });
        } catch (__e) {
          __results.push({ index: ${i}, ok: false, error: String(__e) });
        }`
        )
        .join("\n")}
      return { results: __results, logs: __logs, trace: __trace };
    })();
  `;
}

/**
 * Runs the learner's code in a sandboxed Function and evaluates each test case.
 * The harness is async: if a test expression returns a thenable it is awaited
 * (raced against a timeout), so both synchronous and Promise-returning
 * challenges grade through the same path.
 *
 * We first try a loop-instrumented copy of the code (which records a live
 * execution trace). If that copy fails to construct, we fall back to the
 * original source — so the trace feature can never affect running or grading.
 *
 * This is for LEARNING, not security — code runs on the same thread, so it
 * isn't isolated from a determined user; it just can't accidentally touch React
 * state or the DOM through these globals.
 */
export async function runChallenge(
  userCode: string,
  tests: TestCase[]
): Promise<RunResult> {
  const logs: string[] = [];

  // Prefer the instrumented build; validate it constructs, else use the original.
  let fn: ((s: typeof show) => Promise<RawRun>) | null = null;
  const instrumented = instrumentLoops(userCode);
  if (instrumented !== userCode) {
    try {
      fn = new Function("__show", buildBody(instrumented, tests)) as (
        s: typeof show
      ) => Promise<RawRun>;
    } catch {
      fn = null; // instrumentation produced invalid code — fall back below
    }
  }
  if (!fn) {
    try {
      fn = new Function("__show", buildBody(userCode, tests)) as (
        s: typeof show
      ) => Promise<RawRun>;
    } catch (e) {
      return { logs, cases: [], trace: [], fatalError: String(e) };
    }
  }

  let raw: RawRun;
  try {
    raw = await fn(show);
  } catch (e) {
    return { logs, cases: [], trace: [], fatalError: String(e) };
  }

  logs.push(...raw.logs);

  const cases: CaseResult[] = tests.map((t, i) => {
    const r = raw.results.find((x) => x.index === i);
    const expected = show(t.expected);
    if (!r || !r.ok) {
      return {
        name: t.name,
        call: t.call,
        passed: false,
        expected,
        actual: "—",
        error: r?.error ?? "did not run",
        kind: t.kind,
      };
    }
    return {
      name: t.name,
      call: t.call,
      passed: r.value === expected,
      expected,
      actual: r.value ?? "undefined",
      kind: t.kind,
    };
  });

  return { logs, cases, trace: raw.trace ?? [] };
}

// ---------------------------------------------------------------------------
// "Write the tests" mode — run the learner's tests against several
// implementations and report which were accepted / caught.
// ---------------------------------------------------------------------------

export interface TestAssertion {
  name: string;
  pass: boolean;
  error?: string;
}

export interface ImplResult {
  label: string;
  /** True for the canonical correct implementation. */
  isCorrect: boolean;
  assertions: TestAssertion[];
  /** A correct impl is "ok" when every assertion passes; a buggy impl is
   *  "caught" when at least one assertion fails (or throws). */
  allPass: boolean;
  fatalError?: string; // syntax error in the learner's tests
}

// Runs the learner's test code once with `implCode` defining the target
// function, plus a `test(name, cond)` recorder and an `eq(a,b)` deep-compare.
function runTestsAgainst(testCode: string, implCode: string): {
  assertions: TestAssertion[];
  fatalError?: string;
} {
  const body = `
    "use strict";
    const __r = [];
    const test = (name, cond) => __r.push({ name: String(name == null ? "" : name), pass: !!cond });
    const eq = (a, b) => __show(a) === __show(b);
    // ---- implementation under test ----
    ${implCode}
    // ---- the learner's tests ----
    try {
      ${testCode}
    } catch (__e) {
      __r.push({ name: "(error while running your tests)", pass: false, error: String(__e) });
    }
    return __r;
  `;
  try {
    const fn = new Function("__show", body) as (s: typeof show) => TestAssertion[];
    return { assertions: fn(show) };
  } catch (e) {
    return { assertions: [], fatalError: String(e) };
  }
}

export function runTestWriting(
  testCode: string,
  correctImpl: string,
  buggyImpls: BuggyImpl[]
): ImplResult[] {
  const out: ImplResult[] = [];

  const correct = runTestsAgainst(testCode, correctImpl);
  out.push({
    label: "Correct solution",
    isCorrect: true,
    assertions: correct.assertions,
    allPass:
      !correct.fatalError &&
      correct.assertions.length > 0 &&
      correct.assertions.every((a) => a.pass),
    fatalError: correct.fatalError,
  });

  for (const buggy of buggyImpls) {
    const r = runTestsAgainst(testCode, buggy.code);
    out.push({
      label: buggy.label,
      isCorrect: false,
      assertions: r.assertions,
      allPass: !r.fatalError && r.assertions.length > 0 && r.assertions.every((a) => a.pass),
      fatalError: r.fatalError,
    });
  }

  return out;
}
