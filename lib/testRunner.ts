import { buildTestBody, SuiteRun, TestEnv } from "./testHarness";
import { show, execute, compiles, ExecResult, RUN_BUDGET_MS, INFINITE_LOOP_MESSAGE } from "./runner";
import { BuggyImpl } from "./types";

// Runs a learner's test suite in a sandbox and reports Jest-style results.
//   env "js"  → a throwaway Web Worker (lib/runner.ts execute()).
//   env "dom" → a hidden sandboxed iframe (real DOM, opaque origin), torn down
//               after each run or when it exceeds the time budget.

export interface SuiteOutcome {
  run?: SuiteRun;
  fatalError?: string;
}

export interface MutantOutcome {
  label: string;
  code: string;
  /** True when at least one test failed against this buggy version. */
  caught: boolean;
  /** The first test that caught it. */
  caughtBy?: string;
  /** Warnings raised while the suite ran against this mutant (e.g. a missing await). */
  warnings: string[];
}

// The sandbox document: receives a harness body, runs it, posts the result back.
const frameDoc = () => `<!doctype html><html><head><meta charset="utf-8"></head><body><script>
const __show = (${show.toString()});
addEventListener("message", async (e) => {
  try {
    const value = await new Function("__show", e.data)(__show);
    parent.postMessage({ __fll: true, ok: true, value }, "*");
  } catch (err) {
    parent.postMessage({ __fll: true, ok: false, error: String(err) }, "*");
  }
});
parent.postMessage({ __fll: true, ready: true }, "*");
<\/script></body></html>`;

function executeInFrame(body: string): Promise<ExecResult> {
  if (typeof document === "undefined") {
    return Promise.resolve({ ok: false, error: "DOM tests can only run in the browser." });
  }
  return new Promise((resolve) => {
    const frame = document.createElement("iframe");
    frame.setAttribute("sandbox", "allow-scripts");
    frame.setAttribute("aria-hidden", "true");
    frame.tabIndex = -1;
    // Off-screen but rendered, so computed styles (toBeVisible) work.
    frame.style.cssText = "position:fixed;left:-10000px;top:0;width:800px;height:600px;border:0;";

    const finish = (r: ExecResult) => {
      clearTimeout(timer);
      window.removeEventListener("message", onMessage);
      frame.remove();
      resolve(r);
    };
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.contentWindow || !e.data || !e.data.__fll) return;
      if (e.data.ready) {
        frame.contentWindow?.postMessage(body, "*");
        return;
      }
      finish(e.data.ok ? { ok: true, value: e.data.value } : { ok: false, error: e.data.error });
    };
    const timer = setTimeout(() => finish({ ok: false, error: INFINITE_LOOP_MESSAGE }), RUN_BUDGET_MS);
    window.addEventListener("message", onMessage);
    frame.srcdoc = frameDoc();
    document.body.appendChild(frame);
  });
}

/** Run `tests` against `code` and return the per-test results. */
export async function runSuite(code: string, tests: string, env: TestEnv): Promise<SuiteOutcome> {
  const body = buildTestBody(code, tests, env);
  const syntaxError = compiles(body);
  if (syntaxError) return { fatalError: syntaxError };
  const exec = env === "dom" ? await executeInFrame(body) : await execute(body);
  if (!exec.ok) return { fatalError: exec.error };
  return { run: exec.value as SuiteRun };
}

/**
 * Mutation testing: run the same tests against each deliberately buggy
 * version. A good suite makes at least one test fail for every mutant.
 */
export async function runMutants(
  mutants: BuggyImpl[],
  tests: string,
  env: TestEnv
): Promise<MutantOutcome[]> {
  const out: MutantOutcome[] = [];
  for (const m of mutants) {
    const r = await runSuite(m.code, tests, env);
    const failing = r.run?.results.find((t) => !t.pass);
    out.push({
      label: m.label,
      code: m.code,
      // A crash (e.g. the buggy code throws at load time) also counts as caught.
      caught: !!r.fatalError || !!failing,
      caughtBy: failing?.name ?? (r.fatalError ? "(the suite crashed)" : undefined),
      warnings: Array.from(new Set(r.run?.results.flatMap((t) => t.warnings) ?? [])),
    });
  }
  return out;
}
