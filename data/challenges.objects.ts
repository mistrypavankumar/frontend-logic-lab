import { Challenge } from "@/lib/types";

// E2 — Objects: cloning, equality, safe access, immutable updates, and the
// shaping operations (pick/omit/merge/normalize) every real app needs.
export const objectChallenges: Challenge[] = [
  {
    id: "ch-deep-clone",
    slug: "deep-clone-object",
    title: "Deep Clone an Object",
    difficulty: "Intermediate",
    category: "Objects",
    tags: ["object", "recursion", "immutability"],
    relatedMethods: ["structuredClone"],
    flags: { builtInAvailable: true, interview: true },
    problem:
      "Implement deepClone(value) that recursively copies plain objects and arrays so no nested reference is shared with the original.",
    realWorldScenario: "Snapshotting state for an undo feature, or cloning config before mutating it locally.",
    example: { input: "deepClone({a:{b:1}})", output: "{a:{b:1}} (fully independent)" },
    constraints: ["Handle nested objects and arrays", "Primitives return as-is", "Don't share nested references"],
    starterCode: `function deepClone(value) {
  // recursively clone objects and arrays
}`,
    builtInSolution: { language: "ts", code: "structuredClone(value)" },
    manualSolution: { language: "ts", code: "JSON.parse(JSON.stringify(value)) // loses Dates/undefined/functions" },
    internalImplementation: {
      language: "ts",
      code: `function deepClone(value) {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(deepClone);
  const out = {};
  for (const k of Object.keys(value)) out[k] = deepClone(value[k]);
  return out;
}`,
    },
    solution: `function deepClone(value) {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(deepClone);
  const out = {};
  for (const k of Object.keys(value)) out[k] = deepClone(value[k]);
  return out;
}`,
    tests: [
      { name: "clones nested object", kind: "normal", call: "deepClone({a:{b:1}})", expected: { a: { b: 1 } } },
      { name: "no shared nested reference", kind: "mutation", call: "(()=>{const o={a:{b:1}};const c=deepClone(o);c.a.b=99;return o.a.b;})()", expected: 1 },
      { name: "clones arrays", kind: "normal", call: "deepClone([1,[2,3]])", expected: [1, [2, 3]] },
      { name: "primitive passthrough", kind: "normal", call: "deepClone(5)", expected: 5 },
      { name: "null", kind: "nullish", call: "deepClone(null)", expected: null },
    ],
    hiddenTests: [
      { name: "deeply nested", kind: "normal", call: "deepClone({a:{b:{c:[1,{d:2}]}}})", expected: { a: { b: { c: [1, { d: 2 }] } } } },
    ],
    hints: ["If it's not an object, return it.", "Arrays: map(deepClone).", "Objects: recurse over each key."],
    explanation:
      "Recursion copies every level, so nothing nested is shared. structuredClone does this natively (and handles Date/Map/Set), unlike the JSON trick.",
    edgeCases: ["Functions can't be cloned (structuredClone throws)", "JSON trick drops undefined/Date/functions", "Circular refs need a seen-set (or structuredClone)"],
    timeComplexity: "O(n) nodes",
    spaceComplexity: "O(n)",
    industrialNotes: ["Prefer structuredClone over JSON.parse(JSON.stringify()) — no silent data loss."],
    commonMistakes: ["Assuming spread/Object.assign is deep.", "Using the JSON trick on data with Dates."],
  },
  {
    id: "ch-deep-equal",
    slug: "deep-equality-check",
    title: "Deep Equality Check",
    difficulty: "Advanced",
    category: "Objects",
    tags: ["object", "recursion", "comparison"],
    relatedMethods: [],
    flags: { interview: true },
    problem:
      "Implement deepEqual(a, b) that returns true when two values are structurally equal (same nested keys/values), regardless of key order.",
    realWorldScenario: "Skipping a re-render or network call when data hasn't actually changed.",
    example: { input: "deepEqual({a:1,b:{c:2}}, {b:{c:2},a:1})", output: "true" },
    constraints: ["Compare nested objects/arrays recursively", "Key order must not matter"],
    starterCode: `function deepEqual(a, b) {
  // structural equality
}`,
    builtInSolution: { language: "ts", code: "// No standard built-in; libraries: lodash.isEqual, fast-deep-equal" },
    manualSolution: { language: "ts", code: "JSON.stringify(a) === JSON.stringify(b) // fails on key order & undefined" },
    internalImplementation: {
      language: "ts",
      code: `function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null)
    return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => deepEqual(a[k], b[k]));
}`,
    },
    solution: `function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null)
    return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => deepEqual(a[k], b[k]));
}`,
    tests: [
      { name: "equal regardless of key order", kind: "normal", call: "deepEqual({a:1,b:{c:2}},{b:{c:2},a:1})", expected: true },
      { name: "different value", kind: "normal", call: "deepEqual({a:1},{a:2})", expected: false },
      { name: "different key count", kind: "normal", call: "deepEqual({a:1},{a:1,b:2})", expected: false },
      { name: "nested arrays", kind: "normal", call: "deepEqual([1,[2,3]],[1,[2,3]])", expected: true },
      { name: "primitive equality", kind: "normal", call: "deepEqual(5,5)", expected: true },
    ],
    hiddenTests: [
      { name: "null vs object", kind: "nullish", call: "deepEqual(null,{})", expected: false },
    ],
    hints: ["Quick win: a === b handles primitives & same reference.", "Compare key counts, then recurse on each key."],
    explanation:
      "Strict equals handles primitives; for objects, equal length + every key deep-equal. The JSON.stringify shortcut breaks on key order and undefined.",
    edgeCases: ["NaN !== NaN (this simple version treats them unequal)", "Arrays are objects — keys are indexes", "null is typeof 'object' — guard it"],
    timeComplexity: "O(n) nodes",
    spaceComplexity: "O(depth) recursion",
    industrialNotes: ["For production use a battle-tested lib; this version skips Map/Set/Date specifics."],
    commonMistakes: ["Using JSON.stringify and getting false on reordered keys.", "Forgetting null is typeof 'object'."],
  },
  {
    id: "ch-safe-get",
    slug: "safe-nested-getter",
    title: "Safe Nested Getter",
    difficulty: "Intermediate",
    category: "Objects",
    tags: ["object", "path", "defensive"],
    relatedMethods: ["optional chaining"],
    flags: { interview: true, realWorld: true },
    problem:
      "Implement safeGet(obj, path, fallback) that reads a dotted path (e.g. 'a.b.c') and returns fallback if any step is missing.",
    realWorldScenario: "Reading deeply nested API fields that may be missing, without 'cannot read property of undefined' crashes.",
    example: { input: "safeGet({a:{b:{c:5}}}, 'a.b.c')", output: "5" },
    constraints: ["Path is a dot-separated string", "Return fallback (default undefined) when any step is null/undefined"],
    starterCode: `function safeGet(obj, path, fallback) {
  // walk the path; return fallback if a step is missing
}`,
    builtInSolution: { language: "ts", code: "obj?.a?.b?.c ?? fallback // optional chaining for known paths" },
    manualSolution: { language: "ts", code: "path.split('.').reduce((acc, k) => acc?.[k], obj) ?? fallback" },
    internalImplementation: {
      language: "ts",
      code: `function safeGet(obj, path, fallback) {
  const keys = Array.isArray(path) ? path : path.split(".");
  let cur = obj;
  for (const k of keys) {
    if (cur == null) return fallback;
    cur = cur[k];
  }
  return cur === undefined ? fallback : cur;
}`,
    },
    solution: `function safeGet(obj, path, fallback) {
  const keys = Array.isArray(path) ? path : path.split(".");
  let cur = obj;
  for (const k of keys) {
    if (cur == null) return fallback;
    cur = cur[k];
  }
  return cur === undefined ? fallback : cur;
}`,
    tests: [
      { name: "reads deep value", kind: "normal", call: "safeGet({a:{b:{c:5}}}, 'a.b.c')", expected: 5 },
      { name: "missing path → fallback", kind: "normal", call: "safeGet({a:{}}, 'a.b.c', 'none')", expected: "none" },
      { name: "null mid-path → fallback", kind: "nullish", call: "safeGet({a:{b:null}}, 'a.b.c', 'def')", expected: "def" },
      { name: "null root → fallback", kind: "nullish", call: "safeGet(null, 'a', 'x')", expected: "x" },
    ],
    hiddenTests: [
      { name: "fallback defaults to undefined", kind: "normal", call: "safeGet({a:1}, 'a.b')", expected: undefined },
    ],
    hints: ["Split the path on '.'.", "Bail out to fallback the moment cur is null/undefined."],
    explanation:
      "Walk each key, stopping safely if a step is nullish. Optional chaining (?.) does this inline for fixed paths; safeGet handles dynamic string paths.",
    edgeCases: ["Null/undefined at any depth → fallback", "Value of 0/'' is returned (only undefined triggers fallback)", "Array path also supported"],
    timeComplexity: "O(depth)",
    spaceComplexity: "O(1)",
    industrialNotes: ["For static paths prefer ?. + ??; reach for safeGet when the path is data-driven."],
    commonMistakes: ["Treating falsy values (0, '') as missing.", "Not guarding against a null root."],
  },
  {
    id: "ch-set-path",
    slug: "object-path-setter",
    title: "Immutable Path Setter",
    difficulty: "Advanced",
    category: "Objects",
    tags: ["object", "path", "immutability"],
    relatedMethods: [],
    flags: { interview: true, realWorld: true },
    problem:
      "Implement setPath(obj, path, value) that returns a NEW object with the dotted path set, WITHOUT mutating the original (creating missing levels).",
    realWorldScenario: "Updating one deeply-nested field in React/Redux state immutably.",
    example: { input: "setPath({a:{b:1}}, 'a.b', 9)", output: "{a:{b:9}} (original unchanged)" },
    constraints: ["Must not mutate the input", "Create intermediate objects if missing"],
    starterCode: `function setPath(obj, path, value) {
  // return a new object with the nested path set
}`,
    builtInSolution: { language: "ts", code: "// No built-in; libraries: lodash.set (mutating) / immer produce" },
    manualSolution: { language: "ts", code: "structuredClone(obj) then assign the path (simple but clones everything)" },
    internalImplementation: {
      language: "ts",
      code: `function setPath(obj, path, value) {
  const [head, ...rest] = Array.isArray(path) ? path : path.split(".");
  if (rest.length === 0) return { ...obj, [head]: value };
  return { ...obj, [head]: setPath(obj?.[head] ?? {}, rest, value) };
}`,
    },
    solution: `function setPath(obj, path, value) {
  const [head, ...rest] = Array.isArray(path) ? path : path.split(".");
  if (rest.length === 0) return { ...obj, [head]: value };
  return { ...obj, [head]: setPath(obj?.[head] ?? {}, rest, value) };
}`,
    tests: [
      { name: "sets nested value", kind: "normal", call: "setPath({a:{b:1,c:2}}, 'a.b', 9)", expected: { a: { b: 9, c: 2 } } },
      { name: "does not mutate input", kind: "mutation", call: "(()=>{const o={a:{b:1}};setPath(o,'a.b',9);return o.a.b;})()", expected: 1 },
      { name: "creates missing levels", kind: "normal", call: "setPath({}, 'a.b', 5)", expected: { a: { b: 5 } } },
    ],
    hiddenTests: [
      { name: "top-level key", kind: "normal", call: "setPath({x:1}, 'y', 2)", expected: { x: 1, y: 2 } },
    ],
    hints: ["Split off the head key.", "Base case: last key → spread + assign.", "Otherwise spread + recurse into the child (default to {})."],
    explanation:
      "Spreading at each level copies only the path you touch; sibling branches are reused by reference. This is the immutable-update backbone of reducers.",
    edgeCases: ["Missing intermediate objects are created", "Only the touched path is copied (others reused)", "Array path supported"],
    timeComplexity: "O(depth)",
    spaceComplexity: "O(depth) new objects",
    industrialNotes: ["Immer's produce() gives the same result with mutable-looking code for complex updates."],
    commonMistakes: ["Mutating the original.", "Deep-cloning the whole tree when only one path changed."],
  },
  {
    id: "ch-entries-to-object",
    slug: "entries-to-object",
    title: "Convert Entries to Object",
    difficulty: "Beginner",
    category: "Objects",
    tags: ["object", "entries"],
    relatedMethods: ["Object.fromEntries"],
    flags: { builtInAvailable: true, dataTransformation: true },
    problem:
      "Implement fromEntries(pairs) that turns an array of [key, value] pairs into an object.",
    realWorldScenario: "Turning URLSearchParams / FormData / a Map into a plain object.",
    example: { input: "fromEntries([['a',1],['b',2]])", output: "{a:1, b:2}" },
    constraints: ["Accept any iterable of [key, value] pairs", "Later duplicate keys win"],
    starterCode: `function fromEntries(pairs) {
  // build an object from [key, value] pairs
}`,
    builtInSolution: { language: "ts", code: "Object.fromEntries(pairs)" },
    manualSolution: { language: "ts", code: "pairs.reduce((o,[k,v]) => (o[k]=v, o), {})" },
    internalImplementation: {
      language: "ts",
      code: `function fromEntries(pairs) {
  const out = {};
  for (const [k, v] of pairs) out[k] = v;
  return out;
}`,
    },
    solution: `function fromEntries(pairs) {
  const out = {};
  for (const [k, v] of pairs) out[k] = v;
  return out;
}`,
    tests: [
      { name: "builds object", kind: "normal", call: "fromEntries([['a',1],['b',2]])", expected: { a: 1, b: 2 } },
      { name: "empty input", kind: "empty", call: "fromEntries([])", expected: {} },
      { name: "duplicate key: last wins", kind: "duplicate", call: "fromEntries([['a',1],['a',2]])", expected: { a: 2 } },
    ],
    hiddenTests: [
      { name: "works on a Map", kind: "normal", call: "fromEntries(new Map([['x',1]]))", expected: { x: 1 } },
    ],
    hints: ["Destructure each pair as [k, v].", "Assign out[k] = v; later keys overwrite."],
    explanation:
      "Destructure each pair and assign. Works on any iterable of pairs (arrays, Maps), which is why it's the go-to for converting URLSearchParams/Map to objects.",
    edgeCases: ["Duplicate keys: last wins", "Empty → {}", "Keys coerced to strings"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    industrialNotes: ["Object.fromEntries(new URLSearchParams(search)) is the cleanest query-string → object."],
    commonMistakes: ["Assuming first duplicate wins (last does)."],
  },
  {
    id: "ch-deep-merge",
    slug: "merge-config-objects",
    title: "Deep Merge Config Objects",
    difficulty: "Advanced",
    category: "Objects",
    tags: ["object", "recursion", "config"],
    relatedMethods: ["Object.assign", "spread"],
    flags: { interview: true, realWorld: true, dataTransformation: true },
    problem:
      "Implement deepMerge(base, override) that recursively merges plain objects (override wins). Arrays and primitives are replaced, not merged.",
    realWorldScenario: "Merging default settings with user overrides; theme/config composition.",
    example: { input: "deepMerge({a:1,b:{x:1}}, {b:{y:2},c:3})", output: "{a:1,b:{x:1,y:2},c:3}" },
    constraints: ["Only plain objects are deep-merged", "Arrays/primitives from override replace", "Don't mutate inputs"],
    starterCode: `function deepMerge(base, override) {
  // recursively merge; override wins
}`,
    builtInSolution: { language: "ts", code: "{ ...base, ...override } // SHALLOW — nested objects are replaced, not merged" },
    manualSolution: { language: "ts", code: "structuredClone then assign overrides recursively" },
    internalImplementation: {
      language: "ts",
      code: `function isPlainObject(v) {
  return v != null && typeof v === "object" && !Array.isArray(v);
}
function deepMerge(base, override) {
  const out = { ...base };
  for (const k of Object.keys(override)) {
    out[k] = isPlainObject(base[k]) && isPlainObject(override[k])
      ? deepMerge(base[k], override[k])
      : override[k];
  }
  return out;
}`,
    },
    solution: `function deepMerge(base, override) {
  const isObj = (v) => v != null && typeof v === "object" && !Array.isArray(v);
  const out = { ...base };
  for (const k of Object.keys(override)) {
    out[k] = isObj(base[k]) && isObj(override[k])
      ? deepMerge(base[k], override[k])
      : override[k];
  }
  return out;
}`,
    tests: [
      { name: "merges nested objects", kind: "normal", call: "deepMerge({a:1,b:{x:1}},{b:{y:2},c:3})", expected: { a: 1, b: { x: 1, y: 2 }, c: 3 } },
      { name: "override wins on conflict", kind: "normal", call: "deepMerge({a:{x:1}},{a:{x:9}})", expected: { a: { x: 9 } } },
      { name: "arrays are replaced", kind: "normal", call: "deepMerge({a:[1,2]},{a:[3]})", expected: { a: [3] } },
      { name: "does not mutate base", kind: "mutation", call: "(()=>{const b={a:{x:1}};deepMerge(b,{a:{y:2}});return b;})()", expected: { a: { x: 1 } } },
    ],
    hiddenTests: [
      { name: "empty override", kind: "empty", call: "deepMerge({a:1},{})", expected: { a: 1 } },
    ],
    hints: ["Start from a shallow copy of base.", "If both sides are plain objects at a key, recurse; else take override."],
    explanation:
      "Spread copies the top level; recursion handles nested objects. Deciding 'merge vs replace' by isPlainObject is the key — arrays usually replace.",
    edgeCases: ["Arrays replace by default (merging arrays is app-specific)", "null override values overwrite", "Keys only in base are kept"],
    timeComplexity: "O(n) keys",
    spaceComplexity: "O(n)",
    industrialNotes: ["Decide your array policy explicitly (replace vs concat) — bugs hide here.", "Beware __proto__ keys from untrusted config."],
    commonMistakes: ["Using shallow spread and losing nested defaults.", "Mutating base."],
  },
  {
    id: "ch-remove-undefined",
    slug: "remove-undefined-fields",
    title: "Remove Undefined Fields",
    difficulty: "Beginner",
    category: "Objects",
    tags: ["object", "cleanup"],
    relatedMethods: [],
    flags: { realWorld: true, dataTransformation: true },
    problem:
      "Implement clean(obj) returning a new object with keys whose value is undefined removed (keep null, 0, '').",
    realWorldScenario: "Stripping undefined fields before sending a PATCH request so you don't overwrite server data.",
    example: { input: "clean({a:1, b:undefined, c:null})", output: "{a:1, c:null}" },
    constraints: ["Only undefined is removed", "Keep null, 0, false, ''"],
    starterCode: `function clean(obj) {
  // drop keys whose value is undefined
}`,
    builtInSolution: { language: "ts", code: "Object.fromEntries(Object.entries(obj).filter(([,v]) => v !== undefined))" },
    manualSolution: { language: "ts", code: "loop keys; copy when obj[k] !== undefined" },
    internalImplementation: {
      language: "ts",
      code: `function clean(obj) {
  const out = {};
  for (const k of Object.keys(obj)) {
    if (obj[k] !== undefined) out[k] = obj[k];
  }
  return out;
}`,
    },
    solution: `function clean(obj) {
  const out = {};
  for (const k of Object.keys(obj)) {
    if (obj[k] !== undefined) out[k] = obj[k];
  }
  return out;
}`,
    tests: [
      { name: "drops only undefined", kind: "normal", call: "clean({a:1,b:undefined,c:null})", expected: { a: 1, c: null } },
      { name: "keeps falsy values", kind: "normal", call: "clean({a:0,b:'',c:false})", expected: { a: 0, b: "", c: false } },
      { name: "empty object", kind: "empty", call: "clean({})", expected: {} },
    ],
    hiddenTests: [
      { name: "all undefined → empty", kind: "normal", call: "clean({a:undefined,b:undefined})", expected: {} },
    ],
    hints: ["Compare strictly to undefined (!== undefined).", "Do not drop null/0/''."],
    explanation:
      "Only undefined is removed; null, 0, false, '' are real values you usually want to keep. Strict !== undefined avoids the falsy trap.",
    edgeCases: ["null is kept (it's an intentional value)", "0/false/'' kept", "Shallow only"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    industrialNotes: ["Critical before PATCH requests — sending undefined-stripped payloads avoids clobbering fields."],
    commonMistakes: ["Filtering by falsiness (drops 0/''/false/null too)."],
  },
  {
    id: "ch-pick",
    slug: "pick-allowed-fields",
    title: "Pick Allowed Fields",
    difficulty: "Beginner",
    category: "Objects",
    tags: ["object", "whitelist"],
    relatedMethods: [],
    flags: { realWorld: true },
    problem:
      "Implement pick(obj, keys) returning a new object containing only the listed keys that exist on obj.",
    realWorldScenario: "Whitelisting which user fields to expose in an API response or log.",
    example: { input: "pick({a:1,b:2,c:3}, ['a','c'])", output: "{a:1, c:3}" },
    constraints: ["Only include keys present on obj", "Don't mutate obj"],
    starterCode: `function pick(obj, keys) {
  // keep only the listed keys
}`,
    builtInSolution: { language: "ts", code: "// No built-in; lodash.pick" },
    manualSolution: { language: "ts", code: "Object.fromEntries(keys.filter(k => k in obj).map(k => [k, obj[k]]))" },
    internalImplementation: {
      language: "ts",
      code: `function pick(obj, keys) {
  const out = {};
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) out[k] = obj[k];
  }
  return out;
}`,
    },
    solution: `function pick(obj, keys) {
  const out = {};
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) out[k] = obj[k];
  }
  return out;
}`,
    tests: [
      { name: "keeps listed keys", kind: "normal", call: "pick({a:1,b:2,c:3},['a','c'])", expected: { a: 1, c: 3 } },
      { name: "ignores missing keys", kind: "normal", call: "pick({a:1},['a','z'])", expected: { a: 1 } },
      { name: "empty keys", kind: "empty", call: "pick({a:1},[])", expected: {} },
    ],
    hiddenTests: [
      { name: "keeps falsy values", kind: "normal", call: "pick({a:0,b:2},['a'])", expected: { a: 0 } },
    ],
    hints: ["Iterate the keys list, not the object.", "Use hasOwn to include only present keys."],
    explanation:
      "Iterating the keys list (not the object) makes it a true whitelist. hasOwn avoids accidentally including inherited keys.",
    edgeCases: ["Missing keys are skipped", "Falsy values are still picked", "Inherited keys excluded via hasOwn"],
    timeComplexity: "O(keys)",
    spaceComplexity: "O(keys)",
    industrialNotes: ["Use a whitelist (pick) over a blacklist (omit) for security-sensitive output."],
    commonMistakes: ["Iterating obj instead of keys.", "Including inherited properties."],
  },
  {
    id: "ch-omit",
    slug: "omit-blocked-fields",
    title: "Omit Blocked Fields",
    difficulty: "Beginner",
    category: "Objects",
    tags: ["object", "blacklist"],
    relatedMethods: [],
    flags: { realWorld: true },
    problem:
      "Implement omit(obj, keys) returning a new object WITHOUT the listed keys.",
    realWorldScenario: "Stripping a password/token field before logging or returning a user object.",
    example: { input: "omit({a:1,b:2,c:3}, ['b'])", output: "{a:1, c:3}" },
    constraints: ["Exclude the listed keys", "Don't mutate obj"],
    starterCode: `function omit(obj, keys) {
  // copy all keys except the blocked ones
}`,
    builtInSolution: { language: "ts", code: "// No built-in; lodash.omit" },
    manualSolution: { language: "ts", code: "Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))" },
    internalImplementation: {
      language: "ts",
      code: `function omit(obj, keys) {
  const blocked = new Set(keys);
  const out = {};
  for (const k of Object.keys(obj)) {
    if (!blocked.has(k)) out[k] = obj[k];
  }
  return out;
}`,
    },
    solution: `function omit(obj, keys) {
  const blocked = new Set(keys);
  const out = {};
  for (const k of Object.keys(obj)) {
    if (!blocked.has(k)) out[k] = obj[k];
  }
  return out;
}`,
    tests: [
      { name: "removes blocked key", kind: "normal", call: "omit({a:1,b:2,c:3},['b'])", expected: { a: 1, c: 3 } },
      { name: "remove multiple", kind: "normal", call: "omit({a:1,b:2,c:3},['a','c'])", expected: { b: 2 } },
      { name: "empty block list", kind: "empty", call: "omit({a:1},[])", expected: { a: 1 } },
    ],
    hiddenTests: [
      { name: "unknown keys ignored", kind: "normal", call: "omit({a:1},['z'])", expected: { a: 1 } },
    ],
    hints: ["Put keys in a Set for O(1) lookups.", "Copy each obj key that's NOT blocked."],
    explanation:
      "A Set of blocked keys makes the exclusion check O(1). Iterate the object's keys and skip blocked ones.",
    edgeCases: ["Unknown keys to omit are harmless", "Empty list → full copy", "Shallow copy"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    industrialNotes: ["Prefer pick (whitelist) when correctness/security matters — omit can leak newly-added fields."],
    commonMistakes: ["Using includes() in a loop (O(n·m)) instead of a Set."],
  },
  {
    id: "ch-normalize",
    slug: "normalize-api-response",
    title: "Normalize an API Response",
    difficulty: "Industrial",
    category: "Objects",
    tags: ["object", "normalization", "state-shape"],
    relatedMethods: [],
    flags: { realWorld: true, dataTransformation: true, interview: true },
    problem:
      "Implement normalize(list) that turns an array of records (each with an id) into { byId, allIds } — the normalized shape used by Redux and data caches.",
    realWorldScenario: "Storing fetched lists so you can update one item in O(1) without scanning the array.",
    example: { input: "normalize([{id:1,n:'a'},{id:2,n:'b'}])", output: "{ byId: {1:{...},2:{...}}, allIds:[1,2] }" },
    constraints: ["Each item has an `id`", "Preserve order in allIds"],
    starterCode: `function normalize(list) {
  // return { byId, allIds }
}`,
    builtInSolution: { language: "ts", code: "// No built-in; this is a standard normalization pattern" },
    manualSolution: {
      language: "ts",
      code: `const byId = Object.fromEntries(list.map(x => [x.id, x]));
const allIds = list.map(x => x.id);`,
    },
    internalImplementation: {
      language: "ts",
      code: `function normalize(list) {
  const byId = {};
  const allIds = [];
  for (const item of list) {
    byId[item.id] = item;
    allIds.push(item.id);
  }
  return { byId, allIds };
}`,
    },
    solution: `function normalize(list) {
  const byId = {};
  const allIds = [];
  for (const item of list) {
    byId[item.id] = item;
    allIds.push(item.id);
  }
  return { byId, allIds };
}`,
    tests: [
      { name: "builds byId + allIds", kind: "normal", call: "normalize([{id:1,n:'a'},{id:2,n:'b'}])", expected: { byId: { "1": { id: 1, n: "a" }, "2": { id: 2, n: "b" } }, allIds: [1, 2] } },
      { name: "empty list", kind: "empty", call: "normalize([])", expected: { byId: {}, allIds: [] } },
    ],
    hiddenTests: [
      { name: "duplicate id: last wins in byId", kind: "duplicate", call: "normalize([{id:1,n:'a'},{id:1,n:'b'}]).byId['1'].n", expected: "b" },
    ],
    hints: ["byId maps id → item.", "allIds keeps the order.", "One pass builds both."],
    explanation:
      "Normalization turns O(n) array lookups into O(1) by-id access and keeps order in allIds — the backbone of Redux/RTK Query state shape.",
    edgeCases: ["Duplicate ids: last wins in byId", "Empty → empty structure", "Numeric ids become string keys in byId"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    industrialNotes: ["Normalized state lets you update one record without re-rendering the whole list.", "Pair allIds with byId to render in order while updating in O(1)."],
    commonMistakes: ["Keeping data as an array and scanning it for every update."],
  },
];
