/* eslint-disable */
// Content verifier: runs every lesson practiceTest and every challenge
// test/hiddenTest against its OWN solution, using a JS mirror of the app's
// async runner (lib/runner.ts). Expects compiled JS under /tmp/fllverify
// (scripts/verify.sh produces it). Exits non-zero on any failure.
const fs = require("fs");
const path = require("path");

const ROOT = "/tmp/fllverify";

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
  const body =
    `"use strict";const __l=[];const console={log:(...a)=>__l.push(a.map(__s).join(" ")),error:(...a)=>__l.push(a.map(__s).join(" ")),warn:(...a)=>__l.push(a.map(__s).join(" "))};${code}
return (async()=>{const __r=[];const __to=(p)=>Promise.race([p,new Promise((_,j)=>setTimeout(()=>j(new Error("Timed out (2000ms)")),2000))]);
${tests.map((t, i) => `try{const __raw=(${t.call});const __v=(__raw&&typeof __raw.then==="function")?await __to(__raw):__raw;__r.push({i:${i},ok:1,v:__s(__v)});}catch(e){__r.push({i:${i},ok:0,e:String(e)});}`).join("\n")}
return {__r};})();`;
  let raw;
  try { raw = await new Function("__s", body)(show); }
  catch (e) { return tests.map((t) => ({ name: t.name, passed: false, fatal: String(e) })); }
  return tests.map((t, i) => {
    const r = raw.__r.find((x) => x.i === i);
    const exp = show(t.expected);
    if (!r || !r.ok) return { name: t.name, passed: false, error: r && r.e };
    return { name: t.name, passed: r.v === exp, exp, got: r.v };
  });
}

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.isFile() && e.name.endsWith(".js")) out.push(p);
  }
  return out;
}

(async () => {
  if (!fs.existsSync(ROOT)) {
    console.error("No compiled output at " + ROOT + " — run scripts/verify.sh");
    process.exit(2);
  }
  const files = walk(ROOT).filter((f) => {
    const b = path.basename(f);
    return b.startsWith("challenges") || b.startsWith("lessons");
  });
  let grandTotal = 0, grandFailed = 0;
  for (const file of files.sort()) {
    const mod = require(file);
    let total = 0, failed = 0, items = 0, graded = 0;
    for (const arr of Object.values(mod)) {
      if (!Array.isArray(arr)) continue;
      for (const item of arr) {
        items++;
        // challenge: solution string + tests/hiddenTests. lesson: solution.code + practiceTests.
        const code = typeof item.solution === "string" ? item.solution : item.solution?.code;
        const tests = [
          ...(item.tests || []),
          ...(item.hiddenTests || []),
          ...(item.practiceTests || []),
        ];
        if (!code || tests.length === 0) continue;
        graded++;
        const res = await run(code, tests);
        total += res.length;
        const bad = res.filter((r) => !r.passed);
        if (bad.length) {
          failed += bad.length;
          console.log("❌ " + (item.slug || item.id));
          bad.forEach((b) =>
            console.log("   - " + b.name + " " +
              (b.error ? "threw " + b.error : b.fatal ? "FATAL " + b.fatal : "exp=" + b.exp + " got=" + b.got))
          );
        }
      }
    }
    grandTotal += total; grandFailed += failed;
    const tag = failed ? "FAIL" : "ok";
    console.log(`[${tag}] ${path.basename(file).padEnd(28)} ${items} items, ${graded} graded, ${total - failed}/${total} tests`);
  }
  console.log(`\nTOTAL: ${grandTotal - grandFailed}/${grandTotal} tests pass`);
  process.exit(grandFailed ? 1 : 0);
})();
