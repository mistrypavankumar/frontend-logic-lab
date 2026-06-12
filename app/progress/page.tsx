"use client";

import Link from "next/link";
import { orderedLessons, allChallenges } from "@/data";
import ProgressBar from "@/components/ProgressBar";
import StreakWidget from "@/components/StreakWidget";
import RecentlyViewed from "@/components/RecentlyViewed";
import ConceptMastery from "@/components/ConceptMastery";
import { useProgress } from "@/lib/useProgress";
import { totalLogicScore, isDue, todayKey } from "@/lib/progress";

export default function ProgressPage() {
  const { state, loaded, isLessonDone, isChallengeDone, reset } = useProgress();

  const lessonsDone = loaded ? state.completedLessons.length : 0;
  const challengesDone = loaded ? state.completedChallenges.length : 0;
  const bookmarkCount = loaded ? state.bookmarks.length : 0;
  const revisionCount = loaded ? state.revision.length : 0;
  const logicScore = loaded ? totalLogicScore(state.scores) : 0;
  const solvedClean = loaded
    ? Object.values(state.scores).filter((s) => s.solvedWithoutSolution).length
    : 0;
  const dueCount = loaded
    ? Object.values(state.srs).filter((e) => isDue(e, todayKey())).length
    : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Your Progress</h1>
        <p className="mt-2 text-slate-600">
          Saved in your browser with localStorage — no account needed.
        </p>
      </header>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StreakWidget />
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Link href="/bookmarks" className="flex-1 text-sm hover:text-brand-700">
            <div className="text-2xl font-extrabold text-amber-500">{bookmarkCount}</div>
            <div className="text-slate-500">★ Bookmarks</div>
          </Link>
          <Link href="/revision" className="flex-1 text-sm hover:text-brand-700">
            <div className="text-2xl font-extrabold text-indigo-500">{revisionCount}</div>
            <div className="text-slate-500">↻ In revision</div>
          </Link>
        </div>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <StatCard label="Lessons done" value={lessonsDone} total={orderedLessons.length} />
        <StatCard label="Challenges solved" value={challengesDone} total={allChallenges.length} />
        <StatCard label="Overall" value={lessonsDone + challengesDone} total={orderedLessons.length + allChallenges.length} />
      </div>

      {/* Logic Score — rewards HOW you solved, not just that you did. */}
      <div className="mb-10 flex flex-wrap items-center gap-6 rounded-xl border border-brand-200 bg-brand-50 p-6">
        <div>
          <div className="text-3xl font-extrabold text-brand-600">🏅 {logicScore}</div>
          <div className="text-sm text-slate-500">Total Logic Score</div>
        </div>
        <div className="text-sm text-slate-600">
          <p>
            <span className="font-semibold text-slate-800">{solvedClean}</span> solved without
            looking at the solution.
          </p>
          <p className="mt-1 text-slate-500">
            Earn points by predicting output, passing edge cases, and solving from scratch.
          </p>
        </div>
        <Link
          href="/revision"
          className="ml-auto rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {dueCount > 0 ? `Review ${dueCount} due →` : "Review weak spots →"}
        </Link>
      </div>

      <div className="mb-10 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ProgressBar value={lessonsDone} total={orderedLessons.length} label="Lessons" />
        <ProgressBar value={challengesDone} total={allChallenges.length} label="Challenges" />
      </div>

      {loaded && (
        <ConceptMastery
          completedChallenges={state.completedChallenges}
          scores={state.scores}
        />
      )}

      <div className="mb-10">
        <RecentlyViewed />
      </div>

      <Checklist title="Lessons">
        {orderedLessons.map((l) => (
          <ChecklistRow key={l.id} href={`/learn/${l.slug}`} label={l.title} done={loaded && isLessonDone(l.id)} />
        ))}
      </Checklist>

      <Checklist title="Challenges">
        {allChallenges.map((c) => (
          <ChecklistRow key={c.id} href={`/practice/${c.slug}`} label={c.title} done={loaded && isChallengeDone(c.id)} />
        ))}
      </Checklist>

      <div className="mt-10">
        <button
          onClick={() => {
            if (confirm("Reset all progress? This cannot be undone.")) reset();
          }}
          className="rounded-lg border border-rose-300 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
        >
          Reset all progress
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, total }: { label: string; value: number; total: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
      <div className="text-3xl font-extrabold text-brand-600">
        {value}
        <span className="text-lg font-semibold text-slate-400">/{total}</span>
      </div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}

function Checklist({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-semibold text-slate-800">{title}</h2>
      <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {children}
      </ul>
    </section>
  );
}

function ChecklistRow({ href, label, done }: { href: string; label: string; done: boolean }) {
  return (
    <li>
      <Link href={href} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-50">
        <span className={done ? "text-slate-400 line-through" : "text-slate-700"}>{label}</span>
        <span
          className={
            "flex h-5 w-5 items-center justify-center rounded-full text-xs " +
            (done ? "bg-green-600 text-white" : "border border-slate-300 text-transparent")
          }
        >
          ✓
        </span>
      </Link>
    </li>
  );
}
