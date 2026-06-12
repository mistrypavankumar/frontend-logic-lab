"use client";

import { useEffect, useMemo, useState } from "react";
import { allChallenges, challengeTopics, allMethods } from "@/data";
import ChallengeCard from "@/components/ChallengeCard";
import ProgressBar from "@/components/ProgressBar";
import FilterBar, { FilterValue, EMPTY_FILTER } from "@/components/FilterBar";
import { useProgress } from "@/lib/useProgress";

export default function PracticePage() {
  const { isChallengeDone, isBookmarked, state, loaded } = useProgress();
  const [filter, setFilter] = useState<FilterValue>(EMPTY_FILTER);

  const patch = (p: Partial<FilterValue>) => setFilter((f) => ({ ...f, ...p }));

  // Honor ?method=… / ?topic=… deep links (e.g. from Review mode) once on mount.
  // Read from location (not useSearchParams) so the page stays statically rendered.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const method = params.get("method");
    const topic = params.get("topic");
    const next: Partial<FilterValue> = {};
    if (method && allMethods.includes(method)) next.method = method;
    if (topic && challengeTopics.includes(topic)) next.topic = topic;
    if (Object.keys(next).length > 0) setFilter((f) => ({ ...f, ...next }));
  }, []);

  const filtered = useMemo(() => {
    const q = filter.query.toLowerCase();
    return allChallenges.filter((c) => {
      if (filter.level !== "All" && c.difficulty !== filter.level) return false;
      if (filter.topic !== "All" && c.category !== filter.topic) return false;
      if (filter.method !== "All" && !(c.relatedMethods ?? []).includes(filter.method)) return false;
      if (filter.flags.length > 0 && !filter.flags.every((f) => c.flags?.[f])) return false;
      if (filter.status === "completed" && !isChallengeDone(c.id)) return false;
      if (filter.status === "uncompleted" && isChallengeDone(c.id)) return false;
      if (filter.bookmarked && !isBookmarked("challenge", c.id)) return false;
      if (q) {
        const hit =
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          (c.relatedMethods ?? []).some((m) => m.toLowerCase().includes(q));
        if (!hit) return false;
      }
      return true;
    });
  }, [filter, isChallengeDone, isBookmarked]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Practice Challenges</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          {allChallenges.length} problems — implement built-ins from scratch, build
          real frontend logic, and prep for interviews. Filter by topic, method,
          difficulty, or kind.
        </p>
      </header>

      <div className="mb-6 max-w-md">
        <ProgressBar
          value={loaded ? state.completedChallenges.length : 0}
          total={allChallenges.length}
          label="Challenges solved"
        />
      </div>

      <div className="mb-8">
        <FilterBar
          value={filter}
          onChange={patch}
          topics={challengeTopics}
          methods={allMethods}
          resultCount={filtered.length}
          total={allChallenges.length}
          onClear={() => setFilter(EMPTY_FILTER)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No challenges match these filters. Try clearing some.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              done={loaded && isChallengeDone(c.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
