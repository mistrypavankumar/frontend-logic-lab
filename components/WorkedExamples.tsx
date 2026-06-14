import { WorkedExample } from "@/lib/types";
import CodeBlock from "./CodeBlock";

// Several short, varied takes on the SAME concept, stacked so the learner can
// scan the idea from a few angles before trying it themselves. Each card: a
// title, the code, an optional result, and one line of "what to notice".
export default function WorkedExamples({
  examples,
}: {
  examples: WorkedExample[];
}) {
  return (
    <div className="space-y-4">
      {examples.map((ex, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {ex.title && (
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                {i + 1}
              </span>
              {ex.title}
            </p>
          )}
          <CodeBlock code={ex.code} language={ex.language ?? "js"} />
          {ex.output && (
            <p className="mt-2 font-mono text-xs text-slate-500">
              → {ex.output}
            </p>
          )}
          {ex.note && <p className="mt-2 text-sm text-slate-600">{ex.note}</p>}
        </div>
      ))}
    </div>
  );
}
