import { Challenge } from "@/lib/types";

// DSA interview classics — the problems MNCs actually ask — modeled as runnable
// challenges. Each is framed with a REAL frontend scenario so the pattern sticks
// as something you'd use, not just a puzzle. Two are fully loaded with learning
// aids (Two Sum, Valid Parentheses) as the depth template.
export const dsaChallenges: Challenge[] = [
  // ---------------- Hashing ----------------
  {
    id: "dsa-two-sum",
    slug: "dsa-two-sum",
    title: "Two Sum",
    difficulty: "Beginner",
    category: "DSA · Hashing",
    tags: ["dsa", "array", "hash-map"],
    relatedMethods: ["Map"],
    reviewTags: ["hashing", "dsa"],
    flags: { interview: true, realWorld: true },
    problem:
      "Given an array of numbers and a target, return the indices of the two numbers that add up to the target. Exactly one solution exists; don't use the same element twice.",
    frontendScenario:
      "A cart promo: 'find two items whose prices add up to exactly ₹X for the combo discount.' The naive double loop is O(n²); a hash map makes it one pass.",
    inputOutputThinking: {
      input: "nums: number[] and target: number.",
      output: "[i, j] — the indices of the two numbers that sum to target.",
      transformation: "For each number, check if its complement (target − num) was already seen.",
      rules: ["Exactly one answer", "Can't reuse the same index"],
      edgeCases: ["Negative numbers", "Duplicates that form the pair"],
    },
    mentalModel:
      "As you walk the array, keep a notebook of 'number → where I saw it'. For each new number, ask: have I already seen the piece that completes the target? If yes, you're done.",
    pseudocode: {
      understand: "Find the two positions whose values sum to target.",
      input: "nums: number[], target: number",
      output: "[i, j]",
      steps: [
        "Make an empty map of value → index.",
        "For each index i, compute need = target − nums[i].",
        "If need is already in the map, return [map[need], i].",
        "Otherwise store nums[i] → i and continue.",
      ],
      toCode: `const seen = new Map();
for (let i = 0; i < nums.length; i++) {
  const need = target - nums[i];
  if (seen.has(need)) return [seen.get(need), i];
  seen.set(nums[i], i);
}`,
    },
    example: { input: "twoSum([2, 7, 11, 15], 9)", output: "[0, 1]" },
    starterCode: `function twoSum(nums, target) {
  // return the indices of the two numbers that add up to target
}`,
    solution: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
}`,
    builtInSolution: { language: "js", code: "// No built-in — the hash-map pattern IS the idiomatic answer." },
    manualSolution: {
      language: "js",
      code: `// Brute force O(n^2): try every pair
for (let i = 0; i < nums.length; i++)
  for (let j = i + 1; j < nums.length; j++)
    if (nums[i] + nums[j] === target) return [i, j];`,
    },
    dryRun: [
      { label: "i=0", code: `need = 9 - 2 = 7; seen={}`, detail: "7 not seen → store 2→0. seen={2:0}." },
      { label: "i=1", code: `need = 9 - 7 = 2; seen={2:0}`, detail: "2 IS seen at index 0 → return [0, 1]." },
    ],
    variableTrace: {
      columns: ["i", "nums[i]", "need", "seen has need?", "action"],
      rows: [
        ["0", "2", "7", "no", "store 2→0"],
        ["1", "7", "2", "yes (idx 0)", "return [0, 1]"],
      ],
    },
    tests: [
      { name: "basic pair", kind: "normal", call: "twoSum([2,7,11,15], 9)", expected: [0, 1] },
      { name: "pair later in array", kind: "normal", call: "twoSum([3,2,4], 6)", expected: [1, 2] },
      { name: "duplicates form the pair", kind: "duplicate", call: "twoSum([3,3], 6)", expected: [0, 1] },
      { name: "negatives", kind: "normal", call: "twoSum([-3,4,3,90], 0)", expected: [0, 2] },
    ],
    hints: [
      "The brute force is two nested loops — O(n²). Can you do one pass?",
      "What if you remembered every number you've already seen, and where?",
      "For each num, look up target − num in a map.",
    ],
    explanation:
      "A hash map turns 'have I seen the complement?' into an O(1) lookup, so the whole thing is one O(n) pass instead of O(n²). Store value→index as you go and check for the complement first.",
    edgeCases: ["Duplicates can be the answer", "Negative numbers and zero targets"],
    commonMistakes: [
      "Using nested loops when a map gives O(n).",
      "Storing the number before checking — you might match an element with itself.",
      "Returning the values instead of the indices.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  {
    id: "dsa-contains-duplicate",
    slug: "dsa-contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Beginner",
    category: "DSA · Hashing",
    tags: ["dsa", "set", "hash"],
    relatedMethods: ["Set"],
    reviewTags: ["hashing", "set", "dsa"],
    flags: { interview: true },
    problem: "Return true if any value appears at least twice in the array, false if every element is distinct.",
    frontendScenario:
      "Detecting a duplicate tag, SKU, or selected option before submitting a form — a Set makes it a one-liner.",
    example: { input: "hasDuplicate([1, 2, 3, 1])", output: "true" },
    starterCode: `function hasDuplicate(nums) {
  // true if any value appears more than once
}`,
    solution: `function hasDuplicate(nums) {
  return new Set(nums).size !== nums.length;
}`,
    explanation:
      "A Set drops duplicates. If the Set is smaller than the array, something collapsed — there was a duplicate. O(n) time, O(n) space.",
    tests: [
      { name: "has a duplicate", kind: "normal", call: "hasDuplicate([1,2,3,1])", expected: true },
      { name: "all unique", kind: "normal", call: "hasDuplicate([1,2,3,4])", expected: false },
      { name: "empty", kind: "empty", call: "hasDuplicate([])", expected: false },
    ],
    hints: ["A Set keeps only unique values.", "Compare the Set's size to the array length."],
    commonMistakes: ["Sorting first (O(n log n)) when a Set is O(n).", "Forgetting the empty array is false."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  // ---------------- Two Pointers ----------------
  {
    id: "dsa-valid-palindrome",
    slug: "dsa-valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Beginner",
    category: "DSA · Two Pointers",
    tags: ["dsa", "two-pointers", "string"],
    reviewTags: ["two-pointers", "string", "dsa"],
    flags: { interview: true },
    problem:
      "Return true if the string is a palindrome, considering only letters and digits and ignoring case. Otherwise false.",
    frontendScenario:
      "Validating a symmetric input (some coupon/serial formats) — and the two-pointer scan is the same shape you'd use to compare a string from both ends.",
    example: { input: `isPalindrome("A man, a plan, a canal: Panama")`, output: "true" },
    starterCode: `function isPalindrome(s) {
  // ignore case and non-alphanumeric characters
}`,
    solution: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let i = 0, j = clean.length - 1;
  while (i < j) {
    if (clean[i] !== clean[j]) return false;
    i++; j--;
  }
  return true;
}`,
    explanation:
      "Normalize (lowercase, strip non-alphanumerics), then walk one pointer from each end toward the middle. Any mismatch → not a palindrome. O(n) time, O(1) extra beyond the cleaned string.",
    tests: [
      { name: "classic palindrome", kind: "normal", call: `isPalindrome("A man, a plan, a canal: Panama")`, expected: true },
      { name: "not a palindrome", kind: "normal", call: `isPalindrome("race a car")`, expected: false },
      { name: "empty is a palindrome", kind: "empty", call: `isPalindrome("")`, expected: true },
    ],
    hints: ["Strip out anything that isn't a letter/number and lowercase it.", "Compare characters from both ends moving inward."],
    commonMistakes: ["Forgetting to ignore case/punctuation.", "Comparing the whole reversed string (extra memory) instead of two pointers."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  {
    id: "dsa-move-zeroes",
    slug: "dsa-move-zeroes",
    title: "Move Zeroes",
    difficulty: "Beginner",
    category: "DSA · Two Pointers",
    tags: ["dsa", "two-pointers", "array"],
    reviewTags: ["two-pointers", "dsa"],
    flags: { interview: true },
    problem:
      "Return a new array with all 0s moved to the end, keeping the order of the non-zero elements. Don't mutate the input.",
    frontendScenario:
      "Pushing empty/placeholder rows to the bottom of a list while keeping the real items in order.",
    example: { input: "moveZeroes([0, 1, 0, 3, 12])", output: "[1, 3, 12, 0, 0]" },
    starterCode: `function moveZeroes(nums) {
  // non-zeros first (original order), zeros at the end; return a NEW array
}`,
    solution: `function moveZeroes(nums) {
  const nonZero = nums.filter((n) => n !== 0);
  const zeros = nums.length - nonZero.length;
  return [...nonZero, ...Array(zeros).fill(0)];
}`,
    explanation:
      "Keep the non-zeros in order, then pad with the right number of zeros. (The in-place two-pointer version swaps a write-pointer with each non-zero — same idea, O(1) space.)",
    tests: [
      { name: "moves zeroes to end", kind: "normal", call: "moveZeroes([0,1,0,3,12])", expected: [1, 3, 12, 0, 0] },
      { name: "no zeroes", kind: "normal", call: "moveZeroes([1,2,3])", expected: [1, 2, 3] },
      { name: "does not mutate input", kind: "mutation", call: "(()=>{const a=[0,1];moveZeroes(a);return a;})()", expected: [0, 1] },
    ],
    hints: ["Keep the non-zero values in order first.", "Then append as many zeros as you removed."],
    commonMistakes: ["Losing the original order of non-zeros.", "Mutating the input array."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  // ---------------- Sliding Window ----------------
  {
    id: "dsa-longest-substring",
    slug: "dsa-longest-substring",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Advanced",
    category: "DSA · Sliding Window",
    tags: ["dsa", "sliding-window", "string", "set"],
    relatedMethods: ["Set"],
    reviewTags: ["sliding-window", "dsa"],
    flags: { interview: true },
    problem:
      "Return the length of the longest substring with no repeating characters.",
    frontendScenario:
      "Longest run of unique events/keystrokes, or the longest streak with no repeat — the sliding-window pattern behind many 'longest valid run' features.",
    example: { input: `lengthOfLongestSubstring("abcabcbb")`, output: "3" },
    starterCode: `function lengthOfLongestSubstring(s) {
  // length of the longest window with all-unique characters
}`,
    solution: `function lengthOfLongestSubstring(s) {
  const seen = new Set();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    seen.add(s[right]);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
    explanation:
      "Grow a window to the right; when a repeat appears, shrink from the left until it's gone. The Set holds the current window's characters. Each character enters and leaves at most once → O(n).",
    tests: [
      { name: "abcabcbb → 3", kind: "normal", call: `lengthOfLongestSubstring("abcabcbb")`, expected: 3 },
      { name: "all same → 1", kind: "normal", call: `lengthOfLongestSubstring("bbbbb")`, expected: 1 },
      { name: "pwwkew → 3", kind: "normal", call: `lengthOfLongestSubstring("pwwkew")`, expected: 3 },
      { name: "empty → 0", kind: "empty", call: `lengthOfLongestSubstring("")`, expected: 0 },
    ],
    hints: ["Track a window [left, right] of unique chars.", "When s[right] repeats, move left forward until it's unique again.", "A Set tells you what's currently in the window."],
    commonMistakes: ["Resetting the window to empty instead of shrinking from the left.", "Recomputing uniqueness from scratch each step (O(n²))."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(n, charset))",
  },
  {
    id: "dsa-max-sum-subarray-k",
    slug: "dsa-max-sum-subarray-k",
    title: "Max Sum of a Subarray of Size K",
    difficulty: "Beginner",
    category: "DSA · Sliding Window",
    tags: ["dsa", "sliding-window", "array"],
    reviewTags: ["sliding-window", "dsa"],
    flags: { interview: true },
    problem: "Given an array and a window size k, return the maximum sum of any k consecutive elements.",
    frontendScenario:
      "Best k-day total (revenue, active users) over a rolling window — computed in one pass instead of re-summing every window.",
    example: { input: "maxSumK([2, 1, 5, 1, 3, 2], 3)", output: "9" },
    starterCode: `function maxSumK(nums, k) {
  // max sum of any k consecutive elements
}`,
    solution: `function maxSumK(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k]; // slide: add new, drop old
    best = Math.max(best, sum);
  }
  return best;
}`,
    explanation:
      "Sum the first window, then slide: each step add the entering element and subtract the leaving one — O(1) per move instead of re-summing k elements. Total O(n).",
    tests: [
      { name: "window of 3", kind: "normal", call: "maxSumK([2,1,5,1,3,2], 3)", expected: 9 },
      { name: "whole array", kind: "normal", call: "maxSumK([1,2,3], 3)", expected: 6 },
    ],
    hints: ["Don't re-add k numbers each time.", "Slide the window: + new element − element that left."],
    commonMistakes: ["Recomputing the whole window sum each step (O(n·k))."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  // ---------------- Stacks ----------------
  {
    id: "dsa-valid-parentheses",
    slug: "dsa-valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Beginner",
    category: "DSA · Stacks",
    tags: ["dsa", "stack", "string"],
    reviewTags: ["stack", "dsa"],
    flags: { interview: true, realWorld: true },
    problem:
      "Given a string of just the characters ()[]{}, return true if every bracket is closed by the matching type in the correct order.",
    frontendScenario:
      "Exactly how an editor or template engine checks that tags/brackets are balanced — the canonical use of a stack.",
    inputOutputThinking: {
      input: "A string of bracket characters.",
      output: "true if balanced and correctly nested, else false.",
      transformation: "Push openers; on a closer, the top of the stack must be its match.",
      rules: ["Right type AND right order", "Nothing left over at the end"],
      edgeCases: ["Empty string → true", "A lone closer → false", "Leftover opener → false"],
    },
    mentalModel:
      "A stack of plates: every opening bracket puts a plate on top. A closing bracket must match the plate you take off the top. Wrong plate, or no plate, means invalid.",
    pseudocode: {
      understand: "Check brackets are balanced and properly nested.",
      input: "s: string of ()[]{}",
      output: "boolean",
      steps: [
        "Keep a stack and a map of closer → opener.",
        "For each char: if it's an opener, push it.",
        "If it's a closer, the popped top must equal its matching opener; else return false.",
        "At the end, the stack must be empty.",
      ],
      toCode: `const pairs = { ")": "(", "]": "[", "}": "{" };
const stack = [];
for (const ch of s) {
  if (ch in pairs) {
    if (stack.pop() !== pairs[ch]) return false;
  } else stack.push(ch);
}
return stack.length === 0;`,
    },
    example: { input: `isValid("()[]{}")`, output: "true" },
    starterCode: `function isValid(s) {
  // true if every bracket closes with the right type, in order
}`,
    solution: `function isValid(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false;
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
}`,
    dryRun: [
      { label: `"{[]}"`, code: `ch='{'`, detail: "opener → push. stack=['{']." },
      { label: "", code: `ch='['`, detail: "opener → push. stack=['{','[']." },
      { label: "", code: `ch=']'`, detail: "closer; pop '[' === match '[' ✓. stack=['{']." },
      { label: "", code: `ch='}'`, detail: "closer; pop '{' === match '{' ✓. stack=[]." },
      { label: "end", code: `stack.length === 0`, detail: "Empty → valid → true." },
    ],
    tests: [
      { name: "all matched", kind: "normal", call: `isValid("()[]{}")`, expected: true },
      { name: "wrong type", kind: "normal", call: `isValid("(]")`, expected: false },
      { name: "wrong order", kind: "normal", call: `isValid("([)]")`, expected: false },
      { name: "nested ok", kind: "normal", call: `isValid("{[]}")`, expected: true },
      { name: "leftover opener", kind: "invalid", call: `isValid("(")`, expected: false },
      { name: "empty → true", kind: "empty", call: `isValid("")`, expected: true },
    ],
    hints: [
      "A stack remembers the most recent unclosed opener.",
      "On a closing bracket, the top of the stack must be its matching opener.",
      "At the end the stack must be empty.",
    ],
    explanation:
      "Push each opener. On a closer, pop and check it matches — this enforces both correct type and correct nesting order. A non-empty stack at the end means unclosed openers. O(n) time and space.",
    edgeCases: ["Empty string is valid", "A single closer is invalid (pop returns undefined)", "Leftover openers are invalid"],
    commonMistakes: [
      "Only counting brackets instead of tracking order (so '([)]' wrongly passes).",
      "Forgetting to check the stack is empty at the end.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  // ---------------- Searching ----------------
  {
    id: "dsa-binary-search",
    slug: "dsa-binary-search",
    title: "Binary Search",
    difficulty: "Beginner",
    category: "DSA · Searching",
    tags: ["dsa", "binary-search", "array"],
    reviewTags: ["binary-search", "dsa"],
    flags: { interview: true },
    problem:
      "Given a sorted array of distinct numbers and a target, return its index, or -1 if it isn't present.",
    frontendScenario:
      "Looking something up fast in already-sorted data (autocomplete ranges, timeline lookups) — halving the search space each step.",
    example: { input: "search([-1, 0, 3, 5, 9, 12], 9)", output: "4" },
    starterCode: `function search(nums, target) {
  // return the index of target in the sorted array, or -1
}`,
    solution: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    explanation:
      "Because the array is sorted, comparing the middle to the target eliminates half the array each step. O(log n). Watch the loop condition (lo <= hi) and the mid ± 1 updates to avoid infinite loops.",
    tests: [
      { name: "found in middle", kind: "normal", call: "search([-1,0,3,5,9,12], 9)", expected: 4 },
      { name: "not present", kind: "normal", call: "search([-1,0,3,5,9,12], 2)", expected: -1 },
      { name: "first element", kind: "normal", call: "search([1,2,3], 1)", expected: 0 },
      { name: "empty → -1", kind: "empty", call: "search([], 5)", expected: -1 },
    ],
    hints: ["Track a lo and hi bound.", "Compare the middle element to the target and discard half.", "Use lo <= hi and move mid ± 1."],
    commonMistakes: ["Off-by-one in the bounds (infinite loop).", "Using it on an unsorted array."],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  },
  // ---------------- Dynamic Programming ----------------
  {
    id: "dsa-climbing-stairs",
    slug: "dsa-climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Beginner",
    category: "DSA · Dynamic Programming",
    tags: ["dsa", "dynamic-programming", "fibonacci"],
    reviewTags: ["dynamic-programming", "dsa"],
    flags: { interview: true },
    problem:
      "You can climb 1 or 2 steps at a time. How many distinct ways are there to reach the top of n steps?",
    frontendScenario:
      "Counting paths/combinations (a classic intro to DP) — recognizing it's just Fibonacci is the 'aha'.",
    example: { input: "climbStairs(5)", output: "8" },
    starterCode: `function climbStairs(n) {
  // number of distinct ways to climb n steps (1 or 2 at a time)
}`,
    solution: `function climbStairs(n) {
  let a = 1, b = 1; // ways to reach step 0 and step 1
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}`,
    explanation:
      "Ways(n) = Ways(n−1) + Ways(n−2): your last move was either a 1-step or a 2-step. That's Fibonacci. Carry the last two values instead of recursing → O(n) time, O(1) space.",
    tests: [
      { name: "2 steps → 2", kind: "normal", call: "climbStairs(2)", expected: 2 },
      { name: "3 steps → 3", kind: "normal", call: "climbStairs(3)", expected: 3 },
      { name: "5 steps → 8", kind: "normal", call: "climbStairs(5)", expected: 8 },
      { name: "1 step → 1", kind: "normal", call: "climbStairs(1)", expected: 1 },
    ],
    hints: ["How could you reach step n? From n−1 (one step) or n−2 (two steps).", "So ways(n) = ways(n−1) + ways(n−2) — Fibonacci.", "Keep the last two numbers instead of recursing."],
    commonMistakes: ["Naive recursion without memoization (exponential, times out).", "Wrong base cases for n = 1 and n = 2."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "dsa-maximum-subarray",
    slug: "dsa-maximum-subarray",
    title: "Maximum Subarray (Kadane's)",
    difficulty: "Advanced",
    category: "DSA · Dynamic Programming",
    tags: ["dsa", "dynamic-programming", "array", "kadane"],
    reviewTags: ["dynamic-programming", "dsa"],
    flags: { interview: true },
    problem:
      "Find the largest sum of any contiguous subarray (at least one element).",
    frontendScenario:
      "Best contiguous streak — peak engagement window, best run of daily gains — in one pass.",
    example: { input: "maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])", output: "6" },
    starterCode: `function maxSubArray(nums) {
  // largest sum of any contiguous subarray
}`,
    solution: `function maxSubArray(nums) {
  let best = nums[0], current = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]); // extend, or start fresh
    best = Math.max(best, current);
  }
  return best;
}`,
    explanation:
      "Kadane's: at each element decide whether to extend the running subarray or start a new one from here (whichever is larger). Track the best seen. O(n) time, O(1) space.",
    tests: [
      { name: "mixed signs → 6", kind: "normal", call: "maxSubArray([-2,1,-3,4,-1,2,1,-5,4])", expected: 6 },
      { name: "all negative → largest single", kind: "normal", call: "maxSubArray([-3,-1,-2])", expected: -1 },
      { name: "single element", kind: "normal", call: "maxSubArray([5])", expected: 5 },
    ],
    hints: ["At each step: is it better to extend the current run or start over at this element?", "current = max(nums[i], current + nums[i]).", "Track the best current you've seen."],
    commonMistakes: ["Initializing best to 0 (breaks all-negative arrays).", "Resetting on every negative number instead of comparing sums."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },

  // ---------------- Hashing (more) ----------------
  {
    id: "dsa-valid-anagram",
    slug: "dsa-valid-anagram",
    title: "Valid Anagram",
    difficulty: "Beginner",
    category: "DSA · Hashing",
    tags: ["dsa", "hash", "string"],
    reviewTags: ["hashing", "string", "dsa"],
    flags: { interview: true },
    problem: "Return true if t is an anagram of s (same letters, same counts), else false.",
    frontendScenario: "Checking two tag sets / inputs contain the same items regardless of order.",
    example: { input: `isAnagram("anagram", "nagaram")`, output: "true" },
    starterCode: `function isAnagram(s, t) {
  // true if t uses exactly the same letters as s
}`,
    solution: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (const c of t) {
    if (!count[c]) return false;
    count[c]--;
  }
  return true;
}`,
    explanation:
      "Tally each letter of s, then spend those tallies on t. If t needs a letter that's used up (or has a different length), it isn't an anagram. O(n).",
    tests: [
      { name: "is an anagram", kind: "normal", call: `isAnagram("anagram","nagaram")`, expected: true },
      { name: "not an anagram", kind: "normal", call: `isAnagram("rat","car")`, expected: false },
      { name: "different lengths", kind: "normal", call: `isAnagram("a","ab")`, expected: false },
    ],
    hints: ["Count each character in s.", "Decrement while scanning t; fail if a count goes negative or lengths differ."],
    commonMistakes: ["Sorting both (O(n log n)) when counting is O(n).", "Forgetting the length check."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) (fixed alphabet)",
  },
  {
    id: "dsa-first-unique-char",
    slug: "dsa-first-unique-char",
    title: "First Unique Character",
    difficulty: "Beginner",
    category: "DSA · Hashing",
    tags: ["dsa", "hash", "string"],
    reviewTags: ["hashing", "string", "dsa"],
    flags: { interview: true },
    problem: "Return the index of the first non-repeating character in a string, or -1 if there is none.",
    frontendScenario: "Finding the first item in a list that appears only once — a common 'first unique' need.",
    example: { input: `firstUniqChar("leetcode")`, output: "0" },
    starterCode: `function firstUniqChar(s) {
  // index of the first character that appears exactly once, or -1
}`,
    solution: `function firstUniqChar(s) {
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (let i = 0; i < s.length; i++) {
    if (count[s[i]] === 1) return i;
  }
  return -1;
}`,
    explanation:
      "One pass to count every character, a second pass to return the first with count 1. Two O(n) passes beat checking each char against the rest (O(n²)).",
    tests: [
      { name: "first char unique", kind: "normal", call: `firstUniqChar("leetcode")`, expected: 0 },
      { name: "later unique", kind: "normal", call: `firstUniqChar("loveleetcode")`, expected: 2 },
      { name: "none unique", kind: "normal", call: `firstUniqChar("aabb")`, expected: -1 },
    ],
    hints: ["Count all characters first.", "Then scan left-to-right for the first count of 1."],
    commonMistakes: ["Re-scanning the string for each character (O(n²))."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) (fixed alphabet)",
  },

  // ---------------- Two Pointers (more) ----------------
  {
    id: "dsa-two-sum-sorted",
    slug: "dsa-two-sum-sorted",
    title: "Two Sum II (Sorted Input)",
    difficulty: "Beginner",
    category: "DSA · Two Pointers",
    tags: ["dsa", "two-pointers", "array"],
    reviewTags: ["two-pointers", "dsa"],
    flags: { interview: true },
    problem:
      "The input array is sorted ascending. Return the indices [i, j] (i < j) of the two numbers that add up to target. Exactly one solution.",
    frontendScenario: "When data is already sorted, two pointers beat a hash map — no extra memory.",
    example: { input: "twoSumSorted([2, 7, 11, 15], 9)", output: "[0, 1]" },
    starterCode: `function twoSumSorted(nums, target) {
  // sorted input — use two pointers, no extra memory
}`,
    solution: `function twoSumSorted(nums, target) {
  let i = 0, j = nums.length - 1;
  while (i < j) {
    const sum = nums[i] + nums[j];
    if (sum === target) return [i, j];
    if (sum < target) i++;
    else j--;
  }
  return [];
}`,
    explanation:
      "Because it's sorted, a sum that's too small means move the left pointer up; too big means move the right pointer down. One pass, O(1) space — the payoff of sorted data.",
    tests: [
      { name: "basic", kind: "normal", call: "twoSumSorted([2,7,11,15], 9)", expected: [0, 1] },
      { name: "ends", kind: "normal", call: "twoSumSorted([2,3,4], 6)", expected: [0, 2] },
      { name: "negatives", kind: "normal", call: "twoSumSorted([-1,0], -1)", expected: [0, 1] },
    ],
    hints: ["Start one pointer at each end.", "Too small? move left up. Too big? move right down."],
    commonMistakes: ["Using a hash map and missing that sorted input enables O(1) space.", "Moving the wrong pointer."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "dsa-is-subsequence",
    slug: "dsa-is-subsequence",
    title: "Is Subsequence",
    difficulty: "Beginner",
    category: "DSA · Two Pointers",
    tags: ["dsa", "two-pointers", "string"],
    reviewTags: ["two-pointers", "string", "dsa"],
    flags: { interview: true },
    problem: "Return true if s is a subsequence of t (s's characters appear in t in order, not necessarily contiguous).",
    frontendScenario: "Fuzzy-match style checks — does the typed query appear, in order, inside a candidate string?",
    example: { input: `isSubsequence("abc", "ahbgdc")`, output: "true" },
    starterCode: `function isSubsequence(s, t) {
  // do all of s's chars appear in t, in order?
}`,
    solution: `function isSubsequence(s, t) {
  let i = 0;
  for (const c of t) {
    if (i < s.length && s[i] === c) i++;
  }
  return i === s.length;
}`,
    explanation:
      "Walk t once with a pointer into s; advance it each time the current s-character matches. If the pointer reaches the end of s, every character was found in order.",
    tests: [
      { name: "is a subsequence", kind: "normal", call: `isSubsequence("abc","ahbgdc")`, expected: true },
      { name: "wrong order", kind: "normal", call: `isSubsequence("axc","ahbgdc")`, expected: false },
      { name: "empty s", kind: "empty", call: `isSubsequence("","x")`, expected: true },
    ],
    hints: ["One pointer into s; scan t once.", "Advance the s-pointer only on a match.", "Empty s is always a subsequence."],
    commonMistakes: ["Requiring the characters to be contiguous.", "Not handling empty s."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },

  // ---------------- Sliding Window (more) ----------------
  {
    id: "dsa-min-subarray-len",
    slug: "dsa-min-subarray-len",
    title: "Minimum Size Subarray Sum",
    difficulty: "Advanced",
    category: "DSA · Sliding Window",
    tags: ["dsa", "sliding-window", "array"],
    reviewTags: ["sliding-window", "dsa"],
    flags: { interview: true },
    problem:
      "Return the minimal length of a contiguous subarray whose sum is ≥ target. If none exists, return 0. (All numbers are positive.)",
    frontendScenario: "Smallest window of recent events whose total crosses a threshold (e.g. fewest days to hit a goal).",
    example: { input: "minSubArrayLen(7, [2,3,1,2,4,3])", output: "2" },
    starterCode: `function minSubArrayLen(target, nums) {
  // shortest contiguous subarray with sum >= target, else 0
}`,
    solution: `function minSubArrayLen(target, nums) {
  let left = 0, sum = 0, best = Infinity;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum >= target) {
      best = Math.min(best, right - left + 1);
      sum -= nums[left++];
    }
  }
  return best === Infinity ? 0 : best;
}`,
    explanation:
      "Grow the window to the right adding to the sum; whenever it's ≥ target, record the length and shrink from the left to find the smallest valid window. Each index enters/leaves once → O(n).",
    tests: [
      { name: "target 7", kind: "normal", call: "minSubArrayLen(7, [2,3,1,2,4,3])", expected: 2 },
      { name: "single element suffices", kind: "normal", call: "minSubArrayLen(4, [1,4,4])", expected: 1 },
      { name: "impossible → 0", kind: "normal", call: "minSubArrayLen(11, [1,1,1,1,1,1,1,1])", expected: 0 },
    ],
    hints: ["Expand right to grow the sum.", "Once sum ≥ target, shrink from the left to minimize length.", "Return 0 if you never reach target."],
    commonMistakes: ["Returning Infinity instead of 0 when impossible.", "Not shrinking the window (gives a length, not the minimum)."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "dsa-max-vowels",
    slug: "dsa-max-vowels",
    title: "Max Vowels in a Window of Size K",
    difficulty: "Beginner",
    category: "DSA · Sliding Window",
    tags: ["dsa", "sliding-window", "string"],
    reviewTags: ["sliding-window", "string", "dsa"],
    flags: { interview: true },
    problem: "Return the maximum number of vowels in any substring of length k.",
    frontendScenario: "A fixed-size rolling count over a stream — the same shape as 'most X in any k-length window'.",
    example: { input: `maxVowels("abciiidef", 3)`, output: "3" },
    starterCode: `function maxVowels(s, k) {
  // most vowels in any window of length k
}`,
    solution: `function maxVowels(s, k) {
  const isV = (c) => "aeiou".includes(c);
  let cur = 0;
  for (let i = 0; i < k; i++) if (isV(s[i])) cur++;
  let best = cur;
  for (let i = k; i < s.length; i++) {
    if (isV(s[i])) cur++;
    if (isV(s[i - k])) cur--;
    best = Math.max(best, cur);
  }
  return best;
}`,
    explanation:
      "Count vowels in the first window, then slide: +1 if the entering char is a vowel, −1 if the leaving char was. O(1) per step instead of recounting k chars.",
    tests: [
      { name: "three vowels", kind: "normal", call: `maxVowels("abciiidef", 3)`, expected: 3 },
      { name: "all vowels", kind: "normal", call: `maxVowels("aeiou", 2)`, expected: 2 },
      { name: "sparse vowels", kind: "normal", call: `maxVowels("leetcode", 3)`, expected: 2 },
    ],
    hints: ["Count vowels in the first k characters.", "Slide: add the entering char, remove the leaving one."],
    commonMistakes: ["Recounting the whole window each step (O(n·k))."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },

  // ---------------- Stacks (more) ----------------
  {
    id: "dsa-evaluate-rpn",
    slug: "dsa-evaluate-rpn",
    title: "Evaluate Reverse Polish Notation",
    difficulty: "Intermediate",
    category: "DSA · Stacks",
    tags: ["dsa", "stack", "math"],
    reviewTags: ["stack", "dsa"],
    flags: { interview: true },
    problem:
      "Evaluate an arithmetic expression in Reverse Polish Notation (tokens are an array of numbers and the operators + - * /). Division truncates toward zero.",
    frontendScenario: "How calculators and formula/expression evaluators work under the hood — a stack of operands.",
    example: { input: `evalRPN(["2","1","+","3","*"])`, output: "9" },
    starterCode: `function evalRPN(tokens) {
  // evaluate the RPN expression; division truncates toward zero
}`,
    solution: `function evalRPN(tokens) {
  const stack = [];
  for (const tk of tokens) {
    if (["+", "-", "*", "/"].includes(tk)) {
      const b = stack.pop(), a = stack.pop();
      stack.push(
        tk === "+" ? a + b :
        tk === "-" ? a - b :
        tk === "*" ? a * b :
        Math.trunc(a / b)
      );
    } else {
      stack.push(Number(tk));
    }
  }
  return stack[0];
}`,
    explanation:
      "Push numbers; on an operator, pop the top two (order matters: second-popped is the left operand) and push the result. The stack ends with the single final value.",
    tests: [
      { name: "(2+1)*3", kind: "normal", call: `evalRPN(["2","1","+","3","*"])`, expected: 9 },
      { name: "4 + 13/5 (trunc)", kind: "normal", call: `evalRPN(["4","13","5","/","+"])`, expected: 6 },
    ],
    hints: ["Push operands; on an operator pop two.", "Mind the operand order: the first popped is the right-hand side.", "Use Math.trunc for division."],
    commonMistakes: ["Swapping operands for − and / (order matters).", "Using Math.floor (wrong for negatives) instead of truncation."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  {
    id: "dsa-daily-temperatures",
    slug: "dsa-daily-temperatures",
    title: "Daily Temperatures",
    difficulty: "Intermediate",
    category: "DSA · Stacks",
    tags: ["dsa", "stack", "monotonic"],
    reviewTags: ["stack", "monotonic-stack", "dsa"],
    flags: { interview: true },
    problem:
      "For each day, return how many days you'd wait for a warmer temperature. If none, 0.",
    frontendScenario: "'Days until the next higher value' — the monotonic-stack pattern behind next-greater-element problems.",
    example: { input: "dailyTemperatures([73,74,75,71,69,72,76,73])", output: "[1,1,4,2,1,1,0,0]" },
    starterCode: `function dailyTemperatures(temps) {
  // for each day, days until a warmer one (0 if none)
}`,
    solution: `function dailyTemperatures(temps) {
  const res = new Array(temps.length).fill(0);
  const stack = []; // indices of days awaiting a warmer day
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {
      const j = stack.pop();
      res[j] = i - j;
    }
    stack.push(i);
  }
  return res;
}`,
    explanation:
      "Keep a stack of day-indices whose warmer day hasn't been found. When today is warmer than the day on top, that day's answer is the gap. Each index is pushed/popped once → O(n).",
    tests: [
      { name: "sample", kind: "normal", call: "dailyTemperatures([73,74,75,71,69,72,76,73])", expected: [1, 1, 4, 2, 1, 1, 0, 0] },
      { name: "non-increasing → all 0", kind: "normal", call: "dailyTemperatures([5,4,3])", expected: [0, 0, 0] },
    ],
    hints: ["Store indices, not temperatures, on the stack.", "When today beats the top, pop and record the day gap.", "This is 'next greater element'."],
    commonMistakes: ["Using nested loops (O(n²)).", "Storing values instead of indices, losing the distance."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  {
    id: "dsa-backspace-compare",
    slug: "dsa-backspace-compare",
    title: "Backspace String Compare",
    difficulty: "Beginner",
    category: "DSA · Stacks",
    tags: ["dsa", "stack", "string"],
    reviewTags: ["stack", "string", "dsa"],
    flags: { interview: true },
    problem: "Two strings contain letters and '#' (backspace). Return true if they're equal after applying the backspaces.",
    frontendScenario: "Comparing what two text inputs actually resolve to when '#' means 'delete the previous char'.",
    example: { input: `backspaceCompare("ab#c", "ad#c")`, output: "true" },
    starterCode: `function backspaceCompare(s, t) {
  // '#' deletes the previous typed character
}`,
    solution: `function backspaceCompare(s, t) {
  const type = (str) => {
    const out = [];
    for (const c of str) {
      if (c === "#") out.pop();
      else out.push(c);
    }
    return out.join("");
  };
  return type(s) === type(t);
}`,
    explanation:
      "Replay each string onto a stack: a normal char pushes, a '#' pops. The final stacks (joined) are the real typed text — compare them.",
    tests: [
      { name: "equal after backspaces", kind: "normal", call: `backspaceCompare("ab#c","ad#c")`, expected: true },
      { name: "not equal", kind: "normal", call: `backspaceCompare("a#c","b")`, expected: false },
    ],
    hints: ["Build each string on a stack.", "'#' pops the last character (if any).", "Compare the resolved strings."],
    commonMistakes: ["Erroring when popping an empty stack (Array.pop is safe — returns undefined).", "Removing only one '#' incorrectly."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },

  // ---------------- Searching (more) ----------------
  {
    id: "dsa-search-insert",
    slug: "dsa-search-insert",
    title: "Search Insert Position",
    difficulty: "Beginner",
    category: "DSA · Searching",
    tags: ["dsa", "binary-search", "array"],
    reviewTags: ["binary-search", "dsa"],
    flags: { interview: true },
    problem:
      "Given a sorted array of distinct numbers and a target, return the index if found, otherwise the index where it would be inserted to keep it sorted.",
    frontendScenario: "Finding where a new item slots into an already-sorted list (leaderboards, ordered inserts).",
    example: { input: "searchInsert([1,3,5,6], 5)", output: "2" },
    starterCode: `function searchInsert(nums, target) {
  // index of target, or where it should be inserted
}`,
    solution: `function searchInsert(nums, target) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
    explanation:
      "A 'lower bound' binary search: shrink to the first index whose value is ≥ target. That index is the answer whether or not the target exists. O(log n).",
    tests: [
      { name: "found", kind: "normal", call: "searchInsert([1,3,5,6], 5)", expected: 2 },
      { name: "insert middle", kind: "normal", call: "searchInsert([1,3,5,6], 2)", expected: 1 },
      { name: "insert end", kind: "normal", call: "searchInsert([1,3,5,6], 7)", expected: 4 },
    ],
    hints: ["Search for the first index with value ≥ target.", "Use hi = nums.length and the lo < hi form."],
    commonMistakes: ["Off-by-one bounds.", "Returning -1 when not found instead of the insert position."],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "dsa-sqrt",
    slug: "dsa-integer-sqrt",
    title: "Integer Square Root (Sqrt(x))",
    difficulty: "Beginner",
    category: "DSA · Searching",
    tags: ["dsa", "binary-search", "math"],
    reviewTags: ["binary-search", "math", "dsa"],
    flags: { interview: true },
    problem: "Return the floor of the square root of a non-negative integer x, without using Math.sqrt.",
    frontendScenario: "Binary search isn't only for arrays — you can search a numeric answer range the same way.",
    example: { input: "mySqrt(8)", output: "2" },
    starterCode: `function mySqrt(x) {
  // floor of sqrt(x), no Math.sqrt
}`,
    solution: `function mySqrt(x) {
  if (x < 2) return x;
  let lo = 1, hi = Math.floor(x / 2), ans = 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (mid * mid <= x) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
}`,
    explanation:
      "Binary-search the answer: the largest mid whose square is ≤ x. Searching a value range (not an array) is a powerful binary-search variant.",
    tests: [
      { name: "perfect square", kind: "normal", call: "mySqrt(4)", expected: 2 },
      { name: "floors down", kind: "normal", call: "mySqrt(8)", expected: 2 },
      { name: "zero", kind: "normal", call: "mySqrt(0)", expected: 0 },
      { name: "one", kind: "normal", call: "mySqrt(1)", expected: 1 },
    ],
    hints: ["You're searching for an answer in [0, x], not an array index.", "Keep the largest mid with mid*mid ≤ x."],
    commonMistakes: ["Wrong base cases for 0 and 1.", "Using Math.sqrt (defeats the exercise)."],
    timeComplexity: "O(log x)",
    spaceComplexity: "O(1)",
  },
  {
    id: "dsa-search-rotated",
    slug: "dsa-search-rotated",
    title: "Search in Rotated Sorted Array",
    difficulty: "Advanced",
    category: "DSA · Searching",
    tags: ["dsa", "binary-search", "array"],
    reviewTags: ["binary-search", "dsa"],
    flags: { interview: true },
    problem:
      "A sorted array of distinct values was rotated at an unknown pivot. Find the index of target in O(log n), or -1.",
    frontendScenario: "A classic 'can you adapt binary search?' interview filter — one half is always still sorted.",
    example: { input: "search([4,5,6,7,0,1,2], 0)", output: "4" },
    starterCode: `function search(nums, target) {
  // rotated sorted array; find target in O(log n) or -1
}`,
    solution: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
    explanation:
      "At every step one half is properly sorted. Check whether target lies within that sorted half; if so search it, otherwise search the other half. Still O(log n).",
    tests: [
      { name: "found after pivot", kind: "normal", call: "search([4,5,6,7,0,1,2], 0)", expected: 4 },
      { name: "absent", kind: "normal", call: "search([4,5,6,7,0,1,2], 3)", expected: -1 },
      { name: "single element", kind: "normal", call: "search([1], 1)", expected: 0 },
    ],
    hints: ["At each mid, decide which half is sorted (compare nums[lo] and nums[mid]).", "Check if target is inside the sorted half; otherwise go the other way."],
    commonMistakes: ["Forgetting one half is always sorted.", "Wrong inclusive/exclusive comparisons at the boundaries."],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  },

  // ---------------- Dynamic Programming (more) ----------------
  {
    id: "dsa-house-robber",
    slug: "dsa-house-robber",
    title: "House Robber",
    difficulty: "Intermediate",
    category: "DSA · Dynamic Programming",
    tags: ["dsa", "dynamic-programming", "array"],
    reviewTags: ["dynamic-programming", "dsa"],
    flags: { interview: true },
    problem:
      "Given values in an array, return the maximum total you can take without taking two adjacent elements.",
    frontendScenario: "Max value under a 'no two adjacent' constraint — a clean intro to choice-based DP.",
    example: { input: "rob([2,7,9,3,1])", output: "12" },
    starterCode: `function rob(nums) {
  // max sum with no two adjacent elements chosen
}`,
    solution: `function rob(nums) {
  let prev = 0, cur = 0; // best up to i-2 and i-1
  for (const n of nums) {
    [prev, cur] = [cur, Math.max(cur, prev + n)];
  }
  return cur;
}`,
    explanation:
      "At each house: either skip it (keep cur) or take it (prev + value). Carry the best totals for 'up to previous' and 'up to one before that' — O(n) time, O(1) space.",
    tests: [
      { name: "basic", kind: "normal", call: "rob([1,2,3,1])", expected: 4 },
      { name: "bigger", kind: "normal", call: "rob([2,7,9,3,1])", expected: 12 },
      { name: "empty → 0", kind: "empty", call: "rob([])", expected: 0 },
    ],
    hints: ["For each element: max(skip, take + best two-back).", "Track two rolling totals instead of an array."],
    commonMistakes: ["Comparing only neighbors instead of best-so-far.", "Mishandling the empty array."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "dsa-coin-change",
    slug: "dsa-coin-change",
    title: "Coin Change (Fewest Coins)",
    difficulty: "Advanced",
    category: "DSA · Dynamic Programming",
    tags: ["dsa", "dynamic-programming"],
    reviewTags: ["dynamic-programming", "dsa"],
    flags: { interview: true },
    problem:
      "Given coin denominations and an amount, return the fewest coins needed to make the amount, or -1 if it can't be made.",
    frontendScenario: "Minimal-combination problems (making change, fewest steps) — the canonical bottom-up DP.",
    example: { input: "coinChange([1,2,5], 11)", output: "3" },
    starterCode: `function coinChange(coins, amount) {
  // fewest coins to make amount, or -1
}`,
    solution: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    explanation:
      "dp[a] = fewest coins to make amount a. For each amount, try every coin: dp[a] = min(dp[a], dp[a − coin] + 1). Build up from 0; greedy fails for arbitrary coins, DP doesn't.",
    tests: [
      { name: "11 from {1,2,5}", kind: "normal", call: "coinChange([1,2,5], 11)", expected: 3 },
      { name: "impossible", kind: "normal", call: "coinChange([2], 3)", expected: -1 },
      { name: "zero amount", kind: "normal", call: "coinChange([1], 0)", expected: 0 },
    ],
    hints: ["dp[0] = 0; dp[a] from dp[a − coin] + 1.", "Greedy (biggest coin first) is wrong in general — use DP."],
    commonMistakes: ["Assuming greedy works for all coin sets.", "Forgetting the -1 (unreachable) case."],
    timeComplexity: "O(amount × coins)",
    spaceComplexity: "O(amount)",
  },

  // ---------------- Greedy (new pattern) ----------------
  {
    id: "dsa-max-profit",
    slug: "dsa-best-time-buy-sell",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Beginner",
    category: "DSA · Greedy",
    tags: ["dsa", "greedy", "array"],
    reviewTags: ["greedy", "dsa"],
    flags: { interview: true, realWorld: true },
    problem:
      "Given daily prices, return the maximum profit from one buy and one later sell. If no profit is possible, return 0.",
    frontendScenario: "Biggest gain between a low and a later high — track the running minimum in one pass.",
    example: { input: "maxProfit([7,1,5,3,6,4])", output: "5" },
    starterCode: `function maxProfit(prices) {
  // best profit from one buy then one later sell, else 0
}`,
    solution: `function maxProfit(prices) {
  let minSoFar = Infinity, best = 0;
  for (const price of prices) {
    if (price < minSoFar) minSoFar = price;
    else best = Math.max(best, price - minSoFar);
  }
  return best;
}`,
    explanation:
      "Track the lowest price seen so far; at each day the best sale today is price − minSoFar. One pass, O(1) space — no need to compare all pairs.",
    tests: [
      { name: "profit of 5", kind: "normal", call: "maxProfit([7,1,5,3,6,4])", expected: 5 },
      { name: "only falling → 0", kind: "normal", call: "maxProfit([7,6,4,3,1])", expected: 0 },
    ],
    hints: ["Track the minimum price so far.", "Best today = today's price − min so far.", "Never sell before you buy."],
    commonMistakes: ["Comparing every pair (O(n²)).", "Allowing a sell before the buy day."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "dsa-jump-game",
    slug: "dsa-jump-game",
    title: "Jump Game",
    difficulty: "Intermediate",
    category: "DSA · Greedy",
    tags: ["dsa", "greedy", "array"],
    reviewTags: ["greedy", "dsa"],
    flags: { interview: true },
    problem:
      "Each element is the max jump length from that position. Starting at index 0, return true if you can reach the last index.",
    frontendScenario: "Reachability with a budget at each step — greedily track the farthest you can get.",
    example: { input: "canJump([2,3,1,1,4])", output: "true" },
    starterCode: `function canJump(nums) {
  // can you reach the last index?
}`,
    solution: `function canJump(nums) {
  let reach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false; // stuck before here
    reach = Math.max(reach, i + nums[i]);
  }
  return true;
}`,
    explanation:
      "Track the farthest index reachable. If you ever stand on an index beyond that reach, you're stuck. Otherwise extend the reach. One greedy pass, O(n).",
    tests: [
      { name: "reachable", kind: "normal", call: "canJump([2,3,1,1,4])", expected: true },
      { name: "stuck at a 0", kind: "normal", call: "canJump([3,2,1,0,4])", expected: false },
    ],
    hints: ["Track the farthest index you can reach.", "If your current index passes that reach, you're stuck."],
    commonMistakes: ["Trying every jump combination (exponential).", "Off-by-one on the reach check."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "dsa-gas-station",
    slug: "dsa-gas-station",
    title: "Gas Station",
    difficulty: "Advanced",
    category: "DSA · Greedy",
    tags: ["dsa", "greedy", "array"],
    reviewTags: ["greedy", "dsa"],
    flags: { interview: true },
    problem:
      "gas[i] is fuel at station i; cost[i] is fuel to reach the next. Return the starting index to complete the circular route once, or -1 if impossible.",
    frontendScenario: "A greedy insight problem: if the total is enough, a unique start works — found in one pass.",
    example: { input: "canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2])", output: "3" },
    starterCode: `function canCompleteCircuit(gas, cost) {
  // index to start a full loop, or -1
}`,
    solution: `function canCompleteCircuit(gas, cost) {
  let total = 0, tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i];
    total += diff;
    tank += diff;
    if (tank < 0) {       // can't reach i+1 from current start
      start = i + 1;
      tank = 0;
    }
  }
  return total >= 0 ? start : -1;
}`,
    explanation:
      "If the total gas ≥ total cost, a solution exists. Whenever the running tank dips below 0, no start in [start..i] works, so jump start to i+1. One pass, O(1) space.",
    tests: [
      { name: "starts at 3", kind: "normal", call: "canCompleteCircuit([1,2,3,4,5],[3,4,5,1,2])", expected: 3 },
      { name: "impossible", kind: "normal", call: "canCompleteCircuit([2,3,4],[3,4,3])", expected: -1 },
    ],
    hints: ["If total gas < total cost, it's impossible.", "When the tank goes negative, the next station is the new candidate start."],
    commonMistakes: ["Re-simulating from every start (O(n²)).", "Forgetting the total-feasibility check."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    id: "dsa-assign-cookies",
    slug: "dsa-assign-cookies",
    title: "Assign Cookies",
    difficulty: "Beginner",
    category: "DSA · Greedy",
    tags: ["dsa", "greedy", "sorting"],
    reviewTags: ["greedy", "sorting", "dsa"],
    flags: { interview: true },
    problem:
      "Each child i needs a cookie of size ≥ greed g[i]; each cookie has size s[j] and serves one child. Return the maximum number of content children.",
    frontendScenario: "Maximize matches under a 'good enough' threshold — sort both sides, then greedily pair smallest-fit.",
    example: { input: "findContentChildren([1,2,3], [1,1])", output: "1" },
    starterCode: `function findContentChildren(g, s) {
  // max children satisfied (cookie size >= greed)
}`,
    solution: `function findContentChildren(g, s) {
  g = [...g].sort((a, b) => a - b);
  s = [...s].sort((a, b) => a - b);
  let i = 0, j = 0;
  while (i < g.length && j < s.length) {
    if (s[j] >= g[i]) i++; // this cookie satisfies child i
    j++;
  }
  return i;
}`,
    explanation:
      "Sort children by greed and cookies by size. Give the smallest sufficient cookie to the least greedy child; if a cookie can't satisfy the current child, it can't satisfy a greedier one either. Greedy + two pointers.",
    tests: [
      { name: "one satisfied", kind: "normal", call: "findContentChildren([1,2,3], [1,1])", expected: 1 },
      { name: "both satisfied", kind: "normal", call: "findContentChildren([1,2], [1,2,3])", expected: 2 },
    ],
    hints: ["Sort both arrays ascending.", "Walk a pointer through cookies; advance the child pointer on a fit."],
    commonMistakes: ["Not sorting first.", "Mutating the inputs (copy before sort)."],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  },
];
