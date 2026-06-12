"use client";

import Link from "next/link";
import { useMemo } from "react";
import { allChallenges } from "@/data";
import { Challenge } from "@/lib/types";
import SavedItemsList from "@/components/SavedItemsList";
import ChallengeCard from "@/components/ChallengeCard";
import { useProgress } from "@/lib/useProgress";
import { isDue, todayKey } from "@/lib/progress";

export default function RevisionPage() {
  const { state, loaded, toggleRevision, isChallengeDone } = useProgress();

  // Spaced-repetition queue: challenges whose next review date has arrived,
  // soonest-due first. This is the highest-value thing to do today.
  const dueForReview = useMemo<Challenge[]>(() => {
    if (!loaded) return [];
    const today = todayKey();
    return allChallenges
      .filter((c) => {
        const e = state.srs[c.id];
        return e && isDue(e, today);
      })
      .sort((a, b) => (state.srs[a.id]!.due < state.srs[b.id]!.due ? -1 : 1));
  }, [loaded, state.srs]);

  // Challenges the learner struggled with: failed a run at some point, or
  // leaned on hints. These are the highest-value things to review.
  const struggled = useMemo<Challenge[]>(() => {
    if (!loaded) return [];
    return allChallenges.filter((c) => {
      const s = state.scores[c.id];
      return s && (s.everFailed || s.usedHints);
    });
  }, [loaded, state.scores]);

  // Methods + topics those struggles cluster around (reviewTags / relatedMethods).
  const weakTopics = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of struggled) {
      for (const t of [...(c.reviewTags ?? []), ...(c.relatedMethods ?? [])]) {
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [struggled]);

  // Common mistakes worth re-reading, pulled from the struggled set.
  const mistakes = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const c of struggled) {
      for (const m of c.commonMistakes ?? []) {
        if (!seen.has(m)) {
          seen.add(m);
          out.push(m);
        }
      }
    }
    return out.slice(0, 12);
  }, [struggled]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">↻ Review Mode</h1>
        <p className="mt-2 text-slate-600">
          Revisit what's still shaky: challenges you flagged, ones you struggled
          with, the methods behind them, and the mistakes to avoid.
        </p>
      </header>

      {/* Due for review (spaced repetition) */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-slate-800">
          🔁 Due for review
          {dueForReview.length > 0 && (
            <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-sm font-semibold text-brand-700">
              {dueForReview.length}
            </span>
          )}
        </h2>
        {dueForReview.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            Nothing due right now. Solve a challenge and rate your confidence — it'll come
            back here on the right day to keep it fresh.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {dueForReview.map((c) => (
              <ChallengeCard key={c.id} challenge={c} done={isChallengeDone(c.id)} />
            ))}
          </div>
        )}
      </section>

      {/* Flagged for revision */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Flagged for revision</h2>
        <SavedItemsList
          keys={loaded ? state.revision : []}
          onRemove={(kind, id) => toggleRevision(kind, id)}
          removeLabel="Done revising"
          emptyText='Nothing flagged yet. Use "Add to revision" on any lesson or challenge.'
        />
      </section>

      {/* Struggled with (failed / used hints) */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-slate-800">
          Challenges you struggled with
          {struggled.length > 0 && (
            <span className="ml-2 text-sm font-normal text-slate-400">{struggled.length}</span>
          )}
        </h2>
        {struggled.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            Nothing here yet. Challenges where you fail a run or open hints show up here automatically.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {struggled.map((c) => (
              <ChallengeCard key={c.id} challenge={c} done={isChallengeDone(c.id)} />
            ))}
          </div>
        )}
      </section>

      {/* Weak topics / methods */}
      {weakTopics.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Methods to drill</h2>
          <div className="flex flex-wrap gap-2">
            {weakTopics.map(([topic, n]) => (
              <Link
                key={topic}
                href={`/practice?method=${encodeURIComponent(topic)}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:border-brand-300 hover:text-brand-700"
              >
                {topic} <span className="text-slate-400">×{n}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Common mistakes to re-read */}
      {mistakes.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Mistakes to watch for</h2>
          <ul className="space-y-2">
            {mistakes.map((m, i) => (
              <li
                key={i}
                className="flex gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-800"
              >
                <span aria-hidden className="shrink-0">⚠️</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
