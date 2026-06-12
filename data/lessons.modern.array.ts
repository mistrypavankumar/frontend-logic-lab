import { Lesson } from "@/lib/types";

// Modern, non-mutating array methods (ES2023). Each lesson teaches the built-in,
// the manual equivalent, and a from-scratch internal implementation. The
// practice task always asks for the INTERNAL version so the auto-grader runs in
// any browser (it never depends on the new built-in existing).
export const modernArrayLessons: Lesson[] = [
  {
    id: "m-tosorted",
    slug: "array-tosorted",
    title: "Array.prototype.toSorted()",
    category: "Modern Array Methods",
    difficulty: "Intermediate",
    order: 101,
    estimatedMinutes: 9,
    isModernMethod: true,
    relatedMethods: ["toReversed", "toSpliced", "with", "sort"],
    summary:
      "toSorted() returns a NEW sorted array and leaves the original untouched — unlike sort(), which sorts in place and mutates.",
    realLifeExample:
      "Photocopying a document before reordering the pages, so the original stays intact.",
    codeExample: {
      language: "ts",
      code: `const nums = [3, 1, 2];
const sorted = nums.toSorted((a, b) => a - b);
// sorted -> [1, 2, 3], nums is still [3, 1, 2]`,
    },
    practiceTask:
      "Implement myToSorted(arr, cmp) that returns a NEW sorted array without mutating the input.",
    practiceStarter: `function myToSorted(arr, cmp) {
  // copy first, then sort the copy
}`,
    practiceTests: [
      { name: "sorts ascending", kind: "normal", call: "myToSorted([3,1,2],(a,b)=>a-b)", expected: [1, 2, 3] },
      { name: "does not mutate input", kind: "mutation", call: "(()=>{const a=[3,1,2];myToSorted(a,(x,y)=>x-y);return a;})()", expected: [3, 1, 2] },
      { name: "empty array", kind: "empty", call: "myToSorted([],(a,b)=>a-b)", expected: [] },
    ],
    hint: "Use arr.slice() (or [...arr]) to copy, then call .sort(cmp) on the copy.",
    solution: {
      language: "ts",
      code: `function myToSorted(arr, cmp) {
  const copy = arr.slice();
  copy.sort(cmp);
  return copy;
}`,
    },
    explanation:
      "Copy, then sort the copy — the original array is never touched, which is exactly what toSorted does internally.",
    deepDive: {
      problemSolved:
        "sort() mutates in place, a classic React bug when you sort an array held in state directly (you mutate state and the UI doesn't update predictably).",
      realWorldUseCase:
        "Sorting a data-table column while keeping the source rows in state untouched.",
      builtInSolution: { language: "ts", code: "rows.toSorted((a, b) => a.price - b.price)" },
      manualSolution: { language: "ts", code: "[...rows].sort((a, b) => a.price - b.price)" },
      internalImplementation: {
        language: "ts",
        code: `function myToSorted(arr, cmp) {
  const copy = arr.slice();
  copy.sort(cmp);
  return copy;
}`,
      },
      edgeCases: [
        "Empty array → []",
        "No comparator → lexicographic order ('10' sorts before '9')",
        "Sparse holes become undefined in the result",
        "NaN never compares equal — keep it out of comparators",
      ],
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n) — a copy is always made",
      browserSupport: "Chrome/Edge 110+, Firefox 115+, Safari 16+, Node 20+. Fallback: [...arr].sort(cmp).",
      whenNotToUse:
        "Hot paths over very large arrays where in-place sort is safe and the extra copy's cost matters.",
      industrialNotes: [
        "Default to toSorted in reducers/selectors to keep state immutable.",
        "V8's sort is stable (since 2019) — equal items keep their original order.",
      ],
      commonMistakes: ["Omitting the numeric comparator.", "Assuming it mutates (it does not)."],
    },
  },
  {
    id: "m-toreversed",
    slug: "array-toreversed",
    title: "Array.prototype.toReversed()",
    category: "Modern Array Methods",
    difficulty: "Beginner",
    order: 102,
    estimatedMinutes: 6,
    isModernMethod: true,
    relatedMethods: ["toSorted", "reverse"],
    summary:
      "toReversed() returns a NEW reversed array. reverse() mutates the original — toReversed() does not.",
    realLifeExample:
      "Reading a guest list bottom-to-top by writing out a fresh reversed copy, rather than scribbling over the original list.",
    codeExample: {
      language: "ts",
      code: `const a = [1, 2, 3];
const r = a.toReversed(); // [3, 2, 1], a unchanged`,
    },
    practiceTask: "Implement myToReversed(arr) returning a new reversed array (no mutation).",
    practiceStarter: `function myToReversed(arr) {
  // build a new array in reverse order
}`,
    practiceTests: [
      { name: "reverses", kind: "normal", call: "myToReversed([1,2,3])", expected: [3, 2, 1] },
      { name: "no mutation", kind: "mutation", call: "(()=>{const a=[1,2,3];myToReversed(a);return a;})()", expected: [1, 2, 3] },
      { name: "empty", kind: "empty", call: "myToReversed([])", expected: [] },
    ],
    hint: "Copy with slice() then .reverse(), or loop from the end pushing into a new array.",
    solution: {
      language: "ts",
      code: `function myToReversed(arr) {
  return arr.slice().reverse();
}`,
    },
    explanation:
      "slice() copies, reverse() flips the copy. The original array is preserved.",
    deepDive: {
      problemSolved: "reverse() mutates state arrays in place, causing the same React bug as sort().",
      realWorldUseCase: "Showing a chat or activity feed newest-first without mutating the stored order.",
      builtInSolution: { language: "ts", code: "messages.toReversed()" },
      manualSolution: { language: "ts", code: "[...messages].reverse()" },
      internalImplementation: {
        language: "ts",
        code: `function myToReversed(arr) {
  const out = [];
  for (let i = arr.length - 1; i >= 0; i--) out.push(arr[i]);
  return out;
}`,
      },
      edgeCases: ["Empty array → []", "Single element → same single element", "Sparse holes become undefined"],
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      browserSupport: "Chrome/Edge 110+, Firefox 115+, Safari 16+, Node 20+. Fallback: [...arr].reverse().",
      whenNotToUse: "When you actually want to mutate in place and reverse() is fine.",
      industrialNotes: ["Pairs well with toSorted for 'sort then reverse' without two mutations."],
      commonMistakes: ["Confusing it with reverse() and expecting the original to change."],
    },
  },
  {
    id: "m-with",
    slug: "array-with",
    title: "Array.prototype.with()",
    category: "Modern Array Methods",
    difficulty: "Intermediate",
    order: 103,
    estimatedMinutes: 8,
    isModernMethod: true,
    relatedMethods: ["toSpliced", "map"],
    summary:
      "with(index, value) returns a NEW array with one index replaced. It's the immutable version of arr[i] = value.",
    realLifeExample:
      "Reprinting a single page of a document with a correction, instead of scribbling over the original copy.",
    codeExample: {
      language: "ts",
      code: `const a = [1, 2, 3];
const b = a.with(1, 99); // [1, 99, 3], a unchanged`,
    },
    practiceTask: "Implement myWith(arr, index, value) returning a new array with that index replaced.",
    practiceStarter: `function myWith(arr, index, value) {
  // copy, then replace one element immutably
}`,
    practiceTests: [
      { name: "replaces index", kind: "normal", call: "myWith([1,2,3], 1, 99)", expected: [1, 99, 3] },
      { name: "no mutation", kind: "mutation", call: "(()=>{const a=[1,2,3];myWith(a,0,9);return a;})()", expected: [1, 2, 3] },
      { name: "replace first", kind: "normal", call: "myWith(['a','b'], 0, 'x')", expected: ["x", "b"] },
    ],
    hint: "Copy the array, then set copy[index] = value, then return the copy.",
    solution: {
      language: "ts",
      code: `function myWith(arr, index, value) {
  const copy = arr.slice();
  copy[index] = value;
  return copy;
}`,
    },
    explanation:
      "Replacing one element by index immutably is the daily bread of React state updates — with() does it in one call.",
    deepDive: {
      problemSolved:
        "Updating one item in a state array usually means a verbose map(); with() expresses 'replace index i' directly and immutably.",
      realWorldUseCase: "Toggling/editing one row in a table whose rows live in React state.",
      builtInSolution: { language: "ts", code: "rows.with(i, { ...rows[i], done: true })" },
      manualSolution: { language: "ts", code: "rows.map((r, idx) => (idx === i ? { ...r, done: true } : r))" },
      internalImplementation: {
        language: "ts",
        code: `function myWith(arr, index, value) {
  const copy = arr.slice();
  copy[index < 0 ? arr.length + index : index] = value;
  return copy;
}`,
      },
      edgeCases: [
        "Negative index counts from the end (a.with(-1, x))",
        "Out-of-range index throws RangeError in the native method",
        "Replaces exactly one slot",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      browserSupport: "Chrome/Edge 110+, Firefox 115+, Safari 16+, Node 20+. Fallback: map with index check.",
      whenNotToUse: "When you need to change many indexes — map() reads better there.",
      industrialNotes: ["Cleaner than map() for single-index updates in reducers."],
      commonMistakes: ["Forgetting native with() throws on out-of-range indexes (manual copy silently extends)."],
    },
  },
  {
    id: "m-tospliced",
    slug: "array-tospliced",
    title: "Array.prototype.toSpliced()",
    category: "Modern Array Methods",
    difficulty: "Advanced",
    order: 104,
    estimatedMinutes: 9,
    isModernMethod: true,
    relatedMethods: ["with", "splice"],
    summary:
      "toSpliced(start, deleteCount, ...items) returns a NEW array with items removed/inserted. It's the immutable splice().",
    realLifeExample:
      "Editing a fresh copy of a playlist — removing two songs and inserting one — while the saved playlist stays as it was.",
    codeExample: {
      language: "ts",
      code: `const a = [1, 2, 3, 4];
const b = a.toSpliced(1, 2, 99); // [1, 99, 4], a unchanged`,
    },
    practiceTask:
      "Implement myToSpliced(arr, start, deleteCount, ...items) returning a new array (no mutation).",
    practiceStarter: `function myToSpliced(arr, start, deleteCount, ...items) {
  // copy, splice the copy, return it
}`,
    practiceTests: [
      { name: "remove + insert", kind: "normal", call: "myToSpliced([1,2,3,4], 1, 2, 99)", expected: [1, 99, 4] },
      { name: "pure insert", kind: "normal", call: "myToSpliced([1,4], 1, 0, 2, 3)", expected: [1, 2, 3, 4] },
      { name: "no mutation", kind: "mutation", call: "(()=>{const a=[1,2,3];myToSpliced(a,0,1);return a;})()", expected: [1, 2, 3] },
    ],
    hint: "Copy with slice(), call splice() on the copy (which mutates the copy), then return the copy.",
    solution: {
      language: "ts",
      code: `function myToSpliced(arr, start, deleteCount, ...items) {
  const copy = arr.slice();
  copy.splice(start, deleteCount, ...items);
  return copy;
}`,
    },
    explanation:
      "splice() is powerful but mutates. Running it on a copy gives the same power without touching the source — that's toSpliced.",
    deepDive: {
      problemSolved: "Insert/remove at an index immutably without the awkward slice-concat dance.",
      realWorldUseCase: "Reordering or removing a list item in state (drag-and-drop lists, todo deletion).",
      builtInSolution: { language: "ts", code: "list.toSpliced(index, 1) // remove one immutably" },
      manualSolution: { language: "ts", code: "[...list.slice(0, index), ...list.slice(index + 1)]" },
      internalImplementation: {
        language: "ts",
        code: `function myToSpliced(arr, start, deleteCount, ...items) {
  const copy = arr.slice();
  copy.splice(start, deleteCount, ...items);
  return copy;
}`,
      },
      edgeCases: [
        "deleteCount omitted natively removes to the end (manual splice matches)",
        "Negative start counts from the end",
        "start beyond length appends items",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      browserSupport: "Chrome/Edge 110+, Firefox 115+, Safari 16+, Node 20+. Fallback: slice + spread.",
      whenNotToUse: "Simple single-index replace — use with() instead.",
      industrialNotes: ["Great for immutable list reordering in drag-and-drop UIs."],
      commonMistakes: ["Mixing up deleteCount and items order.", "Expecting it to mutate like splice()."],
    },
  },
  {
    id: "m-findlast",
    slug: "array-findlast",
    title: "findLast() & findLastIndex()",
    category: "Modern Array Methods",
    difficulty: "Beginner",
    order: 105,
    estimatedMinutes: 7,
    isModernMethod: true,
    relatedMethods: ["find", "findIndex"],
    summary:
      "findLast() / findLastIndex() search from the END of the array — the mirror of find() / findIndex().",
    realLifeExample:
      "Finding the most recent transaction by scanning the ledger from the bottom up instead of the top down.",
    codeExample: {
      language: "ts",
      code: `const nums = [1, 5, 2, 5, 3];
nums.findLast(n => n === 5);      // 5 (the last one)
nums.findLastIndex(n => n === 5); // 3`,
    },
    practiceTask:
      "Implement myFindLast(arr, predicate) returning the LAST element matching predicate, or undefined.",
    practiceStarter: `function myFindLast(arr, predicate) {
  // search from the end
}`,
    practiceTests: [
      { name: "finds last match", kind: "normal", call: "myFindLast([1,5,2,5,3], x => x === 5)", expected: 5 },
      { name: "returns undefined when none", kind: "normal", call: "myFindLast([1,2,3], x => x > 9)", expected: undefined },
      { name: "empty array", kind: "empty", call: "myFindLast([], x => true)", expected: undefined },
    ],
    hint: "Loop from arr.length - 1 down to 0; return the first element where predicate is true.",
    solution: {
      language: "ts",
      code: `function myFindLast(arr, predicate) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i], i, arr)) return arr[i];
  }
  return undefined;
}`,
    },
    explanation:
      "Same logic as find(), just walking the index backwards — the first backward match is the last forward match.",
    deepDive: {
      problemSolved:
        "Before ES2023 you had to reverse the array (a copy + O(n)) just to find the last match. findLast does it in one pass, no copy.",
      realWorldUseCase: "Finding the latest log entry, the most recent error, or the last completed step.",
      builtInSolution: { language: "ts", code: "logs.findLast(l => l.level === 'error')" },
      manualSolution: { language: "ts", code: "[...logs].reverse().find(l => l.level === 'error')" },
      internalImplementation: {
        language: "ts",
        code: `function myFindLast(arr, predicate) {
  for (let i = arr.length - 1; i >= 0; i--)
    if (predicate(arr[i], i, arr)) return arr[i];
  return undefined;
}`,
      },
      edgeCases: ["No match → undefined (findLastIndex → -1)", "Empty array → undefined / -1", "Predicate receives (value, index, array)"],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      browserSupport: "Chrome/Edge 97+, Firefox 104+, Safari 15.4+, Node 18+. Fallback: reverse + find (extra O(n) copy).",
      whenNotToUse: "When you need the first match — use find().",
      industrialNotes: ["Avoids the wasteful reverse-copy pattern for 'most recent' lookups."],
      commonMistakes: ["Reversing then using findIndex and forgetting the index is now flipped."],
    },
  },
];
