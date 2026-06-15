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
      "An online store has products shaped like { name, category }. Write groupByCategory(products) that returns an object mapping each category to the array of products in it.",
    practiceStarter: `function groupByCategory(products) {
  // bucket each product under its category
}`,
    practiceTests: [
      {
        name: "buckets by category",
        kind: "normal",
        call: "groupByCategory([{name:'Apple',category:'fruit'},{name:'Milk',category:'dairy'},{name:'Pear',category:'fruit'}])",
        expected: {
          fruit: [{ name: "Apple", category: "fruit" }, { name: "Pear", category: "fruit" }],
          dairy: [{ name: "Milk", category: "dairy" }],
        },
      },
      { name: "empty input", kind: "empty", call: "groupByCategory([])", expected: {} },
    ],
    builtInPractice: {
      starter: `function groupByCategory(products) {
  // return Object.groupBy(products, p => p.category)
}`,
      mustUse: ["Object.groupBy("],
      intro: "Bucket the list with the built-in in one call.",
    },
    hint: "New way: Object.groupBy(products, p => p.category). Manual way: loop (or reduce) into {}, creating each category's array on first sight, then pushing.",
    solution: {
      language: "ts",
      code: `function groupByCategory(products) {
  const out = {};
  for (const p of products) {
    (out[p.category] ||= []).push(p);
  }
  return out;
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
      "You have a list of names. Write groupByInitial(names) that returns a Map from each first letter to the array of names starting with it.",
    practiceStarter: `function groupByInitial(names) {
  // use a Map keyed by each name's first letter
}`,
    practiceTests: [
      {
        name: "groups by first letter",
        kind: "normal",
        call: "[...groupByInitial(['Ann','Bob','Amy']).entries()]",
        expected: [
          ["A", ["Ann", "Amy"]],
          ["B", ["Bob"]],
        ],
      },
      { name: "empty input", kind: "empty", call: "[...groupByInitial([]).entries()]", expected: [] },
    ],
    builtInPractice: {
      starter: `function groupByInitial(names) {
  // return Map.groupBy(names, n => n[0])
}`,
      mustUse: ["Map.groupBy("],
      intro: "Bucket into a Map with the built-in in one call.",
    },
    hint: "New way: Map.groupBy(names, n => n[0]). Manual way: make a Map; for each name get-or-create the array for n[0], then push.",
    solution: {
      language: "ts",
      code: `function groupByInitial(names) {
  const map = new Map();
  for (const n of names) {
    const key = n[0];
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(n);
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
      "A settings object may or may not define a key itself. Write hasSetting(settings, key) that returns true only if settings has its OWN property named key — not one inherited from the prototype (like 'toString').",
    practiceStarter: `function hasSetting(settings, key) {
  // true only for settings' OWN key (not inherited)
}`,
    practiceTests: [
      { name: "own key", kind: "normal", call: "hasSetting({theme:'dark'}, 'theme')", expected: true },
      { name: "missing key", kind: "normal", call: "hasSetting({theme:'dark'}, 'lang')", expected: false },
      { name: "inherited key is not own", kind: "normal", call: "hasSetting({}, 'toString')", expected: false },
    ],
    builtInPractice: {
      starter: `function hasSetting(settings, key) {
  // return Object.hasOwn(settings, key)
}`,
      mustUse: ["Object.hasOwn("],
      intro: "Use the safe modern check.",
    },
    hint: "New way: Object.hasOwn(settings, key). Manual way (no Object.hasOwn): Object.prototype.hasOwnProperty.call(settings, key) — calling it safely off the prototype.",
    solution: {
      language: "ts",
      code: `function hasSetting(settings, key) {
  return Object.prototype.hasOwnProperty.call(settings, key);
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
      "Scores are stored as an object like { alice: 10, bob: 20 }. Write addBonus(scores, bonus) that returns a NEW object with bonus added to every score (keys unchanged).",
    practiceStarter: `function addBonus(scores, bonus) {
  // return a new object: each value increased by bonus, same keys
}`,
    practiceTests: [
      { name: "adds the bonus", kind: "normal", call: "addBonus({alice:10, bob:20}, 5)", expected: { alice: 15, bob: 25 } },
      { name: "zero bonus", kind: "normal", call: "addBonus({x:1}, 0)", expected: { x: 1 } },
      { name: "empty object", kind: "empty", call: "addBonus({}, 5)", expected: {} },
    ],
    builtInPractice: {
      starter: `function addBonus(scores, bonus) {
  // return Object.fromEntries(
  //   Object.entries(scores).map(([k, v]) => [k, v + bonus])
  // )
}`,
      mustUse: ["Object.fromEntries("],
      intro: "Round-trip through entries: object → pairs → transform → back to object.",
    },
    hint: "New way: Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, v + bonus])). Manual way (no fromEntries): loop Object.entries and assign each k to v + bonus on a new object.",
    solution: {
      language: "ts",
      code: `function addBonus(scores, bonus) {
  const out = {};
  for (const [k, v] of Object.entries(scores)) {
    out[k] = v + bonus;
  }
  return out;
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
      "Before a user edits a draft you take a snapshot for undo. Write snapshot(draft) that returns a DEEP copy of the (nested, JSON-safe) draft object, so editing the copy never changes the original.",
    practiceStarter: `function snapshot(draft) {
  // return a fully independent deep copy of draft
}`,
    practiceTests: [
      { name: "copies nested data", kind: "normal", call: "snapshot({title:'A', meta:{tags:['x']}})", expected: { title: "A", meta: { tags: ["x"] } } },
      {
        name: "no shared reference",
        kind: "mutation",
        call: "(()=>{const d={meta:{tags:['x']}};const c=snapshot(d);c.meta.tags.push('y');return d.meta.tags;})()",
        expected: ["x"],
      },
      { name: "clones arrays", kind: "normal", call: "snapshot([1,[2,3]])", expected: [1, [2, 3]] },
    ],
    builtInPractice: {
      starter: `function snapshot(draft) {
  // return structuredClone(draft)
}`,
      mustUse: ["structuredClone("],
      intro: "One call gives a true deep copy — nested objects and arrays included.",
    },
    hint: "New way: structuredClone(draft). Manual way (no structuredClone): recurse — if it's not an object return it; arrays map() each element through the clone; objects copy each key through the clone.",
    solution: {
      language: "ts",
      code: `function snapshot(draft) {
  if (draft === null || typeof draft !== 'object') return draft;
  if (Array.isArray(draft)) return draft.map(snapshot);
  const out = {};
  for (const k of Object.keys(draft)) out[k] = snapshot(draft[k]);
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
