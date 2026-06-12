"use client";

import { useState } from "react";
import { FadedExample as FadedExampleType } from "@/lib/types";

// Faded worked example: the solution with key pieces blanked out. The learner
// fills them in — far lower cognitive load than a blank editor, and it targets
// exactly the parts that carry the idea. Once correct, it nudges them to write
// the whole thing from scratch above.
const accepts = (answer: string, value: string) =>
  answer.split("|").some((a) => a.trim() === value.trim());

const firstAnswer = (answer: string) => answer.split("|")[0].trim();

export default function FadedExample({ data }: { data: FadedExampleType }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  // Split "code with {{id}} tokens" into alternating text / blank-id segments.
  const segments = data.code.split(/\{\{(\w+)\}\}/);
  const blankById = new Map(data.blanks.map((b) => [b.id, b]));

  const allCorrect = data.blanks.every((b) => accepts(b.answer, values[b.id] ?? ""));

  const reveal = () => {
    const next: Record<string, string> = {};
    for (const b of data.blanks) next[b.id] = firstAnswer(b.answer);
    setValues(next);
    setChecked(true);
  };

  return (
    <div className="space-y-3">
      {data.intro && <p className="text-sm text-slate-600">{data.intro}</p>}

      <pre className="overflow-x-auto whitespace-pre rounded-lg border border-slate-700 bg-slate-900 p-4 font-mono text-sm leading-relaxed text-slate-100">
        {segments.map((seg, i) => {
          // Even indices are literal code; odd indices are blank ids.
          if (i % 2 === 0) return <span key={i}>{seg}</span>;
          const blank = blankById.get(seg);
          if (!blank) return <span key={i}>{`{{${seg}}}`}</span>;
          const val = values[seg] ?? "";
          const correct = accepts(blank.answer, val);
          const border = !checked
            ? "border-slate-500 focus:border-brand-400"
            : correct
            ? "border-green-400 text-green-300"
            : "border-rose-400 text-rose-300";
          return (
            <input
              key={i}
              value={val}
              onChange={(e) =>
                setValues((v) => ({ ...v, [seg]: e.target.value }))
              }
              spellCheck={false}
              aria-label={`Blank ${seg}`}
              size={Math.max(firstAnswer(blank.answer).length, 3)}
              className={
                "mx-0.5 inline-block rounded border-b-2 bg-slate-800 px-1 text-center font-mono text-slate-100 outline-none " +
                border
              }
            />
          );
        })}
      </pre>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setChecked(true)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Check blanks
        </button>
        <button
          onClick={reveal}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Reveal answers
        </button>
        {checked && (
          <span
            className={
              "rounded-full px-3 py-1 text-sm font-semibold " +
              (allCorrect ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")
            }
          >
            {allCorrect
              ? "✅ All blanks filled correctly!"
              : `${data.blanks.filter((b) => accepts(b.answer, values[b.id] ?? "")).length}/${data.blanks.length} correct`}
          </span>
        )}
      </div>

      {/* Per-blank hints after a check, for the ones still wrong */}
      {checked && !allCorrect && (
        <ul className="space-y-1">
          {data.blanks
            .filter((b) => !accepts(b.answer, values[b.id] ?? "") && b.hint)
            .map((b) => (
              <li
                key={b.id}
                className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
              >
                <span className="font-semibold">Blank {b.id}: </span>
                {b.hint}
              </li>
            ))}
        </ul>
      )}

      {checked && allCorrect && (
        <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-slate-700">
          Nice — now try writing the whole thing from scratch in the editor above.
        </p>
      )}
    </div>
  );
}
