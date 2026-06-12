import { Challenge } from "@/lib/types";

// "Debug this code" challenges. The starterCode IS the broken code — the
// learner fixes it until the tests pass. The `debugChallenge` block reveals the
// bug, the fix, and the lesson learned. These build the most underrated skill:
// reading code that already (almost) works and finding why it doesn't.
export const debugChallenges: Challenge[] = [
  {
    id: "dbg-even-filter",
    slug: "debug-even-number-filter",
    title: "Debug: Even Number Filter",
    difficulty: "Beginner",
    category: "Debugging",
    tags: ["debug", "filter", "condition"],
    isDebugChallenge: true,
    flags: { interview: true },
    reviewTags: ["wrong-condition", "filter", "truthiness"],
    relatedMethods: ["filter"],
    problem:
      "getEvens(nums) should return only the even numbers. It currently returns the ODD ones. Find and fix the bug.",
    frontendScenario:
      "You're filtering a list to show only items that pass a check (in-stock products, active users). A wrong condition silently shows the exact opposite set — a bug QA often misses.",
    example: { input: "getEvens([1,2,3,4])", output: "[2,4]" },
    inputOutputThinking: {
      input: "An array of numbers, e.g. [1,2,3,4].",
      output: "A new array with only the even numbers, e.g. [2,4].",
      transformation: "Keep an item only when it divides evenly by 2.",
      rules: ["Even means n % 2 === 0", "n % 2 is 0 (falsy) for evens, 1 (truthy) for odds"],
      edgeCases: ["Empty array → []", "All odd → []", "Negative evens like -2 are still even"],
    },
    mentalModel:
      "n % 2 is the remainder after dividing by 2. For evens it's 0 — which is FALSY. So `if (n % 2)` keeps the wrong half.",
    starterCode: `function getEvens(nums) {
  return nums.filter((n) => n % 2);
}`,
    solution: `function getEvens(nums) {
  return nums.filter((n) => n % 2 === 0);
}`,
    explanation:
      "filter keeps items where the callback is TRUTHY. `n % 2` is 1 (truthy) for odds and 0 (falsy) for evens, so the original kept odds. Comparing `=== 0` makes the test explicitly 'remainder is zero' → evens.",
    debugChallenge: {
      brokenCode: `function getEvens(nums) {
  return nums.filter((n) => n % 2);
}
getEvens([1, 2, 3, 4]); // ?`,
      expectedOutput: "[2, 4]",
      actualOutput: "[1, 3]",
      bugExplanation:
        "`n % 2` returns 0 for even numbers (falsy) and 1 for odd numbers (truthy). filter keeps truthy results, so it kept the odds — the exact opposite of what we wanted.",
      fixedCode: `function getEvens(nums) {
  return nums.filter((n) => n % 2 === 0);
}`,
      lessonLearned:
        "Don't rely on a number being 'truthy' as a boolean test. Compare explicitly (=== 0). 0 is falsy, which flips list filters.",
    },
    tests: [
      { name: "keeps evens", kind: "normal", call: "getEvens([1,2,3,4])", expected: [2, 4] },
      { name: "all odd → empty", kind: "normal", call: "getEvens([1,3,5])", expected: [] },
      { name: "empty input", kind: "empty", call: "getEvens([])", expected: [] },
      { name: "handles negatives", kind: "normal", call: "getEvens([-2,-1,0])", expected: [-2, 0] },
    ],
    hints: [
      "What does n % 2 equal for an even number?",
      "0 is falsy — filter drops it.",
      "Compare the remainder to 0 explicitly.",
    ],
    progressiveHints: [
      { level: 1, label: "Understand the goal", text: "Return only even numbers, in a new array." },
      { level: 2, label: "Think input/output", text: "[1,2,3,4] → [2,4]. The odds must be dropped." },
      { level: 3, label: "Inspect the condition", text: "Print n % 2 for each n. What is it for evens?" },
      { level: 4, label: "Edge case", text: "0 % 2 is 0, which is falsy — filter treats it as 'reject'." },
      { level: 5, label: "Almost there", text: "Change the test to n % 2 === 0." },
    ],
    commonMistakes: [
      "Using a number as a boolean (`if (n % 2)`) instead of comparing to 0.",
      "Forgetting 0 is falsy, so even results get dropped.",
      "Mutating nums instead of returning filter's new array.",
    ],
  },
  {
    id: "dbg-cart-total",
    slug: "debug-cart-total",
    title: "Debug: Cart Total",
    difficulty: "Beginner",
    category: "Debugging",
    tags: ["debug", "reduce", "accumulator"],
    isDebugChallenge: true,
    reviewTags: ["missing-initial-value", "reduce", "accumulator"],
    relatedMethods: ["reduce"],
    problem:
      "cartTotal(items) should sum each item's price. It crashes (or returns an object) on some inputs. Fix it so it always returns a number.",
    frontendScenario:
      "Summing a shopping cart total. Without an initial value, reduce uses the first ITEM (an object) as the starting accumulator — so you add a number to an object and get NaN or '[object Object]'.",
    example: { input: "cartTotal([{price:10},{price:5}])", output: "15" },
    inputOutputThinking: {
      input: "An array of items, each with a numeric `price`.",
      output: "A single number: the sum of all prices.",
      transformation: "Add up every item.price, starting from 0.",
      rules: ["Start the accumulator at 0", "Empty cart total is 0"],
      edgeCases: ["Empty array must return 0, not throw", "Single item returns that item's price"],
    },
    mentalModel:
      "reduce carries a running total. If you don't hand it a starting value (0), it grabs the first element as the start — and the first element here is an object, not a number.",
    starterCode: `function cartTotal(items) {
  return items.reduce((sum, item) => sum + item.price);
}`,
    solution: `function cartTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}`,
    explanation:
      "Without the initial value, reduce starts with items[0] (an object) as `sum`, then does object + number → NaN, and throws on an empty array. Passing 0 as the seed makes `sum` a number from the start and makes the empty case return 0.",
    debugChallenge: {
      brokenCode: `function cartTotal(items) {
  return items.reduce((sum, item) => sum + item.price);
}
cartTotal([{ price: 10 }, { price: 5 }]); // ?`,
      expectedOutput: "15",
      actualOutput: "NaN  (and throws on an empty array)",
      bugExplanation:
        "reduce was called without an initial value. So `sum` started as the first item ({price:10}), and `{price:10} + 5` is NaN. On an empty array, reduce with no seed throws 'Reduce of empty array with no initial value'.",
      fixedCode: `function cartTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}`,
      lessonLearned:
        "Always pass an initial value to reduce when building a number/string/array. It sets the accumulator type and makes the empty-input case safe.",
    },
    tests: [
      { name: "sums prices", kind: "normal", call: "cartTotal([{price:10},{price:5}])", expected: 15 },
      { name: "single item", kind: "normal", call: "cartTotal([{price:42}])", expected: 42 },
      { name: "empty cart → 0", kind: "empty", call: "cartTotal([])", expected: 0 },
    ],
    hints: [
      "What is `sum` on the very first call?",
      "reduce's second argument is the starting value.",
      "Seed it with 0.",
    ],
    progressiveHints: [
      { level: 1, label: "Understand the goal", text: "Add up every item's price into one number." },
      { level: 2, label: "Think input/output", text: "[{price:10},{price:5}] → 15; [] → 0." },
      { level: 3, label: "Inspect reduce", text: "What type is `sum` on the first iteration here?" },
      { level: 4, label: "Edge case", text: "Try the empty array — it throws. Why?" },
      { level: 5, label: "Almost there", text: "Pass 0 as reduce's second argument." },
    ],
    commonMistakes: [
      "Calling reduce without an initial value when summing.",
      "Not handling the empty-array case (throws with no seed).",
      "Assuming the accumulator is a number when it actually starts as the first element.",
    ],
  },
  {
    id: "dbg-search-case",
    slug: "debug-case-insensitive-search",
    title: "Debug: Case-Insensitive Search",
    difficulty: "Beginner",
    category: "Debugging",
    tags: ["debug", "string", "filter"],
    isDebugChallenge: true,
    reviewTags: ["case-sensitivity", "string", "search"],
    relatedMethods: ["filter", "includes"],
    problem:
      "search(users, query) should match names regardless of case. Typing 'AN' returns nothing for a user named 'Ana'. Fix it.",
    frontendScenario:
      "A live search box. Users type lowercase, your data is mixed-case — exact matching makes the box feel broken even though the data is right there.",
    example: { input: `search([{name:"Ana"}], "an")`, output: `[{name:"Ana"}]` },
    inputOutputThinking: {
      input: "An array of users with a `name`, and a query string.",
      output: "Users whose name contains the query, ignoring case.",
      transformation: "Lowercase both sides, then check `includes`.",
      rules: ["Compare in the same case", "Match anywhere in the name, not just the start"],
      edgeCases: ["Empty query matches everyone", "No match → []"],
    },
    mentalModel:
      "'A' and 'a' are different characters to the computer. To compare by meaning, flatten both to the same case first.",
    starterCode: `function search(users, query) {
  return users.filter((u) => u.name.includes(query));
}`,
    solution: `function search(users, query) {
  const q = query.toLowerCase();
  return users.filter((u) => u.name.toLowerCase().includes(q));
}`,
    explanation:
      "includes is case-sensitive: 'Ana'.includes('AN') is false. Lowercasing both the name and the query before comparing makes 'AN', 'an' and 'aN' all match.",
    debugChallenge: {
      brokenCode: `function search(users, query) {
  return users.filter((u) => u.name.includes(query));
}
search([{ name: "Ana" }], "AN"); // ?`,
      expectedOutput: `[{ name: "Ana" }]`,
      actualOutput: "[]",
      bugExplanation:
        "String.includes is case-sensitive. 'Ana'.includes('AN') is false because 'A','N' (uppercase) don't appear in 'Ana' in that case.",
      fixedCode: `function search(users, query) {
  const q = query.toLowerCase();
  return users.filter((u) => u.name.toLowerCase().includes(q));
}`,
      lessonLearned:
        "String comparisons are case-sensitive. Normalize case (and often whitespace) on BOTH sides before comparing user input to data.",
    },
    tests: [
      { name: "matches case-insensitively", kind: "normal", call: `search([{name:"Ana"},{name:"Bob"}], "AN")`, expected: [{ name: "Ana" }] },
      { name: "matches anywhere", kind: "normal", call: `search([{name:"Johnathan"}], "than")`, expected: [{ name: "Johnathan" }] },
      { name: "no match → empty", kind: "normal", call: `search([{name:"Ana"}], "zzz")`, expected: [] },
    ],
    hints: [
      "Is includes case-sensitive?",
      "Make both strings the same case first.",
      "Lowercase the name AND the query.",
    ],
    progressiveHints: [
      { level: 1, label: "Understand the goal", text: "Find users whose name contains the query, ignoring case." },
      { level: 2, label: "Think input/output", text: `[{name:"Ana"}], "AN" → [{name:"Ana"}].` },
      { level: 3, label: "Inspect the compare", text: "Log 'Ana'.includes('AN') — is it true?" },
      { level: 4, label: "Why", text: "includes compares exact characters, including case." },
      { level: 5, label: "Almost there", text: "Lowercase both u.name and query before includes." },
    ],
    commonMistakes: [
      "Comparing user input to data without normalizing case.",
      "Lowercasing only one side of the comparison.",
      "Using === for a 'contains' check instead of includes.",
    ],
  },
];
