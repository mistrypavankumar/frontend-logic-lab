// A tiny Jest-compatible test framework, as SOURCE TEXT. It's prepended to the
// learner's code + tests and run in a sandbox (Web Worker for plain JS, a
// sandboxed iframe for DOM tests — see lib/testRunner.ts). Kept free of
// browser imports so scripts/verify can run the same harness in Node.
//
// Supports: describe / it / test / beforeEach / afterEach, expect with the
// common matchers (+ .not, .resolves, .rejects), jest.fn / jest.spyOn mocks,
// fake timers, and — in the DOM env — render / screen queries / fireEvent /
// userEvent in the style of Testing Library.
//
// Teaching extras: a test with no assertions, or an assertion that fails after
// the test already finished (a missing `await`), gets a warning — those are
// the tests that "pass" without proving anything.

export interface SpecResult {
  name: string;
  pass: boolean;
  ms: number;
  error?: string;
  expected?: string;
  received?: string;
  warnings: string[];
}

export interface SuiteRun {
  results: SpecResult[];
  logs: string[];
}

export type TestEnv = "js" | "dom";

// NOTE: plain string (no backticks / ${} inside) so it can be embedded as-is.
const CORE = String.raw`
const __logs = [];
const __fmt = (v) => {
  if (typeof v === "string") return JSON.stringify(v);
  if (v === undefined) return "undefined";
  if (typeof v === "number" && Number.isNaN(v)) return "NaN";
  if (typeof v === "function") return v._isMock ? "[mock function]" : "[Function " + (v.name || "anonymous") + "]";
  if (v instanceof RegExp) return String(v);
  if (v instanceof Error) return v.name + ": " + v.message;
  if (v && typeof v === "object" && typeof v.nodeType === "number") return "<" + (v.tagName ? v.tagName.toLowerCase() : "#node") + ">";
  try { const s = __show(v); return s === undefined ? String(v) : s; } catch (e) { return String(v); }
};
const __eq = (a, b) => __fmt(a) === __fmt(b);
const __out = (...a) => __logs.push(a.map((x) => (typeof x === "string" ? x : __fmt(x))).join(" "));
const console = { log: __out, info: __out, warn: __out, error: __out, debug: __out, table: __out };

// ---------- real + fake timers ----------
const __realSetTimeout = globalThis.setTimeout.bind(globalThis);
const __realClearTimeout = globalThis.clearTimeout.bind(globalThis);
const __realSetInterval = globalThis.setInterval.bind(globalThis);
const __realClearInterval = globalThis.clearInterval.bind(globalThis);
let __fake = null;
function setTimeout(cb, ms, ...args) {
  if (!__fake) return __realSetTimeout(cb, ms, ...args);
  const id = ++__fake.seq;
  __fake.timers.push({ id, at: __fake.now + (ms || 0), cb, args, every: 0 });
  return id;
}
function setInterval(cb, ms, ...args) {
  if (!__fake) return __realSetInterval(cb, ms, ...args);
  const id = ++__fake.seq;
  __fake.timers.push({ id, at: __fake.now + (ms || 0), cb, args, every: Math.max(1, ms || 0) });
  return id;
}
function clearTimeout(id) {
  if (!__fake) return __realClearTimeout(id);
  __fake.timers = __fake.timers.filter((t) => t.id !== id);
}
function clearInterval(id) {
  if (!__fake) return __realClearInterval(id);
  __fake.timers = __fake.timers.filter((t) => t.id !== id);
}
function __advance(ms) {
  if (!__fake) throw new Error("Call jest.useFakeTimers() before advancing time.");
  const end = __fake.now + ms;
  let guard = 0;
  for (;;) {
    __fake.timers.sort((a, b) => a.at - b.at || a.id - b.id);
    const t = __fake.timers[0];
    if (!t || t.at > end) break;
    if (++guard > 10000) throw new Error("More than 10000 timers fired — is a timer rescheduling itself forever?");
    __fake.now = t.at;
    if (t.every) t.at += t.every; else __fake.timers.shift();
    t.cb(...t.args);
  }
  __fake.now = end;
}

// ---------- mocks ----------
function __fn(impl) {
  const m = function (...args) {
    m.mock.calls.push(args);
    const next = m.__once.length ? m.__once.shift() : m.__impl;
    const r = next ? next.apply(this, args) : undefined;
    m.mock.results.push(r);
    return r;
  };
  m._isMock = true;
  m.mock = { calls: [], results: [] };
  m.__impl = impl;
  m.__once = [];
  m.mockImplementation = (f) => { m.__impl = f; return m; };
  m.mockImplementationOnce = (f) => { m.__once.push(f); return m; };
  m.mockReturnValue = (v) => { m.__impl = () => v; return m; };
  m.mockReturnValueOnce = (v) => { m.__once.push(() => v); return m; };
  m.mockResolvedValue = (v) => { m.__impl = () => Promise.resolve(v); return m; };
  m.mockResolvedValueOnce = (v) => { m.__once.push(() => Promise.resolve(v)); return m; };
  m.mockRejectedValue = (e) => { m.__impl = () => Promise.reject(e); return m; };
  m.mockRejectedValueOnce = (e) => { m.__once.push(() => Promise.reject(e)); return m; };
  m.mockClear = () => { m.mock.calls = []; m.mock.results = []; return m; };
  m.mockReset = () => { m.mockClear(); m.__impl = undefined; m.__once = []; return m; };
  return m;
}
function __spyOn(obj, key) {
  const orig = obj[key];
  if (typeof orig !== "function") throw new Error("jest.spyOn: " + String(key) + " is not a function");
  const m = __fn(function (...a) { return orig.apply(this, a); });
  m.mockRestore = () => { obj[key] = orig; };
  obj[key] = m;
  return m;
}
const jest = {
  fn: __fn,
  spyOn: __spyOn,
  useFakeTimers() { __fake = { now: 0, timers: [], seq: 0 }; },
  useRealTimers() { __fake = null; },
  advanceTimersByTime: __advance,
  runAllTimers() {
    let guard = 0;
    while (__fake && __fake.timers.some((t) => !t.every)) {
      if (++guard > 10000) throw new Error("runAllTimers: timers keep scheduling more timers.");
      const next = Math.min(...__fake.timers.filter((t) => !t.every).map((t) => t.at));
      __advance(next - __fake.now);
    }
  },
  getTimerCount() { return __fake ? __fake.timers.length : 0; },
};
const vi = jest;

// ---------- registry ----------
const __tests = [];
const __path = [];
const __before = [[]];
const __after = [[]];
let __cleanup = null;
function describe(name, fn) {
  __path.push(String(name));
  __before.push([]);
  __after.push([]);
  try { fn(); } finally { __path.pop(); __before.pop(); __after.pop(); }
}
function it(name, fn) {
  if (typeof fn !== "function") throw new Error("it(\"" + name + "\") needs a test function as its 2nd argument.");
  // Keep references to the scope's hook arrays so hooks declared later in the
  // same describe still apply (like Jest).
  __tests.push({ name: __path.concat(String(name)).join(" › "), fn, before: __before.slice(), after: __after.slice() });
}
const test = it;
it.skip = () => {};
describe.skip = () => {};
function beforeEach(fn) { __before[__before.length - 1].push(fn); }
function afterEach(fn) { __after[__after.length - 1].push(fn); }

// ---------- expect ----------
class __AssertionError extends Error {
  constructor(message, expected, received) {
    super(message);
    this.name = "AssertionError";
    this.__assert = true;
    this.expected = expected;
    this.received = received;
  }
}
const __isMock = (r) => (r && r._isMock ? null : { invalid: true, pass: false, exp: "a mock function (jest.fn())", rec: __fmt(r), note: "Create one with jest.fn() or jest.spyOn()." });
const __text = (el) => String(el && el.textContent != null ? el.textContent : "").replace(/\s+/g, " ").trim();
const __matchers = {
  toBe: (r, e) => ({ pass: Object.is(r, e), exp: __fmt(e), note: !Object.is(r, e) && __eq(r, e) && r && typeof r === "object" ? "Same contents, different object — toBe checks identity (===). Use toEqual to compare arrays/objects by value." : "" }),
  toEqual: (r, e) => ({ pass: __eq(r, e), exp: __fmt(e) }),
  toStrictEqual: (r, e) => ({ pass: __eq(r, e), exp: __fmt(e) }),
  toBeTruthy: (r) => ({ pass: !!r, exp: "a truthy value" }),
  toBeFalsy: (r) => ({ pass: !r, exp: "a falsy value" }),
  toBeNull: (r) => ({ pass: r === null, exp: "null" }),
  toBeUndefined: (r) => ({ pass: r === undefined, exp: "undefined" }),
  toBeDefined: (r) => ({ pass: r !== undefined, exp: "a defined value" }),
  toBeNaN: (r) => ({ pass: Number.isNaN(r), exp: "NaN" }),
  toBeInstanceOf: (r, C) => ({ pass: r instanceof C, exp: "an instance of " + (C && C.name) }),
  toBeGreaterThan: (r, n) => ({ pass: r > n, exp: "> " + __fmt(n) }),
  toBeGreaterThanOrEqual: (r, n) => ({ pass: r >= n, exp: ">= " + __fmt(n) }),
  toBeLessThan: (r, n) => ({ pass: r < n, exp: "< " + __fmt(n) }),
  toBeLessThanOrEqual: (r, n) => ({ pass: r <= n, exp: "<= " + __fmt(n) }),
  toBeCloseTo: (r, n, digits = 2) => ({ pass: Math.abs(r - n) < Math.pow(10, -digits) / 2, exp: "≈ " + __fmt(n) + " (to " + digits + " decimal places)" }),
  toContain: (r, item) => ({ pass: r != null && typeof r.includes === "function" && r.includes(item), exp: "to contain " + __fmt(item) }),
  toContainEqual: (r, item) => ({ pass: Array.isArray(r) && r.some((x) => __eq(x, item)), exp: "to contain an item equal to " + __fmt(item) }),
  toHaveLength: (r, n) => ({ pass: r != null && r.length === n, exp: "length " + n, rec: r != null && r.length !== undefined ? "length " + r.length + ": " + __fmt(r) : __fmt(r) }),
  toMatch: (r, p) => ({ pass: typeof r === "string" && (p instanceof RegExp ? p.test(r) : r.includes(p)), exp: "to match " + __fmt(p) }),
  toHaveProperty: (r, path, ...v) => {
    const keys = Array.isArray(path) ? path : String(path).split(".");
    let cur = r, has = true;
    for (const k of keys) { if (cur != null && k in Object(cur)) cur = cur[k]; else { has = false; break; } }
    const pass = has && (v.length === 0 || __eq(cur, v[0]));
    return { pass, exp: "property " + __fmt(String(path)) + (v.length ? " = " + __fmt(v[0]) : "") };
  },
  toThrow: (r, e) => {
    if (typeof r !== "function") return { invalid: true, pass: false, exp: "a function that throws", rec: __fmt(r), note: "Wrap the call in a function: expect(() => fn()).toThrow()" };
    let threw = false, err;
    try { r(); } catch (x) { threw = true; err = x; }
    const msg = err && err.message !== undefined ? String(err.message) : String(err);
    let pass = threw;
    if (threw && e !== undefined) {
      if (typeof e === "string") pass = msg.includes(e);
      else if (e instanceof RegExp) pass = e.test(msg);
      else if (typeof e === "function") pass = err instanceof e;
    }
    return { pass, exp: e === undefined ? "to throw" : "to throw " + (typeof e === "function" ? e.name : __fmt(e)), rec: threw ? "threw " + JSON.stringify(msg) : "did not throw" };
  },
  toHaveBeenCalled: (r) => __isMock(r) || { pass: r.mock.calls.length > 0, exp: "to be called", rec: "called " + r.mock.calls.length + " times" },
  toHaveBeenCalledTimes: (r, n) => __isMock(r) || { pass: r.mock.calls.length === n, exp: "called " + n + " times", rec: "called " + r.mock.calls.length + " times" },
  toHaveBeenCalledWith: (r, ...args) => __isMock(r) || { pass: r.mock.calls.some((c) => __eq(c, args)), exp: "called with " + args.map(__fmt).join(", "), rec: r.mock.calls.length ? "calls: " + r.mock.calls.map((c) => "(" + c.map(__fmt).join(", ") + ")").join(", ") : "never called" },
  toHaveBeenLastCalledWith: (r, ...args) => __isMock(r) || { pass: r.mock.calls.length > 0 && __eq(r.mock.calls[r.mock.calls.length - 1], args), exp: "last called with " + args.map(__fmt).join(", "), rec: r.mock.calls.length ? "last call: (" + r.mock.calls[r.mock.calls.length - 1].map(__fmt).join(", ") + ")" : "never called" },
  // DOM matchers (jest-dom style)
  toBeInTheDocument: (r) => ({ pass: !!r && r.isConnected === true, exp: "an element in the document", rec: r ? "detached element" : __fmt(r) }),
  toHaveTextContent: (r, t) => ({ pass: !!r && (t instanceof RegExp ? t.test(__text(r)) : __text(r).includes(String(t))), exp: "text " + __fmt(t), rec: __fmt(__text(r)) }),
  toBeDisabled: (r) => ({ pass: !!r && !!r.disabled, exp: "disabled", rec: r && r.disabled ? "disabled" : "enabled" }),
  toBeEnabled: (r) => ({ pass: !!r && !r.disabled, exp: "enabled", rec: r && r.disabled ? "disabled" : "enabled" }),
  toHaveValue: (r, v) => ({ pass: !!r && r.value === v, exp: "value " + __fmt(v), rec: "value " + __fmt(r && r.value) }),
  toHaveClass: (r, c) => ({ pass: !!r && !!r.classList && r.classList.contains(c), exp: "class " + __fmt(c), rec: __fmt(r && r.className) }),
  toHaveAttribute: (r, name, ...v) => ({ pass: !!r && r.hasAttribute(name) && (v.length === 0 || r.getAttribute(name) === v[0]), exp: "attribute " + name + (v.length ? "=" + __fmt(v[0]) : ""), rec: r && r.hasAttribute(name) ? name + "=" + __fmt(r.getAttribute(name)) : "no " + name + " attribute" }),
  toBeVisible: (r) => {
    let el = r, vis = !!r && r.isConnected;
    while (vis && el && el.nodeType === 1) {
      const st = el.ownerDocument.defaultView.getComputedStyle(el);
      if (el.hidden || st.display === "none" || st.visibility === "hidden") vis = false;
      el = el.parentElement;
    }
    return { pass: vis, exp: "visible", rec: r ? (vis ? "visible" : "hidden") : __fmt(r) };
  },
};
let __current = null;
function expect(received) {
  const owner = __current;
  const build = (negate, mode) => {
    const api = {};
    for (const name of Object.keys(__matchers)) {
      api[name] = (...args) => {
        if (owner) owner.__asserts++;
        const head = "expect(" + (mode ? "promise)." + mode : "received)") + (negate ? ".not." : ".") + name + "(" + args.map(__fmt).join(", ") + ")";
        const check = (value) => {
          const res = __matchers[name](value, ...args);
          if (res.invalid || (negate ? res.pass : !res.pass)) {
            const err = new __AssertionError(head + (res.note ? "\n" + res.note : ""), (negate ? "not " : "") + res.exp, res.rec !== undefined ? res.rec : __fmt(value));
            err.__owner = owner;
            throw err;
          }
        };
        if (!mode) return check(received);
        return Promise.resolve(received).then(
          (v) => {
            if (mode === "rejects") {
              const err = new __AssertionError(head + "\nThe promise resolved, but it was expected to reject.", "a rejected promise", "resolved with " + __fmt(v));
              err.__owner = owner;
              throw err;
            }
            check(v);
          },
          (e) => {
            if (mode === "resolves") {
              const err = new __AssertionError(head + "\nThe promise rejected, but it was expected to resolve.", "a resolved promise", "rejected with " + __fmt(e));
              err.__owner = owner;
              throw err;
            }
            check(name === "toThrow" ? () => { throw e; } : e);
          }
        );
      };
    }
    return api;
  };
  const api = build(false, null);
  api.not = build(true, null);
  api.resolves = build(false, "resolves");
  api.resolves.not = build(true, "resolves");
  api.rejects = build(false, "rejects");
  api.rejects.not = build(true, "rejects");
  return api;
}

// ---------- run ----------
const __lateMsg = "An assertion failed AFTER this test had already finished — it was never awaited, so the test passed by accident. Put await (or return) in front of expect(…).resolves / .rejects.";
const __onUnhandled = (ev) => {
  const err = ev && ev.reason;
  if (err && err.__assert) {
    if (err.__owner && !err.__owner.warnings.includes(__lateMsg)) err.__owner.warnings.push(__lateMsg);
    if (ev.preventDefault) ev.preventDefault();
  }
};
async function __runAll() {
  const hasEvents = typeof addEventListener === "function";
  if (hasEvents) addEventListener("unhandledrejection", __onUnhandled);
  const results = [];
  for (const t of __tests) {
    const r = { name: t.name, pass: true, ms: 0, warnings: [], __asserts: 0 };
    __current = r;
    const t0 = Date.now();
    try {
      for (const h of t.before.flat()) await h();
      await Promise.race([
        Promise.resolve().then(() => t.fn()),
        new Promise((_, rej) => __realSetTimeout(() => rej(new Error("Test timed out after 2000 ms — a promise never settled (or fake timers were never advanced).")), 2000)),
      ]);
      for (const h of t.after.flat().reverse()) await h();
    } catch (e) {
      r.pass = false;
      r.error = e && e.message !== undefined ? String(e.message) : String(e);
      if (e && e.__assert) { r.expected = e.expected; r.received = e.received; }
    }
    r.ms = Date.now() - t0;
    __current = null;
    __fake = null;
    if (__cleanup) __cleanup();
    results.push(r);
  }
  // Give un-awaited assertions a moment to surface as unhandled rejections.
  await new Promise((res) => __realSetTimeout(res, 30));
  if (hasEvents) removeEventListener("unhandledrejection", __onUnhandled);
  return {
    logs: __logs,
    results: results.map((r) => {
      const { __asserts, ...rest } = r;
      if (__asserts === 0 && r.pass) rest.warnings.unshift("No assertions ran — this test can never fail. Add an expect(…).");
      return rest;
    }),
  };
}
`;

// Testing-Library-style helpers for the DOM env (runs inside the sandbox iframe).
const DOM_HELPERS = String.raw`
__cleanup = () => { document.body.innerHTML = ""; };
function render(ui) {
  const host = document.createElement("div");
  if (typeof ui === "string") host.innerHTML = ui;
  else if (ui && ui.nodeType) host.appendChild(ui);
  else throw new Error("render() expects an HTML string or a DOM element.");
  document.body.appendChild(host);
  return { container: host };
}
const __norm = (s) => String(s == null ? "" : s).replace(/\s+/g, " ").trim();
const __tm = (text, m) => (m instanceof RegExp ? m.test(text) : text === __norm(m));
const __els = () => Array.from(document.body.querySelectorAll("*"));
function __roleOf(el) {
  const explicit = el.getAttribute("role");
  if (explicit) return explicit;
  const tag = el.tagName.toLowerCase();
  if (tag === "button") return "button";
  if (tag === "a" && el.hasAttribute("href")) return "link";
  if (tag === "textarea") return "textbox";
  if (tag === "select") return "combobox";
  if (/^h[1-6]$/.test(tag)) return "heading";
  if (tag === "ul" || tag === "ol") return "list";
  if (tag === "li") return "listitem";
  if (tag === "img") return "img";
  if (tag === "input") {
    const type = (el.getAttribute("type") || "text").toLowerCase();
    if (type === "checkbox") return "checkbox";
    if (type === "radio") return "radio";
    if (type === "submit" || type === "button" || type === "reset") return "button";
    if (type === "password" || type === "hidden") return null;
    return "textbox";
  }
  return null;
}
function __labelText(el) {
  if (el.id) {
    const l = document.querySelector('label[for="' + el.id + '"]');
    if (l) return __norm(l.textContent);
  }
  const wrap = el.closest && el.closest("label");
  return wrap ? __norm(wrap.textContent) : "";
}
function __nameOf(el) {
  if (el.getAttribute("aria-label")) return __norm(el.getAttribute("aria-label"));
  const by = el.getAttribute("aria-labelledby");
  if (by) return __norm(by.split(/\s+/).map((id) => { const n = document.getElementById(id); return n ? n.textContent : ""; }).join(" "));
  const lab = __labelText(el);
  if (lab) return lab;
  if (el.tagName.toLowerCase() === "img") return __norm(el.getAttribute("alt"));
  if (el.tagName.toLowerCase() === "input") return __norm(el.getAttribute("value") || el.getAttribute("placeholder"));
  return __norm(el.textContent);
}
const __queries = {
  ByText: (m) => {
    const hits = __els().filter((el) => !/^(script|style)$/i.test(el.tagName) && __tm(__norm(el.textContent), m));
    return hits.filter((el) => !hits.some((o) => o !== el && el.contains(o)));
  },
  ByRole: (role, opts) => __els().filter((el) => __roleOf(el) === role && (!opts || opts.name === undefined || __tm(__nameOf(el), opts.name))),
  ByLabelText: (m) => __els().filter((el) => /^(input|select|textarea|button)$/i.test(el.tagName) && (__tm(__labelText(el), m) || __tm(__norm(el.getAttribute("aria-label")), m))),
  ByPlaceholderText: (m) => __els().filter((el) => el.hasAttribute("placeholder") && __tm(__norm(el.getAttribute("placeholder")), m)),
  ByTestId: (id) => __els().filter((el) => el.getAttribute("data-testid") === id),
};
const __desc = (q, args) => q.slice(2).replace(/[A-Z]/g, (c) => " " + c.toLowerCase()).trim() + " " + args.map(__fmt).join(", ");
const screen = { debug: () => console.log(document.body.innerHTML) };
for (const q of Object.keys(__queries)) {
  const all = (...a) => __queries[q](...a);
  const one = (strict) => (...a) => {
    const found = all(...a);
    if (found.length > 1) throw new Error("Found " + found.length + " elements with " + __desc(q, a) + " — use getAll" + q + " or a more specific query.");
    if (found.length === 0) {
      if (strict) throw new Error("Unable to find an element with " + __desc(q, a) + ".\nThe page contains: " + __norm(document.body.textContent).slice(0, 200));
      return null;
    }
    return found[0];
  };
  screen["get" + q] = one(true);
  screen["query" + q] = one(false);
  screen["getAll" + q] = (...a) => {
    const found = all(...a);
    if (!found.length) throw new Error("Unable to find any elements with " + __desc(q, a) + ".");
    return found;
  };
  screen["queryAll" + q] = all;
  screen["find" + q] = (...a) => new Promise((resolve, reject) => {
    const start = Date.now();
    const poll = () => {
      const found = all(...a);
      if (found.length === 1) return resolve(found[0]);
      if (Date.now() - start > 1000) return reject(new Error("Timed out (1000 ms) waiting for an element with " + __desc(q, a) + "."));
      __realSetTimeout(poll, 20);
    };
    poll();
  });
}
const __setValue = (el, value) => { el.value = value; };
const fireEvent = {
  click: (el) => el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })),
  input: (el, init) => { if (init && init.target) __setValue(el, init.target.value); return el.dispatchEvent(new Event("input", { bubbles: true })); },
  change: (el, init) => { if (init && init.target) { if ("checked" in init.target) el.checked = init.target.checked; else __setValue(el, init.target.value); } return el.dispatchEvent(new Event("change", { bubbles: true })); },
  keyDown: (el, init) => el.dispatchEvent(new KeyboardEvent("keydown", Object.assign({ bubbles: true }, init))),
  submit: (el) => el.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })),
  focus: (el) => el.focus(),
  blur: (el) => el.blur(),
};
const userEvent = {
  async click(el) { if (el.disabled) return; if (el.focus) el.focus(); el.click(); },
  async type(el, text) {
    if (el.focus) el.focus();
    for (const ch of String(text)) {
      if (ch === "\n") { el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })); continue; }
      el.value += ch;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
    el.dispatchEvent(new Event("change", { bubbles: true }));
  },
  async clear(el) { el.value = ""; el.dispatchEvent(new Event("input", { bubbles: true })); },
};
`;

/**
 * The full sandbox body: harness + code under test + the learner's tests.
 * Runs as `new Function("__show", body)` and resolves to a SuiteRun.
 */
export function buildTestBody(code: string, tests: string, env: TestEnv): string {
  return [
    '"use strict";',
    CORE,
    env === "dom" ? DOM_HELPERS : "",
    "// ---- code under test ----",
    code,
    ";",
    "// ---- tests ----",
    tests,
    ";",
    "return __runAll();",
  ].join("\n");
}
