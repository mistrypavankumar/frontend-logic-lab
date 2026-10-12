/* eslint-disable */
// Verifies the Testing track (data/testing.ts) with the real harness
// (lib/testHarness.ts), compiled to /tmp/fllverify by scripts/verify.sh.
// For every plain-JS lab scenario:
//   pass      → model tests pass on the code (≥ minTests, uses mustUse, no warnings)
//   catch     → model tests pass on the code AND catch every mutant;
//               the starter tests pass on the code but don't catch everything
//   implement → the given tests pass on the reference code and fail on the starter
// DOM scenarios need a browser, so they're listed as skipped.
const ROOT = "/tmp/fllverify";
const { testingLessons } = require(ROOT + "/data/testing.js");
const { buildTestBody } = require(ROOT + "/lib/testHarness.js");

process.on("unhandledRejection", () => {}); // un-awaited assertions in starter suites

function show(v) {
  const seen = new WeakSet();
  const s = (_k, val) => {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      if (seen.has(val)) return "[Circular]";
      seen.add(val);
      return Object.keys(val).sort().reduce((a, k) => ((a[k] = val[k]), a), {});
    }
    return val;
  };
  try { return JSON.stringify(v, s); } catch { return String(v); }
}

async function run(code, tests) {
  try {
    return await new Function("__show", buildTestBody(code, tests, "js"))(show);
  } catch (e) {
    return { fatal: String(e), results: [] };
  }
}
const allPass = (r) => !r.fatal && r.results.length > 0 && r.results.every((t) => t.pass);
const failures = (r) => r.fatal ? [r.fatal] : r.results.filter((t) => !t.pass).map((t) => t.name + ": " + t.error);

(async () => {
  let ok = 0, bad = 0, skipped = 0;
  const fail = (where, msg) => { bad++; console.log("  ✕ " + where + " — " + msg); };
  for (const lesson of testingLessons) {
    for (const sc of lesson.scenarios) {
      const where = lesson.slug + ":" + sc.id;
      if (lesson.env === "dom") { skipped++; console.log("  - " + where + " (DOM — verify in the browser)"); continue; }
      let good = true;
      const check = (cond, msg) => { if (!cond) { good = false; fail(where, msg); } };

      if (sc.goal === "implement") {
        const ref = await run(sc.code, sc.starterTests);
        check(allPass(ref), "tests fail on the reference code: " + failures(ref).join(" | "));
        const start = await run(sc.starterCode || "", sc.starterTests);
        check(!allPass(start), "tests already pass on the starter code");
      } else {
        const sol = await run(sc.code, sc.solutionTests);
        check(allPass(sol), "model tests fail on the code: " + failures(sol).join(" | "));
        check(sol.results.every((t) => t.warnings.length === 0), "model tests have warnings");
        if (sc.goal === "pass") {
          check(sol.results.length >= (sc.minTests || 1), "model suite has fewer than minTests tests");
          for (const tok of sc.mustUse || []) check(sc.solutionTests.includes(tok), "model tests don't use " + tok);
        }
        if (sc.goal === "catch") {
          const starter = await run(sc.code, sc.starterTests);
          check(allPass(starter), "starter tests fail on the real code: " + failures(starter).join(" | "));
          let starterCatchesAll = true;
          for (const m of sc.mutants || []) {
            const r = await run(m.code, sc.solutionTests);
            check(!allPass(r), "model tests miss mutant \"" + m.label + "\"");
            const s = await run(m.code, sc.starterTests);
            if (allPass(s)) starterCatchesAll = false;
          }
          check(!starterCatchesAll, "starter tests already catch every mutant (nothing to learn)");
        }
      }
      if (good) { ok++; console.log("  ✓ " + where); }
    }
  }
  console.log("\nTESTING TRACK: " + ok + " ok, " + bad + " problems, " + skipped + " DOM scenarios skipped");
  process.exit(bad ? 1 : 0);
})();
