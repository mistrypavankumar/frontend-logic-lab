import { Pseudocode as PseudocodeType } from "@/lib/types";
import CodeBlock from "./CodeBlock";

// "Think before you code." Walks the learner from understanding the problem to
// plain-English steps, then (optionally) the same steps as JavaScript.
export default function Pseudocode({ data }: { data: PseudocodeType }) {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="1 · Understand" value={data.understand} />
        <Field label="2 · Input" value={data.input} mono />
        <Field label="3 · Output" value={data.output} mono />
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          4 · Plain-English steps
        </p>
        <ol className="ml-5 list-decimal space-y-1 text-sm text-slate-700">
          {data.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>

      {data.toCode && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            5 · Convert to JavaScript
          </p>
          <CodeBlock code={data.toCode} language="js" />
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className={"mt-1 text-sm text-slate-700 " + (mono ? "font-mono" : "")}>
        {value}
      </p>
    </div>
  );
}
