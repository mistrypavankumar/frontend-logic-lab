"use client";

import { SolutionVariant } from "@/lib/types";
import CodeBlock from "./CodeBlock";
import Tabs, { TabItem } from "./Tabs";

// Beginner → Built-in → Manual → Optimized, each with its tradeoffs. Lets
// learners see that there's rarely one "right" answer — only tradeoffs.
const TONE: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  "Built-in": "bg-sky-100 text-sky-700",
  Manual: "bg-amber-100 text-amber-700",
  Optimized: "bg-purple-100 text-purple-700",
};

export default function MultipleSolutions({
  variants,
}: {
  variants: SolutionVariant[];
}) {
  const tabs: TabItem[] = variants.map((v, i) => ({
    id: `sol-${i}`,
    label: v.approach,
    content: (
      <div className="space-y-3">
        <span
          className={
            "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold " +
            (TONE[v.approach] ?? "bg-slate-100 text-slate-700")
          }
        >
          {v.approach}
        </span>
        <CodeBlock code={v.code} language={v.language ?? "js"} />
        {v.explanation && (
          <p className="text-sm text-slate-600">{v.explanation}</p>
        )}
        {v.tradeoffs && (
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            <span className="font-semibold text-slate-800">Tradeoffs: </span>
            {v.tradeoffs}
          </p>
        )}
      </div>
    ),
  }));

  return <Tabs tabs={tabs} />;
}
