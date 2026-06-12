"use client";

// A small "mark as complete" toggle used on lesson and challenge pages.
export default function CompleteButton({
  done,
  onToggle,
}: {
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={
        "rounded-lg px-4 py-2 text-sm font-semibold transition-colors " +
        (done
          ? "bg-green-600 text-white hover:bg-green-700"
          : "border border-brand-500 text-brand-600 hover:bg-brand-50")
      }
    >
      {done ? "✓ Completed" : "Mark as complete"}
    </button>
  );
}
