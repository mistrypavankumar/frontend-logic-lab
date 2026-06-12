import { internalsLessonList } from "@/data";
import TopicCard from "@/components/TopicCard";

export const metadata = {
  title: "JavaScript Internals — Frontend Logic Lab",
};

export default function InternalsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">JavaScript Internals</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          The mental models that explain <em>why</em> code behaves the way it does —
          the event loop, closures, <code>this</code>, prototypes, references,
          immutability, garbage collection, and Big-O for frontend engineers.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {internalsLessonList.map((lesson) => (
          <TopicCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}
