// Shared types for the whole app. Keeping them in one place makes the
// data files and components easy to keep in sync.
//
// MIGRATION NOTE (industrial upgrade): every change below is ADDITIVE.
// All previously-required fields stay required so the original lessons /
// challenges keep compiling and rendering unchanged. New "deep-dive" fields
// are OPTIONAL — pages render those sections only when the data provides them.

// ---------------------------------------------------------------------------
// Enums / unions
// ---------------------------------------------------------------------------

// Two new tiers added for industrial-grade content. Additive — existing data
// only uses the first three. NOTE: components/DifficultyBadge.tsx must list
// every level in its style map.
export type Difficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Industrial"
  | "Expert";

export const DIFFICULTIES: Difficulty[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Industrial",
  "Expert",
];

// Original categories kept; new industrial categories appended.
export type LessonCategory =
  | "HTML"
  | "CSS"
  | "JavaScript"
  | "React"
  | "Modern Array Methods"
  | "Modern Objects & Grouping"
  | "Modern Set Operations"
  | "Async JavaScript"
  | "Data Transformation"
  | "JavaScript Internals"
  | "UI Logic";

export interface CodeSnippet {
  language: string; // e.g. "html", "css", "js", "jsx", "ts"
  code: string;
}

// ---------------------------------------------------------------------------
// Test cases (shared by lessons + challenges)
// ---------------------------------------------------------------------------

export interface TestCase {
  name: string;
  call: string; // a JS expression evaluated in the learner's code scope
  expected: unknown; // compared by key-sorted deep equality
  /** Optional label so the UI can group cases (normal / empty / invalid …). */
  kind?: TestKind;
}

export type TestKind =
  | "normal"
  | "empty"
  | "invalid"
  | "duplicate"
  | "large"
  | "nullish"
  | "mutation"
  | "performance";

// ---------------------------------------------------------------------------
// Deep-dive block — the reusable "built-in vs manual vs internal" teaching unit.
// Shared shape between modern-method lessons and industrial challenges.
// ---------------------------------------------------------------------------

export interface MethodDeepDive {
  /** What problem this method/technique solves, in one or two plain sentences. */
  problemSolved?: string;
  realWorldUseCase?: string;
  /** 1: idiomatic built-in usage. */
  builtInSolution?: CodeSnippet;
  /** 2: same result without the built-in (loop / reduce / spread). */
  manualSolution?: CodeSnippet;
  /** 3: from-scratch implementation (myToSorted, myGroupBy, polyfill-style). */
  internalImplementation?: CodeSnippet;
  edgeCases?: string[];
  timeComplexity?: string; // e.g. "O(n log n)"
  spaceComplexity?: string; // e.g. "O(n)"
  /** Free-text browser/runtime support + "since" notes. */
  browserSupport?: string;
  whenNotToUse?: string;
  industrialNotes?: string[];
  commonMistakes?: string[];
}

// ---------------------------------------------------------------------------
// Lesson
// ---------------------------------------------------------------------------

/** A short, practice-first lesson. */
export interface Lesson {
  id: string;
  slug: string;
  title: string;
  category: LessonCategory;
  difficulty: Difficulty;
  order: number; // position in the learning path
  estimatedMinutes: number;

  // --- core teaching fields (kept required for backward compatibility) ---
  summary: string; // simple explanation, beginner friendly
  realLifeExample: string; // an everyday analogy
  codeExample: CodeSnippet; // small example
  practiceTask: string; // what the learner should try
  practiceStarter?: string; // editable starter for the "Your code" editor
  practiceTests?: TestCase[]; // auto-graded practice
  practiceRunnable?: boolean; // force console-mode Run without tests
  hint: string;
  solution: CodeSnippet;
  explanation: string; // why the solution works

  // --- navigation / relationships ---
  nextLessonSlug?: string; // original single-next pointer (kept)
  nextLessonIds?: string[]; // richer multi-next recommendations
  relatedMethods?: string[]; // method slugs/names this lesson relates to
  practiceChallengeIds?: string[]; // challenges that drill this lesson
  tags?: string[];

  // --- industrial deep-dive (optional; rendered only when present) ---
  deepDive?: MethodDeepDive;
  /** True for the new modern-JS method lessons (drives the /modern hub). */
  isModernMethod?: boolean;
}

// ---------------------------------------------------------------------------
// Challenge
// ---------------------------------------------------------------------------

/** Flags powering the practice-page filters (data-driven, not progress-driven). */
export interface ChallengeFlags {
  /** A native built-in exists for this (so we can teach built-in vs manual). */
  builtInAvailable?: boolean;
  interview?: boolean;
  async?: boolean;
  dataTransformation?: boolean;
  realWorld?: boolean;
}

/** A standalone logic challenge in the practice bank. */
export interface Challenge {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  category: string; // e.g. "Filtering", "Sorting", "Async", "Objects"
  tags: string[];

  // --- problem statement (kept required) ---
  problem: string;
  example: { input: string; output: string };
  starterCode: string;
  hints: string[];
  solution: string; // the canonical/primary solution (kept required)
  explanation: string;
  /** Visible auto-graded test cases (the editor checks these on Run). */
  tests?: TestCase[];

  // --- richer industrial fields (all optional / additive) ---
  relatedMethods?: string[];
  realWorldScenario?: string;
  constraints?: string[];
  builtInSolution?: CodeSnippet;
  manualSolution?: CodeSnippet;
  internalImplementation?: CodeSnippet;
  /** Hidden cases revealed after the learner runs the visible ones. */
  hiddenTests?: TestCase[];
  edgeCases?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
  industrialNotes?: string[];
  commonMistakes?: string[];
  flags?: ChallengeFlags;
}

// ---------------------------------------------------------------------------
// Project (unchanged)
// ---------------------------------------------------------------------------

/** A larger build-it-yourself project idea. */
export interface Project {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  features: string[];
  skills: string[];
}
