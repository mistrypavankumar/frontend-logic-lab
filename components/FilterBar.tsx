"use client";

import { Difficulty, DIFFICULTIES, ChallengeFlags } from "@/lib/types";

export type FlagKey = keyof ChallengeFlags;
export type StatusFilter = "all" | "completed" | "uncompleted";

export interface FilterValue {
  query: string;
  level: "All" | Difficulty;
  topic: string; // "All" or a category
  method: string; // "All" or a method name
  flags: FlagKey[]; // active flag toggles (AND-ed)
  status: StatusFilter;
  bookmarked: boolean;
}

export const EMPTY_FILTER: FilterValue = {
  query: "",
  level: "All",
  topic: "All",
  method: "All",
  flags: [],
  status: "all",
  bookmarked: false,
};

const FLAGS: { key: FlagKey; label: string }[] = [
  { key: "aiReview", label: "🤖 AI review" },
  { key: "testWriting", label: "🧪 Write tests" },
  { key: "builtInAvailable", label: "Has built-in" },
  { key: "interview", label: "Interview" },
  { key: "async", label: "Async" },
  { key: "dataTransformation", label: "Data transform" },
  { key: "realWorld", label: "Real-world" },
];

export function isFilterActive(v: FilterValue): boolean {
  return (
    v.query !== "" ||
    v.level !== "All" ||
    v.topic !== "All" ||
    v.method !== "All" ||
    v.flags.length > 0 ||
    v.status !== "all" ||
    v.bookmarked
  );
}

const selectCls =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

export default function FilterBar({
  value,
  onChange,
  topics,
  methods,
  resultCount,
  total,
  onClear,
}: {
  value: FilterValue;
  onChange: (patch: Partial<FilterValue>) => void;
  topics: string[];
  methods: string[];
  resultCount: number;
  total: number;
  onClear: () => void;
}) {
  const toggleFlag = (key: FlagKey) =>
    onChange({
      flags: value.flags.includes(key)
        ? value.flags.filter((f) => f !== key)
        : [...value.flags, key],
    });

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      {/* Row 1: search + selects */}
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        <input
          type="text"
          value={value.query}
          onChange={(e) => onChange({ query: e.target.value })}
          placeholder="Search title, topic, tag…"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 lg:max-w-xs"
        />

        <select value={value.topic} onChange={(e) => onChange({ topic: e.target.value })} className={selectCls}>
          <option value="All">All topics</option>
          {topics.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select value={value.method} onChange={(e) => onChange({ method: e.target.value })} className={selectCls}>
          <option value="All">All methods</option>
          {methods.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        <select
          value={value.status}
          onChange={(e) => onChange({ status: e.target.value as StatusFilter })}
          className={selectCls}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="uncompleted">Uncompleted</option>
        </select>

        <button
          onClick={() => onChange({ bookmarked: !value.bookmarked })}
          className={
            "rounded-lg px-3 py-2 text-sm font-medium transition " +
            (value.bookmarked
              ? "bg-amber-100 text-amber-700"
              : "border border-slate-300 text-slate-600 hover:bg-slate-100")
          }
        >
          ★ Bookmarked
        </button>
      </div>

      {/* Row 2: difficulty chips */}
      <div className="flex flex-wrap gap-2">
        {(["All", ...DIFFICULTIES] as ("All" | Difficulty)[]).map((d) => (
          <button
            key={d}
            onClick={() => onChange({ level: d })}
            className={
              "rounded-full px-3 py-1 text-xs font-medium transition " +
              (value.level === d
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100")
            }
          >
            {d}
          </button>
        ))}
      </div>

      {/* Row 3: flag chips */}
      <div className="flex flex-wrap gap-2">
        {FLAGS.map((f) => (
          <button
            key={f.key}
            onClick={() => toggleFlag(f.key)}
            className={
              "rounded-full px-3 py-1 text-xs font-medium transition " +
              (value.flags.includes(f.key)
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100")
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Row 4: count + clear */}
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span>Showing {resultCount} of {total}</span>
        {isFilterActive(value) && (
          <button onClick={onClear} className="font-medium text-brand-600 hover:underline">
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
