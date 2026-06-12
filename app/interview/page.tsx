"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { allChallenges } from "@/data";
import CodeBlock from "@/components/CodeBlock";
import DifficultyBadge from "@/components/DifficultyBadge";

export default function InterviewPage() {
  const questions = useMemo(
    () => allChallenges.filter((c) => c.flags?.interview),
    []
  );
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);

  if (questions.length === 0) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-slate-500">No interview questions yet.</div>;
  }

  const q = questions[i];
  const go = (next: number) => {
    setI((next + questions.length) % questions.length);
    setRevealed(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">🎤 Interview Mode</h1>
        <p className="mt-2 text-slate-600">
          Practice out loud: read the prompt, explain your approach, then reveal a
          model answer. {questions.length} questions.
        </p>
      </header>

      <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
        <span>Question {i + 1} of {questions.length}</span>
        <div className="flex gap-2">
          <button onClick={() => go(i - 1)} className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100">← Prev</button>
          <button onClick={() => go(i + 1)} className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100">Next →</button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{q.category}</span>
          <DifficultyBadge level={q.difficulty} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{q.title}</h2>
        <p className="mt-2 leading-relaxed text-slate-700">{q.problem}</p>

        <div className="mt-4">
          <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Example</p>
          <CodeBlock code={`${q.example.input}\n// → ${q.example.output}`} language="js" />
        </div>

        {q.commonMistakes && q.commonMistakes.length > 0 && (
          <p className="mt-3 text-sm text-slate-500">
            💭 Think about: {q.commonMistakes.join("; ")}
          </p>
        )}

        <div className="mt-5">
          {revealed ? (
            <div className="space-y-3">
              <CodeBlock code={q.internalImplementation?.code ?? q.solution} language="js" />
              <p className="text-sm text-slate-600">{q.explanation}</p>
              {(q.timeComplexity || q.spaceComplexity) && (
                <p className="text-sm text-slate-500">
                  Complexity — time: <code className="font-mono">{q.timeComplexity ?? "—"}</code>, space:{" "}
                  <code className="font-mono">{q.spaceComplexity ?? "—"}</code>
                </p>
              )}
              <Link href={`/practice/${q.slug}`} className="inline-block text-sm font-medium text-brand-600 hover:underline">
                Open full challenge →
              </Link>
            </div>
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Reveal model answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
