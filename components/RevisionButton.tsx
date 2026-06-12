"use client";

// Toggle for adding a lesson/challenge to the revision list. Presentational —
// the caller wires `active`/`onToggle` from useProgress.
export default function RevisionButton({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      className={
        "rounded-lg px-3 py-2 text-sm font-medium transition " +
        (active
          ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
          : "border border-slate-300 text-slate-600 hover:bg-slate-100")
      }
    >
      {active ? "↻ In revision" : "Add to revision"}
    </button>
  );
}
