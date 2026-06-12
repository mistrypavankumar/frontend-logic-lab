"use client";

import { useState } from "react";
import CodeBlock from "./CodeBlock";

// Hides a solution behind a click so learners don't see it by accident.
// `onReveal` fires the first time it's opened (used to flag "solution viewed"
// for the Logic Score).
export default function SolutionToggle({
  code,
  language,
  explanation,
  heading = "✅ Solution",
  onReveal,
}: {
  code: string;
  language?: string;
  explanation?: string;
  heading?: string;
  onReveal?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((o) => {
      if (!o) onReveal?.();
      return !o;
    });
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-800">{heading}</h3>
        <button
          onClick={toggle}
          className="shrink-0 rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-4">
          <CodeBlock code={code} language={language} />
          {explanation && (
            <div className="rounded-md bg-brand-50 p-3 text-sm text-slate-700">
              <span className="font-semibold text-brand-700">Why it works: </span>
              {explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
