import { Challenge } from "@/lib/types";

// "Write the tests" challenges. The learner writes test cases (not code); we run
// them against a correct implementation and several buggy ones. A strong suite
// accepts the correct code and catches every bug — the verification skill that
// matters most when AI writes the first draft.
export const testWritingChallenges: Challenge[] = [
  {
    id: "tw-average",
    slug: "write-tests-average",
    title: "Write Tests: average()",
    difficulty: "Beginner",
    category: "Write the Tests",
    tags: ["testing", "edge-cases", "verification"],
    isTestWriting: true,
    flags: { testWriting: true },
    reviewTags: ["testing", "edge-cases"],
    problem:
      "Don't write average() — write the TESTS for it. Your suite should accept a correct average and catch every buggy version below. The bugs are the classic ones AI ships: empty input, missing initial value, integer assumptions.",
    realWorldScenario:
      "When AI hands you a function, your tests are the safety net. The bug it missed is usually an edge case — so your tests have to think of the edges it didn't.",
    inputOutputThinking: {
      input: "average(nums): an array of numbers (maybe empty).",
      output: "Their average; 0 for an empty array.",
      transformation: "Sum ÷ count, with the empty case handled.",
      rules: ["Test the happy path AND the edges", "Empty array should return 0"],
      edgeCases: ["[] → 0", "single element", "negatives / decimals"],
    },
    example: { input: "average([2, 4, 6])", output: "4" },
    testWriting: {
      functionName: "average",
      starterTests: `// Write tests with test(name, condition). Catch every bug!
test("basic average", average([2, 4, 6]) === 4);
// Add more — what about an empty array? one element? negatives?`,
      correctImpl: `function average(nums) {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}`,
      buggyImpls: [
        { label: "Crashes / NaN on an empty array", code: `function average(nums){ return nums.reduce((a,b)=>a+b,0)/nums.length; }` },
        { label: "Off by one: divides by length + 1", code: `function average(nums){ if(!nums.length) return 0; return nums.reduce((a,b)=>a+b,0)/(nums.length+1); }` },
        { label: "Ignores the first element", code: `function average(nums){ if(!nums.length) return 0; let s=0; for(let i=1;i<nums.length;i++) s+=nums[i]; return s/nums.length; }` },
      ],
    },
    // The canonical solution shown if they reveal it (it's the function, for reference).
    starterCode: `function average(nums) {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}`,
    solution: `// A test suite that catches all three bugs:
test("basic average", average([2,4,6]) === 4);
test("empty array is 0", average([]) === 0);          // catches the crash
test("single element", average([5]) === 5);            // catches divide-by-(n+1)
test("uses every element", average([10, 0]) === 5);    // catches 'skips first'`,
    explanation:
      "The happy-path test alone catches nothing. average([]) === 0 catches the crash; average([5]) === 5 catches dividing by length+1; average([10,0]) === 5 catches skipping the first element. Edge cases are where bugs hide.",
    hints: [
      "One test (the happy path) won't catch much — what edges exist?",
      "Add average([]) === 0 to catch the crash.",
      "Add a single-element and a two-element test to pin down the math.",
    ],
    commonMistakes: [
      "Testing only the happy path.",
      "Forgetting the empty-input case.",
      "Not testing that every element is actually used.",
    ],
  },
  {
    id: "tw-sortnums",
    slug: "write-tests-sort-numbers",
    title: "Write Tests: sortNums()",
    difficulty: "Intermediate",
    category: "Write the Tests",
    tags: ["testing", "sort", "mutation", "verification"],
    isTestWriting: true,
    flags: { testWriting: true },
    reviewTags: ["testing", "sort", "mutation"],
    problem:
      "Write tests for sortNums(arr) (ascending). Your suite must catch the two classic sort bugs: string-order sorting, and mutating the caller's array. Use eq(a, b) to compare arrays.",
    realWorldScenario:
      "AI loves a bare arr.sort(). Your tests are what reveal that it sorts as strings and quietly mutates the input.",
    inputOutputThinking: {
      input: "sortNums(arr): an array of numbers.",
      output: "A NEW array sorted ascending; the input unchanged.",
      transformation: "Copy, then numeric sort.",
      rules: ["Numeric order, not string order", "Must not mutate the input"],
      edgeCases: ["[1,10,2] → [1,2,10]", "original array unchanged after the call"],
    },
    example: { input: "sortNums([10, 2, 1])", output: "[1, 2, 10]" },
    testWriting: {
      functionName: "sortNums",
      starterTests: `// Use eq(a, b) for arrays. Catch BOTH the ordering bug and the mutation bug.
test("sorts ascending", eq(sortNums([10, 2, 1]), [1, 2, 10]));
// What else? Think about multi-digit numbers and the original array…`,
      correctImpl: `function sortNums(arr) {
  return [...arr].sort((a, b) => a - b);
}`,
      buggyImpls: [
        { label: "Sorts as strings (no comparator)", code: `function sortNums(arr){ return [...arr].sort(); }` },
        { label: "Mutates the caller's array", code: `function sortNums(arr){ return arr.sort((a,b)=>a-b); }` },
      ],
    },
    starterCode: `function sortNums(arr) {
  return [...arr].sort((a, b) => a - b);
}`,
    solution: `// A suite that catches both bugs:
test("multi-digit numeric order", eq(sortNums([1, 10, 2]), [1, 2, 10])); // catches string sort
test("does not mutate input", (() => {
  const a = [3, 1, 2];
  sortNums(a);
  return eq(a, [3, 1, 2]);
})()); // catches mutation`,
    explanation:
      "eq(sortNums([1,10,2]), [1,2,10]) fails on a string sort (which gives [1,10,2]). The mutation test snapshots the input, calls sortNums, and checks the original is untouched — failing the version that sorts in place. Two targeted tests, two bugs caught.",
    hints: [
      "A string sort puts '10' before '2' — pick inputs that expose it.",
      "To catch mutation: make an array, call sortNums on it, then check the array is unchanged.",
      "eq(a, b) compares arrays by value.",
    ],
    commonMistakes: [
      "Only using single-digit inputs (hides the string-sort bug).",
      "Never checking the input array for mutation.",
    ],
  },
];
