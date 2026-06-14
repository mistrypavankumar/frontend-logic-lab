import { DsaTopic } from "@/lib/types";

// DSA learning path: each topic teaches the PATTERN (idea, when to use, mental
// model, complexity) then links to the interview problems that drill it. The
// problems live in challenges.dsa.ts and open in the normal challenge page.
export const dsaTopics: DsaTopic[] = [
  {
    slug: "hashing",
    name: "Hashing / Hash Maps",
    icon: "🗺️",
    idea: "Trade memory for speed: a Map/Set turns 'have I seen this?' or 'where is this?' into an O(1) lookup, so you replace a nested loop with a single pass.",
    whenToUse:
      "You're about to write two nested loops to find a pair, a duplicate, or a count — or you need fast membership/lookup by value.",
    mentalModel: "Keep a notebook of what you've seen so far; check it before doing work again.",
    complexity: "Usually O(n) time, O(n) space.",
    problemSlugs: [
      "dsa-two-sum",
      "dsa-contains-duplicate",
      "dsa-valid-anagram",
      "dsa-first-unique-char",
    ],
  },
  {
    slug: "two-pointers",
    name: "Two Pointers",
    icon: "↔️",
    idea: "Use two indices that move toward each other (or together) over a sequence, so you scan it in one pass instead of comparing all pairs.",
    whenToUse:
      "A sorted array or a string where you compare ends, partition, or de-duplicate in place; 'is it symmetric / does a pair exist' questions.",
    mentalModel: "One finger at each end, walking inward — or a slow and a fast finger moving together.",
    complexity: "O(n) time, often O(1) extra space.",
    problemSlugs: [
      "dsa-valid-palindrome",
      "dsa-move-zeroes",
      "dsa-two-sum-sorted",
      "dsa-is-subsequence",
    ],
  },
  {
    slug: "sliding-window",
    name: "Sliding Window",
    icon: "🪟",
    idea: "Maintain a moving window over a sequence and update its summary (sum, count, set) incrementally as it grows and shrinks — instead of recomputing each window from scratch.",
    whenToUse:
      "'Longest/shortest/largest contiguous … that satisfies a condition' over an array or string.",
    mentalModel: "A window slides along: add what enters on the right, remove what leaves on the left.",
    complexity: "O(n) time.",
    problemSlugs: [
      "dsa-longest-substring",
      "dsa-max-sum-subarray-k",
      "dsa-min-subarray-len",
      "dsa-max-vowels",
    ],
  },
  {
    slug: "stacks",
    name: "Stacks",
    icon: "🥞",
    idea: "A last-in-first-out structure that remembers the most recent unresolved thing — perfect for matching, nesting, and 'undo'.",
    whenToUse:
      "Balanced brackets/tags, nesting/depth, evaluating expressions, or 'most recent' lookups.",
    mentalModel: "A stack of plates: you can only add to or take from the top.",
    complexity: "O(n) time, O(n) space.",
    problemSlugs: [
      "dsa-valid-parentheses",
      "dsa-evaluate-rpn",
      "dsa-daily-temperatures",
      "dsa-backspace-compare",
    ],
  },
  {
    slug: "searching",
    name: "Binary Search",
    icon: "🔍",
    idea: "On sorted data, compare the middle to your target and throw away half the search space every step.",
    whenToUse:
      "Data is sorted (or monotonic) and you need a fast lookup or the boundary where a condition flips.",
    mentalModel: "Guess the middle of a dictionary, then decide which half to keep — repeat.",
    complexity: "O(log n) time.",
    problemSlugs: [
      "dsa-binary-search",
      "dsa-search-insert",
      "dsa-integer-sqrt",
      "dsa-search-rotated",
    ],
  },
  {
    slug: "dynamic-programming",
    name: "Dynamic Programming",
    icon: "🧩",
    idea: "Break a problem into overlapping subproblems and reuse their answers instead of recomputing — by building up from small cases.",
    whenToUse:
      "'Count the ways', 'best/min/max over choices', or recursion that recomputes the same inputs again and again.",
    mentalModel: "Solve the tiny cases first and carry their answers forward; bigger answers are built from smaller ones.",
    complexity: "Often O(n) time with O(1)–O(n) space.",
    problemSlugs: [
      "dsa-climbing-stairs",
      "dsa-maximum-subarray",
      "dsa-house-robber",
      "dsa-coin-change",
    ],
  },
  {
    slug: "greedy",
    name: "Greedy",
    icon: "🪙",
    idea: "Make the locally-best choice at each step and never look back. When a problem has the 'greedy-choice property', that local optimum builds the global optimum — in a single pass.",
    whenToUse:
      "'Maximize/minimize' where an obvious best move at each step is safe — running min/max, farthest-reachable, or 'sort then pair'. (If a local choice can hurt you later, it's DP, not greedy.)",
    mentalModel: "Take the best you can see right now and keep moving — like always grabbing the nearest cheapest option.",
    complexity: "O(n) (or O(n log n) if it needs a sort).",
    problemSlugs: [
      "dsa-best-time-buy-sell",
      "dsa-jump-game",
      "dsa-gas-station",
      "dsa-assign-cookies",
    ],
  },
  {
    slug: "prefix-sum",
    name: "Prefix Sum",
    icon: "➕",
    idea: "Precompute running totals so any range/subarray sum (or count) becomes a quick lookup instead of a re-scan.",
    whenToUse:
      "Repeated 'sum/count over a range' queries, or 'subarray that totals X' problems.",
    mentalModel: "Keep a running tally as you go; the answer for a range is the difference of two tallies.",
    complexity: "O(n) time, O(n) space.",
    problemSlugs: [
      "dsa-subarray-sum-k",
      "dsa-pivot-index",
      "dsa-product-except-self",
      "dsa-running-sum",
    ],
  },
  {
    slug: "intervals",
    name: "Intervals",
    icon: "📅",
    idea: "Sort intervals by start (or end), then sweep once — overlaps become a simple comparison with the previous interval.",
    whenToUse:
      "Anything with ranges: merging, inserting, detecting clashes, or removing the fewest to de-conflict.",
    mentalModel: "Lay the ranges on a timeline in order, then walk left to right joining or skipping.",
    complexity: "O(n log n) (the sort dominates).",
    problemSlugs: [
      "dsa-merge-intervals",
      "dsa-insert-interval",
      "dsa-can-attend-meetings",
      "dsa-erase-overlap",
    ],
  },
  {
    slug: "linked-list",
    name: "Linked List",
    icon: "🔗",
    idea: "Re-point or traverse nodes with a couple of pointers — reversal, finding the middle, and merging are all pointer dances.",
    whenToUse:
      "Sequential data where you reverse, find a position from the end, or merge — often with fast/slow or gap pointers.",
    mentalModel: "Two fingers on the chain: one slow, one fast — or a 'previous' finger you flip links onto.",
    complexity: "O(n) time, O(1) extra. (Here lists are arrays so they run in the editor.)",
    problemSlugs: [
      "dsa-reverse-list",
      "dsa-middle-node",
      "dsa-merge-two-lists",
      "dsa-remove-nth",
    ],
  },
  {
    slug: "backtracking",
    name: "Recursion & Backtracking",
    icon: "🌿",
    idea: "Build a solution one choice at a time; recurse, and UNDO the choice (backtrack) to explore the next branch.",
    whenToUse:
      "'Generate all …' — subsets, permutations, combinations, valid arrangements; exploring a decision tree.",
    mentalModel: "Walk down a tree of choices; at each dead-end or leaf, step back and try the next option.",
    complexity: "Exponential by nature (2ⁿ, n!, …).",
    problemSlugs: [
      "dsa-subsets",
      "dsa-permutations",
      "dsa-combinations",
      "dsa-generate-parentheses",
    ],
  },
  {
    slug: "bit-manipulation",
    name: "Bit Manipulation",
    icon: "💡",
    idea: "Use XOR, AND, shifts, and the n & (n−1) trick to solve counting/uniqueness problems in O(1) space.",
    whenToUse:
      "'Appears once/odd times', counting set bits, powers of two, or packing flags into a number.",
    mentalModel: "Think of the number as a row of switches you flip and test directly.",
    complexity: "O(n) or O(1), O(1) space.",
    problemSlugs: [
      "dsa-single-number",
      "dsa-hamming-weight",
      "dsa-counting-bits",
      "dsa-missing-number",
    ],
  },
  {
    slug: "math",
    name: "Math & Numbers",
    icon: "🔢",
    idea: "Spot the formula or numeric property instead of brute-forcing — divisibility, digit operations, closed-form sums.",
    whenToUse:
      "Digit/number puzzles, conversions, divisibility rules, or when an arithmetic identity skips a loop.",
    mentalModel: "Ask 'is there a pattern or formula here?' before reaching for iteration.",
    complexity: "Often O(1)–O(log n).",
    problemSlugs: [
      "dsa-fizzbuzz",
      "dsa-power-of-two",
      "dsa-roman-to-int",
      "dsa-happy-number",
    ],
  },
  {
    slug: "strings",
    name: "Strings",
    icon: "✏️",
    idea: "Most string problems reduce to a clean scan, a split/normalize, or a character map — know the built-ins and the two-map trick.",
    whenToUse:
      "Parsing, normalizing, comparing patterns, prefixes, or character-mapping between two strings.",
    mentalModel: "Treat a string as an array of characters you scan once, tracking what you've seen.",
    complexity: "O(n) time.",
    problemSlugs: [
      "dsa-reverse-words",
      "dsa-longest-common-prefix",
      "dsa-is-isomorphic",
      "dsa-last-word-length",
    ],
  },
  {
    slug: "trees",
    name: "Trees",
    icon: "🌳",
    idea: "Most tree problems are 'solve the children, then combine' — a recursive function with a null base case.",
    whenToUse:
      "Nested/hierarchical data: depth, comparison, mirroring, counting, traversals.",
    mentalModel: "Trust the recursion: assume it works on the subtrees, then combine their answers for this node.",
    complexity: "O(n) time, O(h) stack (h = height).",
    problemSlugs: [
      "dsa-max-depth",
      "dsa-same-tree",
      "dsa-invert-tree",
      "dsa-count-nodes",
    ],
  },
];
