// Common mistakes list — wrong method, missing return, mutation, wrong
// condition, unhandled empty / null / undefined, etc. Shared by lessons +
// challenges so learners can self-check against typical traps.
export default function CommonMistakes({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="space-y-2">
      {items.map((m, i) => (
        <li
          key={i}
          className="flex gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-800"
        >
          <span aria-hidden className="shrink-0">⚠️</span>
          <span>{m}</span>
        </li>
      ))}
    </ul>
  );
}
