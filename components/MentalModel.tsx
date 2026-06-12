// "What to picture in your head." A short, vivid analogy for a concept —
// e.g. filter = "check each item; if the test passes, drop it in a new basket."
export default function MentalModel({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4">
      <span aria-hidden className="text-2xl">🧠</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">
          Picture this
        </p>
        <p className="mt-1 leading-relaxed text-violet-900">{text}</p>
      </div>
    </div>
  );
}
