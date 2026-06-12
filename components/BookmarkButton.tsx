"use client";

// Star toggle for bookmarking a lesson or challenge. Presentational —
// the caller wires `active`/`onToggle` from useProgress.
export default function BookmarkButton({
  active,
  onToggle,
  label = "Bookmark",
}: {
  active: boolean;
  onToggle: () => void;
  label?: string;
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      title={active ? "Remove bookmark" : "Bookmark"}
      className={
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition " +
        (active
          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
          : "border border-slate-300 text-slate-600 hover:bg-slate-100")
      }
    >
      <span aria-hidden>{active ? "★" : "☆"}</span>
      {active ? "Bookmarked" : label}
    </button>
  );
}
