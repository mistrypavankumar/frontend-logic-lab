import { InputOutputThinking as IOThinking } from "@/lib/types";

// Forces "think in transformations": what goes in, what must come out, the
// transformation between them, the rules, and the edge cases — before any code.
export default function InputOutputThinking({ data }: { data: IOThinking }) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <Box label="Input" value={data.input} tone="bg-sky-50 text-sky-900" />
        <Box label="Transformation" value={data.transformation} tone="bg-amber-50 text-amber-900" />
        <Box label="Output" value={data.output} tone="bg-green-50 text-green-900" />
      </div>

      {data.rules && data.rules.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Rules to apply
          </p>
          <ul className="ml-5 list-disc space-y-1 text-sm text-slate-700">
            {data.rules.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}

      {data.edgeCases && data.edgeCases.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Edge cases to consider
          </p>
          <ul className="ml-5 list-disc space-y-1 text-sm text-slate-600">
            {data.edgeCases.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function Box({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={"flex flex-col rounded-lg p-3 " + tone}>
      <span className="text-xs font-semibold uppercase tracking-wide opacity-70">
        {label}
      </span>
      <span className="mt-1 text-sm">{value}</span>
    </div>
  );
}
