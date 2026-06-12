"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ProgressState,
  BookmarkKind,
  emptyProgress,
  readProgress,
  writeProgress,
  toggleId,
  pushRecent,
  refKey,
  bumpStreak,
  todayKey,
} from "./progress";

/**
 * Central progress hook. Reads localStorage on mount, persists every change,
 * and stays in sync across tabs via the `storage` event.
 *
 * `loaded` guards against hydration mismatch: render neutral (empty) state on
 * the server / first paint, then flip to the stored values.
 */
export function useProgress() {
  const [state, setState] = useState<ProgressState>(emptyProgress);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setState(readProgress());
    setLoaded(true);
    const onStorage = () => setState(readProgress());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Single update helper: apply a change, persist, and return the next state.
  const update = useCallback(
    (fn: (prev: ProgressState) => ProgressState) => {
      setState((prev) => {
        const next = fn(prev);
        writeProgress(next);
        return next;
      });
    },
    []
  );

  // Completing something also counts as activity for the streak.
  const toggleLesson = useCallback(
    (id: string) =>
      update((p) => {
        const completedLessons = toggleId(p.completedLessons, id);
        const justCompleted = completedLessons.length > p.completedLessons.length;
        return {
          ...p,
          completedLessons,
          streak: justCompleted ? bumpStreak(p.streak, todayKey()) : p.streak,
        };
      }),
    [update]
  );

  const toggleChallenge = useCallback(
    (id: string) =>
      update((p) => {
        const completedChallenges = toggleId(p.completedChallenges, id);
        const justCompleted =
          completedChallenges.length > p.completedChallenges.length;
        return {
          ...p,
          completedChallenges,
          streak: justCompleted ? bumpStreak(p.streak, todayKey()) : p.streak,
        };
      }),
    [update]
  );

  const toggleBookmark = useCallback(
    (kind: BookmarkKind, id: string) =>
      update((p) => ({ ...p, bookmarks: toggleId(p.bookmarks, refKey(kind, id)) })),
    [update]
  );

  const toggleRevision = useCallback(
    (kind: BookmarkKind, id: string) =>
      update((p) => ({ ...p, revision: toggleId(p.revision, refKey(kind, id)) })),
    [update]
  );

  const recordLessonView = useCallback(
    (id: string) =>
      update((p) => ({ ...p, recentLessons: pushRecent(p.recentLessons, id) })),
    [update]
  );

  const reset = useCallback(() => update(() => emptyProgress()), [update]);

  // --- read selectors ---
  const isLessonDone = useCallback(
    (id: string) => state.completedLessons.includes(id),
    [state.completedLessons]
  );
  const isChallengeDone = useCallback(
    (id: string) => state.completedChallenges.includes(id),
    [state.completedChallenges]
  );
  const isBookmarked = useCallback(
    (kind: BookmarkKind, id: string) =>
      state.bookmarks.includes(refKey(kind, id)),
    [state.bookmarks]
  );
  const isInRevision = useCallback(
    (kind: BookmarkKind, id: string) =>
      state.revision.includes(refKey(kind, id)),
    [state.revision]
  );

  return {
    loaded,
    state,
    // toggles
    toggleLesson,
    toggleChallenge,
    toggleBookmark,
    toggleRevision,
    recordLessonView,
    reset,
    // selectors
    isLessonDone,
    isChallengeDone,
    isBookmarked,
    isInRevision,
  };
}
