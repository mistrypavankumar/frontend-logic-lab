"use client";

import { Fragment, ReactNode } from "react";
import Link from "next/link";
import { TestingLesson } from "@/lib/types";
import { testingLessons } from "@/data/testing";
import ProblemLayout, { PanelTab } from "@/components/ProblemLayout";
import TestLab from "@/components/TestLab";
import CodeBlock from "@/components/CodeBlock";
import ConceptVisualizer from "@/components/ConceptVisualizer";
import PredictOutput from "@/components/PredictOutput";
import { useProgress } from "@/lib/useProgress";

const LEVEL_CLS: Record<TestingLesson["level"], string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-rose-100 text-rose-700",
};

/** Renders `inline code` and **bold** inside lesson paragraphs. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i): ReactNode => {
        if (p.startsWith("`") && p.endsWith("`")) {
          return (
            <code key={i} className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.85em] text-slate-800">
              {p.slice(1, -1)}
            </code>
          );
        }
        if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

export default function TestingLessonView({ lesson }: { lesson: TestingLesson }) {
  const { isTestingDone, loaded } = useProgress();
  const pos = testingLessons.findIndex((l) => l.slug === lesson.slug);
  const prev = testingLessons[pos - 1];
  const next = testingLessons[pos + 1];
  const done = loaded ? lesson.scenarios.filter((s) => isTestingDone(`${lesson.slug}:${s.id}`)).length : 0;

  const learn = (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Testing · Lesson {pos + 1} of {testingLessons.length}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          {lesson.icon} {lesson.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-full px-2.5 py-0.5 font-semibold ${LEVEL_CLS[lesson.level]}`}>{lesson.level}</span>
          <span className="text-slate-400">⏱ {lesson.minutes} min</span>
          <span className="text-slate-400">
            · {done}/{lesson.scenarios.length} examples done
          </span>
        </div>
        <p className="mt-3 leading-relaxed text-slate-700">{lesson.summary}</p>
      </header>

      {lesson.sections.map((s, i) => (
        <section key={i} className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{s.title}</h2>
          {s.body.map((p, j) => (
            <p key={j} className="leading-relaxed text-slate-700">
              <Rich text={p} />
            </p>
          ))}
          {s.code && <CodeBlock code={s.code.code} language={s.code.language} />}
          {s.output && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Test runner output</p>
              <pre className="whitespace-pre-wrap rounded-lg bg-slate-900 px-4 py-3 font-mono text-xs text-slate-200">{s.output}</pre>
            </div>
          )}
        </section>
      ))}

      <section className="rounded-xl border border-brand-100 bg-brand-50 p-4">
        <h2 className="mb-2 text-sm font-semibold text-brand-800">🔑 Key points</h2>
        <ul className="ml-5 list-disc space-y-1 text-sm text-slate-700">
          {lesson.keyPoints.map((k, i) => (
            <li key={i}>{k}</li>
          ))}
        </ul>
      </section>

      <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600">
        👉 Now practise in the lab on the right: pick an <strong>example</strong>, press <strong>▶ Run tests</strong>, and
        watch what happens. Switch examples to try the same skill on different code.
      </p>
    </div>
  );

  const tabs: PanelTab[] = [
    { key: "learn", label: "📖 Learn", content: learn },
    ...(lesson.visualization
      ? [
          {
            key: "visualize",
            label: "▶️ See it step by step",
            content: (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Step through it — watch what happens at each line.</p>
                <ConceptVisualizer data={lesson.visualization} />
              </div>
            ),
          },
        ]
      : []),
    ...(lesson.quiz && lesson.quiz.length > 0
      ? [
          {
            key: "quiz",
            label: "🔮 Quiz",
            content: (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Commit to an answer, then check it.</p>
                <PredictOutput questions={lesson.quiz} />
              </div>
            ),
          },
        ]
      : []),
  ];

  const navBtn = "rounded-md border border-slate-200 px-2.5 py-1 text-sm text-slate-600 hover:bg-slate-100";
  const topBar = (
    <div className="flex items-center justify-between gap-3 text-sm">
      <Link href="/testing" className="font-medium text-slate-600 hover:text-brand-700">
        ☰ Testing course
      </Link>
      <div className="flex items-center gap-2">
        {prev && (
          <Link href={`/testing/${prev.slug}`} title={prev.title} className={navBtn}>
            ‹ Prev
          </Link>
        )}
        {next && (
          <Link href={`/testing/${next.slug}`} title={next.title} className={navBtn}>
            Next: {next.title} ›
          </Link>
        )}
      </div>
    </div>
  );

  return <ProblemLayout key={lesson.slug} tabs={tabs} topBar={topBar} right={<TestLab lesson={lesson} />} />;
}
