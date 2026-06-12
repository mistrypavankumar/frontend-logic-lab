import { Challenge } from "@/lib/types";

// E4 — Async: retries, timeouts, concurrency control, the Promise combinators,
// caching, and request dedup. The auto-graded ones use tiny real delays; the
// timing/runtime ones (debounce, AbortController) are editable reasoning tasks.
export const asyncChallenges: Challenge[] = [
  {
    id: "ch-retry",
    slug: "retry-promise",
    title: "Retry a Promise",
    difficulty: "Advanced",
    category: "Async",
    tags: ["async", "promise", "resilience"],
    relatedMethods: ["Promise"],
    flags: { async: true, interview: true, realWorld: true },
    problem:
      "Implement retry(fn, retries) that calls the async fn and, on rejection, retries up to `retries` more times before rejecting with the last error.",
    realWorldScenario: "Retrying a flaky network request a couple of times before showing an error.",
    example: { input: "retry(flakyFn, 3)", output: "resolves once fn succeeds, else rejects after 4 attempts" },
    constraints: ["Resolve with the first success", "After exhausting retries, reject with the last error"],
    starterCode: `async function retry(fn, retries = 3) {
  // call fn(); on failure, retry until out of attempts
}`,
    builtInSolution: { language: "ts", code: "// No built-in; libraries: p-retry" },
    manualSolution: { language: "ts", code: "recursive: fn().catch(e => retries > 0 ? retry(fn, retries-1) : Promise.reject(e))" },
    internalImplementation: {
      language: "ts",
      code: `async function retry(fn, retries = 3) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}`,
    },
    solution: `async function retry(fn, retries = 3) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}`,
    tests: [
      { name: "succeeds after failures", kind: "normal", call: '(()=>{let n=0;const fn=()=>{n++;return n<3?Promise.reject(new Error("f")):Promise.resolve("ok");};return retry(fn,3);})()', expected: "ok" },
      { name: "succeeds first try", kind: "normal", call: "retry(()=>Promise.resolve(42), 3)", expected: 42 },
      { name: "rejects after exhausting", kind: "invalid", call: '(()=>{const fn=()=>Promise.reject(new Error("nope"));return retry(fn,2).catch(e=>e.message);})()', expected: "nope" },
    ],
    hiddenTests: [
      { name: "exactly retries+1 attempts", kind: "normal", call: '(()=>{let n=0;const fn=()=>{n++;return Promise.reject(new Error("x"));};return retry(fn,2).catch(()=>n);})()', expected: 3 },
    ],
    hints: ["Loop attempt 0..retries.", "Return on success; remember the error on failure.", "After the loop, throw the last error."],
    explanation:
      "A try/catch loop attempts up to retries+1 times, returning the first success and re-throwing the last error if all fail. Add a delay (and backoff) between attempts in production.",
    edgeCases: ["retries=0 → one attempt only", "Should reject with the LAST error, not the first", "Add exponential backoff in production"],
    timeComplexity: "O(retries)",
    spaceComplexity: "O(1)",
    industrialNotes: ["Add exponential backoff + jitter and a cap; don't retry non-idempotent writes blindly."],
    commonMistakes: ["Off-by-one (retrying one too few/many times).", "Swallowing the error instead of rethrowing."],
  },
  {
    id: "ch-timeout",
    slug: "timeout-promise",
    title: "Timeout a Promise",
    difficulty: "Advanced",
    category: "Async",
    tags: ["async", "promise", "race"],
    relatedMethods: ["Promise.race", "AbortSignal.timeout"],
    flags: { async: true, interview: true, realWorld: true },
    problem:
      "Implement timeout(promise, ms) that resolves/rejects with `promise`, but rejects with a Timeout error if it doesn't settle within ms.",
    realWorldScenario: "Failing fast when an API call hangs, instead of leaving a spinner forever.",
    example: { input: "timeout(fetchData(), 5000)", output: "rejects 'Timeout' if fetchData takes > 5s" },
    constraints: ["Resolve with the original value if it settles in time", "Otherwise reject with a Timeout error"],
    starterCode: `function timeout(promise, ms) {
  // reject if promise doesn't settle within ms
}`,
    builtInSolution: { language: "ts", code: "fetch(url, { signal: AbortSignal.timeout(ms) }) // for fetch specifically" },
    manualSolution: { language: "ts", code: "race the promise against a setTimeout-reject" },
    internalImplementation: {
      language: "ts",
      code: `function timeout(promise, ms) {
  const timer = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
  );
  return Promise.race([promise, timer]);
}`,
    },
    solution: `function timeout(promise, ms) {
  const timer = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
  );
  return Promise.race([promise, timer]);
}`,
    tests: [
      { name: "fast promise resolves", kind: "normal", call: 'timeout(Promise.resolve("fast"), 1000)', expected: "fast" },
      { name: "slow promise times out", kind: "normal", call: '(()=>timeout(new Promise(()=>{}), 10).catch(e=>e.message))()', expected: "Timeout" },
    ],
    hiddenTests: [
      { name: "value just in time", kind: "normal", call: '(()=>timeout(new Promise(r=>setTimeout(()=>r("done"),5)), 500))()', expected: "done" },
    ],
    hints: ["Build a promise that rejects after ms via setTimeout.", "Promise.race the input against the timer."],
    explanation:
      "Promise.race settles with whichever finishes first. If the timer wins, you get a rejection; otherwise the original result. For fetch specifically, AbortSignal.timeout also cancels the request.",
    edgeCases: ["The original promise keeps running after timeout (race doesn't cancel it)", "Use AbortController to actually cancel work", "ms=0 rejects almost immediately"],
    timeComplexity: "O(1) overhead",
    spaceComplexity: "O(1)",
    industrialNotes: ["race-based timeout doesn't cancel the underlying work — pair with AbortController to free resources."],
    commonMistakes: ["Assuming timeout cancels the original promise (it doesn't)."],
  },
  {
    id: "ch-map-limit",
    slug: "limit-concurrent-promises",
    title: "Limit Concurrent Promises",
    difficulty: "Expert",
    category: "Async",
    tags: ["async", "concurrency", "throttle"],
    relatedMethods: ["Promise.all"],
    flags: { async: true, interview: true, realWorld: true },
    problem:
      "Implement mapLimit(items, limit, fn) that runs fn over items with at most `limit` running at once, returning results IN ORDER.",
    realWorldScenario: "Uploading 100 files but only 4 at a time to avoid hammering the server.",
    example: { input: "mapLimit([1,2,3,4], 2, asyncDouble)", output: "[2,4,6,8] with max 2 in flight" },
    constraints: ["At most `limit` concurrent", "Results in original order", "Don't await items one-by-one (that's no concurrency)"],
    starterCode: `async function mapLimit(items, limit, fn) {
  // run fn over items, at most "limit" at a time, results in order
}`,
    builtInSolution: { language: "ts", code: "// No built-in; libraries: p-limit, p-map" },
    manualSolution: { language: "ts", code: "chunk items into groups of `limit`, Promise.all each group sequentially (simpler, less optimal)" },
    internalImplementation: {
      language: "ts",
      code: `async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;            // claim an index
      results[i] = await fn(items[i], i);
    }
  }
  const pool = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(pool);
  return results;
}`,
    },
    solution: `async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  const pool = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(pool);
  return results;
}`,
    tests: [
      { name: "results in order", kind: "normal", call: "mapLimit([1,2,3,4], 2, x=>Promise.resolve(x*2))", expected: [2, 4, 6, 8] },
      { name: "respects the limit", kind: "performance", call: "(()=>{let active=0,max=0;const fn=(x)=>{active++;max=Math.max(max,active);return new Promise(r=>setTimeout(()=>{active--;r(x);},5));};return mapLimit([1,2,3,4,5],2,fn).then(()=>max);})()", expected: 2 },
      { name: "empty input", kind: "empty", call: "mapLimit([], 2, x=>Promise.resolve(x))", expected: [] },
    ],
    hiddenTests: [
      { name: "limit larger than items", kind: "normal", call: "mapLimit([1,2], 10, x=>Promise.resolve(x+1))", expected: [2, 3] },
    ],
    hints: ["Spawn `limit` workers.", "Each worker grabs the next index and awaits fn, looping until items run out.", "Store results by index to keep order."],
    explanation:
      "A fixed pool of workers each pull the next index until the queue drains — so at most `limit` run concurrently while results stay ordered by index.",
    edgeCases: ["limit >= items → all run at once", "Empty → []", "One rejection rejects the whole thing (like Promise.all) — use allSettled to tolerate failures"],
    timeComplexity: "O(n) work, wall-clock ~ ceil(n/limit) * task time",
    spaceComplexity: "O(n) results",
    industrialNotes: ["Concurrency limits protect rate-limited APIs and the user's bandwidth.", "Reach for p-limit/p-map in production."],
    commonMistakes: ["Awaiting items sequentially (no concurrency).", "Losing result order by pushing instead of indexing."],
  },
  {
    id: "ch-promise-all",
    slug: "implement-promise-all",
    title: "Implement Promise.all",
    difficulty: "Advanced",
    category: "Async",
    tags: ["async", "promise", "polyfill"],
    relatedMethods: ["Promise.all"],
    flags: { async: true, interview: true, builtInAvailable: true },
    problem:
      "Implement promiseAll(promises) that resolves to an array of results IN ORDER, and rejects as soon as ANY input rejects.",
    realWorldScenario: "Loading user + settings + notifications in parallel before rendering a dashboard.",
    example: { input: "promiseAll([Promise.resolve(1), Promise.resolve(2)])", output: "[1, 2]" },
    constraints: ["Preserve input order", "Reject on first rejection", "Empty array resolves to []"],
    starterCode: `function promiseAll(promises) {
  // resolve to results in order; reject on first failure
}`,
    builtInSolution: { language: "ts", code: "Promise.all(promises)" },
    manualSolution: { language: "ts", code: "await each in a loop // WRONG: that's sequential, not parallel" },
    internalImplementation: {
      language: "ts",
      code: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = new Array(promises.length);
    let remaining = promises.length;
    if (remaining === 0) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p).then((value) => {
        results[i] = value;
        if (--remaining === 0) resolve(results);
      }, reject);
    });
  });
}`,
    },
    solution: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = new Array(promises.length);
    let remaining = promises.length;
    if (remaining === 0) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p).then((value) => {
        results[i] = value;
        if (--remaining === 0) resolve(results);
      }, reject);
    });
  });
}`,
    tests: [
      { name: "resolves in order", kind: "normal", call: "promiseAll([Promise.resolve(1), Promise.resolve(2), 3])", expected: [1, 2, 3] },
      { name: "order despite timing", kind: "normal", call: 'promiseAll([new Promise(r=>setTimeout(()=>r("a"),20)), Promise.resolve("b")])', expected: ["a", "b"] },
      { name: "rejects on first failure", kind: "invalid", call: '(()=>promiseAll([Promise.resolve(1), Promise.reject(new Error("x"))]).catch(e=>e.message))()', expected: "x" },
      { name: "empty → []", kind: "empty", call: "promiseAll([])", expected: [] },
    ],
    hiddenTests: [
      { name: "wraps non-promise values", kind: "normal", call: "promiseAll([1, 2, 3])", expected: [1, 2, 3] },
    ],
    hints: ["Store each result by its index (not push) to keep order.", "Count completions; resolve when all done.", "Wrap items in Promise.resolve so plain values work."],
    explanation:
      "Kick off all promises at once, store each result by index, and resolve when the count hits zero. The first rejection rejects the whole thing. Indexing (not pushing) preserves order regardless of timing.",
    edgeCases: ["Empty → resolves []", "Non-promise values are wrapped", "First rejection wins; others are ignored"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    industrialNotes: ["Use allSettled when you want all results even if some fail."],
    commonMistakes: ["await-ing in a loop (sequential).", "push()-ing results (loses order)."],
  },
  {
    id: "ch-promise-allsettled",
    slug: "implement-promise-allsettled",
    title: "Implement Promise.allSettled",
    difficulty: "Advanced",
    category: "Async",
    tags: ["async", "promise", "polyfill"],
    relatedMethods: ["Promise.allSettled"],
    flags: { async: true, interview: true, builtInAvailable: true },
    problem:
      "Implement promiseAllSettled(promises) that NEVER rejects — it resolves to an array of { status: 'fulfilled', value } or { status: 'rejected', reason }.",
    realWorldScenario: "Firing several independent saves and reporting which succeeded and which failed.",
    example: { input: "promiseAllSettled([Promise.resolve(1), Promise.reject(e)])", output: "[{status:'fulfilled',value:1},{status:'rejected',reason:e}]" },
    constraints: ["Never rejects", "Preserve order", "Wrap each outcome in a status object"],
    starterCode: `function promiseAllSettled(promises) {
  // resolve to status objects; never reject
}`,
    builtInSolution: { language: "ts", code: "Promise.allSettled(promises)" },
    manualSolution: { language: "ts", code: "map each to .then(value=>({status:'fulfilled',value}), reason=>({status:'rejected',reason})) then Promise.all" },
    internalImplementation: {
      language: "ts",
      code: `function promiseAllSettled(promises) {
  return Promise.all(
    promises.map((p) =>
      Promise.resolve(p).then(
        (value) => ({ status: "fulfilled", value }),
        (reason) => ({ status: "rejected", reason })
      )
    )
  );
}`,
    },
    solution: `function promiseAllSettled(promises) {
  return Promise.all(
    promises.map((p) =>
      Promise.resolve(p).then(
        (value) => ({ status: "fulfilled", value }),
        (reason) => ({ status: "rejected", reason })
      )
    )
  );
}`,
    tests: [
      { name: "statuses in order", kind: "normal", call: '(()=>promiseAllSettled([Promise.resolve(1), Promise.reject(new Error("bad"))]).then(rs=>rs.map(r=>r.status)))()', expected: ["fulfilled", "rejected"] },
      { name: "fulfilled value", kind: "normal", call: "(()=>promiseAllSettled([Promise.resolve(7)]).then(rs=>rs[0].value))()", expected: 7 },
      { name: "rejected reason", kind: "invalid", call: '(()=>promiseAllSettled([Promise.reject(new Error("oops"))]).then(rs=>rs[0].reason.message))()', expected: "oops" },
      { name: "empty → []", kind: "empty", call: "promiseAllSettled([])", expected: [] },
    ],
    hiddenTests: [],
    hints: ["Convert every promise into one that always FULFILLS with a status object.", "Then Promise.all those (they never reject)."],
    explanation:
      "By catching each promise into a status object, none of them reject, so Promise.all always resolves — giving you a full report of successes and failures.",
    edgeCases: ["Never rejects, even if all inputs reject", "Order preserved", "Empty → []"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    industrialNotes: ["Use for independent operations where one failure shouldn't abort the rest (bulk saves, prefetching)."],
    commonMistakes: ["Letting a rejection escape (using Promise.all without the per-promise catch)."],
  },
  {
    id: "ch-promise-race",
    slug: "implement-promise-race",
    title: "Implement Promise.race",
    difficulty: "Intermediate",
    category: "Async",
    tags: ["async", "promise", "polyfill"],
    relatedMethods: ["Promise.race"],
    flags: { async: true, interview: true, builtInAvailable: true },
    problem:
      "Implement promiseRace(promises) that settles (resolve OR reject) with whichever input settles first.",
    realWorldScenario: "Using the fastest of several mirror endpoints, or a value-vs-timeout race.",
    example: { input: "promiseRace([slow, fast])", output: "settles with `fast`" },
    constraints: ["First settlement wins (resolve or reject)", "Later settlements are ignored"],
    starterCode: `function promiseRace(promises) {
  // settle with the first promise to settle
}`,
    builtInSolution: { language: "ts", code: "Promise.race(promises)" },
    manualSolution: { language: "ts", code: "new Promise((res, rej) => promises.forEach(p => Promise.resolve(p).then(res, rej)))" },
    internalImplementation: {
      language: "ts",
      code: `function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    for (const p of promises) {
      Promise.resolve(p).then(resolve, reject);
    }
  });
}`,
    },
    solution: `function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    for (const p of promises) {
      Promise.resolve(p).then(resolve, reject);
    }
  });
}`,
    tests: [
      { name: "fastest resolve wins", kind: "normal", call: 'promiseRace([new Promise(r=>setTimeout(()=>r("slow"),50)), Promise.resolve("fast")])', expected: "fast" },
      { name: "first rejection wins", kind: "invalid", call: '(()=>promiseRace([Promise.reject(new Error("err")), new Promise(r=>setTimeout(()=>r("late"),50))]).catch(e=>e.message))()', expected: "err" },
    ],
    hiddenTests: [
      { name: "fastest of timers", kind: "normal", call: '(()=>promiseRace([new Promise(r=>setTimeout(()=>r("a"),30)), new Promise(r=>setTimeout(()=>r("b"),5))]))()', expected: "b" },
    ],
    hints: ["A promise can only settle once.", "Attach resolve/reject to EVERY input; the first to fire wins."],
    explanation:
      "Since a promise settles only once, simply forwarding every input's resolve/reject means the first to settle determines the result — the rest are ignored.",
    edgeCases: ["First to SETTLE wins, even if it's a rejection", "Empty array never settles (don't pass empty)", "Losers keep running"],
    timeComplexity: "O(n) to attach",
    spaceComplexity: "O(1)",
    industrialNotes: ["Pair with a timeout promise to bound any operation."],
    commonMistakes: ["Thinking only resolutions win (a rejection can win too)."],
  },
  {
    id: "ch-api-cache",
    slug: "api-response-cache",
    title: "API Response Cache",
    difficulty: "Industrial",
    category: "Async",
    tags: ["async", "cache", "memoize"],
    relatedMethods: ["Map"],
    flags: { async: true, realWorld: true },
    problem:
      "Implement withCache(fn) that memoizes an async fn by its key argument — the same key never calls fn twice (the promise itself is cached).",
    realWorldScenario: "Avoiding duplicate fetches for the same resource across components.",
    example: { input: "const get = withCache(fetchUser); get(1); get(1)", output: "fetchUser called once" },
    constraints: ["Cache by key", "Cache the promise (so in-flight calls dedupe too)", "Different keys call fn separately"],
    starterCode: `function withCache(fn) {
  // memoize fn(key) by key
}`,
    builtInSolution: { language: "ts", code: "// React Query / SWR do this for you in real apps" },
    manualSolution: { language: "ts", code: "a Map from key → promise" },
    internalImplementation: {
      language: "ts",
      code: `function withCache(fn) {
  const cache = new Map();
  return (key) => {
    if (cache.has(key)) return cache.get(key);
    const promise = Promise.resolve(fn(key));
    cache.set(key, promise);
    return promise;
  };
}`,
    },
    solution: `function withCache(fn) {
  const cache = new Map();
  return (key) => {
    if (cache.has(key)) return cache.get(key);
    const promise = Promise.resolve(fn(key));
    cache.set(key, promise);
    return promise;
  };
}`,
    tests: [
      { name: "same key calls fn once", kind: "normal", call: '(()=>{let calls=0;const get=withCache(k=>{calls++;return Promise.resolve(k+"!");});return get("a").then(()=>get("a")).then(v=>v+":"+calls);})()', expected: "a!:1" },
      { name: "different keys call separately", kind: "normal", call: '(()=>{let calls=0;const get=withCache(k=>{calls++;return Promise.resolve(k);});return Promise.all([get("a"),get("b"),get("a")]).then(()=>calls);})()', expected: 2 },
    ],
    hiddenTests: [
      { name: "concurrent same-key dedupes", kind: "duplicate", call: '(()=>{let calls=0;const get=withCache(k=>{calls++;return new Promise(r=>setTimeout(()=>r(k),10));});get("x");get("x");return get("x").then(()=>calls);})()', expected: 1 },
    ],
    hints: ["Use a Map keyed by the argument.", "Cache the PROMISE, not the resolved value — that dedupes in-flight calls too.", "Return the cached promise on a hit."],
    explanation:
      "Caching the promise (not the value) means two simultaneous calls for the same key share one in-flight request. The first call populates the cache; the rest get the same promise.",
    edgeCases: ["Caches rejections too — evict on failure if you want retries", "No expiry here — add TTL for fresh data", "Key must be a primitive (Map can use objects but identity matters)"],
    timeComplexity: "O(1) per lookup",
    spaceComplexity: "O(unique keys)",
    industrialNotes: ["Production caches add TTL, invalidation, and reject-eviction — that's what SWR/React Query give you.", "Caching the promise is the trick that also dedupes concurrent requests."],
    commonMistakes: ["Caching the resolved value (misses in-flight dedup).", "Never evicting failed requests."],
  },
  {
    id: "ch-request-dedup",
    slug: "request-deduplication",
    title: "Request Deduplication",
    difficulty: "Industrial",
    category: "Async",
    tags: ["async", "dedup", "in-flight"],
    relatedMethods: ["Map"],
    flags: { async: true, realWorld: true },
    problem:
      "Implement dedupe(fn) so concurrent calls with the same key share ONE in-flight promise, but a new call AFTER it settles triggers a fresh request.",
    realWorldScenario: "Two components mount and both request /me at once — fire one request, not two.",
    example: { input: "const f = dedupe(fetchMe); f(); f()", output: "one in-flight request shared by both" },
    constraints: ["Share the promise while in-flight", "Remove it once settled so later calls re-fetch", "Key-based"],
    starterCode: `function dedupe(fn) {
  // share in-flight promises by key; clear on settle
}`,
    builtInSolution: { language: "ts", code: "// SWR/React Query dedupe within a window automatically" },
    manualSolution: { language: "ts", code: "a Map of in-flight promises; delete in .finally()" },
    internalImplementation: {
      language: "ts",
      code: `function dedupe(fn) {
  const inflight = new Map();
  return (key) => {
    if (inflight.has(key)) return inflight.get(key);
    const promise = Promise.resolve(fn(key)).finally(() => inflight.delete(key));
    inflight.set(key, promise);
    return promise;
  };
}`,
    },
    solution: `function dedupe(fn) {
  const inflight = new Map();
  return (key) => {
    if (inflight.has(key)) return inflight.get(key);
    const promise = Promise.resolve(fn(key)).finally(() => inflight.delete(key));
    inflight.set(key, promise);
    return promise;
  };
}`,
    tests: [
      { name: "concurrent calls share one request", kind: "duplicate", call: '(()=>{let calls=0;const f=dedupe(k=>{calls++;return new Promise(r=>setTimeout(()=>r(k),10));});f("x");f("x");return f("x").then(()=>calls);})()', expected: 1 },
      { name: "re-fetches after settle", kind: "normal", call: '(()=>{let calls=0;const f=dedupe(k=>{calls++;return Promise.resolve(k);});return f("x").then(()=>f("x")).then(()=>calls);})()', expected: 2 },
    ],
    hiddenTests: [
      { name: "different keys independent", kind: "normal", call: '(()=>{let calls=0;const f=dedupe(k=>{calls++;return Promise.resolve(k);});return Promise.all([f("a"),f("b")]).then(()=>calls);})()', expected: 2 },
    ],
    hints: ["Track in-flight promises in a Map.", "Use .finally() to delete the entry when it settles.", "Return the existing promise if one is in flight."],
    explanation:
      "Unlike a cache, dedupe deletes the entry on settle — so it only collapses CONCURRENT duplicates, while later calls still get fresh data. The .finally() cleanup is the key difference.",
    edgeCases: ["After settle, the next call re-fetches (vs cache, which keeps it)", "finally runs on both success and failure", "Different keys are independent"],
    timeComplexity: "O(1) per call",
    spaceComplexity: "O(in-flight keys)",
    industrialNotes: ["Dedup = collapse concurrent duplicates; cache = remember results. They're different tools — know which you need."],
    commonMistakes: ["Forgetting .finally() cleanup (turns dedup into a permanent cache).", "Confusing dedup with caching."],
  },
  {
    id: "ch-async-debounce",
    slug: "async-debounce",
    title: "Async Debounce",
    difficulty: "Advanced",
    category: "Async",
    tags: ["async", "debounce", "timing"],
    relatedMethods: ["setTimeout"],
    flags: { async: true, realWorld: true },
    problem:
      "Build debounceAsync(fn, ms): each call resets a timer; fn runs only after ms of quiet, and the returned promise resolves with that final call's result. (Timing-based — reason it through in the editor.)",
    realWorldScenario: "Debouncing a search-as-you-type API call so you fire one request after the user stops typing.",
    example: { input: "rapid calls within ms", output: "fn runs once, for the last call" },
    constraints: ["Reset the timer on every call", "Only the trailing call runs", "Return a promise that resolves with fn's result"],
    starterCode: `function debounceAsync(fn, ms) {
  // reset a timer each call; run fn after ms of silence
}`,
    builtInSolution: { language: "ts", code: "// No built-in; lodash.debounce (sync) or a custom async version" },
    manualSolution: { language: "ts", code: "clearTimeout + setTimeout, resolving the promise inside the timer" },
    internalImplementation: {
      language: "ts",
      code: `function debounceAsync(fn, ms) {
  let timer;
  return (...args) =>
    new Promise((resolve, reject) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        Promise.resolve(fn(...args)).then(resolve, reject);
      }, ms);
    });
}`,
    },
    solution: `function debounceAsync(fn, ms) {
  let timer;
  return (...args) =>
    new Promise((resolve, reject) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        Promise.resolve(fn(...args)).then(resolve, reject);
      }, ms);
    });
}`,
    hints: ["Keep a single timer across calls.", "clearTimeout then setTimeout on every call.", "Resolve the promise inside the timer callback."],
    explanation:
      "Each call cancels the pending timer and starts a new one, so only the final call (after ms of silence) actually runs fn. Combine with AbortController to also cancel the in-flight request from earlier calls.",
    edgeCases: ["Earlier calls' promises may never resolve (only the last fires) — design around that", "Leading vs trailing edge is a choice", "Pair with AbortController to cancel stale requests"],
    timeComplexity: "O(1) per call",
    spaceComplexity: "O(1)",
    industrialNotes: ["For search, debounce the input AND abort the previous request (see the AbortController lesson)."],
    commonMistakes: ["Creating a new timer variable per call (no debouncing).", "Leaking promises that never settle."],
  },
  {
    id: "ch-cancel-stale-search",
    slug: "cancel-stale-search",
    title: "Cancel a Stale Search Request",
    difficulty: "Advanced",
    category: "Async",
    tags: ["async", "abortcontroller", "race-condition"],
    relatedMethods: ["AbortController", "fetch"],
    flags: { async: true, realWorld: true },
    problem:
      "Sketch a search function that aborts the PREVIOUS request whenever a new query arrives, so a slow old response can't overwrite newer results. (Runtime/fetch — reason it through in the editor.)",
    realWorldScenario: "Type-ahead search where responses can arrive out of order.",
    example: { input: "type 're' then 're-act' quickly", output: "the 're' request is aborted; only 're-act' results show" },
    constraints: ["Abort the in-flight request before starting a new one", "Ignore AbortError (it's expected)"],
    starterCode: `function makeSearch(onResults) {
  let controller = null;
  return function search(query) {
    // abort the previous request, start a new one
  };
}`,
    builtInSolution: { language: "ts", code: "pass AbortSignal to fetch; call controller.abort() on the next keystroke" },
    manualSolution: { language: "ts", code: "track a request id and ignore responses whose id is stale" },
    internalImplementation: {
      language: "ts",
      code: `function makeSearch(onResults) {
  let controller = null;
  return function search(query) {
    if (controller) controller.abort();      // cancel the previous request
    controller = new AbortController();
    fetch("/api/search?q=" + encodeURIComponent(query), { signal: controller.signal })
      .then((r) => r.json())
      .then(onResults)
      .catch((err) => { if (err.name !== "AbortError") throw err; });
  };
}`,
    },
    solution: `function makeSearch(onResults) {
  let controller = null;
  return function search(query) {
    if (controller) controller.abort();
    controller = new AbortController();
    fetch("/api/search?q=" + encodeURIComponent(query), { signal: controller.signal })
      .then((r) => r.json())
      .then(onResults)
      .catch((err) => { if (err.name !== "AbortError") throw err; });
  };
}`,
    hints: ["Keep the current AbortController in a closure.", "abort() it before starting the next request.", "Swallow AbortError — it's the expected cancellation."],
    explanation:
      "Aborting the previous request on each new query prevents an old, slow response from overwriting newer results — the classic search race condition. The id-tracking approach (ignore stale responses) is a fetch-free alternative.",
    edgeCases: ["Aborted fetch rejects with AbortError — handle it separately", "Without cancellation, out-of-order responses cause flicker/wrong results", "In React, abort in the useEffect cleanup"],
    timeComplexity: "—",
    spaceComplexity: "O(1)",
    industrialNotes: ["Always cancel or id-guard search requests; this is one of the most common real-world race conditions."],
    commonMistakes: ["Showing AbortError as a real error.", "Not cancelling, then rendering stale results."],
  },
];
