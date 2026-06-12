// localStorage-backed progress. All access goes through here so the rest of
// the app never touches raw storage, and SSR (window === undefined) is safe.
//
// v2 adds bookmarks, recently-viewed lessons, a revision list, and a daily
// streak. v3 adds a per-challenge Logic Score (how a challenge was solved) and
// a record of which solutions were revealed, powering Review mode. Old payloads
// are migrated forward automatically on read.

const STORAGE_KEY = "fll-progress-v1"; // key kept stable; we migrate by shape

export type BookmarkKind = "lesson" | "challenge";

export interface StreakState {
  current: number; // consecutive active days
  longest: number;
  lastActiveDate: string | null; // "YYYY-MM-DD" (local)
}

/** How a challenge was solved — the inputs to the Logic Score. */
export interface ChallengeScore {
  solvedWithoutSolution?: boolean; // completed before revealing the solution
  usedHints?: boolean;
  passedEdgeCases?: boolean; // hidden/edge tests passed
  solvedManually?: boolean; // ran the manual/loop approach
  solvedBuiltIn?: boolean; // ran a built-in approach
  predictedCorrectly?: boolean; // got the Predict Output question right
  everFailed?: boolean; // ran and failed at least once (→ Review mode)
}

/** Spaced-repetition schedule for one challenge (SM-2-lite). */
export interface SrsEntry {
  due: string; // "YYYY-MM-DD" — when it should next be reviewed
  intervalDays: number; // gap until the next review
  ease: number; // multiplier that grows/shrinks with performance
  reps: number; // consecutive successful reviews
}

export interface ProgressState {
  version: 4;
  completedLessons: string[];
  completedChallenges: string[];
  /** Namespaced keys: `lesson:<id>` | `challenge:<id>`. */
  bookmarks: string[];
  /** Same namespacing — items the learner flagged to revise. */
  revision: string[];
  /** Lesson ids, most-recent first, capped. */
  recentLessons: string[];
  streak: StreakState;
  /** Per-challenge logic score signals, keyed by challenge id. */
  scores: Record<string, ChallengeScore>;
  /** Challenge ids whose solution the learner revealed. */
  viewedSolutions: string[];
  /** Per-challenge spaced-repetition schedule, keyed by challenge id. */
  srs: Record<string, SrsEntry>;
  /** The learner's own "why does this work?" notes, keyed by challenge id. */
  explanations: Record<string, string>;
}

const RECENT_LIMIT = 8;

export function emptyProgress(): ProgressState {
  return {
    version: 4,
    completedLessons: [],
    completedChallenges: [],
    bookmarks: [],
    revision: [],
    recentLessons: [],
    streak: { current: 0, longest: 0, lastActiveDate: null },
    scores: {},
    viewedSolutions: [],
    srs: {},
    explanations: {},
  };
}

// --- Logic Score ----------------------------------------------------------

/** Each signal is worth points; a challenge tops out at LOGIC_SCORE_MAX. */
export const LOGIC_SCORE_RULES: { key: keyof ChallengeScore; label: string; points: number }[] = [
  { key: "solvedWithoutSolution", label: "Solved without the solution", points: 3 },
  { key: "passedEdgeCases", label: "Passed edge cases", points: 2 },
  { key: "predictedCorrectly", label: "Predicted the output", points: 2 },
  { key: "solvedManually", label: "Solved manually (from scratch)", points: 2 },
  { key: "solvedBuiltIn", label: "Solved with a built-in", points: 1 },
];

export const LOGIC_SCORE_MAX = LOGIC_SCORE_RULES.reduce((s, r) => s + r.points, 0);

/** Points for one challenge (a hint used halves the "no solution" bonus feel). */
export function logicPoints(score: ChallengeScore | undefined): number {
  if (!score) return 0;
  let pts = LOGIC_SCORE_RULES.reduce(
    (sum, r) => sum + (score[r.key] ? r.points : 0),
    0
  );
  if (score.usedHints && pts > 0) pts = Math.max(0, pts - 1); // small hint penalty
  return pts;
}

/** Total Logic Score across all attempted challenges. */
export function totalLogicScore(scores: Record<string, ChallengeScore>): number {
  return Object.values(scores).reduce((sum, s) => sum + logicPoints(s), 0);
}

/** Merge new signals into a challenge's score (never clobbers a `true`). */
export function mergeScore(
  prev: ChallengeScore | undefined,
  patch: ChallengeScore
): ChallengeScore {
  const base = prev ?? {};
  const next: ChallengeScore = { ...base };
  (Object.keys(patch) as (keyof ChallengeScore)[]).forEach((k) => {
    if (patch[k]) next[k] = true; // signals only ever flip on
  });
  return next;
}

/** Build the namespaced key used in bookmarks/revision arrays. */
export function refKey(kind: BookmarkKind, id: string): string {
  return `${kind}:${id}`;
}

// --- date helpers (local time; runs in the browser) -----------------------

export function todayKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dayDiff(fromKey: string, toKey: string): number {
  const [fy, fm, fd] = fromKey.split("-").map(Number);
  const [ty, tm, td] = toKey.split("-").map(Number);
  const from = Date.UTC(fy, fm - 1, fd);
  const to = Date.UTC(ty, tm - 1, td);
  return Math.round((to - from) / 86_400_000);
}

/** Pure streak transition for "the learner did something today". */
export function bumpStreak(streak: StreakState, today: string): StreakState {
  if (streak.lastActiveDate === today) return streak; // already counted today
  const gap = streak.lastActiveDate
    ? dayDiff(streak.lastActiveDate, today)
    : Infinity;
  const current = gap === 1 ? streak.current + 1 : 1; // consecutive vs reset
  return {
    current,
    longest: Math.max(streak.longest, current),
    lastActiveDate: today,
  };
}

// --- spaced repetition (SM-2-lite) -----------------------------------------

/** Add `days` to a "YYYY-MM-DD" key and return the new key (UTC math). */
export function addDays(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d) + days * 86_400_000;
  const dt = new Date(t);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

const DEFAULT_EASE = 2.3;
const MIN_EASE = 1.3;

/**
 * Pure schedule transition. A pass lengthens the interval (more for higher
 * confidence); a miss resets it to tomorrow and lowers ease. Fixed early steps
 * (1d → 3d → 7d) then interval × ease.
 */
export function scheduleReview(
  prev: SrsEntry | undefined,
  outcome: { passed: boolean; confidence?: number },
  today: string
): SrsEntry {
  let ease = prev?.ease ?? DEFAULT_EASE;
  let reps = prev?.reps ?? 0;
  let interval: number;

  if (!outcome.passed) {
    reps = 0;
    ease = Math.max(MIN_EASE, ease - 0.2);
    interval = 1;
  } else {
    reps += 1;
    if (outcome.confidence != null) {
      if (outcome.confidence <= 2) ease = Math.max(MIN_EASE, ease - 0.2);
      else if (outcome.confidence >= 4) ease += 0.1;
    }
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 3;
    else if (reps === 3) interval = 7;
    else interval = Math.round((prev?.intervalDays ?? 7) * ease);
  }

  return { due: addDays(today, interval), intervalDays: interval, ease, reps };
}

/** Is this item due for review on/by `today`? */
export function isDue(entry: SrsEntry, today: string): boolean {
  return dayDiff(entry.due, today) >= 0; // due <= today
}

// --- read / write ----------------------------------------------------------

export function readProgress(): ProgressState {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    // Migrate older payloads (v1–v3) → v4 by filling any missing fields.
    return {
      ...emptyProgress(),
      ...parsed,
      version: 4,
      completedLessons: parsed.completedLessons ?? [],
      completedChallenges: parsed.completedChallenges ?? [],
      bookmarks: parsed.bookmarks ?? [],
      revision: parsed.revision ?? [],
      recentLessons: parsed.recentLessons ?? [],
      streak: parsed.streak ?? emptyProgress().streak,
      scores: parsed.scores ?? {},
      viewedSolutions: parsed.viewedSolutions ?? [],
      srs: parsed.srs ?? {},
      explanations: parsed.explanations ?? {},
    };
  } catch {
    return emptyProgress();
  }
}

export function writeProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded / Safari private mode — keep in-memory state, skip persist.
  }
}

// --- pure list helpers -----------------------------------------------------

export function toggleId(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

/** Move id to the front, dedupe, and cap the length. */
export function pushRecent(list: string[], id: string): string[] {
  const next = [id, ...list.filter((x) => x !== id)];
  return next.slice(0, RECENT_LIMIT);
}
