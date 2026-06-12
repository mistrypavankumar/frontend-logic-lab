// Small monospace badges for time / space complexity (Big-O).
export default function ComplexityBadge({
  time,
  space,
}: {
  time?: string;
  space?: string;
}) {
  if (!time && !space) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {time && (
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
          <span className="text-slate-400">Time</span>
          <code className="font-mono text-slate-800">{time}</code>
        </span>
      )}
      {space && (
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
          <span className="text-slate-400">Space</span>
          <code className="font-mono text-slate-800">{space}</code>
        </span>
      )}
    </div>
  );
}
