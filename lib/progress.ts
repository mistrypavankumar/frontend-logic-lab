// localStorage-backed progress. All access goes through here so the rest of
// the app never touches raw storage, and SSR (window === undefined) is safe.
//
// v2 adds bookmarks, recently-viewed lessons, a revision list, and a daily
// streak. Old v1 payloads ({completedLessons, completedChallenges}) are
// migrated forward automatically on read.

const STORAGE_KEY = "fll-progress-v1"; // key kept stable; we migrate by shape

export type BookmarkKind = "lesson" | "challenge";

export interface StreakState {
  current: number; // consecutive active days
  longest: number;
  lastActiveDate: string | null; // "YYYY-MM-DD" (local)
}

export interface ProgressState {
  version: 2;
  completedLessons: string[];
  completedChallenges: string[];
  /** Namespaced keys: `lesson:<id>` | `challenge:<id>`. */
  bookmarks: string[];
  /** Same namespacing — items the learner flagged to revise. */
  revision: string[];
  /** Lesson ids, most-recent first, capped. */
  recentLessons: string[];
  streak: StreakState;
}

const RECENT_LIMIT = 8;

export function emptyProgress(): ProgressState {
  return {
    version: 2,
    completedLessons: [],
    completedChallenges: [],
    bookmarks: [],
    revision: [],
    recentLessons: [],
    streak: { current: 0, longest: 0, lastActiveDate: null },
  };
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

// --- read / write ----------------------------------------------------------

export function readProgress(): ProgressState {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    // Migrate v1 (no version / missing new fields) → v2 by filling defaults.
    return {
      ...emptyProgress(),
      ...parsed,
      version: 2,
      completedLessons: parsed.completedLessons ?? [],
      completedChallenges: parsed.completedChallenges ?? [],
      bookmarks: parsed.bookmarks ?? [],
      revision: parsed.revision ?? [],
      recentLessons: parsed.recentLessons ?? [],
      streak: parsed.streak ?? emptyProgress().streak,
    };
  } catch {
    return emptyProgress();
  }
}

export function writeProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
