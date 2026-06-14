import Link from "next/link";
import { orderedLessons, allChallenges as challenges } from "@/data";
import TopicCard from "@/components/TopicCard";
import ContinuePath from "@/components/ContinuePath";

export default function HomePage() {
  const featured = orderedLessons.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <span className="inline-block rounded-full bg-white px-3 py-1 text-sm font-medium text-brand-700 shadow-sm">
            🧪 Learn by doing, not just reading
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
            Build real frontend{" "}
            <span className="text-brand-600">logic & confidence</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Short, simple theory followed immediately by hands-on challenges.
            Train your problem-solving and learn to write code manually — one
            small step at a time.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/learn"
              className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Start learning →
            </Link>
            <Link
              href="/practice"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Browse challenges
            </Link>
          </div>

          <div className="mt-10 flex justify-center gap-8 text-center">
            <Stat number={`${orderedLessons.length}`} label="Lessons" />
            <Stat number={`${challenges.length}`} label="Challenges" />
            <Stat number="100%" label="Hands-on" />
          </div>
        </div>
      </section>

      {/* Personalized next step — your roadmap */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <ContinuePath />
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-800">
          How it works
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <Step
            icon="📖"
            title="Read a little"
            text="Each concept is explained simply with a real-life example. No walls of text."
          />
          <Step
            icon="⌨️"
            title="Practice immediately"
            text="Every lesson ends with a task. Then tackle the challenge bank to train your logic."
          />
          <Step
            icon="📈"
            title="Track your progress"
            text="Mark lessons and challenges complete. Your progress is saved right in your browser."
          />
        </div>
      </section>

      {/* Featured lessons */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Start here</h2>
          <Link
            href="/learn"
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            View full path →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((lesson) => (
            <TopicCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-extrabold text-brand-600">{number}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

function Step({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  );
}
