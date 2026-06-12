"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getChallenge } from "@/data";
import { TestCase } from "@/lib/types";
import Section from "@/components/Section";
import CodeBlock from "@/components/CodeBlock";
import ChallengeWorkspace from "@/components/ChallengeWorkspace";
import HintSection from "@/components/HintSection";
import DifficultyBadge from "@/components/DifficultyBadge";
import ComplexityBadge from "@/components/ComplexityBadge";
import CompleteButton from "@/components/CompleteButton";
import BookmarkButton from "@/components/BookmarkButton";
import Tabs, { TabItem } from "@/components/Tabs";
import { useProgress } from "@/lib/useProgress";

export default function ChallengeDetailPage() {
  const params = useParams<{ slug: string }>();
  const challenge = getChallenge(params.slug);
  const {
    isChallengeDone,
    toggleChallenge,
    isBookmarked,
    toggleBookmark,
    isInRevision,
    toggleRevision,
    loaded,
  } = useProgress();

  if (!challenge) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Challenge not found</h1>
        <Link href="/practice" className="mt-4 inline-block text-brand-600 hover:underline">
          ← Back to challenges
        </Link>
      </div>
    );
  }

  const done = loaded && isChallengeDone(challenge.id);
  const bookmarked = loaded && isBookmarked("challenge", challenge.id);
  const inRevision = loaded && isInRevision("challenge", challenge.id);

  // Visible + hidden tests both count toward "all passed". Hidden ones aren't
  // listed upfront in the Test Cases tab — they only surface on a failure.
  const allTests: TestCase[] = [
    ...(challenge.tests ?? []),
    ...(challenge.hiddenTests ?? []),
  ];

  // Build only the tabs that have content.
  const tabs: TabItem[] = [];

  tabs.push({
    id: "problem",
    label: "Problem",
    content: (
      <div className="space-y-6">
        <p className="leading-relaxed text-slate-700">{challenge.problem}</p>

        {challenge.realWorldScenario && (
          <p className="rounded-lg bg-brand-50 p-3 text-sm text-slate-700">
            <span className="font-semibold text-brand-700">Where you'd use it: </span>
            {challenge.realWorldScenario}
          </p>
        )}

        {challenge.constraints && challenge.constraints.length > 0 && (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Constraints</p>
            <ul className="ml-5 list-disc space-y-1 text-sm text-slate-600">
              {challenge.constraints.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Input</p>
            <CodeBlock code={challenge.example.input} language="js" />
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Output</p>
            <CodeBlock code={challenge.example.output} language="js" />
          </div>
        </div>

        <Section icon="🚀" title="Your code">
          <ChallengeWorkspace
            key={challenge.id}
            starterCode={challenge.starterCode}
            tests={allTests.length > 0 ? allTests : undefined}
            notRunnableHint={
              challenge.flags?.async
                ? "This one is timing/runtime-based — reason it through, then run it in your own project."
                : "Build & run this in your own project."
            }
            onAllPassed={() => {
              if (!isChallengeDone(challenge.id)) toggleChallenge(challenge.id);
            }}
          />
          <p className="mt-2 text-sm text-slate-500">
            {allTests.length > 0
              ? "Edit the code and hit Run — checked against all test cases (including hidden ones)."
              : "Edit freely here, then build it in your own project."}
          </p>
        </Section>

        <HintSection hints={challenge.hints} />
      </div>
    ),
  });

  if (challenge.builtInSolution) {
    tabs.push({
      id: "builtin",
      label: "Built-in",
      content: (
        <SolutionTab
          heading="✅ Built-in solution"
          note="Reach for the native method first — it's tested, fast, and clear."
          code={challenge.builtInSolution.code}
          language={challenge.builtInSolution.language}
        />
      ),
    });
  }

  if (challenge.manualSolution) {
    tabs.push({
      id: "manual",
      label: "Manual",
      content: (
        <SolutionTab
          heading="✋ Manual solution"
          note="The same result using basic loops/spread — useful where the built-in isn't available."
          code={challenge.manualSolution.code}
          language={challenge.manualSolution.language}
        />
      ),
    });
  }

  // Internal implementation (or the canonical solution as a fallback).
  const internalCode = challenge.internalImplementation?.code ?? challenge.solution;
  tabs.push({
    id: "internal",
    label: challenge.internalImplementation ? "Internal" : "Solution",
    content: (
      <SolutionTab
        heading="🔧 From-scratch implementation"
        note={challenge.explanation}
        code={internalCode}
        language="js"
      />
    ),
  });

  if (challenge.tests && challenge.tests.length > 0) {
    tabs.push({
      id: "tests",
      label: "Test Cases",
      badge: challenge.tests.length,
      content: (
        <TestCasesPanel
          visible={challenge.tests}
          hiddenCount={challenge.hiddenTests?.length ?? 0}
        />
      ),
    });
  }

  if (challenge.edgeCases && challenge.edgeCases.length > 0) {
    tabs.push({
      id: "edge",
      label: "Edge Cases",
      content: (
        <ul className="ml-5 list-disc space-y-2 text-sm text-slate-700">
          {challenge.edgeCases.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      ),
    });
  }

  if (challenge.timeComplexity || challenge.spaceComplexity) {
    tabs.push({
      id: "complexity",
      label: "Complexity",
      content: (
        <div className="space-y-3">
          <ComplexityBadge time={challenge.timeComplexity} space={challenge.spaceComplexity} />
          {challenge.commonMistakes && challenge.commonMistakes.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Common mistakes</p>
              <ul className="ml-5 list-disc space-y-1 text-sm text-rose-700">
                {challenge.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
          )}
        </div>
      ),
    });
  }

  if (challenge.industrialNotes && challenge.industrialNotes.length > 0) {
    tabs.push({
      id: "industrial",
      label: "Industrial Notes",
      content: (
        <ul className="ml-5 list-disc space-y-2 text-sm text-slate-700">
          {challenge.industrialNotes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      ),
    });
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/practice" className="text-sm text-brand-600 hover:underline">
        ← All challenges
      </Link>

      <header className="mt-4 border-b border-slate-200 pb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {challenge.category}
          </span>
          <DifficultyBadge level={challenge.difficulty} />
          {challenge.flags?.interview && (
            <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
              Interview
            </span>
          )}
          {done && <span className="text-sm text-green-600">✓ Solved</span>}
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{challenge.title}</h1>

        <div className="mt-4 flex flex-wrap gap-2">
          <CompleteButton done={done} onToggle={() => toggleChallenge(challenge.id)} />
          <BookmarkButton active={bookmarked} onToggle={() => toggleBookmark("challenge", challenge.id)} />
          <button
            onClick={() => toggleRevision("challenge", challenge.id)}
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

      <div className="mt-6">
        <Tabs tabs={tabs} />
      </div>
    </article>
  );
}

function SolutionTab({
  heading,
  note,
  code,
  language,
}: {
  heading: string;
  note?: string;
  code: string;
  language?: string;
}) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-slate-800">{heading}</h3>
      <CodeBlock code={code} language={language} />
      {note && <p className="text-sm text-slate-600">{note}</p>}
    </div>
  );
}

const KIND_LABEL: Record<string, string> = {
  normal: "Normal", empty: "Empty input", invalid: "Invalid input",
  duplicate: "Duplicates", large: "Large input", nullish: "Null/undefined",
  mutation: "No mutation", performance: "Performance",
};

function TestCasesPanel({
  visible,
  hiddenCount,
}: {
  visible: TestCase[];
  hiddenCount: number;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        These run when you click <strong>Run code</strong>.
        {hiddenCount > 0 && ` ${hiddenCount} additional hidden test${hiddenCount > 1 ? "s" : ""} also run.`}
      </p>
      <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200">
        {visible.map((t, i) => (
          <li key={i} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
            <code className="truncate font-mono text-xs text-slate-700">{t.call}</code>
            {t.kind && (
              <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                {KIND_LABEL[t.kind] ?? t.kind}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
