import { PathStage } from "@/lib/types";

// The guided Roadmap: one ordered journey from "never coded frontend" to
// "interview-ready", weaving CONCEPTS (lessons) and PRACTICE (challenges)
// together. Steps reference existing lessons/challenges by slug; milestones are
// encouragement/sign-post markers. Keep it a single clear line — the learner
// should always know the one next thing to do.
export const pathStages: PathStage[] = [
  {
    slug: "foundations",
    title: "Web Foundations",
    icon: "🧱",
    goal: "Structure a page with HTML and lay it out with CSS.",
    steps: [
      { ref: { kind: "lesson", slug: "html-structure" }, why: "Every page starts as structured HTML." },
      { ref: { kind: "lesson", slug: "css-layout" }, why: "The box model is how everything is sized and spaced." },
      { ref: { kind: "lesson", slug: "flexbox" }, why: "The everyday tool for arranging things in a row/column." },
      { ref: { kind: "lesson", slug: "css-grid" }, why: "For two-dimensional layouts." },
    ],
  },
  {
    slug: "js-basics",
    title: "JavaScript Basics",
    icon: "🟨",
    goal: "Read and write everyday JavaScript — variables, data, conditions, functions.",
    steps: [
      { ref: { kind: "lesson", slug: "javascript-basics" }, why: "Variables, types, expressions." },
      { ref: { kind: "lesson", slug: "arrays-objects" }, why: "The two shapes nearly all data takes." },
      { ref: { kind: "lesson", slug: "conditions-loops" }, why: "Make decisions and repeat work." },
      { ref: { kind: "lesson", slug: "functions" }, why: "Package logic as reusable inputs → output." },
      { ref: { kind: "milestone", text: "You can write basic logic now. Open the Daily Mix and do a little every day — consistency beats cramming." } },
    ],
  },
  {
    slug: "core-logic",
    title: "Core Logic (Practice)",
    icon: "🎯",
    goal: "Turn a requirement into a working, tested function.",
    steps: [
      { ref: { kind: "challenge", slug: "filter-products-by-category" }, why: "Filtering — the most common UI logic." },
      { ref: { kind: "challenge", slug: "search-users-by-name" }, why: "Case-insensitive search." },
      { ref: { kind: "challenge", slug: "sort-orders-by-price" }, why: "Sorting without mutating." },
      { ref: { kind: "challenge", slug: "debug-even-number-filter" }, why: "Fix broken code — reading code is half the job." },
      { ref: { kind: "milestone", text: "Stuck on a challenge? Every page links back to the lesson that teaches it, and failing tests now give targeted hints." } },
    ],
  },
  {
    slug: "modern-js",
    title: "Modern JavaScript",
    icon: "✨",
    goal: "Use modern, immutable array methods — and know what they do under the hood.",
    steps: [
      { ref: { kind: "lesson", slug: "array-tosorted" }, why: "Sort without mutating (vs .sort())." },
      { ref: { kind: "lesson", slug: "array-toreversed" }, why: "Reverse a copy." },
      { ref: { kind: "lesson", slug: "array-with" }, why: "Immutable single-index update (great for React state)." },
      { ref: { kind: "challenge", slug: "implement-my-map" }, why: "Build map from scratch — truly understand callbacks & indexes." },
      { ref: { kind: "challenge", slug: "implement-my-filter" }, why: "Build filter from scratch." },
    ],
  },
  {
    slug: "internals",
    title: "How JavaScript Works",
    icon: "⚙️",
    goal: "Understand WHY code behaves as it does — the thing AI is weakest at.",
    steps: [
      { ref: { kind: "lesson", slug: "event-loop" }, why: "Why async runs in the order it does." },
      { ref: { kind: "lesson", slug: "closures" }, why: "How functions remember state." },
      { ref: { kind: "lesson", slug: "references-shallow-deep" }, why: "Why editing a copy can change the original." },
      { ref: { kind: "lesson", slug: "this-binding" }, why: "Why `this` changes with how a function is called." },
    ],
  },
  {
    slug: "dsa",
    title: "DSA for Interviews",
    icon: "🧠",
    goal: "Recognize and apply the core patterns MNCs ask about.",
    steps: [
      { ref: { kind: "challenge", slug: "dsa-two-sum" }, why: "Hashing — replace a nested loop with a map." },
      { ref: { kind: "challenge", slug: "dsa-valid-parentheses" }, why: "Stacks — matching and nesting." },
      { ref: { kind: "challenge", slug: "dsa-binary-search" }, why: "Halve the search space each step." },
      { ref: { kind: "challenge", slug: "dsa-longest-substring" }, why: "Sliding window." },
      { ref: { kind: "milestone", text: "Train pattern recognition with the 'Which Pattern?' quiz on the DSA page — naming the pattern is the real interview skill." } },
    ],
  },
  {
    slug: "level-up",
    title: "Level Up",
    icon: "🚀",
    goal: "Work the way pros do — review AI output, write tests, then build something real.",
    steps: [
      { ref: { kind: "challenge", slug: "ai-review-average" }, why: "Judge AI-written code — the #1 modern skill." },
      { ref: { kind: "challenge", slug: "write-tests-average" }, why: "Write tests that catch bugs." },
      { ref: { kind: "milestone", text: "Pick a Mini Project and build it end to end — combining everything you've learned." } },
    ],
  },
];
