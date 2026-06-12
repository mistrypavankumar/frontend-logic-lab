"use client";

import { useState } from "react";
import CodeBlock from "./CodeBlock";

// Hides the solution behind a click so learners don't see it by accident.
export default function SolutionToggle({
  code,
  language,
  explanation,
}: {
  code: string;
  language?: string;
  explanation: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">✅ Solution</h3>
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          {open ? "Hide solution" : "Show solution"}
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-4">
          <CodeBlock code={code} language={language} />
          <div className="rounded-md bg-brand-50 p-3 text-sm text-slate-700">
            <span className="font-semibold text-brand-700">Why it works: </span>
            {explanation}
          </div>
        </div>
      )}
    </div>
  );
}
