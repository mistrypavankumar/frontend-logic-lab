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
    examples: [
      {
        title: "Numbers, ascending",
        code: `[3, 1, 2].toSorted((a, b) => a - b)`,
        output: "[1, 2, 3]",
        note: "Always pass a comparator for numbers — without one they sort as strings.",
      },
      {
        title: "Numbers, descending",
        code: `[3, 1, 2].toSorted((a, b) => b - a)`,
        output: "[3, 2, 1]",
        note: "Flip the subtraction (b - a) to reverse the order.",
      },
      {
        title: "Strings, A→Z",
        code: `["pear", "apple", "fig"].toSorted()`,
        output: `["apple", "fig", "pear"]`,
        note: "For plain strings the default lexicographic sort is fine — no comparator needed.",
      },
      {
        title: "Objects, by a field",
        code: `const users = [{ name: "Ana", age: 30 }, { name: "Bo", age: 22 }];
users.toSorted((a, b) => a.age - b.age);`,
        output: `[{ Bo, 22 }, { Ana, 30 }]`,
        note: "Compare the field you care about. `users` stays untouched — that's the toSorted promise.",
      },
    ],
    practiceTask:
      "A scoreboard keeps player scores in React state. Write ranked(scores) that returns a NEW array sorted highest-first, leaving the original state array untouched.",
    practiceStarter: `function ranked(scores) {
  // return a NEW array sorted highest-first; don't mutate scores
}`,
    practiceTests: [
      { name: "highest first", kind: "normal", call: "ranked([30, 10, 20])", expected: [30, 20, 10] },
      { name: "does not mutate state", kind: "mutation", call: "(()=>{const s=[30,10,20];ranked(s);return s;})()", expected: [30, 10, 20] },
      { name: "empty scoreboard", kind: "empty", call: "ranked([])", expected: [] },
    ],
    builtInPractice: {
      starter: `function ranked(scores) {
  // return scores.toSorted(...) sorted highest-first
}`,
      mustUse: [".toSorted("],
      intro: "Use the new immutable method — it sorts a copy, so state stays intact.",
    },
    hint: "Sort descending with (a, b) => b - a. New way: scores.toSorted((a,b)=>b-a). Older way (no toSorted): [...scores].sort((a,b)=>b-a).",
    solution: {
      language: "ts",
      code: `function ranked(scores) {
  return [...scores].sort((a, b) => b - a);
}`,
    },
    explanation:
      "Copy, then sort the copy — the original array is never touched, which is exactly what toSorted does internally.",
    mentalModel:
      "Picture photocopying a stack of papers, then shuffling the COPY into order. The original stack stays exactly as it was — that's the difference between toSorted (copy) and sort (in place).",
    eli5:
      "sort() rearranges your actual toys on the shelf. toSorted() takes a photo, arranges toys in the photo, and hands you the photo — your real shelf is untouched.",
    methodComparison: {
      builtIn: { language: "js", code: `const sorted = nums.toSorted((a, b) => a - b);` },
      manual: { language: "js", code: `const sorted = [...nums].sort((a, b) => a - b);` },
      internal: {
        language: "js",
        code: `function myToSorted(arr, cmp) {
  const copy = arr.slice(); // copy first
  copy.sort(cmp);           // sort the copy in place
  return copy;              // original never touched
}`,
      },
      whenToUse: [
        "Use toSorted when you have it (modern runtimes) and want clean, immutable code.",
        "Use [...arr].sort(cmp) as the everywhere-supported equivalent.",
        "Use in-place sort() only when you own the array and the extra copy genuinely costs too much.",
      ],
    },
    fadedExample: {
      intro: "Fill the gaps in myToSorted, then try writing it from scratch below.",
      code: `function myToSorted(arr, cmp) {
  const copy = arr.{{1}}();
  copy.{{2}}(cmp);
  return {{3}};
}`,
      blanks: [
        { id: "1", answer: "slice", hint: "Make an independent copy of the array first." },
        { id: "2", answer: "sort", hint: "Reorder the COPY in place." },
        { id: "3", answer: "copy", hint: "Return the sorted copy — not arr." },
      ],
    },
    predictOutput: [
      {
        prompt: "What is logged?",
        code: `const nums = [3, 1, 2];
const sorted = nums.toSorted((a, b) => a - b);
console.log(nums, sorted);`,
        kind: "multiple-choice",
        choices: [
          "[3,1,2] [1,2,3]",
          "[1,2,3] [1,2,3]",
          "[1,2,3] [3,1,2]",
          "[3,1,2] [3,1,2]",
        ],
        answer: "[3,1,2] [1,2,3]",
        explanation:
          "toSorted returns a NEW sorted array, so `sorted` is [1,2,3]. It does not mutate, so `nums` is still [3,1,2]. That's the whole point of toSorted vs sort.",
        distractorExplanations: {
          "[1,2,3] [1,2,3]": "This is what you'd get from sort() — it mutates in place, so both would be sorted. toSorted leaves the original alone.",
          "[1,2,3] [3,1,2]": "You've got them swapped. `nums` is the original (untouched → [3,1,2]) and `sorted` is the new sorted copy ([1,2,3]).",
          "[3,1,2] [3,1,2]": "toSorted does return a sorted result — `sorted` isn't a plain copy, it's sorted ascending.",
        },
      },
    ],
    dryRun: [
      { label: "Copy", code: `const copy = arr.slice(); // [3,1,2]`, detail: "First we copy the input so we never touch the original." },
      { label: "Sort the copy", code: `copy.sort((a,b)=>a-b)`, detail: "sort compares pairs: a-b<0 means a comes first. It rearranges the COPY in place." },
      { label: "Result", code: `copy // [1,2,3]`, detail: "The copy is now ascending." },
      { label: "Return", code: `return copy`, detail: "We return the sorted copy. arr is still [3,1,2]." },
    ],
    variableTrace: {
      columns: ["Step", "copy", "arr (original)", "Explanation"],
      rows: [
        ["after slice()", "[3,1,2]", "[3,1,2]", "Independent copy made"],
        ["after sort()", "[1,2,3]", "[3,1,2]", "Only the copy is reordered"],
        ["return", "[1,2,3]", "[3,1,2]", "Original stayed immutable"],
      ],
    },
    commonMistakes: [
      "Omitting the numeric comparator — `[10,9].toSorted()` gives [10,9] (lexicographic!).",
      "Assuming toSorted mutates like sort (it doesn't).",
      "Calling .sort() directly on state in React, mutating it and causing stale renders.",
    ],
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
    mentalModel:
      "Like flipping a photocopy of the list end-to-end — the order reverses on the copy, the original stays put.",
    examples: [
      {
        title: "Reverse numbers",
        code: `[1, 2, 3].toReversed()`,
        output: "[3, 2, 1]",
        note: "A new array; the original is untouched (unlike .reverse(), which mutates).",
      },
      {
        title: "Reverse the characters of a string",
        code: `[...'abc'].toReversed().join('')`,
        output: `"cba"`,
        note: "Spread the string into an array of chars first, then join back.",
      },
      {
        title: "Newest-first list",
        code: `const posts = ['old', 'mid', 'new'];
posts.toReversed();`,
        output: `['new', 'mid', 'old']`,
        note: "A common UI move: store oldest-first, show newest-first without mutating state.",
      },
    ],
    practiceTask:
      "A carousel shows slides in reverse for a right-to-left layout. Write rtlOrder(slides) that returns a NEW reversed array, leaving the original slides array unchanged.",
    practiceStarter: `function rtlOrder(slides) {
  // return a NEW reversed array; don't mutate slides
}`,
    practiceTests: [
      { name: "reverses order", kind: "normal", call: "rtlOrder(['a','b','c'])", expected: ["c", "b", "a"] },
      { name: "does not mutate input", kind: "mutation", call: "(()=>{const s=['a','b','c'];rtlOrder(s);return s;})()", expected: ["a", "b", "c"] },
      { name: "empty", kind: "empty", call: "rtlOrder([])", expected: [] },
    ],
    builtInPractice: {
      starter: `function rtlOrder(slides) {
  // return slides.toReversed()
}`,
      mustUse: [".toReversed("],
      intro: "Use the new immutable method — it reverses a copy, leaving the original alone.",
    },
    hint: "New way: slides.toReversed(). Older way (no toReversed): [...slides].reverse() — copy first so the original isn't flipped.",
    solution: {
      language: "ts",
      code: `function rtlOrder(slides) {
  return [...slides].reverse();
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
    mentalModel:
      "Hand back a fresh copy of the list with exactly one slot swapped — the original array is never edited.",
    examples: [
      {
        title: "Replace by index",
        code: `[1, 2, 3].with(1, 99)`,
        output: "[1, 99, 3]",
        note: "Index 1 becomes 99; a new array comes back.",
      },
      {
        title: "Count from the end",
        code: `[1, 2, 3].with(-1, 9)`,
        output: "[1, 2, 9]",
        note: "Negative indices count from the end — -1 is the last item.",
      },
      {
        title: "Immutable update in React state",
        code: `// mark item i done, without mutating state
setItems(items.with(i, { ...items[i], done: true }));`,
        note: "Returns a new array, so React sees a fresh reference and re-renders correctly.",
      },
    ],
    practiceTask:
      "A todo list lives in React state. Write rename(todos, index, newText) that returns a NEW array with the todo at index replaced by newText — without mutating the original.",
    practiceStarter: `function rename(todos, index, newText) {
  // return a NEW array with todos[index] replaced; don't mutate todos
}`,
    practiceTests: [
      { name: "replaces one item", kind: "normal", call: "rename(['buy','cook','eat'], 1, 'bake')", expected: ["buy", "bake", "eat"] },
      { name: "does not mutate input", kind: "mutation", call: "(()=>{const t=['a','b'];rename(t,0,'x');return t;})()", expected: ["a", "b"] },
      { name: "replace first", kind: "normal", call: "rename(['a','b'], 0, 'x')", expected: ["x", "b"] },
    ],
    builtInPractice: {
      starter: `function rename(todos, index, newText) {
  // return todos.with(index, newText)
}`,
      mustUse: [".with("],
      intro: "Use the new method — it replaces one slot and returns a fresh array.",
    },
    hint: "New way: todos.with(index, newText). Manual way (no with): todos.map((t, i) => i === index ? newText : t).",
    solution: {
      language: "ts",
      code: `function rename(todos, index, newText) {
  return todos.map((t, i) => (i === index ? newText : t));
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
    mentalModel:
      "splice() with the mutation removed: same (start, deleteCount, ...itemsToInsert) recipe, but you get a new array back.",
    examples: [
      {
        title: "Remove items",
        code: `[1, 2, 3, 4].toSpliced(1, 2)`,
        output: "[1, 4]",
        note: "From index 1, delete 2 items. Nothing inserted.",
      },
      {
        title: "Insert without removing",
        code: `[1, 2, 3].toSpliced(1, 0, 'x')`,
        output: `[1, 'x', 2, 3]`,
        note: "deleteCount 0 = pure insert at the position.",
      },
      {
        title: "Replace a range",
        code: `[1, 2, 3, 4].toSpliced(1, 2, 99)`,
        output: "[1, 99, 4]",
        note: "Delete 2 from index 1, insert 99 in their place.",
      },
    ],
    practiceTask:
      "A playlist lives in React state. Write removeAt(songs, index) that returns a NEW array with the song at index removed — without mutating the original.",
    practiceStarter: `function removeAt(songs, index) {
  // return a NEW array with songs[index] removed; don't mutate songs
}`,
    practiceTests: [
      { name: "removes the middle one", kind: "normal", call: "removeAt(['a','b','c'], 1)", expected: ["a", "c"] },
      { name: "removes the first", kind: "normal", call: "removeAt(['a','b'], 0)", expected: ["b"] },
      { name: "does not mutate input", kind: "mutation", call: "(()=>{const s=['a','b','c'];removeAt(s,0);return s;})()", expected: ["a", "b", "c"] },
    ],
    builtInPractice: {
      starter: `function removeAt(songs, index) {
  // return songs.toSpliced(index, 1)
}`,
      mustUse: [".toSpliced("],
      intro: "Use the new immutable method — toSpliced(index, 1) removes one item into a fresh array.",
    },
    hint: "New way: songs.toSpliced(index, 1). Manual way (no toSpliced): [...songs.slice(0, index), ...songs.slice(index + 1)].",
    solution: {
      language: "ts",
      code: `function removeAt(songs, index) {
  return [...songs.slice(0, index), ...songs.slice(index + 1)];
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
    mentalModel:
      "Just like find(), but it walks the array from the END — it returns the first match going backwards.",
    examples: [
      {
        title: "Last matching value",
        code: `[1, 5, 2, 5, 3].findLast(n => n === 5)`,
        output: "5",
        note: "Scans from the right; returns the value (or undefined if none match).",
      },
      {
        title: "Last matching index",
        code: `[1, 5, 2, 5, 3].findLastIndex(n => n === 5)`,
        output: "3",
        note: "Same scan, but gives the index (-1 if none).",
      },
      {
        title: "Most recent matching record",
        code: `const logs = [
  { level: 'info' }, { level: 'error' }, { level: 'info' },
];
logs.findLast(l => l.level === 'error');`,
        output: `{ level: 'error' }`,
        note: "Perfect for 'the latest X' — no need to reverse the array first.",
      },
    ],
    practiceTask:
      "An activity log is stored oldest-first, each entry shaped like { action, ok }. Write lastFailure(log) that returns the MOST RECENT entry where ok is false — or undefined if there are none.",
    practiceStarter: `function lastFailure(log) {
  // return the last entry with ok === false, or undefined
}`,
    practiceTests: [
      { name: "most recent failure", kind: "normal", call: "lastFailure([{action:'a',ok:true},{action:'b',ok:false},{action:'c',ok:true}])", expected: { action: "b", ok: false } },
      { name: "no failures", kind: "normal", call: "lastFailure([{action:'a',ok:true}])", expected: undefined },
      { name: "empty log", kind: "empty", call: "lastFailure([])", expected: undefined },
    ],
    builtInPractice: {
      starter: `function lastFailure(log) {
  // return log.findLast(...) for the last entry with ok === false
}`,
      mustUse: [".findLast("],
      intro: "Use findLast — it scans from the end, so no reversing needed.",
    },
    hint: "New way: log.findLast(e => !e.ok). Manual way (no findLast): loop from the last index down to 0 and return the first entry with ok === false.",
    solution: {
      language: "ts",
      code: `function lastFailure(log) {
  for (let i = log.length - 1; i >= 0; i--) {
    if (!log[i].ok) return log[i];
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
