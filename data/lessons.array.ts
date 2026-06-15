import { Lesson } from "@/lib/types";

// Classic, everyday array methods (forEach, map, filter, reduce, sort, reverse…).
// Each lesson shows the SAME problem solved two (or three) ways:
//   1. built-in  — the idiomatic one-liner
//   2. manual    — the same result with a plain loop, NO built-in
//   3. internal  — a from-scratch reimplementation (myMap, myFilter…)
// The practice task always asks for the manual/internal version so the
// auto-grader runs in any browser without depending on the built-in.
//
// Order range 51-70 places these after the JavaScript foundations (1-10) and
// before the modern immutable variants (101+). These are NOT isModernMethod,
// so they live on /learn under "Array Methods" (not the /modern hub).
export const arrayMethodLessons: Lesson[] = [
  // -------------------------------------------------------------------------
  {
    id: "am-foreach",
    slug: "array-foreach",
    title: "Array.prototype.forEach()",
    category: "Array Methods",
    difficulty: "Beginner",
    order: 51,
    estimatedMinutes: 6,
    relatedMethods: ["map", "for...of"],
    nextLessonSlug: "array-map",
    summary:
      "forEach() runs a function once for every item. It's the readable way to 'do something with each element' — but it returns nothing (undefined).",
    realLifeExample:
      "Going down a checklist and ticking each box one at a time — you act on each item, you don't build a new list.",
    codeExample: {
      language: "js",
      code: `const names = ["Ana", "Bo", "Cy"];
names.forEach((name, i) => {
  console.log(i, name);
});
// 0 Ana / 1 Bo / 2 Cy`,
    },
    examples: [
      {
        title: "Use the index too",
        code: `["a", "b"].forEach((x, i) => console.log(i, x));`,
        output: "0 a / 1 b",
        note: "The callback gets (value, index, array). The index is handy for numbering.",
      },
      {
        title: "Side effects, not a result",
        code: `let total = 0;
[1, 2, 3].forEach(n => { total += n; });
total;`,
        output: "6",
        note: "forEach returns undefined — you keep results in a variable outside it.",
      },
    ],
    practiceTask:
      "A pedometer logs your steps for each day of the week. Write totalSteps(days) that walks the list and returns the grand total number of steps.",
    practiceStarter: `function totalSteps(days) {
  let total = 0;
  // walk every day with a for loop and add it to total
  return total;
}`,
    practiceTests: [
      { name: "adds every day", kind: "normal", call: "totalSteps([1000, 2500, 3000])", expected: 6500 },
      { name: "single day", kind: "normal", call: "totalSteps([4200])", expected: 4200 },
      { name: "no steps yet", kind: "empty", call: "totalSteps([])", expected: 0 },
    ],
    builtInPractice: {
      starter: `function totalSteps(days) {
  let total = 0;
  // use days.forEach(...) to add each day's steps to total
  return total;
}`,
      mustUse: [".forEach("],
    },
    hint: "Keep a running total. Built-in: days.forEach(n => { total += n; }). By hand: a for loop adding days[i] to total each time.",
    solution: {
      language: "js",
      code: `function totalSteps(days) {
  let total = 0;
  for (let i = 0; i < days.length; i++) {
    total += days[i];
  }
  return total;
}`,
    },
    explanation:
      "forEach is just a for loop wearing a nicer hat: it walks the array and hands each (value, index, array) to your function. It never returns a value.",
    mentalModel:
      "A conveyor belt: every item passes your hands once. You can DO something to each (log it, add it up), but nothing comes out the other end of forEach itself.",
    eli5:
      "Like reading every name on a guest list out loud, one by one. You did something with each name, but you didn't make a new list.",
    methodComparison: {
      builtIn: { language: "js", code: `names.forEach((name, i) => console.log(i, name));` },
      manual: {
        language: "js",
        code: `for (let i = 0; i < names.length; i++) {
  console.log(i, names[i]);
}`,
      },
      internal: {
        language: "js",
        code: `function myForEach(arr, fn) {
  for (let i = 0; i < arr.length; i++) fn(arr[i], i, arr);
}`,
      },
      whenToUse: [
        "Use forEach when you want to DO something per item (log, mutate external state) and don't need a result.",
        "Use a plain for / for...of loop when you need to break early — forEach can't be stopped.",
        "Reach for map/filter/reduce instead when you're BUILDING a new value from the items.",
      ],
    },
    commonMistakes: [
      "Expecting forEach to return something — it's always undefined. Use map if you want a new array.",
      "Trying to break/continue — they don't work in forEach. Use for...of or some()/every() to stop early.",
      "Using forEach to build an array by pushing, when map expresses it more clearly.",
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: "am-map",
    slug: "array-map",
    title: "Array.prototype.map()",
    category: "Array Methods",
    difficulty: "Beginner",
    order: 52,
    estimatedMinutes: 7,
    relatedMethods: ["forEach", "filter", "flatMap"],
    nextLessonSlug: "array-filter",
    summary:
      "map() builds a NEW array by transforming every item. Same length as the input, each element replaced by whatever your callback returns.",
    realLifeExample:
      "Converting every price on a menu from dollars to euros — same number of dishes, each price swapped for its converted value.",
    codeExample: {
      language: "js",
      code: `const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
// doubled -> [2, 4, 6]; nums unchanged`,
    },
    examples: [
      {
        title: "Transform each value",
        code: `[1, 2, 3].map(n => n * 2)`,
        output: "[2, 4, 6]",
        note: "One in, one out — the result is always the same length as the input.",
      },
      {
        title: "Pull a field off each object",
        code: `const users = [{ name: "Ana" }, { name: "Bo" }];
users.map(u => u.name);`,
        output: `["Ana", "Bo"]`,
        note: "The classic 'extract a column' move from an array of objects.",
      },
      {
        title: "Use the index",
        code: `["a", "b", "c"].map((x, i) => \`\${i}:\${x}\`)`,
        output: `["0:a", "1:b", "2:c"]`,
        note: "The callback also receives the index as its second argument.",
      },
    ],
    practiceTask:
      "A weather widget stores temperatures in Celsius but needs to show Fahrenheit. Write toFahrenheit(celsius) that returns a NEW array with each temperature converted (formula: c * 9 / 5 + 32).",
    practiceStarter: `function toFahrenheit(celsius) {
  // build a new array; convert each c to c * 9 / 5 + 32
}`,
    practiceTests: [
      { name: "converts each temp", kind: "normal", call: "toFahrenheit([0, 100])", expected: [32, 212] },
      { name: "body temperature", kind: "normal", call: "toFahrenheit([37])", expected: [98.6] },
      { name: "does not mutate input", kind: "mutation", call: "(()=>{const a=[0,100];toFahrenheit(a);return a;})()", expected: [0, 100] },
      { name: "empty array", kind: "empty", call: "toFahrenheit([])", expected: [] },
    ],
    builtInPractice: {
      starter: `function toFahrenheit(celsius) {
  // return celsius.map(...) converting each c to c * 9 / 5 + 32
}`,
      mustUse: [".map("],
    },
    hint: "Each output is c * 9 / 5 + 32. Built-in: celsius.map(c => c * 9 / 5 + 32). By hand: push that value into a new array for every c.",
    solution: {
      language: "js",
      code: `function toFahrenheit(celsius) {
  const out = [];
  for (let i = 0; i < celsius.length; i++) {
    out.push(celsius[i] * 9 / 5 + 32);
  }
  return out;
}`,
    },
    explanation:
      "map = forEach that collects the return values. For each item you compute a new value and push it; the original array is never touched.",
    mentalModel:
      "A factory line: each raw item goes through the same machine (your callback) and a finished item drops into a new box. Same count in and out.",
    eli5:
      "Give every kid in line the same sticker. Everyone still in line (same length), but now each one is changed in the same way.",
    methodComparison: {
      builtIn: { language: "js", code: `const doubled = nums.map(n => n * 2);` },
      manual: {
        language: "js",
        code: `const doubled = [];
for (let i = 0; i < nums.length; i++) {
  doubled.push(nums[i] * 2);
}`,
      },
      internal: {
        language: "js",
        code: `function myMap(arr, fn) {
  const out = [];
  for (let i = 0; i < arr.length; i++) out.push(fn(arr[i], i, arr));
  return out;
}`,
      },
      whenToUse: [
        "Use map when every input maps to exactly one output (a 1-to-1 transform).",
        "Use filter when you might DROP items, or map().filter() when you transform AND drop.",
        "Use forEach (not map) when you don't need the new array — using map for side effects is a code smell.",
      ],
    },
    commonMistakes: [
      "Forgetting to return from the callback — `nums.map(n => { n * 2 })` returns [undefined, …].",
      "Using map for side effects only (use forEach) — you build an array you throw away.",
      "Expecting map to remove items — it always returns the same length. Use filter to drop.",
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: "am-filter",
    slug: "array-filter",
    title: "Array.prototype.filter()",
    category: "Array Methods",
    difficulty: "Beginner",
    order: 53,
    estimatedMinutes: 7,
    relatedMethods: ["map", "find", "reduce"],
    nextLessonSlug: "array-reduce",
    summary:
      "filter() builds a NEW array of only the items that pass a test. The callback returns true (keep) or false (drop).",
    realLifeExample:
      "Going through a basket of fruit and keeping only the ripe ones — same fruit, fewer of them.",
    codeExample: {
      language: "js",
      code: `const nums = [1, 2, 3, 4];
const evens = nums.filter(n => n % 2 === 0);
// evens -> [2, 4]`,
    },
    examples: [
      {
        title: "Keep what passes the test",
        code: `[1, 2, 3, 4].filter(n => n % 2 === 0)`,
        output: "[2, 4]",
        note: "Truthy callback result keeps the item; falsy drops it.",
      },
      {
        title: "Filter objects by a field",
        code: `const users = [{ name: "Ana", active: true }, { name: "Bo", active: false }];
users.filter(u => u.active);`,
        output: `[{ name: "Ana", active: true }]`,
        note: "Returns just the matching objects (still references to the originals).",
      },
      {
        title: "Remove falsy values",
        code: `[0, "hi", "", 5, null].filter(Boolean)`,
        output: `["hi", 5]`,
        note: "Passing Boolean as the test is a handy way to strip out 0, '', null, undefined, NaN.",
      },
    ],
    practiceTask:
      "A teacher needs the students who passed. Write passingScores(scores) that returns a NEW array containing only the scores that are 60 or higher.",
    practiceStarter: `function passingScores(scores) {
  // keep only scores >= 60 in a new array
}`,
    practiceTests: [
      { name: "keeps only 60+", kind: "normal", call: "passingScores([55, 60, 72, 40])", expected: [60, 72] },
      { name: "everyone passed", kind: "normal", call: "passingScores([90, 100])", expected: [90, 100] },
      { name: "nobody passed", kind: "normal", call: "passingScores([10, 20, 59])", expected: [] },
      { name: "no scores yet", kind: "empty", call: "passingScores([])", expected: [] },
    ],
    builtInPractice: {
      starter: `function passingScores(scores) {
  // return scores.filter(...) keeping scores >= 60
}`,
      mustUse: [".filter("],
    },
    hint: "Keep a score when it's >= 60. Built-in: scores.filter(s => s >= 60). By hand: loop and push the ones that pass into a new array.",
    solution: {
      language: "js",
      code: `function passingScores(scores) {
  const out = [];
  for (let i = 0; i < scores.length; i++) {
    if (scores[i] >= 60) out.push(scores[i]);
  }
  return out;
}`,
    },
    explanation:
      "filter is map's cousin: instead of transforming every item, it asks 'keep this?' for each and only pushes the ones that pass. The result can be shorter than the input.",
    mentalModel:
      "A bouncer at a door checking each item against one rule. Pass → you're in the new list. Fail → you're left behind.",
    eli5:
      "Pick only the red M&Ms out of the bag into a new cup. Same candy, just the ones you want.",
    methodComparison: {
      builtIn: { language: "js", code: `const evens = nums.filter(n => n % 2 === 0);` },
      manual: {
        language: "js",
        code: `const evens = [];
for (let i = 0; i < nums.length; i++) {
  if (nums[i] % 2 === 0) evens.push(nums[i]);
}`,
      },
      internal: {
        language: "js",
        code: `function myFilter(arr, pred) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    if (pred(arr[i], i, arr)) out.push(arr[i]);
  }
  return out;
}`,
      },
      whenToUse: [
        "Use filter to KEEP a subset based on a condition.",
        "Use find when you only want the FIRST match (filter(...)[0] does extra work).",
        "Chain map after filter to transform what survives: arr.filter(...).map(...).",
      ],
    },
    commonMistakes: [
      "Returning the value instead of a boolean — filter keeps anything truthy, so `filter(n => n)` drops 0 unexpectedly.",
      "Using filter when you want one item — use find for the first match.",
      "Forgetting it's a new array; the original still has all the items.",
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: "am-reduce",
    slug: "array-reduce",
    title: "Array.prototype.reduce()",
    category: "Array Methods",
    difficulty: "Intermediate",
    order: 54,
    estimatedMinutes: 10,
    relatedMethods: ["map", "filter", "forEach"],
    nextLessonSlug: "array-find",
    summary:
      "reduce() boils an array down to a SINGLE value by accumulating across items. You give it a reducer (acc, item) => newAcc and a starting value.",
    realLifeExample:
      "Adding up every item in a shopping cart to get one final total.",
    codeExample: {
      language: "js",
      code: `const nums = [1, 2, 3, 4];
const sum = nums.reduce((acc, n) => acc + n, 0);
// sum -> 10`,
    },
    examples: [
      {
        title: "Sum",
        code: `[1, 2, 3, 4].reduce((acc, n) => acc + n, 0)`,
        output: "10",
        note: "acc starts at 0; each step adds the next number.",
      },
      {
        title: "Max",
        code: `[3, 9, 2, 7].reduce((acc, n) => (n > acc ? n : acc))`,
        output: "9",
        note: "With no initial value, acc starts as the first element and the loop begins at index 1.",
      },
      {
        title: "Build an object (tally)",
        code: `["a", "b", "a"].reduce((acc, x) => {
  acc[x] = (acc[x] || 0) + 1;
  return acc;
}, {});`,
        output: `{ a: 2, b: 1 }`,
        note: "reduce isn't just for numbers — the accumulator can be an object or array.",
      },
    ],
    practiceTask:
      "A shopping cart holds items shaped like { name, price }. Write cartTotal(items) that boils the whole cart down to one number: the sum of every item's price.",
    practiceStarter: `function cartTotal(items) {
  // add up every item.price into one total
}`,
    practiceTests: [
      { name: "sums the prices", kind: "normal", call: "cartTotal([{name:'pen',price:10},{name:'pad',price:5}])", expected: 15 },
      { name: "single item", kind: "normal", call: "cartTotal([{name:'mug',price:8}])", expected: 8 },
      { name: "empty cart is 0", kind: "empty", call: "cartTotal([])", expected: 0 },
    ],
    builtInPractice: {
      starter: `function cartTotal(items) {
  // use items.reduce(...) to add each item.price, starting the total at 0
}`,
      mustUse: [".reduce("],
      intro: "Fold the cart into one total with the built-in — start the accumulator at 0.",
    },
    hint: "Accumulate prices into a running sum. Built-in: items.reduce((sum, it) => sum + it.price, 0). By hand: let sum = 0; loop adding it.price.",
    solution: {
      language: "js",
      code: `function cartTotal(items) {
  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    sum += items[i].price;
  }
  return sum;
}`,
    },
    explanation:
      "reduce carries an accumulator across the array. Each step folds one more item into the running result. map and filter can both be written with reduce — it's the most general iteration method.",
    mentalModel:
      "A snowball rolling downhill: it starts small (the initial value) and grows by absorbing each item it rolls over, until one big snowball (the result) remains.",
    eli5:
      "Stacking coins one at a time into a single pile and reading the final height. You end with one number, not a pile of separate coins.",
    methodComparison: {
      builtIn: { language: "js", code: `const sum = nums.reduce((acc, n) => acc + n, 0);` },
      manual: {
        language: "js",
        code: `let sum = 0;
for (let i = 0; i < nums.length; i++) {
  sum = sum + nums[i];
}`,
      },
      internal: {
        language: "js",
        code: `function myReduce(arr, reducer, initial) {
  let acc = initial, start = 0;
  if (arguments.length < 3) { acc = arr[0]; start = 1; }
  for (let i = start; i < arr.length; i++) acc = reducer(acc, arr[i], i, arr);
  return acc;
}`,
      },
      whenToUse: [
        "Use reduce when you're collapsing many items into ONE thing (a total, an object, a grouped map).",
        "Prefer a plain loop or map/filter when reduce would be harder to read — clarity beats cleverness.",
        "Always pass an initial value unless you specifically want the first element to seed it.",
      ],
    },
    commonMistakes: [
      "Forgetting to RETURN the accumulator from the reducer — you get undefined on the next step.",
      "Omitting the initial value on an empty array — that throws 'Reduce of empty array with no initial value'.",
      "Reaching for reduce when map/filter is clearer — reduce is powerful but easy to over-use.",
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: "am-find",
    slug: "array-find",
    title: "find() & findIndex()",
    category: "Array Methods",
    difficulty: "Beginner",
    order: 55,
    estimatedMinutes: 6,
    relatedMethods: ["filter", "includes", "indexOf", "findLast"],
    nextLessonSlug: "array-some-every",
    summary:
      "find() returns the FIRST item that passes a test (or undefined). findIndex() returns its index (or -1). Both stop as soon as they hit a match.",
    realLifeExample:
      "Scanning a shelf left to right for the first book by a given author and grabbing it — you stop the moment you find one.",
    codeExample: {
      language: "js",
      code: `const users = [{ id: 1 }, { id: 2 }, { id: 3 }];
const u = users.find(x => x.id === 2);   // { id: 2 }
const i = users.findIndex(x => x.id === 2); // 1`,
    },
    examples: [
      {
        title: "First match",
        code: `[5, 12, 8, 130].find(n => n > 10)`,
        output: "12",
        note: "Returns the value of the first item that passes — not all of them.",
      },
      {
        title: "Its index",
        code: `[5, 12, 8, 130].findIndex(n => n > 10)`,
        output: "1",
        note: "Same scan, returns the position. -1 when nothing matches.",
      },
      {
        title: "No match → undefined",
        code: `[1, 2, 3].find(n => n > 100)`,
        output: "undefined",
        note: "find returns undefined (findIndex returns -1) when nothing passes.",
      },
    ],
    practiceTask:
      "A guest list holds people shaped like { name, age }. Write firstAdult(people) that returns the first person aged 18 or older — or undefined if there isn't one.",
    practiceStarter: `function firstAdult(people) {
  // return the first person with age >= 18, or undefined
}`,
    practiceTests: [
      { name: "returns first adult", kind: "normal", call: "firstAdult([{name:'A',age:15},{name:'B',age:20},{name:'C',age:30}])", expected: { name: "B", age: 20 } },
      { name: "no adults", kind: "normal", call: "firstAdult([{name:'A',age:10},{name:'B',age:12}])", expected: undefined },
      { name: "empty list", kind: "empty", call: "firstAdult([])", expected: undefined },
    ],
    builtInPractice: {
      starter: `function firstAdult(people) {
  // return people.find(...) for the first person with age >= 18
}`,
      mustUse: [".find("],
    },
    hint: "Return the first person whose age >= 18. Built-in: people.find(p => p.age >= 18). By hand: loop and return on the first match; return undefined after the loop.",
    solution: {
      language: "js",
      code: `function firstAdult(people) {
  for (let i = 0; i < people.length; i++) {
    if (people[i].age >= 18) return people[i];
  }
  return undefined;
}`,
    },
    explanation:
      "find is filter that gives up after the first hit. Because it returns early, it's cheaper than filter(...)[0] when you only need one item.",
    mentalModel:
      "Searching a row of lockers for the first unlocked one — you open the door and walk away the instant you find it, ignoring the rest.",
    eli5:
      "Looking for the first kid wearing a red shirt and stopping as soon as you spot them.",
    methodComparison: {
      builtIn: { language: "js", code: `const u = users.find(x => x.id === 2);` },
      manual: {
        language: "js",
        code: `let u;
for (let i = 0; i < users.length; i++) {
  if (users[i].id === 2) { u = users[i]; break; }
}`,
      },
      internal: {
        language: "js",
        code: `function myFind(arr, pred) {
  for (let i = 0; i < arr.length; i++)
    if (pred(arr[i], i, arr)) return arr[i];
  return undefined;
}`,
      },
      whenToUse: [
        "Use find for the FIRST item matching a condition.",
        "Use filter when you want ALL matches.",
        "Use includes/indexOf when you're checking for a known VALUE rather than a condition.",
      ],
    },
    commonMistakes: [
      "Confusing find (returns the value) with findIndex (returns the position).",
      "Treating a returned undefined as 'falsy item found' — undefined means NO match.",
      "Using filter(...)[0] when find is clearer and stops early.",
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: "am-some-every",
    slug: "array-some-every",
    title: "some() & every()",
    category: "Array Methods",
    difficulty: "Beginner",
    order: 56,
    estimatedMinutes: 7,
    relatedMethods: ["find", "filter", "includes"],
    nextLessonSlug: "array-includes",
    summary:
      "some() returns true if AT LEAST ONE item passes the test. every() returns true only if ALL items pass. Both short-circuit as soon as the answer is known.",
    realLifeExample:
      "some = 'is anyone in the room awake?' every = 'is everyone in the room awake?'",
    codeExample: {
      language: "js",
      code: `const nums = [2, 4, 6];
nums.some(n => n > 5);   // true (6 passes)
nums.every(n => n % 2 === 0); // true (all even)`,
    },
    examples: [
      {
        title: "some — at least one",
        code: `[1, 2, 3].some(n => n > 2)`,
        output: "true",
        note: "Stops and returns true the moment one item passes.",
      },
      {
        title: "every — all of them",
        code: `[2, 4, 5].every(n => n % 2 === 0)`,
        output: "false",
        note: "Stops and returns false the moment one item fails (5 here).",
      },
      {
        title: "Empty array quirks",
        code: `[].some(n => true) + " / " + [].every(n => false)`,
        output: `"false / true"`,
        note: "some on [] is always false; every on [] is always true (vacuously).",
      },
    ],
    practiceTask:
      "Temperature sensors report a list of numbers. Write hasNegative(readings) — true if ANY reading is below 0 — and allPositive(readings) — true only if EVERY reading is above 0.",
    practiceStarter: `function hasNegative(readings) {
  // true if at least one reading is < 0
}

function allPositive(readings) {
  // true only if all readings are > 0
}`,
    practiceTests: [
      { name: "hasNegative: one is below 0", kind: "normal", call: "hasNegative([4, 2, -1])", expected: true },
      { name: "hasNegative: none below 0", kind: "normal", call: "hasNegative([4, 2, 0])", expected: false },
      { name: "hasNegative: empty is false", kind: "empty", call: "hasNegative([])", expected: false },
      { name: "allPositive: all above 0", kind: "normal", call: "allPositive([1, 2, 3])", expected: true },
      { name: "allPositive: a zero fails it", kind: "normal", call: "allPositive([1, 0, 3])", expected: false },
      { name: "allPositive: empty is true", kind: "empty", call: "allPositive([])", expected: true },
    ],
    builtInPractice: {
      starter: `function hasNegative(readings) {
  // return readings.some(...) — any reading < 0
}

function allPositive(readings) {
  // return readings.every(...) — every reading > 0
}`,
      mustUse: [".some(", ".every("],
    },
    hint: "some = any match, every = all match. Built-in: readings.some(n => n < 0) and readings.every(n => n > 0). By hand: loop, return true on the first n < 0 (some); return false on the first n <= 0 (every).",
    solution: {
      language: "js",
      code: `function hasNegative(readings) {
  for (let i = 0; i < readings.length; i++) {
    if (readings[i] < 0) return true;
  }
  return false;
}

function allPositive(readings) {
  for (let i = 0; i < readings.length; i++) {
    if (readings[i] <= 0) return false;
  }
  return true;
}`,
    },
    explanation:
      "some and every are mirror images. some looks for one success and bails out early; every looks for one failure and bails out early. They're the readable way to ask yes/no questions about a whole array.",
    mentalModel:
      "some is an OR across all items; every is an AND across all items. Both stop the instant the result can't change.",
    eli5:
      "some: 'Did ANY of you finish your homework?' every: 'Did ALL of you finish your homework?'",
    methodComparison: {
      builtIn: { language: "js", code: `const anyBig = nums.some(n => n > 5);
const allEven = nums.every(n => n % 2 === 0);` },
      manual: {
        language: "js",
        code: `let anyBig = false;
for (let i = 0; i < nums.length; i++) {
  if (nums[i] > 5) { anyBig = true; break; }
}

let allEven = true;
for (let i = 0; i < nums.length; i++) {
  if (nums[i] % 2 !== 0) { allEven = false; break; }
}`,
      },
      internal: {
        language: "js",
        code: `function mySome(arr, pred) {
  for (let i = 0; i < arr.length; i++) if (pred(arr[i], i, arr)) return true;
  return false;
}
function myEvery(arr, pred) {
  for (let i = 0; i < arr.length; i++) if (!pred(arr[i], i, arr)) return false;
  return true;
}`,
      },
      whenToUse: [
        "Use some for 'does at least one match?' (e.g. is any field invalid?).",
        "Use every for 'do all match?' (e.g. are all required fields filled?).",
        "Use includes instead when you're testing for a specific known value, not a condition.",
      ],
    },
    commonMistakes: [
      "Mixing them up: some = OR (any), every = AND (all).",
      "Forgetting the empty-array rule: [].some → false, [].every → true.",
      "Using filter(...).length > 0 when some() is clearer and stops early.",
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: "am-includes",
    slug: "array-includes",
    title: "Array.prototype.includes()",
    category: "Array Methods",
    difficulty: "Beginner",
    order: 57,
    estimatedMinutes: 5,
    relatedMethods: ["indexOf", "some", "find"],
    nextLessonSlug: "array-indexof",
    summary:
      "includes() returns true/false for 'is this value in the array?'. It uses SameValueZero equality, so unlike indexOf it can find NaN.",
    realLifeExample:
      "Checking a guest list for a specific name — yes they're on it, or no they aren't.",
    codeExample: {
      language: "js",
      code: `const tags = ["new", "sale", "hot"];
tags.includes("sale"); // true
tags.includes("old");  // false`,
    },
    examples: [
      {
        title: "Membership check",
        code: `[1, 2, 3].includes(2)`,
        output: "true",
        note: "A clean boolean — no need to compare an index to -1.",
      },
      {
        title: "It can find NaN",
        code: `[NaN].includes(NaN)`,
        output: "true",
        note: "indexOf(NaN) returns -1; includes uses SameValueZero, so it works.",
      },
      {
        title: "Search from an index",
        code: `[1, 2, 1].includes(1, 1)`,
        output: "true",
        note: "The optional second arg is the start index (finds the 1 at index 2).",
      },
    ],
    practiceTask:
      "A door checks names against a guest list. Write isInvited(guests, name) that returns true if name is on the guests list, and false otherwise.",
    practiceStarter: `function isInvited(guests, name) {
  // true if name is somewhere in guests
}`,
    practiceTests: [
      { name: "on the list", kind: "normal", call: "isInvited(['Ana','Bo','Cy'], 'Bo')", expected: true },
      { name: "not on the list", kind: "normal", call: "isInvited(['Ana','Bo'], 'Zoe')", expected: false },
      { name: "empty list", kind: "empty", call: "isInvited([], 'Ana')", expected: false },
    ],
    builtInPractice: {
      starter: `function isInvited(guests, name) {
  // return the result of the built-in: guests.includes(name)
}`,
      mustUse: [".includes("],
    },
    hint: "Built-in: guests.includes(name). By hand: loop and return true the moment guests[i] === name; return false after the loop.",
    solution: {
      language: "js",
      code: `function isInvited(guests, name) {
  for (let i = 0; i < guests.length; i++) {
    if (guests[i] === name) return true;
  }
  return false;
}`,
    },
    explanation:
      "includes is a yes/no membership test. Its one subtlety is NaN: === says NaN !== NaN, so we special-case it. That's exactly why includes was added alongside the older indexOf.",
    mentalModel:
      "Asking 'is this exact item in the box?' and getting a plain yes or no — no index math required.",
    eli5:
      "Checking if your name is on the party list. Just yes or no.",
    methodComparison: {
      builtIn: { language: "js", code: `tags.includes("sale");` },
      manual: {
        language: "js",
        code: `let found = false;
for (let i = 0; i < tags.length; i++) {
  if (tags[i] === "sale") { found = true; break; }
}`,
      },
      internal: {
        language: "js",
        code: `function myIncludes(arr, value) {
  for (let i = 0; i < arr.length; i++) {
    const x = arr[i];
    if (x === value || (Number.isNaN(x) && Number.isNaN(value))) return true;
  }
  return false;
}`,
      },
      whenToUse: [
        "Use includes for a simple 'is this value present?' boolean.",
        "Use indexOf when you also need WHERE it is (the position).",
        "Use some when membership depends on a CONDITION, not an exact value.",
      ],
    },
    commonMistakes: [
      "Expecting includes to find objects by shape — it compares by reference, so {a:1} !== {a:1}.",
      "Using indexOf(x) !== -1 to look for NaN — that always fails; includes handles NaN.",
      "Forgetting it's case-sensitive for strings: includes('Sale') !== includes('sale').",
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: "am-indexof",
    slug: "array-indexof",
    title: "indexOf() & lastIndexOf()",
    category: "Array Methods",
    difficulty: "Beginner",
    order: 58,
    estimatedMinutes: 6,
    relatedMethods: ["includes", "findIndex"],
    nextLessonSlug: "array-sort",
    summary:
      "indexOf() returns the FIRST position of a value (or -1). lastIndexOf() returns the LAST. Both use strict === equality.",
    realLifeExample:
      "Finding the page number where a word first appears in a book's index.",
    codeExample: {
      language: "js",
      code: `const letters = ["a", "b", "a", "c"];
letters.indexOf("a");     // 0
letters.lastIndexOf("a"); // 2
letters.indexOf("z");     // -1`,
    },
    examples: [
      {
        title: "First position",
        code: `["a", "b", "a"].indexOf("a")`,
        output: "0",
        note: "Returns the index of the first match; -1 if absent.",
      },
      {
        title: "Last position",
        code: `["a", "b", "a"].lastIndexOf("a")`,
        output: "2",
        note: "Scans from the end; useful for 'most recent occurrence'.",
      },
      {
        title: "The classic presence check",
        code: `["x", "y"].indexOf("z") !== -1`,
        output: "false",
        note: "The pre-includes idiom: compare the index against -1.",
      },
    ],
    practiceTask:
      "People wait in line (an array of names). Write positionInQueue(queue, name) that returns the spot (index) of name in the line, or -1 if they aren't in it.",
    practiceStarter: `function positionInQueue(queue, name) {
  // return the index of name, or -1 if absent
}`,
    practiceTests: [
      { name: "first in line", kind: "normal", call: "positionInQueue(['Ana','Bo','Cy'], 'Ana')", expected: 0 },
      { name: "further back", kind: "normal", call: "positionInQueue(['Ana','Bo','Cy'], 'Cy')", expected: 2 },
      { name: "not in line", kind: "normal", call: "positionInQueue(['Ana','Bo'], 'Zoe')", expected: -1 },
    ],
    builtInPractice: {
      starter: `function positionInQueue(queue, name) {
  // return the result of the built-in: queue.indexOf(name)
}`,
      mustUse: [".indexOf("],
    },
    hint: "Built-in: queue.indexOf(name). By hand: loop and return i the first time queue[i] === name; return -1 after the loop.",
    solution: {
      language: "js",
      code: `function positionInQueue(queue, name) {
  for (let i = 0; i < queue.length; i++) {
    if (queue[i] === name) return i;
  }
  return -1;
}`,
    },
    explanation:
      "indexOf walks the array comparing with ===, returning the first match's position. Because === says NaN !== NaN, indexOf can never find NaN — that limitation is the whole reason includes() exists.",
    mentalModel:
      "A ruler laid along the array: indexOf tells you the first tick mark where your value sits, or -1 for 'not on the ruler'.",
    eli5:
      "Counting 'which spot in line is the first red hat?' — and saying -1 if there's no red hat at all.",
    methodComparison: {
      builtIn: { language: "js", code: `const i = letters.indexOf("a"); // 0` },
      manual: {
        language: "js",
        code: `let idx = -1;
for (let i = 0; i < letters.length; i++) {
  if (letters[i] === "a") { idx = i; break; }
}`,
      },
      internal: {
        language: "js",
        code: `function myIndexOf(arr, value) {
  for (let i = 0; i < arr.length; i++) if (arr[i] === value) return i;
  return -1;
}`,
      },
      whenToUse: [
        "Use indexOf/lastIndexOf when you need the POSITION of a known value.",
        "Use includes when you only need yes/no (and want NaN support).",
        "Use findIndex when the match is based on a CONDITION, not an exact value.",
      ],
    },
    commonMistakes: [
      "Using indexOf to look for NaN — it always returns -1; use includes or findIndex.",
      "Forgetting -1 is truthy: `if (arr.indexOf(x))` is a bug. Compare against -1 explicitly.",
      "Expecting it to find objects by value — === compares references, not shape.",
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: "am-sort",
    slug: "array-sort",
    title: "Array.prototype.sort()",
    category: "Array Methods",
    difficulty: "Intermediate",
    order: 59,
    estimatedMinutes: 10,
    relatedMethods: ["toSorted", "reverse"],
    nextLessonSlug: "array-reverse",
    summary:
      "sort() reorders an array IN PLACE. By default it sorts as strings — for numbers you MUST pass a comparator (a, b) => a - b.",
    realLifeExample:
      "Alphabetising a shelf of books, or arranging products by price low-to-high.",
    codeExample: {
      language: "js",
      code: `const nums = [10, 1, 9, 2];
nums.sort((a, b) => a - b);
// nums -> [1, 2, 9, 10] (and the original is mutated)`,
    },
    examples: [
      {
        title: "Numbers need a comparator",
        code: `[10, 1, 9, 2].sort((a, b) => a - b)`,
        output: "[1, 2, 9, 10]",
        note: "a - b < 0 means a comes first. Without it you'd get [1,10,2,9] (string order!).",
      },
      {
        title: "Descending",
        code: `[1, 2, 3].sort((a, b) => b - a)`,
        output: "[3, 2, 1]",
        note: "Flip to b - a for largest-first.",
      },
      {
        title: "Objects by a field",
        code: `const items = [{ price: 9 }, { price: 2 }];
items.sort((a, b) => a.price - b.price);`,
        output: `[{ price: 2 }, { price: 9 }]`,
        note: "Compare the field you care about. Note this mutates `items`.",
      },
    ],
    practiceTask:
      "A tag cloud looks best with short words first. Write sortByLength(words) that returns a NEW array of the words ordered from shortest to longest, leaving the original array untouched.",
    practiceStarter: `function sortByLength(words) {
  // sort a COPY by word length (shortest first); don't mutate the input
}`,
    practiceTests: [
      { name: "shortest first", kind: "normal", call: "sortByLength(['ccc','a','bb'])", expected: ["a", "bb", "ccc"] },
      { name: "already ordered", kind: "normal", call: "sortByLength(['a','bb','ccc'])", expected: ["a", "bb", "ccc"] },
      { name: "does not mutate input", kind: "mutation", call: "(()=>{const w=['bb','a'];sortByLength(w);return w;})()", expected: ["bb", "a"] },
      { name: "empty", kind: "empty", call: "sortByLength([])", expected: [] },
    ],
    builtInPractice: {
      starter: `function sortByLength(words) {
  // sort a COPY by length with the built-in:
  // return words.slice().sort((a, b) => a.length - b.length);
}`,
      mustUse: [".sort("],
    },
    hint: "Compare by a.length - b.length. Built-in: words.slice().sort((a, b) => a.length - b.length). By hand: copy, then insertion-sort comparing word lengths.",
    solution: {
      language: "js",
      code: `function sortByLength(words) {
  const a = words.slice(); // sort a copy
  for (let i = 1; i < a.length; i++) {
    const current = a[i];
    let j = i - 1;
    while (j >= 0 && a[j].length > current.length) {
      a[j + 1] = a[j]; // shift longer word right
      j--;
    }
    a[j + 1] = current;
  }
  return a;
}`,
    },
    explanation:
      "The built-in sort hides a comparison-sort algorithm. Writing insertion sort by hand shows what the comparator actually drives: every swap decision is just 'is cmp(a, b) > 0?'. The native sort is the same idea, far more optimized (and stable in modern engines).",
    mentalModel:
      "Sorting a hand of playing cards: pick up each new card and slide it left until the card on its left is no longer bigger. That's insertion sort — and it's exactly what your comparator is deciding.",
    eli5:
      "Line kids up by height: take each kid and walk them left past everyone taller until they fit. Do that for everyone and the line is sorted.",
    methodComparison: {
      builtIn: { language: "js", code: `nums.sort((a, b) => a - b); // in place` },
      manual: {
        language: "js",
        code: `// insertion sort, no built-in .sort
const a = nums.slice();
for (let i = 1; i < a.length; i++) {
  const cur = a[i];
  let j = i - 1;
  while (j >= 0 && a[j] > cur) { a[j + 1] = a[j]; j--; }
  a[j + 1] = cur;
}`,
      },
      internal: {
        language: "js",
        code: `function mySort(arr, cmp) {
  const a = arr.slice();
  for (let i = 1; i < a.length; i++) {
    const cur = a[i];
    let j = i - 1;
    while (j >= 0 && cmp(a[j], cur) > 0) { a[j + 1] = a[j]; j--; }
    a[j + 1] = cur;
  }
  return a;
}`,
      },
      whenToUse: [
        "Use the built-in sort(cmp) for real work — it's optimized and stable in modern engines.",
        "Always pass a numeric comparator for numbers; the default is string order.",
        "Use toSorted (or [...arr].sort) when you must NOT mutate the original (e.g. React state).",
      ],
    },
    commonMistakes: [
      "Sorting numbers without a comparator — [1,10,2,9].sort() gives [1,10,2,9] (string order).",
      "Forgetting sort() MUTATES the original array — copy first if you need the original.",
      "Returning true/false from the comparator — it must return a NUMBER (negative/zero/positive).",
    ],
    deepDive: {
      problemSolved:
        "Default sort() compares items as strings, which silently misorders numbers — the single most common array bug.",
      realWorldUseCase: "Sorting a data table by a numeric or date column.",
      builtInSolution: { language: "js", code: "rows.sort((a, b) => a.price - b.price)" },
      manualSolution: { language: "js", code: "[...rows].sort((a, b) => a.price - b.price) // sort a copy" },
      internalImplementation: {
        language: "js",
        code: `// insertion sort — O(n^2) but stable and clear
function mySort(arr, cmp) {
  const a = arr.slice();
  for (let i = 1; i < a.length; i++) {
    const cur = a[i]; let j = i - 1;
    while (j >= 0 && cmp(a[j], cur) > 0) { a[j+1] = a[j]; j--; }
    a[j+1] = cur;
  }
  return a;
}`,
      },
      edgeCases: [
        "No comparator → lexicographic ('10' < '9')",
        "NaN in a numeric comparator → unpredictable order (keep it out)",
        "Mixed types → coerced to strings by default",
      ],
      timeComplexity: "Native: O(n log n). Insertion sort above: O(n^2).",
      spaceComplexity: "Native: typically O(log n)–O(n). Copy + insertion: O(n).",
      browserSupport: "sort() is universal. Stable sort guaranteed since ES2019 (all modern engines).",
      whenNotToUse: "When you must preserve the original — use toSorted / [...arr].sort.",
      industrialNotes: [
        "V8's sort is stable since 2019 — equal items keep their input order.",
        "For large datasets prefer the native sort; hand-rolled O(n^2) sorts are for learning only.",
      ],
      commonMistakes: ["Missing numeric comparator.", "Mutating shared/state arrays in place."],
    },
  },

  // -------------------------------------------------------------------------
  {
    id: "am-reverse",
    slug: "array-reverse",
    title: "Array.prototype.reverse()",
    category: "Array Methods",
    difficulty: "Beginner",
    order: 60,
    estimatedMinutes: 6,
    relatedMethods: ["toReversed", "sort"],
    nextLessonSlug: "array-slice",
    summary:
      "reverse() flips an array end-to-end IN PLACE — the first item becomes last. It mutates the original and returns it.",
    realLifeExample:
      "Flipping a stack of pancakes so the bottom one ends up on top.",
    codeExample: {
      language: "js",
      code: `const a = [1, 2, 3];
a.reverse();
// a -> [3, 2, 1] (the original is mutated)`,
    },
    examples: [
      {
        title: "Flip the order",
        code: `[1, 2, 3].reverse()`,
        output: "[3, 2, 1]",
        note: "Returns the same (now reversed) array — and mutates it.",
      },
      {
        title: "Reverse a string",
        code: `[..."abc"].reverse().join("")`,
        output: `"cba"`,
        note: "Split into chars, reverse, join back — the classic string-reverse trick.",
      },
      {
        title: "Avoid mutating: copy first",
        code: `const a = [1, 2, 3];
const r = [...a].reverse();
// a stays [1,2,3], r is [3,2,1]`,
        note: "Spread into a fresh array first when you need to keep the original.",
      },
    ],
    practiceTask:
      "An undo history is stored oldest-first, but the UI shows the most recent action at the top. Write newestFirst(history) that returns a NEW array in reverse order, leaving the original unchanged.",
    practiceStarter: `function newestFirst(history) {
  // build a new array from the last item to the first
}`,
    practiceTests: [
      { name: "reverses the order", kind: "normal", call: "newestFirst(['open','edit','save'])", expected: ["save", "edit", "open"] },
      { name: "does not mutate input", kind: "mutation", call: "(()=>{const h=['a','b','c'];newestFirst(h);return h;})()", expected: ["a", "b", "c"] },
      { name: "single action", kind: "normal", call: "newestFirst(['open'])", expected: ["open"] },
      { name: "empty history", kind: "empty", call: "newestFirst([])", expected: [] },
    ],
    builtInPractice: {
      starter: `function newestFirst(history) {
  // return a reversed COPY using the built-in:
  // history.slice().reverse()
}`,
      mustUse: [".reverse("],
    },
    hint: "Built-in: history.slice().reverse() (copy first so the original isn't reversed). By hand: loop from the last index down to 0, pushing each item into a new array.",
    solution: {
      language: "js",
      code: `function newestFirst(history) {
  const out = [];
  for (let i = history.length - 1; i >= 0; i--) {
    out.push(history[i]);
  }
  return out;
}`,
    },
    explanation:
      "Reversing is just reading the array back-to-front. The native reverse() does it in place by swapping ends inward; building a new array (as above) keeps the original safe — the spirit of the modern toReversed().",
    mentalModel:
      "Walking a line of people and re-seating them in the opposite order: the last becomes first, the first becomes last.",
    eli5:
      "Turn a line of toys around so the last toy is now at the front.",
    methodComparison: {
      builtIn: { language: "js", code: `a.reverse(); // mutates a` },
      manual: {
        language: "js",
        code: `const out = [];
for (let i = a.length - 1; i >= 0; i--) {
  out.push(a[i]);
}`,
      },
      internal: {
        language: "js",
        code: `// in-place version: swap ends toward the middle
function myReverseInPlace(arr) {
  let i = 0, j = arr.length - 1;
  while (i < j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
    i++; j--;
  }
  return arr;
}`,
      },
      whenToUse: [
        "Use reverse() when mutating in place is fine and you own the array.",
        "Use [...arr].reverse() or toReversed() to keep the original (React state, shared data).",
        "Combine with sort for 'sort then flip', but prefer a descending comparator when you can.",
      ],
    },
    commonMistakes: [
      "Forgetting reverse() MUTATES — `const r = a.reverse()` also reverses `a`.",
      "Reversing React state directly, causing stale or wrong renders — copy first.",
      "Reversing to get descending order when a `(a,b) => b - a` comparator is cleaner.",
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: "am-slice",
    slug: "array-slice",
    title: "slice() vs splice()",
    category: "Array Methods",
    difficulty: "Intermediate",
    order: 61,
    estimatedMinutes: 9,
    relatedMethods: ["toSpliced", "concat"],
    nextLessonSlug: "array-concat",
    summary:
      "slice(start, end) COPIES a section into a new array (no mutation). splice(start, count, ...items) REMOVES/INSERTS in place (mutates). Two letters apart, opposite behaviour.",
    realLifeExample:
      "slice = photocopying pages 2–4 of a book. splice = tearing pages out of the actual book (and maybe taping new ones in).",
    codeExample: {
      language: "js",
      code: `const a = [1, 2, 3, 4, 5];
a.slice(1, 3);   // [2, 3]  — a is unchanged
a.splice(1, 2);  // removes [2, 3] — a is now [1, 4, 5]`,
    },
    examples: [
      {
        title: "slice — copy a range",
        code: `[1, 2, 3, 4].slice(1, 3)`,
        output: "[2, 3]",
        note: "end is EXCLUSIVE. Original untouched.",
      },
      {
        title: "slice — negative indices & copy-all",
        code: `[1, 2, 3].slice(-2)`,
        output: "[2, 3]",
        note: "Negative counts from the end. slice() with no args clones the array.",
      },
      {
        title: "splice — remove in place",
        code: `const a = [1, 2, 3, 4];
a.splice(1, 2);
a;`,
        output: "[1, 4]",
        note: "Mutates a; returns the removed items ([2, 3]).",
      },
    ],
    practiceTask:
      "A leaderboard is already sorted best-first. Write topN(scores, n) that returns a NEW array of just the first n scores (without touching the original). If n is bigger than the list, return all of them.",
    practiceStarter: `function topN(scores, n) {
  // copy the first n scores into a new array (no mutation)
}`,
    practiceTests: [
      { name: "top 2", kind: "normal", call: "topN([100,90,80,70], 2)", expected: [100, 90] },
      { name: "n bigger than list", kind: "normal", call: "topN([5], 3)", expected: [5] },
      { name: "top 0", kind: "normal", call: "topN([1,2,3], 0)", expected: [] },
      { name: "does not mutate input", kind: "mutation", call: "(()=>{const s=[3,2,1];topN(s,2);return s;})()", expected: [3, 2, 1] },
    ],
    builtInPractice: {
      starter: `function topN(scores, n) {
  // return the result of the built-in: scores.slice(0, n)
}`,
      mustUse: [".slice("],
    },
    hint: "Built-in: scores.slice(0, n). By hand: loop while i < n AND i < scores.length, pushing each score into a new array.",
    solution: {
      language: "js",
      code: `function topN(scores, n) {
  const out = [];
  for (let i = 0; i < n && i < scores.length; i++) {
    out.push(scores[i]);
  }
  return out;
}`,
    },
    explanation:
      "slice copies a window of the array and leaves the source alone — perfect for immutable updates. splice is its mutating opposite: it edits the array in place. Remembering 'slice = safe copy, splice = surgery' saves you from a lot of bugs.",
    mentalModel:
      "slice is a screenshot of part of the array. splice is editing the array itself with scissors and tape.",
    eli5:
      "slice: copy a few cards from the deck onto the table. splice: actually pull cards out of the deck.",
    methodComparison: {
      builtIn: { language: "js", code: `const part = a.slice(1, 3); // copy, no mutation` },
      manual: {
        language: "js",
        code: `const part = [];
for (let i = 1; i < 3; i++) {
  part.push(a[i]);
}`,
      },
      internal: {
        language: "js",
        code: `function mySlice(arr, start = 0, end = arr.length) {
  const out = [];
  for (let i = start; i < end; i++) out.push(arr[i]);
  return out;
}`,
      },
      whenToUse: [
        "Use slice to COPY part of an array (or clone it with slice()) without mutating.",
        "Use splice when you intentionally want to remove/insert in place.",
        "For immutable insert/remove, prefer toSpliced or slice + spread over splice.",
      ],
    },
    commonMistakes: [
      "Mixing up slice (copy, safe) and splice (mutate, in place).",
      "Forgetting slice's end index is EXCLUSIVE — slice(1, 3) gives indices 1 and 2.",
      "Expecting splice to return the new array — it returns the REMOVED items, and mutates in place.",
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: "am-concat",
    slug: "array-concat",
    title: "concat() & spread",
    category: "Array Methods",
    difficulty: "Beginner",
    order: 62,
    estimatedMinutes: 6,
    relatedMethods: ["slice", "flat", "push"],
    nextLessonSlug: "array-join",
    summary:
      "concat() joins arrays into a NEW array without mutating either. The modern spread form [...a, ...b] does the same thing more flexibly.",
    realLifeExample:
      "Combining two guest lists into one master list, leaving both original lists intact.",
    codeExample: {
      language: "js",
      code: `const a = [1, 2];
const b = [3, 4];
const both = a.concat(b);   // [1, 2, 3, 4]
const same = [...a, ...b];  // [1, 2, 3, 4]`,
    },
    examples: [
      {
        title: "Join two arrays",
        code: `[1, 2].concat([3, 4])`,
        output: "[1, 2, 3, 4]",
        note: "Returns a new array; both inputs are untouched.",
      },
      {
        title: "Add single values too",
        code: `[1].concat(2, [3, 4])`,
        output: "[1, 2, 3, 4]",
        note: "concat flattens ONE level of array arguments and appends loose values.",
      },
      {
        title: "Spread is more flexible",
        code: `const a = [1, 2];
[0, ...a, 3]`,
        output: "[0, 1, 2, 3]",
        note: "Spread lets you insert in the middle, mix with other items, etc.",
      },
    ],
    practiceTask:
      "Two friends each have a playlist. Write mergePlaylists(mine, theirs) that returns a NEW array with all of mine's songs followed by all of theirs — leaving both originals unchanged.",
    practiceStarter: `function mergePlaylists(mine, theirs) {
  // new array: all of mine, then all of theirs
}`,
    practiceTests: [
      { name: "combines both", kind: "normal", call: "mergePlaylists(['a','b'],['c','d'])", expected: ["a", "b", "c", "d"] },
      { name: "one is empty", kind: "normal", call: "mergePlaylists([],['c'])", expected: ["c"] },
      { name: "does not mutate inputs", kind: "mutation", call: "(()=>{const a=['a'];const b=['b'];mergePlaylists(a,b);return [...a,...b];})()", expected: ["a", "b"] },
      { name: "both empty", kind: "empty", call: "mergePlaylists([],[])", expected: [] },
    ],
    builtInPractice: {
      starter: `function mergePlaylists(mine, theirs) {
  // return the result of the built-in: mine.concat(theirs)
}`,
      mustUse: [".concat("],
    },
    hint: "Built-in: mine.concat(theirs). By hand: push every song of mine, then every song of theirs, into a new array.",
    solution: {
      language: "js",
      code: `function mergePlaylists(mine, theirs) {
  const out = [];
  for (let i = 0; i < mine.length; i++) out.push(mine[i]);
  for (let i = 0; i < theirs.length; i++) out.push(theirs[i]);
  return out;
}`,
    },
    explanation:
      "concat builds a fresh array containing both inputs in order — neither original changes. That immutability is why it (and spread) are favourites for updating arrays in state.",
    mentalModel:
      "Pouring two jars of marbles into a brand-new third jar. The first two jars are still full and unchanged.",
    eli5:
      "Sticking two LEGO trains together into one longer train — on a new track, without breaking the originals.",
    methodComparison: {
      builtIn: { language: "js", code: `const both = a.concat(b);` },
      manual: {
        language: "js",
        code: `const both = [];
for (const x of a) both.push(x);
for (const x of b) both.push(x);`,
      },
      internal: {
        language: "js",
        code: `// modern idiom — same result, more flexible
const both = [...a, ...b];`,
      },
      whenToUse: [
        "Use spread [...a, ...b] in modern code — it reads well and inserts anywhere.",
        "Use concat when chaining (arr.concat(x).concat(y)) or for clarity joining arrays.",
        "Avoid push in a loop to merge when you need to keep the originals — that mutates.",
      ],
    },
    commonMistakes: [
      "Using push to merge and accidentally mutating the first array.",
      "Expecting concat to deep-flatten — it only flattens ONE level of array arguments.",
      "Forgetting concat returns a NEW array; the result must be captured.",
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: "am-join",
    slug: "array-join",
    title: "join() & split()",
    category: "Array Methods",
    difficulty: "Beginner",
    order: 63,
    estimatedMinutes: 6,
    relatedMethods: ["map", "reduce", "concat"],
    nextLessonSlug: "array-flat",
    summary:
      "join(sep) turns an array into a STRING, gluing items with a separator. split(sep) is the string method that goes the other way: string → array.",
    realLifeExample:
      "Turning a list of names into one comma-separated line for an email's 'To' field.",
    codeExample: {
      language: "js",
      code: `["a", "b", "c"].join("-");  // "a-b-c"
"a-b-c".split("-");          // ["a", "b", "c"]`,
    },
    examples: [
      {
        title: "Default separator is a comma",
        code: `[1, 2, 3].join()`,
        output: `"1,2,3"`,
        note: "With no argument, join uses ','.",
      },
      {
        title: "Custom separator",
        code: `["Mon", "Tue", "Wed"].join(" / ")`,
        output: `"Mon / Tue / Wed"`,
        note: "Any string works as the glue — including ' / ' or ''.",
      },
      {
        title: "null and undefined become empty",
        code: `[1, null, 3, undefined].join("-")`,
        output: `"1--3-"`,
        note: "join renders null/undefined as empty strings (other values are stringified).",
      },
    ],
    practiceTask:
      "A breadcrumb trail is an array of segments like ['users', '42', 'posts']. Write makePath(segments) that joins them into a URL path with a '/' between each part — e.g. 'users/42/posts' (no slash at the start or end).",
    practiceStarter: `function makePath(segments) {
  // build a string with '/' BETWEEN segments (no trailing slash)
}`,
    practiceTests: [
      { name: "joins with slashes", kind: "normal", call: "makePath(['users','42','posts'])", expected: "users/42/posts" },
      { name: "single segment", kind: "normal", call: "makePath(['home'])", expected: "home" },
      { name: "empty is empty string", kind: "empty", call: "makePath([])", expected: "" },
    ],
    builtInPractice: {
      starter: `function makePath(segments) {
  // return the result of the built-in: segments.join('/')
}`,
      mustUse: [".join("],
    },
    hint: "Put '/' BETWEEN segments, not after each. Built-in: segments.join('/'). By hand: add '/' before every segment except the first.",
    solution: {
      language: "js",
      code: `function makePath(segments) {
  let out = "";
  for (let i = 0; i < segments.length; i++) {
    if (i > 0) out += "/";
    out += segments[i];
  }
  return out;
}`,
    },
    explanation:
      "join converts each item to a string and stitches them together with the separator between (not after) items. The 'only add the separator before items past the first' trick is what keeps it from leaving a dangling separator at the end.",
    mentalModel:
      "Threading beads onto a string: a knot (the separator) goes BETWEEN each pair of beads, never before the first or after the last.",
    eli5:
      "Writing a list of friends on one line with commas between their names.",
    methodComparison: {
      builtIn: { language: "js", code: `const csv = ["a", "b", "c"].join(",");` },
      manual: {
        language: "js",
        code: `let csv = "";
for (let i = 0; i < arr.length; i++) {
  if (i > 0) csv += ",";
  csv += arr[i];
}`,
      },
      internal: {
        language: "js",
        code: `function myJoin(arr, sep = ",") {
  let out = "";
  for (let i = 0; i < arr.length; i++) {
    if (i > 0) out += sep;
    out += arr[i] == null ? "" : String(arr[i]);
  }
  return out;
}`,
      },
      whenToUse: [
        "Use join to render an array as text (CSV lines, class names, breadcrumbs).",
        "Use split to parse a string back into an array.",
        "For building strings from objects, map to strings first, then join.",
      ],
    },
    commonMistakes: [
      "Adding the separator AFTER each item, leaving a trailing separator.",
      "Forgetting null/undefined render as empty strings (not the text 'null').",
      "Using join on nested arrays and being surprised they get comma-flattened.",
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: "am-flat",
    slug: "array-flat",
    title: "flat() & flatMap()",
    category: "Array Methods",
    difficulty: "Intermediate",
    order: 64,
    estimatedMinutes: 8,
    relatedMethods: ["map", "reduce", "concat"],
    summary:
      "flat(depth) flattens nested arrays into a shallower one. flatMap(fn) is map() followed by one level of flat — handy when each item expands into zero or more items.",
    realLifeExample:
      "Emptying several small boxes of books into one big box (flat), or splitting each sentence into words and pooling all words together (flatMap).",
    codeExample: {
      language: "js",
      code: `[1, [2, 3], [4, [5]]].flat();    // [1, 2, 3, 4, [5]]
[1, [2, 3], [4, [5]]].flat(2);   // [1, 2, 3, 4, 5]
[1, 2].flatMap(n => [n, n * 10]); // [1, 10, 2, 20]`,
    },
    examples: [
      {
        title: "Flatten one level",
        code: `[1, [2, 3], [4]].flat()`,
        output: "[1, 2, 3, 4]",
        note: "Default depth is 1.",
      },
      {
        title: "Flatten deeper",
        code: `[1, [2, [3, [4]]]].flat(Infinity)`,
        output: "[1, 2, 3, 4]",
        note: "Use Infinity to fully flatten any depth.",
      },
      {
        title: "flatMap to expand items",
        code: `["a b", "c"].flatMap(s => s.split(" "))`,
        output: `["a", "b", "c"]`,
        note: "map would give [['a','b'], ['c']]; flatMap flattens one level for you.",
      },
    ],
    practiceTask:
      "Students are split into groups, so you have an array of arrays of names like [['Ana','Bo'],['Cy']]. Write mergeGroups(groups) that returns ONE flat array with every name.",
    practiceStarter: `function mergeGroups(groups) {
  // push every name from every group into one array
}`,
    practiceTests: [
      { name: "flattens the groups", kind: "normal", call: "mergeGroups([['Ana','Bo'],['Cy'],['Di','Ed']])", expected: ["Ana", "Bo", "Cy", "Di", "Ed"] },
      { name: "handles an empty group", kind: "normal", call: "mergeGroups([[],['x']])", expected: ["x"] },
      { name: "no groups", kind: "empty", call: "mergeGroups([])", expected: [] },
    ],
    builtInPractice: {
      starter: `function mergeGroups(groups) {
  // return the result of the built-in: groups.flat()
}`,
      mustUse: [".flat("],
    },
    hint: "Built-in: groups.flat() collapses one level. By hand: loop the groups, and for each group loop its names, pushing each into one result array.",
    solution: {
      language: "js",
      code: `function mergeGroups(groups) {
  const out = [];
  for (let i = 0; i < groups.length; i++) {
    for (let j = 0; j < groups[i].length; j++) {
      out.push(groups[i][j]);
    }
  }
  return out;
}`,
    },
    explanation:
      "flat unwraps one layer of nesting by spreading any array element into the result. flatMap is the common map-then-flatten combo in a single pass — ideal when a callback returns an array per item (including [] to drop items).",
    mentalModel:
      "flat is tipping a tray of smaller trays out onto one flat surface — one layer at a time.",
    eli5:
      "You have bags inside a big bag. flat() dumps everything from the inner bags into the big bag, one layer.",
    methodComparison: {
      builtIn: { language: "js", code: `const flatArr = nested.flat();
const words = lines.flatMap(s => s.split(" "));` },
      manual: {
        language: "js",
        code: `const flatArr = [];
for (const item of nested) {
  if (Array.isArray(item)) flatArr.push(...item);
  else flatArr.push(item);
}`,
      },
      internal: {
        language: "js",
        code: `// flatMap = map then flat(1)
function myFlatMap(arr, fn) {
  return myFlat(arr.map(fn));
}`,
      },
      whenToUse: [
        "Use flat to collapse known nesting; flat(Infinity) for arbitrary depth.",
        "Use flatMap when each item yields an array (split, expand, or [] to drop).",
        "For deep/irregular nesting, recursion or flat(Infinity) beats manual loops.",
      ],
    },
    commonMistakes: [
      "Expecting flat() to fully flatten — default depth is 1; pass a depth or Infinity.",
      "Using map then forgetting to flatten when the callback returns arrays — use flatMap.",
      "flatMap only flattens ONE level; deeper results stay nested.",
    ],
  },
];
