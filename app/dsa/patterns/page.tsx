"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { allDsaTopics, getChallenge } from "@/data";

// Pattern-recognition trainer — the real interview meta-skill. Given a problem
// statement, pick the pattern that solves it. Questions are auto-generated from
// the DSA data: one representative problem per topic, options drawn from the
// topic names, with the topic's "when to use" as the explanation.
interface Q {
  problem: string;
  title: string;
  slug: string;
  answer: string;
  why: string;
  options: string[];
}

export default function PatternTrainerPage() {
  const questions = useMemo<Q[]>(() => {
    const names = allDsaTopics.map((t) => t.name);
    const optionsFor = (correct: string, i: number) => {
      const others = names.filter((n) => n !== correct);
      const r = i % others.length;
      const picked = [...others.slice(r), ...others.slice(0, r)].slice(0, 3);
      const pos = i % 4;
      picked.splice(pos, 0, correct); // vary the correct answer's position
      return picked;
    };
    return allDsaTopics
      .map((t, i) => {
        const c = getChallenge(t.problemSlugs[0]);
        if (!c) return null;
        return {
          problem: c.problem,
          title: c.title,
          slug: c.slug,
          answer: t.name,
          why: t.whenToUse,
          options: optionsFor(t.name, i),
        };
      })
      .filter((q): q is Q => q !== null);
  }, []);

  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);

  const q = questions[i];
  const done = answered >= questions.length;

  const choose = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    setAnswered((n) => n + 1);
    if (opt === q.answer) setScore((s) => s + 1);
  };
  const next = () => {
    setPicked(null);
    setI((n) => n + 1);
  };
  const restart = () => {
    setI(0);
    setPicked(null);
    setScore(0);
    setAnswered(0);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/dsa" className="text-sm text-brand-600 hover:underline">
        ← DSA
      </Link>
      <header className="mt-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-900">🎯 Which Pattern?</h1>
        <p className="mt-2 text-slate-600">
          The skill interviews really test isn't coding — it's recognizing which pattern a
          problem wants. Read each prompt and pick the approach.
        </p>
      </header>

      <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
        <span>Question {Math.min(i + 1, questions.length)} of {questions.length}</span>
        <span>Score: {score}/{answered}</span>
      </div>

      {done ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-2xl font-bold text-brand-600">{score} / {questions.length}</p>
          <p className="mt-2 text-slate-600">
            {score === questions.length
              ? "Perfect — you can name the pattern on sight."
              : "Replay to drill the ones you missed. Pattern recognition is pure reps."}
          </p>
          <button
            onClick={restart}
            className="mt-4 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            ↺ Restart
          </button>
        </div>
      ) : (
        q && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">The problem</p>
            <p className="mt-1 leading-relaxed text-slate-800">{q.problem}</p>

            <p className="mt-5 mb-2 text-sm font-medium text-slate-700">Which pattern fits best?</p>
            <div className="space-y-2">
              {q.options.map((opt) => {
                const isAnswer = opt === q.answer;
                const isPicked = picked === opt;
                const cls = !picked
                  ? "border-slate-200 text-slate-700 hover:bg-slate-50"
                  : isAnswer
                  ? "border-green-400 bg-green-50 text-green-800"
                  : isPicked
                  ? "border-rose-300 bg-rose-50 text-rose-700"
                  : "border-slate-200 text-slate-400";
                return (
                  <button
                    key={opt}
                    onClick={() => choose(opt)}
                    disabled={!!picked}
                    className={"flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition " + cls}
                  >
                    <span>{picked && isAnswer ? "✓" : "•"}</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {picked && (
              <div className="mt-4 space-y-3">
                <p
                  className={
                    "rounded-lg px-3 py-2 text-sm font-semibold " +
                    (picked === q.answer ? "bg-green-100 text-green-800" : "bg-rose-100 text-rose-700")
                  }
                >
                  {picked === q.answer ? "✅ Correct!" : `❌ It's ${q.answer}.`}
                </p>
                <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-slate-700">
                  <span className="font-semibold text-brand-700">Why {q.answer}: </span>
                  {q.why}
                </p>
                <div className="flex items-center justify-between">
                  <Link href={`/practice/${q.slug}`} className="text-sm font-medium text-brand-600 hover:underline">
                    Solve it: {q.title} →
                  </Link>
                  <button
                    onClick={next}
                    className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                  >
                    {i + 1 >= questions.length ? "See score" : "Next →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
