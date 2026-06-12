import { Lesson } from "@/lib/types";

// Modern async & utility APIs. Where a concept can be checked synchronously
// (shape of the return value, no-throw behaviour) the practice is auto-graded;
// runtime-only APIs (AbortController, Temporal) are editable + explained.
export const modernAsyncLessons: Lesson[] = [
  {
    id: "m-promise-withresolvers",
    slug: "promise-withresolvers",
    title: "Promise.withResolvers()",
    category: "Async JavaScript",
    difficulty: "Advanced",
    order: 131,
    estimatedMinutes: 8,
    isModernMethod: true,
    relatedMethods: ["Promise"],
    summary:
      "Promise.withResolvers() hands you a promise AND its resolve/reject functions together, so you can settle it from outside the executor.",
    realLifeExample:
      "Getting a sealed envelope (the promise) plus the only key that can open it (resolve), so someone elsewhere can open it later.",
    codeExample: {
      language: "ts",
      code: `const { promise, resolve, reject } = Promise.withResolvers();
button.onclick = () => resolve('clicked'); // settle later, from anywhere
await promise;`,
    },
    practiceTask:
      "Implement withResolvers() returning { promise, resolve, reject } where resolve/reject control the promise.",
    practiceStarter: `function withResolvers() {
  // create a promise and expose its resolve/reject
}`,
    practiceTests: [
      {
        name: "exposes promise + functions",
        kind: "normal",
        call: "(()=>{const r=withResolvers();return r.promise instanceof Promise && typeof r.resolve==='function' && typeof r.reject==='function';})()",
        expected: true,
      },
    ],
    hint: "Declare resolve/reject outside, capture them inside new Promise((res, rej) => { ... }), then return all three.",
    solution: {
      language: "ts",
      code: `function withResolvers() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}`,
    },
    explanation:
      "Capturing resolve/reject out of the executor lets unrelated code settle the promise — perfect for event-driven flows and signals.",
    deepDive: {
      problemSolved:
        "The old 'let resolve; const p = new Promise(r => resolve = r)' boilerplate, repeated everywhere you need to resolve a promise from outside.",
      realWorldUseCase: "Bridging an event (a click, a websocket message, a modal result) into an awaitable promise.",
      builtInSolution: { language: "ts", code: "const { promise, resolve } = Promise.withResolvers();" },
      manualSolution: {
        language: "ts",
        code: `let resolve;
const promise = new Promise((r) => (resolve = r));`,
      },
      internalImplementation: {
        language: "ts",
        code: `Promise.myWithResolvers = function () {
  let resolve, reject;
  const promise = new this((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
};`,
      },
      edgeCases: ["Resolving twice is a no-op (first settle wins)", "Reject after resolve is ignored", "Works with subclasses via `this`"],
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      browserSupport: "Chrome/Edge 119+, Firefox 121+, Safari 17.4+, Node 22+. Fallback: the manual capture pattern.",
      whenNotToUse: "When the promise resolves inside its own executor — just use new Promise normally.",
      industrialNotes: ["Cleans up modal/dialog 'await the user's choice' patterns and one-shot event awaiting."],
      commonMistakes: ["Forgetting that only the first settle counts."],
    },
  },
  {
    id: "m-promise-try",
    slug: "promise-try",
    title: "Promise.try()",
    category: "Async JavaScript",
    difficulty: "Advanced",
    order: 132,
    estimatedMinutes: 7,
    isModernMethod: true,
    relatedMethods: ["Promise.resolve"],
    summary:
      "Promise.try(fn) runs fn and always returns a promise — even if fn throws SYNCHRONOUSLY, the error becomes a rejection instead of a thrown exception.",
    realLifeExample:
      "Wrapping a task in a safety net so that whether it trips immediately or later, you always catch it the same way.",
    codeExample: {
      language: "ts",
      code: `Promise.try(() => mightThrowSyncOrAsync())
  .then(handle)
  .catch(handleError); // catches BOTH sync throws and async rejections`,
    },
    practiceTask:
      "Implement promiseTry(fn) that returns a Promise and turns a synchronous throw inside fn into a rejection.",
    practiceStarter: `function promiseTry(fn) {
  // return a promise; a sync throw must NOT escape synchronously
}`,
    practiceTests: [
      { name: "returns a promise", kind: "normal", call: "promiseTry(() => 1) instanceof Promise", expected: true },
      {
        name: "sync throw does not escape",
        kind: "invalid",
        call: "(()=>{try{promiseTry(()=>{throw new Error('x')});return true;}catch(e){return false;}})()",
        expected: true,
      },
    ],
    hint: "new Promise((resolve) => resolve(fn())) — if fn throws inside the executor, the promise rejects automatically.",
    solution: {
      language: "ts",
      code: `function promiseTry(fn) {
  return new Promise((resolve) => resolve(fn()));
}`,
    },
    explanation:
      "Calling fn inside the executor means a synchronous throw is caught by the Promise machinery and surfaces as a rejection, unifying error handling.",
    deepDive: {
      problemSolved:
        "Mixing sync and async code means a function might throw immediately OR reject later — forcing two different error paths. Promise.try unifies them.",
      realWorldUseCase: "Wrapping a possibly-sync, possibly-async plugin/handler so callers only need one .catch().",
      builtInSolution: { language: "ts", code: "Promise.try(handler).catch(report)" },
      manualSolution: { language: "ts", code: "Promise.resolve().then(handler).catch(report)" },
      internalImplementation: {
        language: "ts",
        code: `Promise.myTry = (fn, ...args) =>
  new Promise((resolve) => resolve(fn(...args)));`,
      },
      edgeCases: ["fn returns a promise → it's adopted/flattened", "fn throws sync → rejection", "fn returns a value → resolved promise"],
      timeComplexity: "O(1) overhead",
      spaceComplexity: "O(1)",
      browserSupport: "Chrome/Edge 128+, Firefox 134+, Safari 18.2+, Node 22+. Fallback: Promise.resolve().then(fn).",
      whenNotToUse: "When fn is already guaranteed async — the extra wrap is unnecessary.",
      industrialNotes: ["Great for normalizing user-supplied callbacks/handlers that may or may not be async."],
      commonMistakes: ["Using Promise.resolve(fn()) — that still throws synchronously if fn throws."],
    },
  },
  {
    id: "m-regexp-escape",
    slug: "regexp-escape",
    title: "RegExp.escape()",
    category: "Data Transformation",
    difficulty: "Intermediate",
    order: 135,
    estimatedMinutes: 7,
    isModernMethod: true,
    relatedMethods: ["RegExp"],
    practiceChallengeIds: ["ch-highlight-keyword"],
    summary:
      "RegExp.escape(str) escapes special regex characters in a string so you can safely build a RegExp from user input.",
    realLifeExample:
      "Putting quotes around a search phrase so the search engine treats '.' as a literal dot, not 'any character'.",
    codeExample: {
      language: "ts",
      code: `const term = 'a.b*c';
const re = new RegExp(RegExp.escape(term)); // matches the literal "a.b*c"`,
    },
    practiceTask:
      "Implement escapeRegExp(str) that backslash-escapes regex special characters: . * + ? ^ $ { } ( ) | [ ] \\",
    practiceStarter: `function escapeRegExp(str) {
  // escape every regex special character
}`,
    practiceTests: [
      { name: "escapes a dot", kind: "normal", call: "escapeRegExp('a.c')", expected: "a\\.c" },
      { name: "escapes plus", kind: "normal", call: "escapeRegExp('1+1')", expected: "1\\+1" },
      { name: "leaves letters alone", kind: "normal", call: "escapeRegExp('abc')", expected: "abc" },
    ],
    hint: "Use String.replace with the regex /[.*+?^${}()|[\\]\\\\]/g and replacement '\\\\$&'.",
    solution: {
      language: "ts",
      code: `function escapeRegExp(str) {
  return str.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
}`,
    },
    explanation:
      "$& in the replacement means 'the matched character', so each special char gets a backslash in front — making it literal inside a RegExp.",
    deepDive: {
      problemSolved:
        "Building a RegExp from user input (search boxes) is a security/correctness bug: characters like . ( | change the pattern's meaning (ReDoS, wrong matches).",
      realWorldUseCase: "Highlighting a user's search term in results, or filtering with a user-typed pattern.",
      builtInSolution: { language: "ts", code: "new RegExp(RegExp.escape(userInput), 'gi')" },
      manualSolution: { language: "ts", code: "userInput.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')" },
      internalImplementation: {
        language: "ts",
        code: `function escapeRegExp(s) {
  return s.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
}`,
      },
      edgeCases: ["Empty string → empty string", "Already-escaped input gets double-escaped (still matches literally)", "Hyphen only matters inside character classes"],
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      browserSupport: "Very new (2025): Chrome 136+, Firefox 134+, Safari 18.4+, Node 24+. Use the manual replace as a reliable fallback today.",
      whenNotToUse: "When the pattern is a fixed literal you control — no escaping needed.",
      industrialNotes: ["Always escape user input before new RegExp() to prevent ReDoS and broken searches."],
      commonMistakes: ["Forgetting to escape the backslash itself.", "Building RegExp from raw user input."],
    },
  },
  {
    id: "m-queuemicrotask",
    slug: "queue-microtask",
    title: "queueMicrotask()",
    category: "Async JavaScript",
    difficulty: "Advanced",
    order: 133,
    estimatedMinutes: 7,
    isModernMethod: true,
    relatedMethods: ["Promise", "setTimeout"],
    summary:
      "queueMicrotask(fn) schedules fn to run right after the current synchronous code finishes — BEFORE any setTimeout (which is a macrotask).",
    realLifeExample:
      "Finishing the sentence you're saying (sync code), then immediately answering a quick whispered question (microtask) before starting the next agenda item (macrotask/timeout).",
    codeExample: {
      language: "ts",
      code: `console.log('1 sync');
queueMicrotask(() => console.log('3 microtask'));
console.log('2 sync');
// order: 1, 2, 3 — the microtask runs after sync, before timers`,
    },
    practiceTask:
      "In the editor, predict then verify the order. Use console.log + queueMicrotask + setTimeout and reason about microtask vs macrotask ordering.",
    practiceStarter: `console.log('A');
setTimeout(() => console.log('D (timeout)'), 0);
queueMicrotask(() => console.log('C (microtask)'));
console.log('B');
// Expected reasoning: A, B, then C, then D`,
    // Not auto-graded: the sandbox returns before the event loop flushes
    // microtasks/macrotasks, so this is a reasoning exercise.
    hint: "Sync code runs first (A, B). Microtasks (C) drain before macrotasks/timers (D).",
    solution: {
      language: "ts",
      code: `// Console order: A, B, C, D
// 1) sync: A, B
// 2) microtask queue: C
// 3) macrotask (timer) queue: D`,
    },
    explanation:
      "After each chunk of sync code, the engine empties the ENTIRE microtask queue before taking one macrotask. Promises also use the microtask queue.",
    deepDive: {
      problemSolved: "Deferring work to 'after current code' without the full timer delay or losing priority to timers.",
      realWorldUseCase: "Batching state notifications, or ensuring a callback runs after the current call stack but before paint/timers.",
      builtInSolution: { language: "ts", code: "queueMicrotask(() => flushPendingUpdates());" },
      manualSolution: { language: "ts", code: "Promise.resolve().then(() => flushPendingUpdates());" },
      internalImplementation: { language: "ts", code: "const queueMicrotask = (cb) => Promise.resolve().then(cb);" },
      edgeCases: [
        "A microtask that queues more microtasks can starve the macrotask queue (infinite loop risk)",
        "Throwing inside reports to the global error handler",
        "Runs before requestAnimationFrame and setTimeout",
      ],
      timeComplexity: "O(1) to schedule",
      spaceComplexity: "O(1)",
      browserSupport: "Chrome 71+, Firefox 69+, Safari 12.1+, Node 11+. Fallback: Promise.resolve().then(cb).",
      whenNotToUse: "When you actually want to yield to the browser (rendering, timers) — use setTimeout/requestAnimationFrame.",
      industrialNotes: ["Understanding micro vs macro tasks explains most 'why did this log in that order' bugs."],
      commonMistakes: ["Assuming setTimeout(0) runs before promises/microtasks (it does not)."],
    },
  },
  {
    id: "m-abortcontroller",
    slug: "abort-controller",
    title: "AbortController",
    category: "Async JavaScript",
    difficulty: "Advanced",
    order: 134,
    estimatedMinutes: 9,
    isModernMethod: true,
    relatedMethods: ["fetch", "addEventListener"],
    practiceChallengeIds: ["ch-cancel-stale-search"],
    summary:
      "AbortController produces a signal you pass to fetch (or listeners). Calling controller.abort() cancels the request/listener — the key to cancelling stale searches.",
    realLifeExample:
      "A 'cancel order' button at a restaurant: once you press it, the kitchen stops cooking that order even if it was mid-prep.",
    codeExample: {
      language: "ts",
      code: `const controller = new AbortController();
fetch('/api/search?q=react', { signal: controller.signal })
  .then(r => r.json())
  .catch(err => { if (err.name === 'AbortError') return; /* cancelled */ });

controller.abort(); // cancel it`,
    },
    practiceTask:
      "In the editor, sketch a search effect that aborts the previous request when a new keystroke arrives (cleanup calls controller.abort()).",
    practiceStarter: `// Pseudocode for a React effect — fill in the cancellation:
function searchEffect(query) {
  const controller = new AbortController();
  fetch('/api/search?q=' + query, { signal: controller.signal })
    .then(r => r.json())
    .then(showResults)
    .catch(err => { if (err.name !== 'AbortError') throw err; });

  // cleanup: cancel the in-flight request when query changes/unmounts
  return () => { /* call abort here */ };
}`,
    hint: "The cleanup function should call controller.abort() so the previous fetch is cancelled before the next one starts.",
    solution: {
      language: "ts",
      code: `function searchEffect(query) {
  const controller = new AbortController();
  fetch('/api/search?q=' + query, { signal: controller.signal })
    .then(r => r.json())
    .then(showResults)
    .catch(err => { if (err.name !== 'AbortError') throw err; });
  return () => controller.abort(); // cancel stale request
}`,
    },
    explanation:
      "Aborting the previous request on every new keystroke prevents an old, slow response from overwriting newer results (a classic race condition).",
    deepDive: {
      problemSolved: "Stale-response race conditions in search/autocomplete, and leaking requests on unmount.",
      realWorldUseCase: "Type-ahead search, cancelling uploads, timing out a fetch via AbortSignal.timeout(ms).",
      builtInSolution: { language: "ts", code: "fetch(url, { signal: AbortSignal.timeout(5000) })" },
      manualSolution: {
        language: "ts",
        code: `const c = new AbortController();
const t = setTimeout(() => c.abort(), 5000);
fetch(url, { signal: c.signal }).finally(() => clearTimeout(t));`,
      },
      internalImplementation: {
        language: "ts",
        code: `// Conceptual: a signal is an event target flipped to "aborted".
class MyAbortController {
  constructor() { this.signal = { aborted: false, listeners: [] }; }
  abort() {
    this.signal.aborted = true;
    this.signal.listeners.forEach((fn) => fn());
  }
}`,
      },
      edgeCases: [
        "Aborting an already-settled request is a no-op",
        "Aborted fetch rejects with a DOMException named 'AbortError'",
        "AbortSignal.timeout(ms) auto-aborts; AbortSignal.any([...]) combines signals",
      ],
      timeComplexity: "—",
      spaceComplexity: "—",
      browserSupport: "Controller/signal: broadly supported. AbortSignal.timeout: Chrome 103+, FF 100+, Safari 16+, Node 17.3+.",
      whenNotToUse: "Fire-and-forget requests where cancellation doesn't matter.",
      industrialNotes: [
        "Always pair search inputs with abort to avoid out-of-order results.",
        "In React effects, return () => controller.abort() from useEffect.",
      ],
      commonMistakes: ["Not handling AbortError separately and showing it as a real error to users."],
    },
  },
  {
    id: "m-intl",
    slug: "intl-apis",
    title: "Intl APIs (Number, DateTime, RelativeTime)",
    category: "Data Transformation",
    difficulty: "Intermediate",
    order: 136,
    estimatedMinutes: 9,
    isModernMethod: true,
    relatedMethods: ["toLocaleString"],
    summary:
      "The Intl namespace formats numbers, currency, dates, and relative times correctly for any locale — no manual comma/currency hacks.",
    realLifeExample:
      "A receipt printer that automatically prints ₹1,23,456 in India and $123,456 in the US from the same number.",
    codeExample: {
      language: "ts",
      code: `new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(123456);
// "₹1,23,456.00"
new Intl.RelativeTimeFormat('en').format(-2, 'day'); // "2 days ago"`,
    },
    practiceTask:
      "Explore in the editor: format a price as USD currency and log it, then format -3 'hour' as relative time.",
    practiceStarter: `const price = 1234.5;
console.log(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price));
console.log(new Intl.RelativeTimeFormat('en').format(-3, 'hour'));
`,
    practiceRunnable: true,
    hint: "Intl.NumberFormat for currency; Intl.RelativeTimeFormat for 'x ago'. Negative values mean the past.",
    solution: {
      language: "ts",
      code: `console.log(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(1234.5)); // $1,234.50
console.log(new Intl.RelativeTimeFormat('en').format(-3, 'hour')); // 3 hours ago`,
    },
    explanation:
      "Intl handles grouping, currency symbols, plurals, and locale rules for you — replacing fragile manual string formatting.",
    deepDive: {
      problemSolved: "Locale-correct number/currency/date/relative-time formatting without hand-rolled, buggy string code.",
      realWorldUseCase: "Prices, 'posted 5 minutes ago' timestamps, localized dates in any app with international users.",
      builtInSolution: { language: "ts", code: "new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n)" },
      manualSolution: { language: "ts", code: "n.toLocaleString(locale, { style: 'currency', currency }) // same engine, shorthand" },
      internalImplementation: { language: "ts", code: "// Formatting locale data correctly by hand is impractical — always use Intl." },
      edgeCases: [
        "Reuse a formatter instance — constructing Intl objects is relatively expensive",
        "Output strings vary by environment/locale data; don't snapshot-test exact strings",
        "RelativeTimeFormat: negative = past, positive = future",
      ],
      timeComplexity: "O(n) in output length",
      spaceComplexity: "O(1)",
      browserSupport: "NumberFormat/DateTimeFormat: universal. RelativeTimeFormat: Chrome 71+, FF 65+, Safari 14+.",
      whenNotToUse: "Fixed machine formats (e.g. ISO timestamps for APIs) — use toISOString, not locale formatting.",
      industrialNotes: ["Create formatters once (module scope or useMemo) and reuse them — they're costly to build."],
      commonMistakes: ["Reconstructing a new Intl formatter on every render.", "Snapshot-testing exact localized output."],
    },
  },
  {
    id: "m-temporal",
    slug: "temporal-basics",
    title: "Temporal API (basics)",
    category: "Data Transformation",
    difficulty: "Expert",
    order: 137,
    estimatedMinutes: 9,
    isModernMethod: true,
    relatedMethods: ["Date", "Intl"],
    summary:
      "Temporal is the modern replacement for the broken Date API: immutable, explicit about time zones, with clear types like PlainDate, PlainTime, and ZonedDateTime.",
    realLifeExample:
      "Switching from a single confusing wall clock (Date) to a labeled set of clocks — one for 'just the date', one for 'date + time + time zone' — so you never mix them up.",
    codeExample: {
      language: "ts",
      code: `// Proposal API (not yet shipped in most engines):
const date = Temporal.PlainDate.from('2026-06-10');
date.add({ days: 5 });          // 2026-06-15 (immutable: returns a new value)
Temporal.Now.zonedDateTimeISO('Asia/Kolkata');`,
    },
    practiceTask:
      "Conceptual: list two concrete problems with the legacy Date API that Temporal fixes (mutability, months 0-indexed, time-zone handling, parsing).",
    practiceStarter: `// Write your answer as comments. Examples to consider:
// 1) Date months are 0-indexed (January = 0) — a constant source of off-by-one bugs.
// 2) Date is mutable; setMonth() changes the object in place.
// 3) Time zones are implicit and error-prone.
// Temporal fixes all three with immutable, explicit, well-typed values.
`,
    hint: "Think about: 0-indexed months, mutability of Date, implicit time zones, and inconsistent string parsing.",
    solution: {
      language: "ts",
      code: `// Date problems Temporal fixes:
// - 0-indexed months  -> Temporal uses month 1-12
// - mutable Date       -> Temporal values are immutable (add() returns new)
// - implicit time zone -> ZonedDateTime makes the zone explicit
// - flaky parsing      -> Temporal.PlainDate.from() is strict & predictable`,
    },
    explanation:
      "Temporal separates concerns into distinct, immutable types, eliminating the whole class of bugs Date causes.",
    deepDive: {
      problemSolved: "The legacy Date API's mutability, 0-indexed months, implicit time zones, and unreliable parsing.",
      realWorldUseCase: "Scheduling, calendars, and any app doing date math across time zones.",
      builtInSolution: { language: "ts", code: "Temporal.PlainDate.from('2026-06-10').add({ months: 1 })" },
      manualSolution: {
        language: "ts",
        code: `// Today, use date-fns or Luxon for immutable, zone-aware date math:
import { addMonths } from 'date-fns';
addMonths(new Date('2026-06-10'), 1);`,
      },
      internalImplementation: { language: "ts", code: "// Polyfill: @js-temporal/polyfill provides the Temporal global today." },
      edgeCases: [
        "Not yet shipped natively in most browsers (Stage 3 proposal)",
        "PlainDate has no time zone; ZonedDateTime does — don't mix them",
        "All operations return NEW values (immutable)",
      ],
      timeComplexity: "—",
      spaceComplexity: "—",
      browserSupport:
        "⚠️ Experimental: Firefox 139+ (flagged/partial); not in stable Chrome/Safari as of 2026. Use @js-temporal/polyfill, or date-fns/Luxon in production.",
      whenNotToUse: "Production today, without the polyfill — native support is not broad yet.",
      industrialNotes: ["Until Temporal ships, standardize on date-fns or Luxon for immutable, zone-aware dates."],
      commonMistakes: ["Shipping Temporal to production assuming native support.", "Mixing PlainDate with zoned values."],
    },
  },
];
