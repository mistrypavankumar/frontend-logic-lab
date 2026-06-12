"use client";

import { useState } from "react";
import { PredictOutputQuestion } from "@/lib/types";
import CodeBlock from "./CodeBlock";

// Makes the learner commit to an answer BEFORE the solution is revealed.
// Supports multiple-choice and free-text. Reports correctness up via onResult
// so the page can feed the Logic Score.
export default function PredictOutput({
  questions,
  onResult,
}: {
  questions: PredictOutputQuestion[];
  onResult?: (allCorrect: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <PredictOne key={i} q={q} onResult={onResult} />
      ))}
    </div>
  );
}

const norm = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

function PredictOne({
  q,
  onResult,
}: {
  q: PredictOutputQuestion;
  onResult?: (correct: boolean) => void;
}) {
  const [choice, setChoice] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const guess = q.kind === "multiple-choice" ? choice ?? "" : text;
  const correct = norm(guess) === norm(q.answer);

  // Targeted "why you went wrong" note for the chosen distractor, if any.
  const distractorNote =
    !correct && q.distractorExplanations
      ? q.distractorExplanations[guess] ??
        Object.entries(q.distractorExplanations).find(
          ([k]) => norm(k) === norm(guess)
        )?.[1]
      : undefined;

  const submit = () => {
    setSubmitted(true);
    onResult?.(correct);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="font-medium text-slate-800">🤔 {q.prompt}</p>

      {q.code && (
        <div className="mt-3">
          <CodeBlock code={q.code} language="js" />
        </div>
      )}

      {q.kind === "multiple-choice" ? (
        <div className="mt-3 space-y-2">
          {(q.choices ?? []).map((c) => {
            const isPicked = choice === c;
            const isAnswer = norm(c) === norm(q.answer);
            const state = submitted
              ? isAnswer
                ? "border-green-400 bg-green-50 text-green-800"
                : isPicked
                ? "border-rose-300 bg-rose-50 text-rose-700"
                : "border-slate-200 text-slate-600"
              : isPicked
              ? "border-brand-400 bg-brand-50 text-brand-800"
              : "border-slate-200 text-slate-700 hover:bg-slate-50";
            return (
              <button
                key={c}
                disabled={submitted}
                onClick={() => setChoice(c)}
                className={"flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition " + state}
              >
                <span className="font-mono text-xs">{isAnswer && submitted ? "✓" : "•"}</span>
                <code className="font-mono">{c}</code>
              </button>
            );
          })}
        </div>
      ) : (
        <input
          type="text"
          value={text}
          disabled={submitted}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type the output you expect…"
          className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      )}

      {!submitted ? (
        <button
          onClick={submit}
          disabled={guess.trim() === ""}
          className="mt-3 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
        >
          Check my prediction
        </button>
      ) : (
        <div className="mt-3 space-y-2">
          <p
            className={
              "rounded-lg px-3 py-2 text-sm font-semibold " +
              (correct ? "bg-green-100 text-green-800" : "bg-rose-100 text-rose-700")
            }
          >
            {correct ? "✅ Correct!" : "❌ Not quite."}{" "}
            <span className="font-normal">
              Answer: <code className="font-mono">{q.answer}</code>
            </span>
          </p>
          {distractorNote && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <span className="font-semibold">The trap you hit: </span>
              {distractorNote}
            </p>
          )}
          <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-slate-700">
            <span className="font-semibold text-brand-700">Why: </span>
            {q.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
