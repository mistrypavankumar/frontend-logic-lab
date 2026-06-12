import { VariableTrace } from "@/lib/types";

// Renders how key variables change during execution as a table. Columns are
// free-form (Step / Current item / Condition / Result / Explanation, etc.) so
// any algorithm fits. The last column is left-aligned (usually "Explanation").
export default function VariableTracker({ trace }: { trace: VariableTrace }) {
  const { columns, rows } = trace;
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            {columns.map((c) => (
              <th key={c} className="whitespace-nowrap px-3 py-2 font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-slate-100 align-top">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={
                    "px-3 py-2 " +
                    (j === row.length - 1
                      ? "text-slate-600"
                      : "whitespace-nowrap font-mono text-slate-800")
                  }
                >
                  {String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
