export default function ProgressBar({
  value,
  total,
  label,
}: {
  value: number;
  total: number;
  label?: string;
}) {
  const percent = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex justify-between text-sm text-slate-600">
          <span>{label}</span>
          <span className="font-medium">
            {value}/{total} ({percent}%)
          </span>
        </div>
      )}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
