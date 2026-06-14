import { Challenge } from "@/lib/types";

// "Review the AI's code" challenges. Each shows plausible AI-generated code with
// a real (but easy-to-miss) flaw. The learner judges it FIRST, then runs the
// tests — which include the exact edge case the AI happy-pathed — and fixes it.
// This trains the #1 AI-era skill: verifying code you didn't write.
export const aiReviewChallenges: Challenge[] = [
  {
    id: "ai-average",
    slug: "ai-review-average",
    title: "AI Review: Average of an Array",
    difficulty: "Beginner",
    category: "AI Code Review",
    tags: ["ai-review", "reduce", "edge-cases"],
    isAiReview: true,
    flags: { aiReview: true },
    relatedMethods: ["reduce"],
    reviewTags: ["empty-input", "reduce", "ai-review"],
    problem:
      "The AI was asked for an `average(nums)` function. Review its code: would you ship it? Then run the tests and fix what's wrong.",
    aiReview: {
      prompt: "Write a function average(nums) that returns the average of an array of numbers.",
      verdict: "buggy",
      issue:
        "It works for non-empty arrays, but average([]) crashes: reduce with no initial value throws on an empty array, and dividing by length 0 would give NaN anyway. The AI didn't consider the empty case.",
      reviewLesson:
        "AI almost always writes the happy path. The first thing to check on any AI output: what happens with empty input, zero, null, or one element?",
    },
    example: { input: "average([2, 4, 6])", output: "4" },
    predictOutput: [
      {
        prompt: "Before fixing it — what does the AI's code do on an empty array?",
        code: `// AI's code:
function average(nums){ return nums.reduce((a,b)=>a+b)/nums.length; }
average([]);`,
        kind: "multiple-choice",
        choices: ["0", "NaN", "undefined", "throws an error"],
        answer: "throws an error",
        explanation:
          "reduce with no initial value throws on an empty array ('Reduce of empty array with no initial value') — it never even gets to the division.",
        distractorExplanations: {
          "0": "0 is what the CORRECT version should return — but the AI's version doesn't handle empty input at all.",
          NaN: "You'd get NaN from 0/0 if reduce were seeded; but without a seed, reduce throws first.",
        },
      },
    ],
    inputOutputThinking: {
      input: "An array of numbers (possibly empty).",
      output: "Their average as a number; 0 for an empty array.",
      transformation: "Sum the numbers, divide by how many there are.",
      rules: ["Empty array → 0, not a crash", "reduce needs an initial value when summing"],
      edgeCases: ["[] → 0", "single element → that element"],
    },
    starterCode: `function average(nums) {
  return nums.reduce((a, b) => a + b) / nums.length;
}`,
    solution: `function average(nums) {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}`,
    explanation:
      "Two fixes: seed reduce with 0 (so it never throws and the accumulator is a number), and guard the empty array to return 0 instead of NaN.",
    tests: [
      { name: "averages a list", kind: "normal", call: "average([2,4,6])", expected: 4 },
      { name: "single element", kind: "normal", call: "average([10])", expected: 10 },
      { name: "empty array → 0 (the AI's miss)", kind: "empty", call: "average([])", expected: 0 },
    ],
    hints: [
      "Run average([]) — what happens?",
      "reduce with no second argument throws on an empty array.",
      "Guard length 0, and seed reduce with 0.",
    ],
    edgeCases: ["[] must return 0", "reduce needs an initial value", "one element returns itself"],
    commonMistakes: [
      "Trusting code because the happy-path example works.",
      "Calling reduce without an initial value.",
      "Not handling empty input.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "ai-titlecase",
    slug: "ai-review-title-case",
    title: "AI Review: Title-Case a String",
    difficulty: "Beginner",
    category: "AI Code Review",
    tags: ["ai-review", "string", "edge-cases"],
    isAiReview: true,
    flags: { aiReview: true },
    relatedMethods: ["map", "split"],
    reviewTags: ["edge-cases", "string", "ai-review"],
    problem:
      "The AI wrote titleCase(str) to capitalize each word. It looks fine — but does it survive an empty string or a double space? Judge it, then run the tests.",
    aiReview: {
      prompt: "Write titleCase(str) that uppercases the first letter of each word.",
      verdict: "buggy",
      issue:
        "On 'hello world' it works. But an empty string or a double space produces an empty 'word', and then word[0] is undefined — calling .toUpperCase() on undefined throws. The AI never tested messy input.",
      reviewLesson:
        "Indexing the first character (word[0]) silently assumes the string is non-empty. AI rarely guards against empty pieces produced by split.",
    },
    example: { input: `titleCase("hello world")`, output: `"Hello World"` },
    predictOutput: [
      {
        prompt: "What happens when the AI's titleCase runs on an empty string?",
        code: `// AI's code:
function titleCase(str){ return str.split(' ').map(w=>w[0].toUpperCase()+w.slice(1)).join(' '); }
titleCase("");`,
        kind: "multiple-choice",
        choices: [`""`, `"Undefined"`, "throws an error", `" "`],
        answer: "throws an error",
        explanation:
          `"".split(' ') is [""], so w is "" and w[0] is undefined — calling .toUpperCase() on undefined throws a TypeError.`,
        distractorExplanations: {
          '""': `That's what it SHOULD return — but the AI's version crashes on the empty word instead.`,
        },
      },
    ],
    starterCode: `function titleCase(str) {
  return str
    .split(' ')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}`,
    solution: `function titleCase(str) {
  return str
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}`,
    explanation:
      "Guard each word: if it's an empty string (from a leading/double space), leave it as-is instead of reading w[0] on an empty string. That stops the crash and preserves spacing.",
    tests: [
      { name: "basic two words", kind: "normal", call: `titleCase("hello world")`, expected: "Hello World" },
      { name: "empty string (the AI's miss)", kind: "empty", call: `titleCase("")`, expected: "" },
      { name: "double space doesn't crash", kind: "invalid", call: `titleCase("a  b")`, expected: "A  B" },
    ],
    hints: [
      "Try titleCase('') and titleCase('a  b').",
      "split can produce empty strings; what is ''[0]?",
      "Skip empty words before uppercasing.",
    ],
    edgeCases: ["Empty string", "Leading/trailing/double spaces produce empty words"],
    commonMistakes: [
      "Assuming split always yields non-empty pieces.",
      "Reading word[0] without checking the word exists.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  {
    id: "ai-last",
    slug: "ai-review-last-element",
    title: "AI Review: Get the Last Element",
    difficulty: "Beginner",
    category: "AI Code Review",
    tags: ["ai-review", "hallucination", "array"],
    isAiReview: true,
    flags: { aiReview: true },
    relatedMethods: [],
    reviewTags: ["hallucination", "ai-review"],
    problem:
      "The AI confidently used a method to get the last item. The code reads perfectly. Would you ship it? Run it and find out.",
    aiReview: {
      prompt: "Write last(arr) that returns the last element of an array.",
      verdict: "buggy",
      issue:
        "Array.prototype.last() does not exist. The AI hallucinated a plausible-sounding method, so this throws 'arr.last is not a function' at runtime. (Real options: arr[arr.length - 1] or arr.at(-1).)",
      reviewLesson:
        "AI invents APIs that sound real — arr.last(), arr.removeDuplicates(), str.format(). If a method looks convenient but you've never used it, verify it exists before trusting it.",
    },
    example: { input: "last([1, 2, 3])", output: "3" },
    predictOutput: [
      {
        prompt: "The AI used arr.last(). What actually happens when you run it?",
        code: `// AI's code:
function last(arr){ return arr.last(); }
last([1, 2, 3]);`,
        kind: "multiple-choice",
        choices: ["3", "1", "undefined", "throws: arr.last is not a function"],
        answer: "throws: arr.last is not a function",
        explanation:
          "Array.prototype.last doesn't exist, so arr.last is undefined and calling it throws a TypeError. The method only sounded real.",
        distractorExplanations: {
          "3": "That's the intended result — but there's no .last() method, so it never returns anything; it throws.",
          undefined: "If .last were a property it might be undefined — but calling undefined as a function throws instead.",
        },
      },
    ],
    starterCode: `function last(arr) {
  return arr.last();
}`,
    solution: `function last(arr) {
  return arr[arr.length - 1]; // or arr.at(-1)
}`,
    explanation:
      "There is no Array.prototype.last. Use index access arr[arr.length - 1], or the modern arr.at(-1) which also supports negative indices.",
    tests: [
      { name: "last of three", kind: "normal", call: "last([1,2,3])", expected: 3 },
      { name: "single element", kind: "normal", call: "last([42])", expected: 42 },
      { name: "works with strings", kind: "normal", call: `last(["a","b"])`, expected: "b" },
    ],
    hints: [
      "Run it — what does the error say?",
      "Is arr.last() a real method? (It isn't.)",
      "Use arr[arr.length - 1] or arr.at(-1).",
    ],
    edgeCases: ["No native .last() method exists", "arr.at(-1) is the modern equivalent"],
    commonMistakes: [
      "Trusting a method name because it sounds plausible.",
      "Not running AI code before relying on it.",
    ],
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
  },
  {
    id: "ai-sort",
    slug: "ai-review-sort-numbers",
    title: "AI Review: Sort Numbers",
    difficulty: "Intermediate",
    category: "AI Code Review",
    tags: ["ai-review", "sort", "mutation"],
    isAiReview: true,
    flags: { aiReview: true },
    relatedMethods: ["sort"],
    reviewTags: ["sort", "mutation", "ai-review"],
    problem:
      "The AI wrote a one-liner to sort numbers ascending. There are actually TWO bugs hiding in that single line. Find them, then fix it.",
    aiReview: {
      prompt: "Write sortNums(arr) that returns the numbers sorted ascending.",
      verdict: "buggy",
      issue:
        "Two classic bugs in one line. (1) arr.sort() with no comparator sorts as STRINGS, so [1, 10, 2] instead of [1, 2, 10]. (2) sort mutates the input array in place, so the caller's array is changed too.",
      reviewLesson:
        "Bare .sort() is a double trap: lexicographic ordering and in-place mutation. AI reaches for it constantly. Always pass (a,b)=>a-b and copy first: [...arr].sort(...).",
    },
    example: { input: "sortNums([10, 2, 1])", output: "[1, 2, 10]" },
    predictOutput: [
      {
        prompt: "What does the AI's bare arr.sort() return here?",
        code: `// AI's code:
function sortNums(arr){ return arr.sort(); }
sortNums([1, 10, 2]);`,
        kind: "multiple-choice",
        choices: ["[1, 2, 10]", "[1, 10, 2]", "[10, 2, 1]", "[2, 1, 10]"],
        answer: "[1, 10, 2]",
        explanation:
          "Default sort converts each number to a string and compares lexicographically: '1' < '10' < '2'. So you get [1, 10, 2] — wrong order, the exact bug.",
        distractorExplanations: {
          "[1, 2, 10]": "That's the CORRECT numeric order — but bare .sort() doesn't do that; it sorts as strings.",
        },
      },
    ],
    inputOutputThinking: {
      input: "An array of numbers.",
      output: "A NEW array sorted ascending; the input is untouched.",
      transformation: "Copy, then sort numerically with a comparator.",
      rules: ["Numeric order, not string order", "Don't mutate the input"],
      edgeCases: ["[1,10,2] must give [1,2,10]", "original array must be unchanged"],
    },
    starterCode: `function sortNums(arr) {
  return arr.sort();
}`,
    solution: `function sortNums(arr) {
  return [...arr].sort((a, b) => a - b);
}`,
    explanation:
      "Spread to copy (so the input isn't mutated), and pass (a,b)=>a-b so numbers compare numerically instead of as strings.",
    tests: [
      { name: "sorts numerically, not as strings", kind: "normal", call: "sortNums([1,10,2])", expected: [1, 2, 10] },
      { name: "basic ascending", kind: "normal", call: "sortNums([10,2,1])", expected: [1, 2, 10] },
      {
        name: "does not mutate the input (the AI's miss)",
        kind: "mutation",
        call: "(()=>{const a=[3,1,2];sortNums(a);return a;})()",
        expected: [3, 1, 2],
      },
    ],
    hints: [
      "Run sortNums([1,10,2]) — is 10 really less than 2?",
      "Default sort compares strings: '10' < '2'.",
      "Copy with [...arr] and pass (a,b)=>a-b.",
    ],
    edgeCases: ["Default sort is lexicographic", "sort mutates in place"],
    commonMistakes: [
      "Calling .sort() without a comparator on numbers.",
      "Forgetting sort mutates — copy first.",
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  },
];
