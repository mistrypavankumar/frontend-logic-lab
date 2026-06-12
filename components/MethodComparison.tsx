import { MethodComparison as MethodComparisonType } from "@/lib/types";
import CodeBlock from "./CodeBlock";

// Built-in vs manual vs internal, plus "when to use which". The built-in and
// manual snippets (usually one-liners) sit side by side; the longer internal
// implementation gets a full-width row below — readable inside the narrow
// article column. `min-w-0` lets each CodeBlock scroll instead of overflowing.
export default function MethodComparison({
  data,
}: {
  data: MethodComparisonType;
}) {
  const { builtIn, manual, internal, whenToUse } = data;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        {builtIn && (
          <Column tone="green" label="✅ Built-in" snippet={builtIn} />
        )}
        {manual && <Column tone="blue" label="✋ Manual loop" snippet={manual} />}
      </div>

      {internal && (
        <Column tone="purple" label="🔧 Internal implementation" snippet={internal} />
      )}

      {whenToUse && whenToUse.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            When to use which
          </p>
          <ul className="ml-5 list-disc space-y-1 text-sm text-slate-700">
            {whenToUse.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const tones: Record<string, string> = {
  green: "text-green-700",
  blue: "text-blue-700",
  purple: "text-purple-700",
};

function Column({
  tone,
  label,
  snippet,
}: {
  tone: string;
  label: string;
  snippet: { code: string; language?: string };
}) {
  return (
    <div className="min-w-0">
      <p className={"mb-1 text-xs font-semibold uppercase tracking-wide " + tones[tone]}>
        {label}
      </p>
      <CodeBlock code={snippet.code} language={snippet.language} />
    </div>
  );
}
