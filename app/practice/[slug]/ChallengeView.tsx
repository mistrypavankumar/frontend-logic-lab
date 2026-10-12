"use client";

import { useState } from "react";
import Link from "next/link";
import { Challenge, Lesson, TestCase } from "@/lib/types";
import { getChallenge, allLessons, allChallenges } from "@/data";
import Section from "@/components/Section";
import ProblemLayout, { PanelTab } from "@/components/ProblemLayout";
import CodeBlock from "@/components/CodeBlock";
import ChallengeWorkspace from "@/components/ChallengeWorkspace";
import TestWritingPanel from "@/components/TestWritingPanel";
import HintSection from "@/components/HintSection";
import ProgressiveHints from "@/components/ProgressiveHints";
import DifficultyBadge from "@/components/DifficultyBadge";
import ComplexityBadge from "@/components/ComplexityBadge";
import CompleteButton from "@/components/CompleteButton";
import BookmarkButton from "@/components/BookmarkButton";
import RevisionButton from "@/components/RevisionButton";
import SolutionToggle from "@/components/SolutionToggle";
import InputOutputThinking from "@/components/InputOutputThinking";
import Pseudocode from "@/components/Pseudocode";
import FadedExample from "@/components/FadedExample";
import PredictOutput from "@/components/PredictOutput";
import DryRun from "@/components/DryRun";
import VariableTracker from "@/components/VariableTracker";
import CommonMistakes from "@/components/CommonMistakes";
import MentalModel from "@/components/MentalModel";
import MethodComparison from "@/components/MethodComparison";
import MultipleSolutions from "@/components/MultipleSolutions";
import DebugChallengePanel from "@/components/DebugChallengePanel";
import AiReviewPanel from "@/components/AiReviewPanel";
import LogicScore from "@/components/LogicScore";
import SelfExplain from "@/components/SelfExplain";
import ConfidenceRating from "@/components/ConfidenceRating";
import { Eli5Block } from "@/components/Eli5";
import { useProgress } from "@/lib/useProgress";

export default function ChallengeView({ challenge }: { challenge: Challenge }) {
  const {
    isChallengeDone,
    toggleChallenge,
    isBookmarked,
    toggleBookmark,
    isInRevision,
    toggleRevision,
    recordScore,
    markSolutionViewed,
    isSolutionViewed,
    scoreFor,
    recordReview,
    saveExplanation,
    explanationFor,
    loaded,
  } = useProgress();

  const id = challenge.id;
  const done = loaded && isChallengeDone(id);
  const bookmarked = loaded && isBookmarked("challenge", id);
  const inRevision = loaded && isInRevision("challenge", id);
  const score = scoreFor(id);

  // Attempt-gating: hide the solution code until the learner runs it at least
  // once (or explicitly chooses to give up). Thinking first is the whole point.
  const [attempted, setAttempted] = useState(false);
  const [revealAnyway, setRevealAnyway] = useState(false);
  const [justSolved, setJustSolved] = useState(false);
  const solutionsUnlocked = attempted || revealAnyway;

  // Visible + hidden tests both count toward "all passed". Hidden ones aren't
  // listed upfront — they only surface on a failure. Passing them = edge cases.
  const visibleTests = challenge.tests ?? [];
  const hiddenTests = challenge.hiddenTests ?? [];
  const allTests: TestCase[] = [...visibleTests, ...hiddenTests];
  // "Passed edge cases" = the suite tests beyond the happy path (any non-"normal"
  // kind, e.g. empty / mutation / nullish), whether those tests are visible or hidden.
  const hasEdgeTests =
    hiddenTests.length > 0 || allTests.some((t) => t.kind && t.kind !== "normal");

  // Which Logic Score signals are achievable for THIS challenge (so the score
  // doesn't show points you can't possibly earn here).
  const hasPredict = (challenge.predictOutput?.length ?? 0) > 0;
  const applicableScore: (keyof typeof score)[] = [
    "solvedWithoutSolution",
    ...(hasEdgeTests ? (["passedEdgeCases"] as const) : []),
    ...(hasPredict ? (["predictedCorrectly"] as const) : []),
    "solvedManually",
    "solvedBuiltIn",
  ];

  const internalCode = challenge.internalImplementation?.code ?? challenge.solution;
  const related = (challenge.relatedChallengeSlugs ?? [])
    .map((s) => getChallenge(s))
    .filter((c): c is Challenge => c !== undefined);

  // Lessons that TEACH this challenge — a lesson that lists it as practice, or
  // one that covers a method this challenge uses. Lets a stuck learner go learn.
  const teachingLessons: Lesson[] = allLessons
    .filter(
      (l) =>
        (l.practiceChallengeIds ?? []).includes(id) ||
        (l.relatedMethods ?? []).some((m) =>
          (challenge.relatedMethods ?? []).includes(m)
        )
    )
    .slice(0, 4);

  const onSolutionRevealed = () => markSolutionViewed(id);

  // Previous / next problem in the bank (top-bar navigation, like LeetCode).
  const pos = allChallenges.findIndex((c) => c.id === id);
  const prev = pos > 0 ? allChallenges[pos - 1] : undefined;
  const next = pos >= 0 && pos < allChallenges.length - 1 ? allChallenges[pos + 1] : undefined;

  const hasThinking =
    !!challenge.inputOutputThinking ||
    !!challenge.pseudocode ||
    !!challenge.fadedExample ||
    hasPredict;
  const hasHints =
    (challenge.progressiveHints?.length ?? 0) > 0 || challenge.hints.length > 0;

  // ---- Left panel tabs ------------------------------------------------------

  const description = (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{challenge.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <DifficultyBadge level={challenge.difficulty} />
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {challenge.category}
          </span>
          {challenge.flags?.interview && (
            <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
              Interview
            </span>
          )}
          {challenge.isDebugChallenge && (
            <span className="rounded bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">🐞 Debug</span>
          )}
          {challenge.isAiReview && (
            <span className="rounded bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">🤖 AI review</span>
          )}
          {challenge.isTestWriting && (
            <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">🧪 Write tests</span>
          )}
          {done && <span className="text-sm font-medium text-green-600">✓ Solved</span>}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <CompleteButton done={done} onToggle={() => toggleChallenge(id)} />
          <BookmarkButton active={bookmarked} onToggle={() => toggleBookmark("challenge", id)} />
          <RevisionButton active={inRevision} onToggle={() => toggleRevision("challenge", id)} />
        </div>
      </header>

      <div className="space-y-4">
        <p className="leading-relaxed text-slate-700">{challenge.problem}</p>
        <div>
          <p className="mb-1 text-sm font-semibold text-slate-800">Example</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Input</p>
              <CodeBlock code={challenge.example.input} language="js" />
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Output</p>
              <CodeBlock code={challenge.example.output} language="js" />
            </div>
          </div>
        </div>
        {challenge.constraints && challenge.constraints.length > 0 && (
          <div>
            <p className="mb-1 text-sm font-semibold text-slate-800">Constraints</p>
            <ul className="ml-5 list-disc space-y-1 text-sm text-slate-600">
              {challenge.constraints.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        )}
        {challenge.mentalModel && <MentalModel text={challenge.mentalModel} />}
        {challenge.eli5 && <Eli5Block text={challenge.eli5} />}
      </div>

      {(challenge.frontendScenario || challenge.realWorldScenario) && (
        <Section icon="🌍" title="Real frontend scenario">
          <p className="rounded-lg bg-brand-50 p-4 text-sm leading-relaxed text-slate-700">
            {challenge.frontendScenario ?? challenge.realWorldScenario}
          </p>
        </Section>
      )}

      {/* Review the AI's code — judge it before running */}
      {challenge.aiReview && (
        <Section icon="🤖" title="Review the AI's code">
          <AiReviewPanel review={challenge.aiReview} code={challenge.starterCode} />
        </Section>
      )}

      {/* Debug-this-code exercise (when this challenge is a debug exercise) */}
      {challenge.debugChallenge && (
        <Section icon="🐞" title="Debug this code">
          <DebugChallengePanel data={challenge.debugChallenge} />
        </Section>
      )}

      {/* Learn the concept — jump to the lessons that teach this */}
      {teachingLessons.length > 0 && (
        <Section icon="📚" title="Learn the concept">
          <p className="mb-3 text-sm text-slate-500">
            Stuck, or want the theory? These lessons cover what this challenge uses.
          </p>
          <div className="flex flex-wrap gap-2">
            {teachingLessons.map((l) => (
              <Link
                key={l.id}
                href={`/learn/${l.slug}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:border-brand-300 hover:text-brand-700"
              >
                {l.title}
              </Link>
            ))}
          </div>
        </Section>
      )}

      {related.length > 0 && (
        <Section icon="🔗" title="Related challenges">
          <ul className="space-y-2">
            {related.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/practice/${c.slug}`}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:border-brand-300 hover:text-brand-700"
                >
                  <span>{c.title}</span>
                  <DifficultyBadge level={c.difficulty} />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );

  const thinking = (
    <div className="space-y-8">
      <p className="text-sm text-slate-500">
        Work through these before (or while) you code — they build the plan that makes the code easy.
      </p>
      {challenge.inputOutputThinking && (
        <Section icon="🔁" title="Input / output thinking">
          <InputOutputThinking data={challenge.inputOutputThinking} />
        </Section>
      )}
      {challenge.pseudocode && (
        <Section icon="🧾" title="Pseudocode first">
          <Pseudocode data={challenge.pseudocode} />
        </Section>
      )}
      {challenge.fadedExample && (
        <Section icon="🧩" title="Warm-up · Fill in the blanks">
          <FadedExample data={challenge.fadedExample} />
        </Section>
      )}
      {challenge.predictOutput && challenge.predictOutput.length > 0 && (
        <Section icon="🔮" title="Predict the output">
          <p className="mb-3 text-sm text-slate-500">
            Commit to an answer before you look at the solutions.
          </p>
          <PredictOutput
            questions={challenge.predictOutput}
            onResult={(correct) => correct && recordScore(id, { predictedCorrectly: true })}
          />
        </Section>
      )}
    </div>
  );

  const hints = (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Reveal one hint at a time — each costs a little Logic Score, so try first.
      </p>
      {challenge.progressiveHints && challenge.progressiveHints.length > 0 ? (
        <ProgressiveHints
          hints={challenge.progressiveHints}
          onReveal={() => recordScore(id, { usedHints: true })}
        />
      ) : (
        <HintSection hints={challenge.hints} />
      )}
    </div>
  );

  const solutions = (
    <div className="space-y-8">
      {/* Gated until the learner gives it a real attempt */}
      {!solutionsUnlocked ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
          <p className="font-medium text-slate-800">✋ Give it a real attempt first.</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            Run your code at least once — even a wrong attempt teaches you far more than
            reading the answer cold. The solutions unlock automatically once you do.
          </p>
          <button
            onClick={() => setRevealAnyway(true)}
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white"
          >
            Reveal solutions anyway
          </button>
        </div>
      ) : (
        <>
          {challenge.builtInSolution && (
            <Section icon="✅" title="Built-in solution">
              <SolutionToggle
                heading="Reveal built-in solution"
                code={challenge.builtInSolution.code}
                language={challenge.builtInSolution.language}
                explanation="Reach for the native method first — it's tested, fast, and clear."
                onReveal={onSolutionRevealed}
              />
            </Section>
          )}
          {challenge.manualSolution && (
            <Section icon="✋" title="Manual solution">
              <SolutionToggle
                heading="Reveal manual (loop) solution"
                code={challenge.manualSolution.code}
                language={challenge.manualSolution.language}
                explanation="The same result with basic loops/spread — useful where the built-in isn't available."
                onReveal={onSolutionRevealed}
              />
            </Section>
          )}
          <Section icon="🔧" title="Internal implementation">
            <SolutionToggle
              heading="Reveal from-scratch implementation"
              code={internalCode}
              language="js"
              explanation={challenge.explanation}
              onReveal={onSolutionRevealed}
            />
          </Section>
          {challenge.methodComparison && (
            <Section icon="⚖️" title="Built-in vs manual vs internal">
              <MethodComparison data={challenge.methodComparison} />
            </Section>
          )}
          {challenge.multipleSolutions && challenge.multipleSolutions.length > 0 && (
            <Section icon="🪜" title="Multiple approaches & tradeoffs">
              <MultipleSolutions variants={challenge.multipleSolutions} />
            </Section>
          )}
        </>
      )}

      {challenge.dryRun && challenge.dryRun.length > 0 && (
        <Section icon="👣" title="Dry run (step by step)">
          <DryRun steps={challenge.dryRun} />
        </Section>
      )}
      {challenge.variableTrace && (
        <Section icon="📊" title="Variable tracker">
          <VariableTracker trace={challenge.variableTrace} />
        </Section>
      )}
      {challenge.edgeCases && challenge.edgeCases.length > 0 && (
        <Section icon="🧪" title="Edge cases">
          <ul className="ml-5 list-disc space-y-1 text-sm text-slate-700">
            {challenge.edgeCases.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </Section>
      )}
      {challenge.commonMistakes && challenge.commonMistakes.length > 0 && (
        <Section icon="🚫" title="Common mistakes">
          <CommonMistakes items={challenge.commonMistakes} />
        </Section>
      )}
      {(challenge.timeComplexity ||
        challenge.spaceComplexity ||
        (challenge.industrialNotes && challenge.industrialNotes.length > 0)) && (
        <Section icon="💼" title="Complexity & industrial notes">
          <div className="space-y-3">
            <ComplexityBadge time={challenge.timeComplexity} space={challenge.spaceComplexity} />
            {challenge.industrialNotes && challenge.industrialNotes.length > 0 && (
              <ul className="ml-5 list-disc space-y-1 text-sm text-slate-700">
                {challenge.industrialNotes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            )}
          </div>
        </Section>
      )}
    </div>
  );

  const progress = loaded ? (
    <div className="space-y-6">
      <div className="space-y-2">
        <LogicScore score={score} applicable={applicableScore} />
        <div className="flex flex-wrap gap-2">
          <SelfReport
            label="I solved it manually"
            active={!!score.solvedManually}
            onClick={() => recordScore(id, { solvedManually: true })}
          />
          <SelfReport
            label="I used a built-in"
            active={!!score.solvedBuiltIn}
            onClick={() => recordScore(id, { solvedBuiltIn: true })}
          />
        </div>
      </div>
      {/* Self-explanation — write WHY before peeking at the solution */}
      <SelfExplain value={explanationFor(id)} onSave={(text) => saveExplanation(id, text)} />
    </div>
  ) : null;

  const tabs: PanelTab[] = [
    { key: "description", label: "📝 Description", content: description },
    ...(hasThinking ? [{ key: "think", label: "🧠 Think it through", content: thinking }] : []),
    ...(hasHints ? [{ key: "hints", label: "💡 Hints", content: hints }] : []),
    {
      key: "solutions",
      label: solutionsUnlocked ? "📖 Solutions" : "🔒 Solutions",
      content: solutions,
    },
    { key: "progress", label: "📊 My progress", content: progress },
  ];

  // ---- Right panel: editor + console (or the write-the-tests panel) ---------

  const right = challenge.testWriting ? (
    <div className="flex-1 overflow-y-auto p-4">
      <TestWritingPanel
        spec={challenge.testWriting}
        onSolved={() => {
          setAttempted(true);
          setJustSolved(true);
          if (!isChallengeDone(id)) toggleChallenge(id);
          recordReview(id, { passed: true, confidence: 4 });
        }}
      />
      {justSolved && (
        <div className="mt-3">
          <ConfidenceRating onRate={(confidence) => recordReview(id, { passed: true, confidence })} />
        </div>
      )}
    </div>
  ) : (
    <ChallengeWorkspace
      key={id}
      persistKey={`challenge:${id}`}
      starterCode={challenge.starterCode}
      tests={visibleTests}
      hiddenTests={hiddenTests}
      notRunnableHint={
        challenge.flags?.async
          ? "This one is timing/runtime-based — reason it through, then run it in your own project."
          : "Build & run this in your own project."
      }
      onRun={() => setAttempted(true)}
      onResult={(passed) => {
        if (!passed) {
          recordScore(id, { everFailed: true });
          recordReview(id, { passed: false }); // bring it back sooner
        }
      }}
      onAllPassed={() => {
        setJustSolved(true);
        if (!isChallengeDone(id)) toggleChallenge(id);
        recordScore(id, {
          solvedWithoutSolution: !isSolutionViewed(id),
          passedEdgeCases: hasEdgeTests,
        });
      }}
      afterAccepted={
        justSolved && (
          // Confidence rating → tunes the spaced-repetition schedule
          <ConfidenceRating onRate={(confidence) => recordReview(id, { passed: true, confidence })} />
        )
      }
    />
  );

  const navBtn =
    "rounded-md border border-slate-200 px-2.5 py-1 text-sm text-slate-600 hover:bg-slate-100";
  const topBar = (
    <div className="flex items-center justify-between gap-3 text-sm">
      <Link href="/practice" className="font-medium text-slate-600 hover:text-brand-700">
        ☰ Problem list
      </Link>
      <div className="flex items-center gap-2">
        {prev && (
          <Link href={`/practice/${prev.slug}`} title={prev.title} className={navBtn}>
            ‹ Prev
          </Link>
        )}
        {next && (
          <Link href={`/practice/${next.slug}`} title={next.title} className={navBtn}>
            Next ›
          </Link>
        )}
      </div>
    </div>
  );

  return <ProblemLayout key={id} tabs={tabs} right={right} topBar={topBar} />;
}

function SelfReport({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      disabled={active}
      className={
        "rounded-full px-3 py-1 text-xs font-medium transition " +
        (active
          ? "bg-green-100 text-green-700"
          : "border border-slate-300 text-slate-600 hover:bg-slate-100")
      }
    >
      {active ? "✓ " : ""}
      {label}
    </button>
  );
}
