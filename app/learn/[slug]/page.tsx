"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getLesson, allLessons } from "@/data";
import Section from "@/components/Section";
import CodeBlock from "@/components/CodeBlock";
import ChallengeWorkspace from "@/components/ChallengeWorkspace";
import SolutionToggle from "@/components/SolutionToggle";
import DifficultyBadge from "@/components/DifficultyBadge";
import ComplexityBadge from "@/components/ComplexityBadge";
import CompleteButton from "@/components/CompleteButton";
import BookmarkButton from "@/components/BookmarkButton";
import MethodCompareCard from "@/components/MethodCompareCard";
import { useProgress } from "@/lib/useProgress";

export default function LessonDetailPage() {
  const params = useParams<{ slug: string }>();
  const lesson = getLesson(params.slug);
  const {
    isLessonDone,
    toggleLesson,
    isBookmarked,
    toggleBookmark,
    isInRevision,
    toggleRevision,
    recordLessonView,
    loaded,
  } = useProgress();

  // Track recently-viewed (runs after mount; safe when lesson is missing).
  useEffect(() => {
    if (lesson) recordLessonView(lesson.id);
  }, [lesson, recordLessonView]);

  if (!lesson) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Lesson not found</h1>
        <Link href="/learn" className="mt-4 inline-block text-brand-600 hover:underline">
          ← Back to learning path
        </Link>
      </div>
    );
  }

  const next = lesson.nextLessonSlug
    ? allLessons.find((l) => l.slug === lesson.nextLessonSlug)
    : undefined;
  const done = loaded && isLessonDone(lesson.id);
  const bookmarked = loaded && isBookmarked("lesson", lesson.id);
  const inRevision = loaded && isInRevision("lesson", lesson.id);
  const dd = lesson.deepDive;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/learn" className="text-sm text-brand-600 hover:underline">
        ← Learning path
      </Link>

      {/* Header */}
      <header className="mt-4 border-b border-slate-200 pb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {lesson.category}
          </span>
          <DifficultyBadge level={lesson.difficulty} />
          <span className="text-xs text-slate-400">⏱ {lesson.estimatedMinutes} min</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>

        <div className="mt-4 flex flex-wrap gap-2">
          <BookmarkButton active={bookmarked} onToggle={() => toggleBookmark("lesson", lesson.id)} />
          <button
            onClick={() => toggleRevision("lesson", lesson.id)}
            className={
              "rounded-lg px-3 py-2 text-sm font-medium transition " +
              (inRevision
                ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                : "border border-slate-300 text-slate-600 hover:bg-slate-100")
            }
          >
            {inRevision ? "↻ In revision" : "Add to revision"}
          </button>
        </div>
      </header>

      <div className="mt-8 space-y-8">
        <Section icon="📖" title="Simple explanation">
          <p className="leading-relaxed">{lesson.summary}</p>
        </Section>

        <Section icon="🌍" title="Real-life example">
          <p className="rounded-lg bg-brand-50 p-4 leading-relaxed text-slate-700">
            {lesson.realLifeExample}
          </p>
        </Section>

        <Section icon="💻" title="Small code example">
          <CodeBlock code={lesson.codeExample.code} language={lesson.codeExample.language} />
        </Section>

        {/* ---- Deep dive (modern-method lessons) ---- */}
        {dd && (
          <div className="space-y-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">🔬 Deep dive</h2>

            {dd.problemSolved && (
              <Section icon="🎯" title="What problem it solves">
                <p className="leading-relaxed">{dd.problemSolved}</p>
              </Section>
            )}
            {dd.realWorldUseCase && (
              <Section icon="🏭" title="Real-world frontend use">
                <p className="leading-relaxed">{dd.realWorldUseCase}</p>
              </Section>
            )}

            {(dd.builtInSolution || dd.manualSolution || dd.internalImplementation) && (
              <MethodCompareCard
                title="Built-in vs manual vs internal"
                builtIn={dd.builtInSolution}
                manual={dd.manualSolution}
                internal={dd.internalImplementation}
              />
            )}

            {(dd.timeComplexity || dd.spaceComplexity) && (
              <Section icon="⏱" title="Complexity">
                <ComplexityBadge time={dd.timeComplexity} space={dd.spaceComplexity} />
              </Section>
            )}

            {dd.edgeCases && dd.edgeCases.length > 0 && (
              <Section icon="🧪" title="Edge cases">
                <ul className="ml-5 list-disc space-y-1 text-sm">
                  {dd.edgeCases.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </Section>
            )}

            {dd.browserSupport && (
              <div className="rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
                <span className="font-semibold">🌐 Browser/runtime support: </span>
                {dd.browserSupport}
              </div>
            )}

            {dd.whenNotToUse && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <span className="font-semibold">⚠️ When NOT to use: </span>
                {dd.whenNotToUse}
              </div>
            )}

            {dd.industrialNotes && dd.industrialNotes.length > 0 && (
              <Section icon="💼" title="Industrial notes">
                <ul className="ml-5 list-disc space-y-1 text-sm">
                  {dd.industrialNotes.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </Section>
            )}

            {dd.commonMistakes && dd.commonMistakes.length > 0 && (
              <Section icon="🚫" title="Common mistakes">
                <ul className="ml-5 list-disc space-y-1 text-sm text-rose-700">
                  {dd.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </Section>
            )}
          </div>
        )}

        <Section icon="🎯" title="Practice task">
          <p className="rounded-lg border-l-4 border-brand-500 bg-white p-4 leading-relaxed shadow-sm">
            {lesson.practiceTask}
          </p>
        </Section>

        {lesson.practiceStarter && (
          <Section icon="⌨️" title="Your code">
            <ChallengeWorkspace
              key={lesson.id}
              starterCode={lesson.practiceStarter}
              tests={lesson.practiceTests}
              runnable={lesson.practiceRunnable ?? undefined}
              notRunnableHint={
                lesson.category === "React"
                  ? "Build & run this in your own React project — JSX can't run here yet."
                  : "Try this in your browser or a sandbox like CodePen to see it render."
              }
              onAllPassed={() => {
                if (!isLessonDone(lesson.id)) toggleLesson(lesson.id);
              }}
            />
            <p className="mt-2 text-sm text-slate-500">
              {lesson.practiceTests && lesson.practiceTests.length > 0
                ? "Write your answer above and hit Run — it's checked against test cases."
                : lesson.practiceRunnable
                ? "Write your answer above and hit Run to see the console output."
                : "Edit the starter code to practice writing it yourself."}
            </p>
          </Section>
        )}

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h3 className="mb-1 font-semibold text-amber-800">💡 Hint</h3>
          <p className="text-sm text-amber-900">{lesson.hint}</p>
        </div>

        <SolutionToggle
          code={lesson.solution.code}
          language={lesson.solution.language}
          explanation={lesson.explanation}
        />

        {/* Complete + next */}
        <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <CompleteButton done={done} onToggle={() => toggleLesson(lesson.id)} />

          {next ? (
            <Link
              href={`/learn/${next.slug}`}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Next: {next.title} →
            </Link>
          ) : (
            <Link
              href="/practice"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Try the challenges →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
