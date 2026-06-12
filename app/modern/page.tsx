import Link from "next/link";
import { modernMethodLessons } from "@/data";
import { LessonCategory } from "@/lib/types";
import MethodCompareCard from "@/components/MethodCompareCard";

export const metadata = {
  title: "Modern JavaScript — Frontend Logic Lab",
};

// Display order for modern-method categories.
const ORDER: LessonCategory[] = [
  "Modern Array Methods",
  "Modern Objects & Grouping",
  "Modern Set Operations",
  "Async JavaScript",
  "Data Transformation",
];

export default function ModernPage() {
  const groups = ORDER.map((cat) => ({
    category: cat,
    lessons: modernMethodLessons.filter((l) => l.category === cat),
  })).filter((g) => g.lessons.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Modern JavaScript</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          The latest stable JS methods, each shown three ways — the{" "}
          <span className="font-semibold text-green-700">built-in</span>, the{" "}
          <span className="font-semibold text-blue-700">manual</span> equivalent,
          and a <span className="font-semibold text-purple-700">from-scratch</span>{" "}
          implementation. Tap “Deep dive” for edge cases, complexity, and browser support.
        </p>
      </header>

      <div className="space-y-12">
        {groups.map((group) => (
          <section key={group.category}>
            <h2 className="mb-4 text-xl font-bold text-slate-800">{group.category}</h2>
            <div className="grid gap-5 lg:grid-cols-2">
              {group.lessons.map((l) => (
                <MethodCompareCard
                  key={l.id}
                  title={l.title}
                  href={`/learn/${l.slug}`}
                  difficulty={l.difficulty}
                  problemSolved={l.deepDive?.problemSolved ?? l.summary}
                  builtIn={l.deepDive?.builtInSolution}
                  manual={l.deepDive?.manualSolution}
                  internal={l.deepDive?.internalImplementation}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-lg bg-brand-50 p-6 text-center">
        <p className="font-medium text-slate-800">Want to drill these into muscle memory?</p>
        <Link
          href="/practice"
          className="mt-3 inline-block rounded-lg bg-brand-600 px-6 py-2.5 font-semibold text-white hover:bg-brand-700"
        >
          Go to the challenge bank →
        </Link>
      </div>
    </div>
  );
}
