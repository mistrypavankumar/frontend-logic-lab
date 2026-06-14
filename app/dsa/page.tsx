"use client";

import { useMemo, useState } from "react";
import { allDsaTopics, getChallenge } from "@/data";
import { Challenge, Difficulty, DIFFICULTIES } from "@/lib/types";
import ChallengeCard from "@/components/ChallengeCard";
import ProgressBar from "@/components/ProgressBar";
import { useProgress } from "@/lib/useProgress";

export default function DsaPage() {
  const { isChallengeDone, loaded } = useProgress();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<"All" | Difficulty>("All");

  // Resolve every topic's problems once.
  const topics = useMemo(
    () =>
      allDsaTopics.map((t) => ({
        topic: t,
        problems: t.problemSlugs
          .map((s) => getChallenge(s))
          .filter((c): c is Challenge => !!c),
      })),
    []
  );

  const allProblems = topics.flatMap((t) => t.problems);
  const solved = loaded
    ? allProblems.filter((c) => isChallengeDone(c.id)).length
    : 0;

  // Only show difficulty chips that actually exist in the DSA set.
  const presentLevels = DIFFICULTIES.filter((d) =>
    allProblems.some((c) => c.difficulty === d)
  );

  // Apply search + level filters per problem.
  const q = query.trim().toLowerCase();
  const matches = (c: Challenge) => {
    if (level !== "All" && c.difficulty !== level) return false;
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
    );
  };

  const filteredTopics = topics
    .map((t) => ({ ...t, problems: t.problems.filter(matches) }))
    .filter((t) => t.problems.length > 0);

  const shownCount = filteredTopics.reduce((n, t) => n + t.problems.length, 0);
  const filtering = q !== "" || level !== "All";

  const chipCls = (active: boolean) =>
    "rounded-full px-3 py-1 text-sm font-medium transition " +
    (active
      ? "bg-brand-600 text-white"
      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">🧠 DSA for Interviews</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          The patterns MNCs actually ask — learn the idea, see when to reach for it,
          then solve the classic problems in the live editor. Every problem is framed
          with a real frontend use, so the pattern sticks as a tool, not a trick.
        </p>
      </header>

      <div className="mb-6 max-w-md">
        <ProgressBar value={solved} total={allProblems.length} label="DSA problems solved" />
      </div>

      {/* Search + difficulty filter */}
      <div className="mb-10 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search problems, patterns, tags…"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:max-w-xs"
          />
          <div className="flex flex-wrap gap-2">
            {(["All", ...presentLevels] as ("All" | Difficulty)[]).map((d) => (
              <button key={d} onClick={() => setLevel(d)} className={chipCls(level === d)}>
                {d}
              </button>
            ))}
          </div>
          <span className="text-sm text-slate-500 sm:ml-auto">
            Showing {shownCount} of {allProblems.length}
          </span>
        </div>
        {filtering && (
          <button
            onClick={() => {
              setQuery("");
              setLevel("All");
            }}
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredTopics.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No problems match these filters. Try clearing them.
        </p>
      ) : (
        <div className="space-y-12">
          {filteredTopics.map(({ topic, problems }) => (
            <section key={topic.slug}>
              <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
                <span aria-hidden>{topic.icon}</span>
                {topic.name}
                <span className="ml-1 text-sm font-normal text-slate-400">
                  {problems.length} problem{problems.length === 1 ? "" : "s"}
                </span>
              </h2>

              {/* Concept card — learn the pattern. Hidden while searching to keep results tight. */}
              {!filtering && (
                <div className="mt-3 grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
                  <Field label="The idea" value={topic.idea} />
                  <Field label="When to reach for it" value={topic.whenToUse} />
                  <Field label="Picture this" value={topic.mentalModel} tone="text-violet-900 bg-violet-50" />
                  <Field label="Typical complexity" value={topic.complexity} mono />
                </div>
              )}

              {/* Problems */}
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {problems.map((c) => (
                  <ChallengeCard key={c.id} challenge={c} done={loaded && isChallengeDone(c.id)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  mono,
  tone,
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: string;
}) {
  return (
    <div className={"rounded-lg p-3 " + (tone ?? "bg-slate-50 text-slate-700")}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={"mt-1 text-sm " + (mono ? "font-mono" : "")}>{value}</p>
    </div>
  );
}
