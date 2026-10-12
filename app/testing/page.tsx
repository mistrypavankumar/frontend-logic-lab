"use client";

import Link from "next/link";
import { testingLessons } from "@/data/testing";
import { TestingLesson } from "@/lib/types";
import ProgressBar from "@/components/ProgressBar";
import { useProgress } from "@/lib/useProgress";

const LEVELS: { level: TestingLesson["level"]; blurb: string }[] = [
  { level: "Beginner", blurb: "What a test is, the matchers you'll use daily, and how to hunt edge cases." },
  { level: "Intermediate", blurb: "Async code, mocks and spies, fake timers, and testing real UI in the DOM." },
  { level: "Advanced", blurb: "TDD, integration tests, mutation testing, flaky tests and E2E strategy." },
];

export default function TestingHubPage() {
  const { isTestingDone, loaded } = useProgress();
  const doneIn = (l: TestingLesson) =>
    loaded ? l.scenarios.filter((s) => isTestingDone(`${l.slug}:${s.id}`)).length : 0;
  const total = testingLessons.reduce((n, l) => n + l.scenarios.length, 0);
  const done = testingLessons.reduce((n, l) => n + doneIn(l), 0);
  const firstOpen = testingLessons.find((l) => doneIn(l) < l.scenarios.length) ?? testingLessons[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900">🧪 Become a Frontend Tester</h1>
        <p className="mt-2 text-slate-600">
          Learn to test frontend code from your very first <code className="rounded bg-slate-100 px-1">expect()</code> to
          TDD, mocks, UI testing and mutation testing. Every lesson has a live lab: write real tests, run them, and{" "}
          <strong>see</strong> what they catch — including a bug hunt against deliberately broken code.
        </p>
      </header>

      <div className="mb-10 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div className="max-w-md">
          <ProgressBar value={done} total={total} label="Lab examples completed" />
        </div>
        <Link
          href={`/testing/${firstOpen.slug}`}
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-700"
        >
          {done === 0 ? "Start the course →" : `Continue: ${firstOpen.title} →`}
        </Link>
      </div>

      <section className="mb-12 grid gap-4 sm:grid-cols-3">
        {[
          { icon: "📖", title: "Learn", text: "Short explanations with real examples and the test runner's output." },
          { icon: "▶️", title: "Run", text: "Write tests in the editor and run them instantly — Jest-style results." },
          { icon: "🐞", title: "Hunt bugs", text: "We run your tests against broken versions. Catch them all." },
        ].map((s) => (
          <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-2xl">{s.icon}</div>
            <h3 className="mt-1 font-semibold text-slate-800">{s.title}</h3>
            <p className="text-sm text-slate-500">{s.text}</p>
          </div>
        ))}
      </section>

      {LEVELS.map(({ level, blurb }) => {
        const lessons = testingLessons.filter((l) => l.level === level);
        return (
          <section key={level} className="mb-10">
            <h2 className="text-xl font-bold text-slate-900">{level}</h2>
            <p className="mb-4 text-sm text-slate-500">{blurb}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lessons.map((l) => {
                const n = testingLessons.indexOf(l) + 1;
                const d = doneIn(l);
                const complete = d === l.scenarios.length;
                return (
                  <Link
                    key={l.slug}
                    href={`/testing/${l.slug}`}
                    className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl">{l.icon}</span>
                      {complete ? (
                        <span className="text-sm font-semibold text-green-600">✓ Done</span>
                      ) : (
                        <span className="text-xs text-slate-400">Lesson {n}</span>
                      )}
                    </div>
                    <h3 className="mt-2 font-semibold text-slate-800">{l.title}</h3>
                    <p className="mt-1 flex-1 text-sm text-slate-500">{l.summary}</p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                      <span>⏱ {l.minutes} min</span>
                      <span>
                        🧪 {d}/{l.scenarios.length} examples
                      </span>
                      {l.env === "dom" && <span>🖱️ UI</span>}
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-green-500" style={{ width: `${(d / l.scenarios.length) * 100}%` }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
