"use client";

import { orderedLessons } from "@/data";
import { LessonCategory } from "@/lib/types";
import TopicCard from "@/components/TopicCard";
import ProgressBar from "@/components/ProgressBar";
import RecentlyViewed from "@/components/RecentlyViewed";
import { useProgress } from "@/lib/useProgress";

// Display order for the category sections (foundations → modern → internals).
const CATEGORY_ORDER: LessonCategory[] = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Modern Array Methods",
  "Modern Objects & Grouping",
  "Modern Set Operations",
  "Async JavaScript",
  "Data Transformation",
  "JavaScript Internals",
  "UI Logic",
];

export default function LearnPage() {
  const { isLessonDone, state, loaded } = useProgress();
  const doneCount = state.completedLessons.length;

  // Group lessons by category, preserving the order above.
  const groups = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    lessons: orderedLessons.filter((l) => l.category === cat),
  })).filter((g) => g.lessons.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Learning Path</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Start with the foundations, then move into modern JavaScript methods and
          internals. Every lesson is short and ends with a hands-on task.
        </p>
      </header>

      <div className="mb-10 max-w-md">
        <ProgressBar
          value={loaded ? doneCount : 0}
          total={orderedLessons.length}
          label="Lessons completed"
        />
      </div>

      {loaded && (
        <div className="mb-10">
          <RecentlyViewed />
        </div>
      )}

      <div className="space-y-12">
        {groups.map((group) => (
          <section key={group.category}>
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              {group.category}
              <span className="ml-2 text-sm font-normal text-slate-400">
                {group.lessons.length} lessons
              </span>
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.lessons.map((lesson) => (
                <TopicCard
                  key={lesson.id}
                  lesson={lesson}
                  done={loaded && isLessonDone(lesson.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
