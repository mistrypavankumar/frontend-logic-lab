import { TestCase } from "./types";

export interface CaseResult {
  name: string;
  call: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
}

export interface RunResult {
  logs: string[];
  cases: CaseResult[];
  /** A top-level error (e.g. syntax error) that stopped everything. */
  fatalError?: string;
}

// Per-test wall-clock cap so a buggy promise that never settles can't hang the
// page. Async challenges (retry/timeout/race) use tiny real delays well under this.
const TEST_TIMEOUT_MS = 2000;

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

/**
 * Runs the learner's code in a sandboxed Function and evaluates each test case.
 * The harness is async: if a test expression returns a thenable it is awaited
 * (raced against a timeout), so both synchronous and Promise-returning
 * challenges grade through the same path.
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

  const body = `
    "use strict";
    const __logs = [];
    const console = {
      log: (...args) => __logs.push(args.map(__show).join(" ")),
      error: (...args) => __logs.push(args.map(__show).join(" ")),
      warn: (...args) => __logs.push(args.map(__show).join(" ")),
    };
    // ---- learner code ----
    ${userCode}
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
      return { results: __results, logs: __logs };
    })();
  `;

  let raw: {
    results: { index: number; ok: boolean; value?: string; error?: string }[];
    logs: string[];
  };
  try {
    const fn = new Function("__show", body) as (
      s: typeof show
    ) => Promise<typeof raw>;
    raw = await fn(show);
  } catch (e) {
    return { logs, cases: [], fatalError: String(e) };
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

  return { logs, cases };
}
