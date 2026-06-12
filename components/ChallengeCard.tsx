import Link from "next/link";
import { Challenge } from "@/lib/types";
import DifficultyBadge from "./DifficultyBadge";

export default function ChallengeCard({
  challenge,
  done,
}: {
  challenge: Challenge;
  done?: boolean;
}) {
  return (
    <Link
      href={`/practice/${challenge.slug}`}
      className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
    >
      {done && (
        <span className="absolute right-4 top-4 text-green-600" title="Solved">
          ✓
        </span>
      )}
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          {challenge.category}
        </span>
        <DifficultyBadge level={challenge.difficulty} />
      </div>

      <h3 className="mb-1 text-lg font-semibold text-slate-800 group-hover:text-brand-700">
        {challenge.title}
      </h3>
      <p className="line-clamp-2 flex-1 text-sm text-slate-500">
        {challenge.problem}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {challenge.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
