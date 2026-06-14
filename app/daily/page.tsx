"use client";

import { useMemo } from "react";
import Link from "next/link";
import { allChallenges } from "@/data";
import { Challenge } from "@/lib/types";
import { isDue, todayKey } from "@/lib/progress";
import ChallengeCard from "@/components/ChallengeCard";
import ProgressBar from "@/components/ProgressBar";
import { useProgress } from "@/lib/useProgress";

type Reason = "due" | "revisit" | "new";
interface Item {
  challenge: Challenge;
  reason: Reason;
}

const REASON = {
  due: { label: "🔁 Review", cls: "bg-brand-100 text-brand-700" },
  revisit: { label: "⚠️ Revisit", cls: "bg-amber-100 text-amber-700" },
  new: { label: "🆕 New", cls: "bg-green-100 text-green-700" },
} as const;

const SESSION_SIZE = 8;

// Round-robin interleave so consecutive items vary (interleaved > blocked practice).
function interleave<T>(lists: T[][]): T[] {
  const out: T[] = [];
  let added = true;
  for (let i = 0; added; i++) {
    added = false;
    for (const list of lists) {
      if (i < list.length) {
        out.push(list[i]);
        added = true;
      }
    }
  }
  return out;
}

export default function DailyPage() {
  const { state, loaded, isChallengeDone } = useProgress();

  const session = useMemo<Item[]>(() => {
    if (!loaded) return [];
    const today = todayKey();
    const done = (c: Challenge) => isChallengeDone(c.id);

    // 1) Spaced-repetition: items whose review date has arrived.
    const due = allChallenges
      .filter((c) => state.srs[c.id] && isDue(state.srs[c.id], today))
      .sort((a, b) => (state.srs[a.id].due < state.srs[b.id].due ? -1 : 1))
      .slice(0, 4);
    const dueSet = new Set(due.map((c) => c.id));

    // 2) Weak spots: struggled (failed / used hints) and not yet solved.
    const weak = allChallenges
      .filter((c) => {
        const s = state.scores[c.id];
        return s && (s.everFailed || s.usedHints) && !done(c) && !dueSet.has(c.id);
      })
      .slice(0, 2);
    const weakSet = new Set(weak.map((c) => c.id));

    // 3) New: unsolved, untouched — rotated deterministically so today's pick is stable.
    const fresh = allChallenges.filter(
      (c) => !done(c) && !state.srs[c.id] && !weakSet.has(c.id)
    );
    const seed = [...today].reduce((a, ch) => a + ch.charCodeAt(0), 0);
    const start = fresh.length ? seed % fresh.length : 0;
    const rotated = [...fresh.slice(start), ...fresh.slice(0, start)];
    const newCount = Math.max(0, SESSION_SIZE - due.length - weak.length);
    const fresh2 = rotated.slice(0, newCount);

    return interleave([
      due.map((c) => ({ challenge: c, reason: "due" as Reason })),
      weak.map((c) => ({ challenge: c, reason: "revisit" as Reason })),
      fresh2.map((c) => ({ challenge: c, reason: "new" as Reason })),
    ]);
  }, [loaded, state.srs, state.scores, state.completedChallenges, isChallengeDone]);

  const counts = {
    due: session.filter((i) => i.reason === "due").length,
    revisit: session.filter((i) => i.reason === "revisit").length,
    new: session.filter((i) => i.reason === "new").length,
  };
  const doneInSession = session.filter((i) => isChallengeDone(i.challenge.id)).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">☀️ Today's Mix</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          A short, mixed set built for you — reviews that are due, weak spots to revisit,
          and something new. Mixing topics (interleaving) and spacing reviews is the most
          effective way to make things stick. Aim to finish the mix each day.
        </p>
      </header>

      {session.length > 0 && (
        <div className="mb-8 max-w-md">
          <ProgressBar value={doneInSession} total={session.length} label="Today's goal" />
          <p className="mt-2 text-sm text-slate-500">
            🔁 {counts.due} review{counts.due === 1 ? "" : "s"} · ⚠️ {counts.revisit} revisit · 🆕 {counts.new} new
          </p>
        </div>
      )}

      {session.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          {loaded
            ? "🎉 Nothing queued right now. Solve a few challenges and rate your confidence — they'll come back here on the right day."
            : "Loading your mix…"}
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {session.map(({ challenge, reason }) => (
            <div key={challenge.id} className="flex flex-col gap-2">
              <span
                className={
                  "w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold " + REASON[reason].cls
                }
              >
                {REASON[reason].label}
              </span>
              <ChallengeCard challenge={challenge} done={isChallengeDone(challenge.id)} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        <Link href="/revision" className="font-medium text-brand-600 hover:underline">
          See all due reviews →
        </Link>
        <Link href="/practice" className="font-medium text-brand-600 hover:underline">
          Browse all challenges →
        </Link>
      </div>
    </div>
  );
}
