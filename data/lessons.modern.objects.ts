import { Lesson } from "@/lib/types";

// Modern object/grouping APIs. Grouping is one of the most common real frontend
// jobs (group orders by status, users by role), so it gets the fullest treatment.
export const modernObjectLessons: Lesson[] = [
  {
    id: "m-object-groupby",
    slug: "object-groupby",
    title: "Object.groupBy()",
    category: "Modern Objects & Grouping",
    difficulty: "Intermediate",
    order: 111,
    estimatedMinutes: 10,
    isModernMethod: true,
    relatedMethods: ["Map.groupBy", "reduce"],
    practiceChallengeIds: ["ch-my-groupby"],
    summary:
      "Object.groupBy(items, keyFn) buckets an array into an object: each key holds the array of items that produced it.",
    realLifeExample:
      "Sorting a pile of mail into labelled trays — 'bills', 'personal', 'ads' — one tray per category.",
    codeExample: {
      language: "ts",
      code: `const orders = [{id:1,status:'paid'},{id:2,status:'open'},{id:3,status:'paid'}];
Object.groupBy(orders, o => o.status);
// { paid: [{id:1..},{id:3..}], open: [{id:2..}] }`,
    },
    practiceTask:
      "Implement myGroupBy(items, keyFn) returning { key: items[] }. Use a plain object as the accumulator.",
    practiceStarter: `function myGroupBy(items, keyFn) {
  // bucket each item under keyFn(item)
}`,
    practiceTests: [
      {
        name: "groups by status",
        kind: "normal",
        call: "myGroupBy([{s:'a'},{s:'b'},{s:'a'}], x => x.s)",
        expected: { a: [{ s: "a" }, { s: "a" }], b: [{ s: "b" }] },
      },
      { name: "empty input", kind: "empty", call: "myGroupBy([], x => x)", expected: {} },
    ],
    hint: "reduce into {}. For each item compute the key, create the array if missing, then push.",
    solution: {
      language: "ts",
      code: `function myGroupBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ||= []).push(item);
    return acc;
  }, {});
}`,
    },
    explanation:
      "Each item computes a key; we lazily create that key's array and push. This reduce pattern is the heart of every dashboard grouping.",
    deepDive: {
      problemSolved:
        "Turning a flat list into category buckets — the data shape almost every dashboard, kanban board, and grouped table needs.",
      realWorldUseCase: "Group orders by status, users by role, transactions by month, products by category.",
      builtInSolution: { language: "ts", code: "Object.groupBy(orders, o => o.status)" },
      manualSolution: {
        language: "ts",
        code: `orders.reduce((acc, o) => {
  (acc[o.status] ||= []).push(o);
  return acc;
}, {})`,
      },
      internalImplementation: {
        language: "ts",
        code: `function myGroupBy(items, keyFn) {
  const out = Object.create(null); // no prototype → no __proto__ key collisions
  for (const item of items) {
    const key = keyFn(item);
    (out[key] ||= []).push(item);
  }
  return out;
}`,
      },
      edgeCases: [
        "Empty input → {}",
        "Keys are coerced to strings",
        "A key named '__proto__' is a footgun — native Object.groupBy uses a null-prototype object to be safe",
        "Items in undefined/null groups still bucket under 'undefined'/'null' strings",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      browserSupport: "Chrome/Edge 117+, Firefox 119+, Safari 17.4+, Node 21+. Fallback: the reduce above.",
      whenNotToUse: "When keys aren't valid object keys (objects, NaN distinctions) — use Map.groupBy instead.",
      industrialNotes: [
        "Use Object.create(null) when grouping by user-controlled keys to avoid prototype pollution.",
        "For very large datasets, group once and memoize rather than re-grouping on every render.",
      ],
      commonMistakes: ["Re-grouping inside render on every keystroke.", "Using object keys when values aren't string-safe."],
    },
  },
  {
    id: "m-map-groupby",
    slug: "map-groupby",
    title: "Map.groupBy()",
    category: "Modern Objects & Grouping",
    difficulty: "Intermediate",
    order: 112,
    estimatedMinutes: 8,
    isModernMethod: true,
    relatedMethods: ["Object.groupBy"],
    summary:
      "Map.groupBy(items, keyFn) is like Object.groupBy but returns a Map — so keys can be ANY value (objects, numbers, dates), not just strings.",
    realLifeExample:
      "Filing items by a physical object as the label (e.g. group people by their exact team object) rather than a text tag.",
    codeExample: {
      language: "ts",
      code: `const items = [{n:1},{n:2},{n:3}];
const g = Map.groupBy(items, x => x.n % 2 === 0 ? 'even' : 'odd');
g.get('odd'); // [{n:1},{n:3}]`,
    },
    practiceTask:
      "Implement myMapGroupBy(items, keyFn) returning a Map of key -> items[].",
    practiceStarter: `function myMapGroupBy(items, keyFn) {
  // use a Map so keys can be any type
}`,
    practiceTests: [
      {
        name: "groups into a Map",
        kind: "normal",
        call: "[...myMapGroupBy([1,2,3,4], n => n % 2).entries()]",
        expected: [
          [1, [1, 3]],
          [0, [2, 4]],
        ],
      },
    ],
    hint: "Create a Map. For each item, get-or-create the array via map.get(key) ?? [], push, then map.set.",
    solution: {
      language: "ts",
      code: `function myMapGroupBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}`,
    },
    explanation:
      "A Map preserves the real key type and insertion order, so numbers stay numbers and object identities stay distinct.",
    deepDive: {
      problemSolved:
        "Object.groupBy stringifies keys; when you need to group by a number, Date, or object identity, you need a Map.",
      realWorldUseCase: "Grouping events by their Date object, or rows by a reference to their parent record.",
      builtInSolution: { language: "ts", code: "Map.groupBy(events, e => e.dateObject)" },
      manualSolution: {
        language: "ts",
        code: `events.reduce((m, e) => m.set(e.type, [...(m.get(e.type) ?? []), e]), new Map())`,
      },
      internalImplementation: {
        language: "ts",
        code: `function myMapGroupBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    (map.get(key) ?? map.set(key, []).get(key)).push(item);
  }
  return map;
}`,
      },
      edgeCases: ["Object keys compare by identity, not value", "Insertion order of keys is preserved", "Empty input → empty Map"],
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      browserSupport: "Chrome/Edge 117+, Firefox 119+, Safari 17.4+, Node 21+. Fallback: reduce into a Map.",
      whenNotToUse: "When keys are simple strings and you want plain-object ergonomics — Object.groupBy is simpler to consume in JSX.",
      industrialNotes: ["Prefer Map.groupBy when grouping by non-string keys to avoid silent stringification bugs."],
      commonMistakes: ["Expecting two distinct objects with equal contents to land in the same group (they won't)."],
    },
  },
  {
    id: "m-hasown",
    slug: "object-hasown",
    title: "Object.hasOwn()",
    category: "Modern Objects & Grouping",
    difficulty: "Beginner",
    order: 113,
    estimatedMinutes: 6,
    isModernMethod: true,
    relatedMethods: ["hasOwnProperty"],
    summary:
      "Object.hasOwn(obj, key) safely checks if an object has its OWN property — the modern, safe replacement for obj.hasOwnProperty(key).",
    realLifeExample:
      "Checking whether a form actually has a 'phone' field of its own, versus one inherited from a template.",
    codeExample: {
      language: "ts",
      code: `const user = { name: 'Ana' };
Object.hasOwn(user, 'name'); // true
Object.hasOwn(user, 'toString'); // false (inherited)`,
    },
    practiceTask:
      "Implement myHasOwn(obj, key) returning true only for the object's own keys (not inherited ones).",
    practiceStarter: `function myHasOwn(obj, key) {
  // check OWN property only
}`,
    practiceTests: [
      { name: "own key", kind: "normal", call: "myHasOwn({a:1}, 'a')", expected: true },
      { name: "missing key", kind: "normal", call: "myHasOwn({a:1}, 'b')", expected: false },
      { name: "inherited key is not own", kind: "normal", call: "myHasOwn({}, 'toString')", expected: false },
    ],
    hint: "Use Object.prototype.hasOwnProperty.call(obj, key) — calling it safely off the prototype.",
    solution: {
      language: "ts",
      code: `function myHasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}`,
    },
    explanation:
      "Calling hasOwnProperty via .call works even when obj overrides it or is a null-prototype object — that's exactly what Object.hasOwn does.",
    deepDive: {
      problemSolved:
        "obj.hasOwnProperty(k) breaks if the object has a property literally named 'hasOwnProperty', or is created with Object.create(null).",
      realWorldUseCase: "Validating that an API response object actually contains a field before reading it.",
      builtInSolution: { language: "ts", code: "Object.hasOwn(response, 'data')" },
      manualSolution: { language: "ts", code: "Object.prototype.hasOwnProperty.call(response, 'data')" },
      internalImplementation: {
        language: "ts",
        code: `function myHasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}`,
      },
      edgeCases: ["Works on null-prototype objects", "Returns false for inherited/prototype keys", "Throws on null/undefined obj"],
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      browserSupport: "Chrome/Edge 93+, Firefox 92+, Safari 15.4+, Node 16.9+. Fallback: hasOwnProperty.call.",
      whenNotToUse: "When 'in' (which includes inherited keys) is actually what you want.",
      industrialNotes: ["Prefer Object.hasOwn over the bare method call in all new code."],
      commonMistakes: ["Using key in obj when you meant own-only.", "Calling obj.hasOwnProperty directly on untrusted objects."],
    },
  },
  {
    id: "m-fromentries",
    slug: "object-fromentries",
    title: "Object.fromEntries() & entries transforms",
    category: "Modern Objects & Grouping",
    difficulty: "Intermediate",
    order: 114,
    estimatedMinutes: 9,
    isModernMethod: true,
    relatedMethods: ["Object.entries", "Object.keys"],
    practiceChallengeIds: ["ch-entries-to-object"],
    summary:
      "Object.entries turns an object into [key, value] pairs you can map/filter; Object.fromEntries turns pairs back into an object. Together they let you transform objects like arrays.",
    realLifeExample:
      "Spreading a recipe's ingredients onto a table to adjust quantities, then gathering them back into the recipe.",
    codeExample: {
      language: "ts",
      code: `const prices = { a: 10, b: 20 };
const doubled = Object.fromEntries(
  Object.entries(prices).map(([k, v]) => [k, v * 2])
); // { a: 20, b: 40 }`,
    },
    practiceTask:
      "Implement mapValues(obj, fn) that returns a new object with fn applied to each value (keys unchanged).",
    practiceStarter: `function mapValues(obj, fn) {
  // transform each value, keep keys
}`,
    practiceTests: [
      { name: "doubles values", kind: "normal", call: "mapValues({a:1,b:2}, v => v * 2)", expected: { a: 2, b: 4 } },
      { name: "empty object", kind: "empty", call: "mapValues({}, v => v)", expected: {} },
    ],
    hint: "Object.entries(obj) → .map(([k, v]) => [k, fn(v)]) → Object.fromEntries(...).",
    solution: {
      language: "ts",
      code: `function mapValues(obj, fn) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, fn(v)])
  );
}`,
    },
    explanation:
      "entries → array land where map/filter work → fromEntries back to an object. This 'round-trip' is how you cleanly transform objects.",
    deepDive: {
      problemSolved: "Objects have no map/filter; entries/fromEntries borrow array transforms for objects.",
      realWorldUseCase: "Normalizing form values, stripping fields, converting a Map or query params to a plain object.",
      builtInSolution: { language: "ts", code: "Object.fromEntries(new URLSearchParams(location.search))" },
      manualSolution: {
        language: "ts",
        code: `const out = {};
for (const [k, v] of Object.entries(obj)) out[k] = fn(v);`,
      },
      internalImplementation: {
        language: "ts",
        code: `function myFromEntries(pairs) {
  const out = {};
  for (const [k, v] of pairs) out[k] = v;
  return out;
}`,
      },
      edgeCases: ["Duplicate keys: last one wins", "Symbol keys are skipped by entries()", "Works with any iterable of pairs (incl. Map)"],
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      browserSupport: "fromEntries: Chrome 73+, Firefox 63+, Safari 12.1+, Node 12+. Widely supported.",
      whenNotToUse: "Hot paths with huge objects — a manual for-loop avoids the intermediate array.",
      industrialNotes: ["The cleanest way to convert URLSearchParams / FormData / Map into a plain object."],
      commonMistakes: ["Forgetting entries() ignores symbol keys.", "Building the intermediate array in a tight loop unnecessarily."],
    },
  },
  {
    id: "m-structuredclone",
    slug: "structured-clone",
    title: "structuredClone()",
    category: "Modern Objects & Grouping",
    difficulty: "Intermediate",
    order: 115,
    estimatedMinutes: 8,
    isModernMethod: true,
    relatedMethods: ["JSON.parse", "Object.assign"],
    practiceChallengeIds: ["ch-deep-clone"],
    summary:
      "structuredClone(value) makes a true DEEP copy — nested objects, arrays, Maps, Sets, Dates — with no shared references.",
    realLifeExample:
      "Photocopying a binder including every page inside every divider, not just the cover — so editing the copy never touches the original.",
    codeExample: {
      language: "ts",
      code: `const a = { user: { tags: ['x'] } };
const b = structuredClone(a);
b.user.tags.push('y');
// a.user.tags is still ['x'] — fully independent`,
    },
    practiceTask:
      "Implement deepClone(value) for plain objects/arrays (recursively copy). Handle nested structures.",
    practiceStarter: `function deepClone(value) {
  // recursively clone objects and arrays
}`,
    practiceTests: [
      { name: "clones nested", kind: "normal", call: "deepClone({a:{b:1}})", expected: { a: { b: 1 } } },
      {
        name: "no shared reference",
        kind: "mutation",
        call: "(()=>{const o={a:{b:1}};const c=deepClone(o);c.a.b=99;return o.a.b;})()",
        expected: 1,
      },
      { name: "clones arrays", kind: "normal", call: "deepClone([1,[2,3]])", expected: [1, [2, 3]] },
    ],
    hint: "If value isn't an object, return it. Otherwise recurse over keys/elements building a new object/array.",
    solution: {
      language: "ts",
      code: `function deepClone(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(deepClone);
  const out = {};
  for (const k of Object.keys(value)) out[k] = deepClone(value[k]);
  return out;
}`,
    },
    explanation:
      "Recursion copies every level, so no nested reference is shared. structuredClone does this natively and also handles Dates, Maps, Sets.",
    deepDive: {
      problemSolved:
        "Spread/Object.assign are SHALLOW — nested objects stay shared, causing 'I edited the copy but the original changed too' bugs.",
      realWorldUseCase: "Snapshotting form state for an undo feature, or cloning config before mutating it locally.",
      builtInSolution: { language: "ts", code: "const copy = structuredClone(state);" },
      manualSolution: { language: "ts", code: "const copy = JSON.parse(JSON.stringify(state)); // loses Dates, undefined, functions" },
      internalImplementation: {
        language: "ts",
        code: `function deepClone(v) {
  if (v === null || typeof v !== 'object') return v;
  if (Array.isArray(v)) return v.map(deepClone);
  return Object.fromEntries(Object.entries(v).map(([k, val]) => [k, deepClone(val)]));
}`,
      },
      edgeCases: [
        "Functions cannot be cloned → structuredClone throws (DataCloneError)",
        "Handles circular references (JSON.stringify does not)",
        "Preserves Date/Map/Set/ArrayBuffer; JSON trick loses them",
      ],
      timeComplexity: "O(n) in the number of nodes",
      spaceComplexity: "O(n)",
      browserSupport: "Chrome/Edge 98+, Firefox 94+, Safari 15.4+, Node 17+. Fallback: a recursive deep clone or a library.",
      whenNotToUse: "Cloning values containing functions, DOM nodes, or class instances you need to preserve — it throws or drops them.",
      industrialNotes: [
        "Replaces the JSON.parse(JSON.stringify()) hack and its silent data loss.",
        "Watch the cost on very large objects — clone selectively.",
      ],
      commonMistakes: ["Cloning objects with functions and hitting DataCloneError.", "Assuming spread does a deep copy."],
    },
  },
];
