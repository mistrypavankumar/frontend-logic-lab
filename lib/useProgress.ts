"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  ProgressState,
  BookmarkKind,
  ChallengeScore,
  SrsEntry,
  emptyProgress,
  toggleId,
  pushRecent,
  refKey,
  bumpStreak,
  todayKey,
  mergeScore,
  scheduleReview,
} from "./progress";
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  dispatch,
} from "./progressStore";

/**
 * Central progress hook. Backed by a single tab-wide store
 * (lib/progressStore.ts), so every component that calls useProgress() shares
 * the same state and re-renders together on any change. Cross-tab sync happens
 * via the `storage` event inside the store.
 *
 * `loaded` guards against hydration mismatch: the server / first paint render
 * the neutral empty snapshot, then we flip to the stored values.
 */
export function useProgress() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // True once we're past SSR / first paint (client snapshot != server snapshot).
  const loaded = state !== getServerSnapshot();

  // Single update helper: apply a change, persist, and notify subscribers.
  const update = useCallback(
    (fn: (prev: ProgressState) => ProgressState) => dispatch(fn),
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

  // Record Logic Score signals for a challenge (signals only flip on).
  const recordScore = useCallback(
    (id: string, patch: ChallengeScore) =>
      update((p) => ({
        ...p,
        scores: { ...p.scores, [id]: mergeScore(p.scores[id], patch) },
      })),
    [update]
  );

  // Remember that the learner revealed a challenge's solution.
  const markSolutionViewed = useCallback(
    (id: string) =>
      update((p) =>
        p.viewedSolutions.includes(id)
          ? p
          : { ...p, viewedSolutions: [...p.viewedSolutions, id] }
      ),
    [update]
  );

  // Record a review outcome → reschedule the challenge (spaced repetition).
  const recordReview = useCallback(
    (id: string, outcome: { passed: boolean; confidence?: number }) =>
      update((p) => ({
        ...p,
        srs: { ...p.srs, [id]: scheduleReview(p.srs[id], outcome, todayKey()) },
      })),
    [update]
  );

  // Save the learner's own "why does this work?" explanation.
  const saveExplanation = useCallback(
    (id: string, text: string) =>
      update((p) => ({ ...p, explanations: { ...p.explanations, [id]: text } })),
    [update]
  );

  // --- read selectors ---
  const scoreFor = useCallback(
    (id: string): ChallengeScore => state.scores[id] ?? {},
    [state.scores]
  );
  const isSolutionViewed = useCallback(
    (id: string) => state.viewedSolutions.includes(id),
    [state.viewedSolutions]
  );
  const srsFor = useCallback(
    (id: string): SrsEntry | undefined => state.srs[id],
    [state.srs]
  );
  const explanationFor = useCallback(
    (id: string): string => state.explanations[id] ?? "",
    [state.explanations]
  );
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
    recordScore,
    markSolutionViewed,
    recordReview,
    saveExplanation,
    reset,
    // selectors
    isLessonDone,
    isChallengeDone,
    isBookmarked,
    isInRevision,
    scoreFor,
    isSolutionViewed,
    srsFor,
    explanationFor,
  };
}
