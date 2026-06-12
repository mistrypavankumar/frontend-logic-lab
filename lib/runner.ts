import { TestCase } from "./types";
import { instrumentLoops } from "./instrument";

export interface CaseResult {
  name: string;
  call: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
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
      };
    }
    return {
      name: t.name,
      call: t.call,
      passed: r.value === expected,
      expected,
      actual: r.value ?? "undefined",
    };
  });

  return { logs, cases, trace: raw.trace ?? [] };
}
