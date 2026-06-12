import Link from "next/link";
import { Lesson } from "@/lib/types";
import DifficultyBadge from "./DifficultyBadge";

const categoryColor: Record<string, string> = {
  HTML: "text-orange-600 bg-orange-50",
  CSS: "text-blue-600 bg-blue-50",
  JavaScript: "text-yellow-700 bg-yellow-50",
  React: "text-cyan-700 bg-cyan-50",
};

export default function TopicCard({
  lesson,
  done,
}: {
  lesson: Lesson;
  done?: boolean;
}) {
  return (
    <Link
      href={`/learn/${lesson.slug}`}
      className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
    >
      {done && (
        <span className="absolute right-4 top-4 text-green-600" title="Completed">
          ✓
        </span>
      )}
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`rounded px-2 py-0.5 text-xs font-medium ${
            categoryColor[lesson.category] ?? "bg-slate-100 text-slate-600"
          }`}
        >
          {lesson.category}
        </span>
        <DifficultyBadge level={lesson.difficulty} />
      </div>

      <h3 className="mb-1 text-lg font-semibold text-slate-800 group-hover:text-brand-700">
        {lesson.order}. {lesson.title}
      </h3>
      <p className="line-clamp-2 flex-1 text-sm text-slate-500">{lesson.summary}</p>

      <span className="mt-4 text-xs font-medium text-slate-400">
        ⏱ {lesson.estimatedMinutes} min
      </span>
    </Link>
  );
}
