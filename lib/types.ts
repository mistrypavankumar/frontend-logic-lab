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
  | "Array Methods"
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
// Step-by-step understanding blocks (shared by lessons + challenges).
// All additive and optional — a page renders a section only when its data
// is present. This is the heart of the "understand WHY" learning upgrade.
// ---------------------------------------------------------------------------

/** Pseudocode-first thinking: problem → input → output → plain steps → code. */
export interface Pseudocode {
  understand: string; // restate the problem in your own words
  input: string; // what goes in
  output: string; // what should come out
  steps: string[]; // plain-English steps
  toCode?: string; // optional: the same steps as JS
}

/** One line of a "dry run" — how the code executes, step by step. */
export interface DryRunStep {
  label?: string; // e.g. "Iteration 1", "Condition check", "Return"
  detail: string; // what happens at this point
  code?: string; // optional expression/line being executed
}

/** A variable-tracker table. Columns are free-form so any algorithm fits. */
export interface VariableTrace {
  /** e.g. ["Step", "Current item", "Condition", "Result", "Explanation"]. */
  columns: string[];
  rows: (string | number)[][];
}

/** "Predict the output" question — multiple-choice or free text. */
export interface PredictOutputQuestion {
  prompt: string;
  code?: string; // code to reason about
  kind: "multiple-choice" | "text";
  choices?: string[]; // required for multiple-choice
  answer: string; // the correct choice / expected text
  explanation: string; // why that output is correct
  /**
   * Maps a WRONG choice → why a learner who picked it likely went wrong
   * (the specific misconception). Shown when that distractor is chosen.
   */
  distractorExplanations?: Record<string, string>;
}

/** Input/Output thinking scaffold for a challenge. */
export interface InputOutputThinking {
  input: string;
  output: string;
  transformation: string;
  rules?: string[];
  edgeCases?: string[];
}

/** A "fix the broken code" exercise. */
export interface DebugChallenge {
  brokenCode: string;
  expectedOutput: string;
  actualOutput: string;
  bugExplanation: string;
  fixedCode: string;
  lessonLearned: string;
  language?: string;
}

/** A single leveled hint (Hint 1 → Hint 5), revealed progressively. */
export interface ProgressiveHint {
  level: number; // 1-based
  label: string; // e.g. "Understand the goal"
  text: string;
}

/** One approach in "multiple solutions" mode, with tradeoffs. */
export type SolutionApproach =
  | "Beginner"
  | "Built-in"
  | "Manual"
  | "Optimized"
  | string;

export interface SolutionVariant {
  approach: SolutionApproach;
  code: string;
  language?: string;
  explanation?: string;
  tradeoffs?: string;
}

/** One blank in a faded worked example. */
export interface FadedBlank {
  id: string; // matches a {{id}} token in the code
  /** Accepted answer; alternatives separated by "|" (e.g. "slice|concat"). */
  answer: string;
  hint?: string;
}

/**
 * A "fill in the blanks" version of the solution — the scaffolding rung between
 * reading a worked example and writing it from scratch. `code` contains {{id}}
 * placeholders that map to `blanks`.
 */
export interface FadedExample {
  intro?: string;
  code: string;
  blanks: FadedBlank[];
  language?: string;
}

// ---------------------------------------------------------------------------
// Concept visualizer — a step-through model for internals (event loop, call
// stack, queues…). Each frame is a snapshot of labeled "lanes" (e.g. Call
// stack / Microtasks / Console) plus an optional highlighted code line.
// ---------------------------------------------------------------------------

export interface VisualFrame {
  note: string; // what happens at this step
  line?: number; // 1-based line to highlight in `code`
  /** Current contents per lane, keyed by lane label. */
  lanes?: Record<string, string[]>;
}

export interface ConceptVisualization {
  code?: string; // optional code the frames step through
  language?: string;
  /** Lane labels in display order, e.g. ["Call stack","Microtasks","Console"]. */
  lanes: string[];
  frames: VisualFrame[];
}

/** Built-in vs manual vs internal, plus when to reach for which. */
export interface MethodComparison {
  builtIn?: CodeSnippet;
  manual?: CodeSnippet;
  internal?: CodeSnippet;
  whenToUse?: string[]; // guidance bullets ("Use built-in when …")
}

/**
 * One of several short, varied examples of the SAME concept. Seeing an idea a
 * few different ways (different inputs/shapes) before practising is how it
 * actually sticks (the worked-example + variability effect).
 */
export interface WorkedExample {
  title?: string; // e.g. "Sort objects by a field"
  code: string;
  /** One line: what to notice in this variation. */
  note?: string;
  /** Optional result, shown as a comment-style chip. */
  output?: string;
  language?: string;
}

/** Fields shared by lessons and challenges that power the new learning UX. */
export interface LearningAids {
  /** Several small, varied examples of the same concept. */
  examples?: WorkedExample[];
  /** "Imagine checking each item one by one…" — a picture for the mind. */
  mentalModel?: string;
  /** Plain-language explanation for the "Explain like I'm new" toggle. */
  eli5?: string;
  pseudocode?: Pseudocode;
  /** A fill-in-the-blanks warm-up shown before the empty editor. */
  fadedExample?: FadedExample;
  /** A step-through visual model (event loop, call stack, references…). */
  visualization?: ConceptVisualization;
  dryRun?: DryRunStep[];
  variableTrace?: VariableTrace;
  predictOutput?: PredictOutputQuestion[];
  progressiveHints?: ProgressiveHint[];
  multipleSolutions?: SolutionVariant[];
  methodComparison?: MethodComparison;
  /** Tags used by Review mode (e.g. "loops", "immutability", "async"). */
  reviewTags?: string[];
}

/**
 * The "solve it with the built-in first" stage of a two-stage practice.
 * The manual stage reuses the lesson's practiceStarter + practiceTests.
 */
export interface BuiltInPractice {
  /** Starter for the built-in stage (same function name as the manual stage). */
  starter: string;
  /**
   * Substrings the code MUST contain in the built-in stage (e.g. [".filter("])
   * — and which are FORBIDDEN in the manual stage (so it's written by hand).
   */
  mustUse: string[];
  /** Optional separate tests; defaults to the lesson's practiceTests. */
  tests?: TestCase[];
  /** Optional one-line framing shown above the editor. */
  intro?: string;
}

// ---------------------------------------------------------------------------
// Lesson
// ---------------------------------------------------------------------------

/** A short, practice-first lesson. */
export interface Lesson extends LearningAids {
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
  /**
   * Two-stage practice: solve the SAME task first WITH the built-in method,
   * then again BY HAND. When present, the lesson only counts as complete once
   * BOTH stages pass. practiceStarter/practiceTests power the manual stage.
   */
  builtInPractice?: BuiltInPractice;
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

  /** Common mistakes for this concept (lessons; challenges have their own). */
  commonMistakes?: string[];
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
  /** "Review the AI's code" challenge — judge & fix AI-generated code. */
  aiReview?: boolean;
  /** "Write the tests" challenge — design tests that catch bugs. */
  testWriting?: boolean;
}

/** One (deliberately buggy) implementation a test suite should catch. */
export interface BuggyImpl {
  label: string; // short description shown after the run
  code: string; // defines the target function, with a bug
}

/**
 * A "write the tests" exercise. The learner writes test cases; we run them
 * against the correct implementation (all should pass) and several buggy ones
 * (good tests catch each bug). Trains the verification skill AI makes essential.
 */
export interface TestWritingSpec {
  functionName: string; // the function the learner is testing, e.g. "average"
  starterTests?: string; // starter test code (uses test() / eq())
  correctImpl: string; // source defining functionName correctly
  buggyImpls: BuggyImpl[];
}

/**
 * An "AI code review" exercise: the learner judges AI-written code BEFORE
 * running it (the #1 skill when AI writes the first draft), then verifies and
 * fixes it in the editor.
 */
export type AiVerdict = "buggy" | "works-but-flawed" | "correct";

export interface AiReview {
  /** The prompt a teammate gave the AI. */
  prompt: string;
  /** The truth about the AI's output. */
  verdict: AiVerdict;
  /** What's actually wrong (or why it only LOOKS right). */
  issue: string;
  /** The transferable review skill to carry away. */
  reviewLesson: string;
}

/** A standalone logic challenge in the practice bank. */
export interface Challenge extends LearningAids {
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

  // --- structured "input/output thinking" scaffold ---
  inputOutputThinking?: InputOutputThinking;
  /** A richer "real frontend scenario" framing (complements realWorldScenario). */
  frontendScenario?: string;
  /** Related challenge slugs shown at the bottom of the page. */
  relatedChallengeSlugs?: string[];

  // --- debug-this-code challenges (this challenge IS a debug exercise) ---
  debugChallenge?: DebugChallenge;
  /** Marks a challenge as a "fix the broken code" exercise (drives filters). */
  isDebugChallenge?: boolean;

  // --- AI code review challenges ---
  aiReview?: AiReview;
  /** Marks a challenge as a "review the AI's code" exercise. */
  isAiReview?: boolean;

  // --- write-the-tests challenges ---
  testWriting?: TestWritingSpec;
  /** Marks a challenge as a "write tests that catch bugs" exercise. */
  isTestWriting?: boolean;
}

// ---------------------------------------------------------------------------
// Project (unchanged)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Article — a short developer story/essay for the Reading Room. Doubles as
// read-aloud practice material (clear prose, natural sentence rhythm).
// ---------------------------------------------------------------------------

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  minutes: number; // approximate read-aloud time
  level: Difficulty;
  tags: string[];
  /** Paragraphs of body text. The reader splits these into sentences. */
  body: string[];
  /** The engineering lessons to carry away. */
  takeaways: string[];
}

// ---------------------------------------------------------------------------
// DSA topic — teaches a pattern (the "concept") and links to the interview
// problems that drill it. Problems themselves are regular Challenges.
// ---------------------------------------------------------------------------

export interface DsaTopic {
  slug: string;
  name: string;
  icon: string;
  /** The core idea of the pattern, in plain language. */
  idea: string;
  /** How to RECOGNIZE a problem that wants this pattern. */
  whenToUse: string;
  mentalModel: string;
  /** Typical complexity this pattern achieves. */
  complexity: string;
  /** Slugs of the challenges that drill this topic. */
  problemSlugs: string[];
}

// ---------------------------------------------------------------------------
// Learning Roadmap — a single guided sequence (stages → steps) so a learner
// always knows where to start and what to do next. Steps point at existing
// lessons/challenges by slug, or are milestone markers.
// ---------------------------------------------------------------------------

export type PathStepRef =
  | { kind: "lesson"; slug: string }
  | { kind: "challenge"; slug: string }
  | { kind: "milestone"; text: string };

export interface PathStep {
  ref: PathStepRef;
  /** One line: why this step, here. */
  why?: string;
}

export interface PathStage {
  slug: string;
  title: string;
  icon: string;
  /** What you'll be able to do after finishing this stage. */
  goal: string;
  steps: PathStep[];
}

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
