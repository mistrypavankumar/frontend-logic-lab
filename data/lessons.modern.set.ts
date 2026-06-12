import { Lesson } from "@/lib/types";

// Native Set operations (ES2024/2025). Hugely practical for permissions, tags,
// and "what changed" comparisons. Practice tasks implement the operation over
// arrays so the auto-grader runs everywhere.
export const modernSetLessons: Lesson[] = [
  {
    id: "m-set-union-intersection",
    slug: "set-union-intersection",
    title: "Set union() & intersection()",
    category: "Modern Set Operations",
    difficulty: "Intermediate",
    order: 121,
    estimatedMinutes: 9,
    isModernMethod: true,
    relatedMethods: ["difference", "symmetricDifference"],
    practiceChallengeIds: ["ch-role-permission"],
    summary:
      "union() combines two sets (everything in either). intersection() keeps only what's in BOTH. No more nested loops or filter+includes.",
    realLifeExample:
      "Union = all guests invited by either host. Intersection = guests both hosts invited.",
    codeExample: {
      language: "ts",
      code: `const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
a.union(b);        // {1,2,3,4}
a.intersection(b); // {2,3}`,
    },
    practiceTask:
      "Implement intersect(a, b) (arrays) returning the values present in BOTH, no duplicates, order from a.",
    practiceStarter: `function intersect(a, b) {
  // values in both arrays, deduped
}`,
    practiceTests: [
      { name: "common values", kind: "normal", call: "intersect([1,2,3],[2,3,4])", expected: [2, 3] },
      { name: "no overlap", kind: "normal", call: "intersect([1],[2])", expected: [] },
      { name: "dedupes", kind: "duplicate", call: "intersect([2,2,3],[2,3])", expected: [2, 3] },
    ],
    hint: "Put b in a Set for O(1) lookups, then filter a's unique values by set.has.",
    solution: {
      language: "ts",
      code: `function intersect(a, b) {
  const setB = new Set(b);
  return [...new Set(a)].filter((x) => setB.has(x));
}`,
    },
    explanation:
      "A Set lookup is O(1), so filtering one list against the other is O(n) instead of the O(n²) of nested includes().",
    deepDive: {
      problemSolved: "Comparing two lists for overlap/combination without slow nested loops or manual dedupe.",
      realWorldUseCase: "Which permissions does a user have that a route requires (intersection)? Merge two tag lists (union).",
      builtInSolution: { language: "ts", code: "userPerms.intersection(requiredPerms)" },
      manualSolution: { language: "ts", code: "[...userPerms].filter((p) => requiredPerms.has(p))" },
      internalImplementation: {
        language: "ts",
        code: `function intersection(a, b) {
  const out = new Set();
  for (const x of a) if (b.has(x)) out.add(x);
  return out;
}`,
      },
      edgeCases: ["Empty set → empty result", "Duplicates impossible in Sets by definition", "Order follows the receiver set's insertion order"],
      timeComplexity: "O(n) (Set lookups are O(1))",
      spaceComplexity: "O(n)",
      browserSupport: "Chrome/Edge 122+, Firefox 127+, Safari 17+, Node 22+. Fallback: filter + Set.has.",
      whenNotToUse: "Tiny fixed arrays where readability of a plain filter wins and Set support is uncertain.",
      industrialNotes: ["Permission/tag math becomes one readable call instead of loop soup."],
      commonMistakes: ["Using array.includes in a loop → accidental O(n²) on large lists."],
    },
  },
  {
    id: "m-set-difference",
    slug: "set-difference",
    title: "Set difference() & symmetricDifference()",
    category: "Modern Set Operations",
    difficulty: "Intermediate",
    order: 122,
    estimatedMinutes: 9,
    isModernMethod: true,
    relatedMethods: ["union", "intersection"],
    summary:
      "difference(b) = in A but NOT in B. symmetricDifference(b) = in exactly one of the two (the things that differ).",
    realLifeExample:
      "difference = items on my list that aren't on yours. symmetricDifference = everything only one of us has (what changed).",
    codeExample: {
      language: "ts",
      code: `const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
a.difference(b);          // {1}
a.symmetricDifference(b); // {1, 4}`,
    },
    practiceTask:
      "Implement difference(a, b) (arrays) returning a's unique values that are NOT in b.",
    practiceStarter: `function difference(a, b) {
  // values in a but not in b, deduped
}`,
    practiceTests: [
      { name: "a minus b", kind: "normal", call: "difference([1,2,3],[2,3,4])", expected: [1] },
      { name: "all removed", kind: "normal", call: "difference([1,2],[1,2])", expected: [] },
      { name: "b empty", kind: "empty", call: "difference([1,2],[])", expected: [1, 2] },
    ],
    hint: "Set of b, then filter a's unique values where !setB.has(x).",
    solution: {
      language: "ts",
      code: `function difference(a, b) {
  const setB = new Set(b);
  return [...new Set(a)].filter((x) => !setB.has(x));
}`,
    },
    explanation:
      "Same Set-lookup trick, negated: keep what b does NOT contain. symmetricDifference is just difference both ways, combined.",
    deepDive: {
      problemSolved: "Computing 'what was added' and 'what was removed' between two states without O(n²) comparisons.",
      realWorldUseCase:
        "Diffing selected filter chips before/after a change, or computing newly-granted vs revoked permissions.",
      builtInSolution: { language: "ts", code: "newSelection.symmetricDifference(oldSelection) // what changed" },
      manualSolution: {
        language: "ts",
        code: `const setB = new Set(b);
const onlyA = [...a].filter((x) => !setB.has(x));`,
      },
      internalImplementation: {
        language: "ts",
        code: `function symmetricDifference(a, b) {
  const out = new Set(a);
  for (const x of b) out.has(x) ? out.delete(x) : out.add(x);
  return out;
}`,
      },
      edgeCases: ["difference with empty b → all of a", "symmetricDifference of equal sets → empty", "Order follows receiver then other"],
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      browserSupport: "Chrome/Edge 122+, Firefox 127+, Safari 17+, Node 22+. Fallback: filter + Set.has.",
      whenNotToUse: "When you also need WHICH side each diff came from — track separately.",
      industrialNotes: ["symmetricDifference is the cleanest 'what changed between two selections' primitive."],
      commonMistakes: ["Confusing difference (one-way) with symmetricDifference (both-ways)."],
    },
  },
  {
    id: "m-set-predicates",
    slug: "set-predicates",
    title: "isSubsetOf / isSupersetOf / isDisjointFrom",
    category: "Modern Set Operations",
    difficulty: "Intermediate",
    order: 123,
    estimatedMinutes: 8,
    isModernMethod: true,
    relatedMethods: ["intersection", "difference"],
    summary:
      "Three boolean checks: isSubsetOf (all of A is in B), isSupersetOf (A contains all of B), isDisjointFrom (A and B share nothing).",
    realLifeExample:
      "isSubsetOf = does the user have ALL required permissions? isDisjointFrom = do these two tag groups share nothing?",
    codeExample: {
      language: "ts",
      code: `const required = new Set(['read', 'write']);
const user = new Set(['read', 'write', 'admin']);
required.isSubsetOf(user); // true → access granted`,
    },
    practiceTask:
      "Implement isSubsetOf(a, b) (arrays) → true if every value of a is in b.",
    practiceStarter: `function isSubsetOf(a, b) {
  // every value of a is also in b?
}`,
    practiceTests: [
      { name: "is subset", kind: "normal", call: "isSubsetOf([1,2],[1,2,3])", expected: true },
      { name: "not subset", kind: "normal", call: "isSubsetOf([1,4],[1,2,3])", expected: false },
      { name: "empty is subset of anything", kind: "empty", call: "isSubsetOf([],[1])", expected: true },
    ],
    hint: "Set of b, then a.every(x => setB.has(x)).",
    solution: {
      language: "ts",
      code: `function isSubsetOf(a, b) {
  const setB = new Set(b);
  return a.every((x) => setB.has(x));
}`,
    },
    explanation:
      "every() short-circuits on the first missing value, so a permission check fails fast. The empty set is a subset of everything.",
    deepDive: {
      problemSolved: "Permission/capability checks expressed as one readable boolean instead of loops.",
      realWorldUseCase: "Route guard: requiredPermissions.isSubsetOf(userPermissions). Feature flags, role gates.",
      builtInSolution: { language: "ts", code: "required.isSubsetOf(userPerms)" },
      manualSolution: { language: "ts", code: "[...required].every((p) => userPerms.has(p))" },
      internalImplementation: {
        language: "ts",
        code: `function isSubsetOf(a, b) {
  for (const x of a) if (!b.has(x)) return false;
  return true;
}`,
      },
      edgeCases: [
        "Empty A → always a subset",
        "isDisjointFrom of two empty sets → true",
        "Native methods accept any set-like (has + size + keys)",
      ],
      timeComplexity: "O(n)",
      spaceComplexity: "O(n) (or O(1) if b is already a Set)",
      browserSupport: "Chrome/Edge 122+, Firefox 127+, Safari 17+, Node 22+. Fallback: every + Set.has.",
      whenNotToUse: "When you need the missing items, not just yes/no — use difference().",
      industrialNotes: ["Role-based access control reads like English: required.isSubsetOf(user)."],
      commonMistakes: ["Swapping subset/superset direction.", "Re-creating the Set on every check inside a render loop."],
    },
  },
];
