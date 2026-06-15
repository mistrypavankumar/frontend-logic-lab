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
      "Two teammates each tagged an article. Write sharedTags(mine, theirs) that returns the tags appearing in BOTH lists — deduped, in the order they appear in mine.",
    practiceStarter: `function sharedTags(mine, theirs) {
  // tags in both lists, deduped, order from mine
}`,
    practiceTests: [
      { name: "tags in both", kind: "normal", call: "sharedTags(['js','css','html'],['css','html','go'])", expected: ["css", "html"] },
      { name: "no overlap", kind: "normal", call: "sharedTags(['js'],['go'])", expected: [] },
      { name: "dedupes", kind: "duplicate", call: "sharedTags(['css','css','js'],['css','js'])", expected: ["css", "js"] },
    ],
    builtInPractice: {
      starter: `function sharedTags(mine, theirs) {
  // return [...new Set(mine).intersection(new Set(theirs))]
}`,
      mustUse: [".intersection("],
      intro: "Build Sets and let the native Set method do the overlap.",
    },
    hint: "New way: [...new Set(mine).intersection(new Set(theirs))]. Manual way (no .intersection): put theirs in a Set, then filter mine's unique values by set.has.",
    solution: {
      language: "ts",
      code: `function sharedTags(mine, theirs) {
  const setTheirs = new Set(theirs);
  return [...new Set(mine)].filter((x) => setTheirs.has(x));
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
      "A user's permissions changed. Write revoked(before, after) that returns the permissions that were in `before` but are NOT in `after` — deduped, in the order they appear in before.",
    practiceStarter: `function revoked(before, after) {
  // values in before but not in after, deduped
}`,
    practiceTests: [
      { name: "what was removed", kind: "normal", call: "revoked(['read','write','admin'],['read','write'])", expected: ["admin"] },
      { name: "nothing removed", kind: "normal", call: "revoked(['read','write'],['read','write'])", expected: [] },
      { name: "after is empty", kind: "empty", call: "revoked(['read','write'],[])", expected: ["read", "write"] },
    ],
    builtInPractice: {
      starter: `function revoked(before, after) {
  // return [...new Set(before).difference(new Set(after))]
}`,
      mustUse: [".difference("],
      intro: "Build Sets and subtract one from the other with the native method.",
    },
    hint: "New way: [...new Set(before).difference(new Set(after))]. Manual way (no .difference): put after in a Set, then filter before's unique values where !set.has(x).",
    solution: {
      language: "ts",
      code: `function revoked(before, after) {
  const setAfter = new Set(after);
  return [...new Set(before)].filter((x) => !setAfter.has(x));
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
      "A route requires certain permissions. Write hasAccess(required, granted) that returns true only if EVERY required permission is in the granted list.",
    practiceStarter: `function hasAccess(required, granted) {
  // true only if every required permission is in granted
}`,
    practiceTests: [
      { name: "has all required", kind: "normal", call: "hasAccess(['read','write'],['read','write','admin'])", expected: true },
      { name: "missing one", kind: "normal", call: "hasAccess(['read','delete'],['read','write'])", expected: false },
      { name: "nothing required", kind: "empty", call: "hasAccess([],['read'])", expected: true },
    ],
    builtInPractice: {
      starter: `function hasAccess(required, granted) {
  // return new Set(required).isSubsetOf(new Set(granted))
}`,
      mustUse: [".isSubsetOf("],
      intro: "Express the check as a Set relationship — required ⊆ granted.",
    },
    hint: "New way: new Set(required).isSubsetOf(new Set(granted)). Manual way (no .isSubsetOf): put granted in a Set, then required.every(p => set.has(p)).",
    solution: {
      language: "ts",
      code: `function hasAccess(required, granted) {
  const grantedSet = new Set(granted);
  return required.every((p) => grantedSet.has(p));
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
