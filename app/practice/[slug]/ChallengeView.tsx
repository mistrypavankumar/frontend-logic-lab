"use client";

import { useState } from "react";
import Link from "next/link";
import { Challenge, TestCase } from "@/lib/types";
import { getChallenge } from "@/data";
import Section from "@/components/Section";
import CodeBlock from "@/components/CodeBlock";
import ChallengeWorkspace from "@/components/ChallengeWorkspace";
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
import LogicScore from "@/components/LogicScore";
import SelfExplain from "@/components/SelfExplain";
import ConfidenceRating from "@/components/ConfidenceRating";
import { Eli5Block } from "@/components/Eli5";
import { useProgress } from "@/lib/useProgress";

const KIND_LABEL: Record<string, string> = {
  normal: "Normal", empty: "Empty input", invalid: "Invalid input",
  duplicate: "Duplicates", large: "Large input", nullish: "Null/undefined",
  mutation: "No mutation", performance: "Performance",
};

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

  const internalCode = challenge.internalImplementation?.code ?? challenge.solution;
  const related = (challenge.relatedChallengeSlugs ?? [])
    .map((s) => getChallenge(s))
    .filter((c): c is Challenge => c !== undefined);

  const onSolutionRevealed = () => markSolutionViewed(id);

  return (
    <article className="mx-auto max-w-6xl px-4 py-12">
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
          {challenge.isDebugChallenge && (
            <span className="rounded bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
              🐞 Debug
            </span>
          )}
          {done && <span className="text-sm text-green-600">✓ Solved</span>}
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{challenge.title}</h1>

        <div className="mt-4 flex flex-wrap gap-2">
          <CompleteButton done={done} onToggle={() => toggleChallenge(id)} />
          <BookmarkButton active={bookmarked} onToggle={() => toggleBookmark("challenge", id)} />
          <RevisionButton active={inRevision} onToggle={() => toggleRevision("challenge", id)} />
        </div>
      </header>

      <div className="mt-8 space-y-10">
        {/* 1 · Problem */}
        <Section icon="📝" title="1 · Problem">
          <div className="space-y-4">
            <p className="leading-relaxed text-slate-700">{challenge.problem}</p>
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
            {challenge.constraints && challenge.constraints.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Constraints</p>
                <ul className="ml-5 list-disc space-y-1 text-sm text-slate-600">
                  {challenge.constraints.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            )}
            {challenge.mentalModel && <MentalModel text={challenge.mentalModel} />}
            {challenge.eli5 && <Eli5Block text={challenge.eli5} />}
          </div>
        </Section>

        {/* 2 · Real-world scenario */}
        {(challenge.frontendScenario || challenge.realWorldScenario) && (
          <Section icon="🌍" title="2 · Real frontend scenario">
            <p className="rounded-lg bg-brand-50 p-4 text-sm leading-relaxed text-slate-700">
              {challenge.frontendScenario ?? challenge.realWorldScenario}
            </p>
          </Section>
        )}

        {/* Debug-this-code exercise (when this challenge is a debug exercise) */}
        {challenge.debugChallenge && (
          <Section icon="🐞" title="Debug this code">
            <DebugChallengePanel data={challenge.debugChallenge} />
          </Section>
        )}

        {/* 3 · Input / output thinking */}
        {challenge.inputOutputThinking && (
          <Section icon="🔁" title="3 · Input / output thinking">
            <InputOutputThinking data={challenge.inputOutputThinking} />
          </Section>
        )}

        {/* 4 · Pseudocode */}
        {challenge.pseudocode && (
          <Section icon="🧾" title="4 · Pseudocode first">
            <Pseudocode data={challenge.pseudocode} />
          </Section>
        )}

        {/* Warm-up: fill in the blanks (scaffolding before the empty editor) */}
        {challenge.fadedExample && (
          <Section icon="🧩" title="Warm-up · Fill in the blanks">
            <FadedExample data={challenge.fadedExample} />
          </Section>
        )}

        {/* 5 · Try yourself */}
        <Section icon="🚀" title="5 · Try it yourself">
          <ChallengeWorkspace
            key={id}
            starterCode={challenge.starterCode}
            tests={allTests.length > 0 ? allTests : undefined}
            notRunnableHint={
              challenge.flags?.async
                ? "This one is timing/runtime-based — reason it through, then run it in your own project."
                : "Build & run this in your own project."
            }
            onResult={(passed) => {
              setAttempted(true);
              if (!passed) {
                recordScore(id, { everFailed: true });
                recordReview(id, { passed: false }); // bring it back sooner
              }
            }}
            onAllPassed={() => {
              setAttempted(true);
              setJustSolved(true);
              if (!isChallengeDone(id)) toggleChallenge(id);
              recordScore(id, {
                solvedWithoutSolution: !isSolutionViewed(id),
                passedEdgeCases: hiddenTests.length > 0,
              });
            }}
          />
          <p className="mt-2 text-sm text-slate-500">
            {allTests.length > 0
              ? "Edit the code and hit Run — checked against all test cases (including hidden edge cases)."
              : "Edit freely here, then build it in your own project."}
          </p>

          {/* Confidence rating → tunes the spaced-repetition schedule */}
          {justSolved && (
            <div className="mt-3">
              <ConfidenceRating
                onRate={(confidence) => recordReview(id, { passed: true, confidence })}
              />
            </div>
          )}

          {visibleTests.length > 0 && (
            <details className="mt-3 rounded-lg border border-slate-200 bg-white">
              <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-slate-600">
                Test cases ({visibleTests.length}
                {hiddenTests.length > 0 ? ` + ${hiddenTests.length} hidden` : ""})
              </summary>
              <ul className="divide-y divide-slate-100 border-t border-slate-100">
                {visibleTests.map((t, i) => (
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
            </details>
          )}

          {/* Progressive hints (fall back to flat hints when not provided) */}
          <div className="mt-4">
            {challenge.progressiveHints && challenge.progressiveHints.length > 0 ? (
              <ProgressiveHints
                hints={challenge.progressiveHints}
                onReveal={() => recordScore(id, { usedHints: true })}
              />
            ) : (
              challenge.hints.length > 0 && <HintSection hints={challenge.hints} />
            )}
          </div>

          {/* Logic Score + self-report how you solved it */}
          {loaded && (
            <div className="mt-4 space-y-2">
              <LogicScore score={score} />
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
          )}

          {/* Self-explanation — write WHY before peeking at the solution */}
          {loaded && (
            <div className="mt-4">
              <SelfExplain
                value={explanationFor(id)}
                onSave={(text) => saveExplanation(id, text)}
              />
            </div>
          )}
        </Section>

        {/* 6 · Predict the output */}
        {challenge.predictOutput && challenge.predictOutput.length > 0 && (
          <Section icon="🔮" title="6 · Predict the output">
            <p className="mb-3 text-sm text-slate-500">
              Commit to an answer before you reveal the solutions below.
            </p>
            <PredictOutput
              questions={challenge.predictOutput}
              onResult={(correct) =>
                correct && recordScore(id, { predictedCorrectly: true })
              }
            />
          </Section>
        )}

        {/* 7–9 + comparisons: gated until the learner gives it a real attempt */}
        {!solutionsUnlocked ? (
          <Section icon="🔒" title="7 · Solutions (locked)">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
              <p className="font-medium text-slate-800">
                ✋ Give it a real attempt first.
              </p>
              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                Run your code at least once above — even a wrong attempt teaches you far
                more than reading the answer cold. The solutions unlock automatically once
                you do.
              </p>
              <button
                onClick={() => setRevealAnyway(true)}
                className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white"
              >
                Reveal solutions anyway
              </button>
            </div>
          </Section>
        ) : (
          <>
            {/* 7 · Built-in solution */}
            {challenge.builtInSolution && (
              <Section icon="✅" title="7 · Built-in solution">
                <SolutionToggle
                  heading="Reveal built-in solution"
                  code={challenge.builtInSolution.code}
                  language={challenge.builtInSolution.language}
                  explanation="Reach for the native method first — it's tested, fast, and clear."
                  onReveal={onSolutionRevealed}
                />
              </Section>
            )}

            {/* 8 · Manual solution */}
            {challenge.manualSolution && (
              <Section icon="✋" title="8 · Manual solution">
                <SolutionToggle
                  heading="Reveal manual (loop) solution"
                  code={challenge.manualSolution.code}
                  language={challenge.manualSolution.language}
                  explanation="The same result with basic loops/spread — useful where the built-in isn't available."
                  onReveal={onSolutionRevealed}
                />
              </Section>
            )}

            {/* 9 · Internal implementation */}
            <Section icon="🔧" title="9 · Internal implementation">
              <SolutionToggle
                heading="Reveal from-scratch implementation"
                code={internalCode}
                language="js"
                explanation={challenge.explanation}
                onReveal={onSolutionRevealed}
              />
            </Section>

            {/* Built-in vs manual vs internal — visual comparison + when to use */}
            {challenge.methodComparison && (
              <Section icon="⚖️" title="Built-in vs manual vs internal">
                <MethodComparison data={challenge.methodComparison} />
              </Section>
            )}

            {/* Multiple solutions + tradeoffs */}
            {challenge.multipleSolutions && challenge.multipleSolutions.length > 0 && (
              <Section icon="🪜" title="Multiple approaches & tradeoffs">
                <MultipleSolutions variants={challenge.multipleSolutions} />
              </Section>
            )}
          </>
        )}

        {/* 10 · Dry run */}
        {challenge.dryRun && challenge.dryRun.length > 0 && (
          <Section icon="👣" title="10 · Dry run (step by step)">
            <DryRun steps={challenge.dryRun} />
          </Section>
        )}

        {/* 11 · Variable tracker */}
        {challenge.variableTrace && (
          <Section icon="📊" title="11 · Variable tracker">
            <VariableTracker trace={challenge.variableTrace} />
          </Section>
        )}

        {/* 12 · Edge cases */}
        {challenge.edgeCases && challenge.edgeCases.length > 0 && (
          <Section icon="🧪" title="12 · Edge cases">
            <ul className="ml-5 list-disc space-y-1 text-sm text-slate-700">
              {challenge.edgeCases.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </Section>
        )}

        {/* 13 · Common mistakes */}
        {challenge.commonMistakes && challenge.commonMistakes.length > 0 && (
          <Section icon="🚫" title="13 · Common mistakes">
            <CommonMistakes items={challenge.commonMistakes} />
          </Section>
        )}

        {/* 14 · Complexity + industrial notes */}
        {(challenge.timeComplexity ||
          challenge.spaceComplexity ||
          (challenge.industrialNotes && challenge.industrialNotes.length > 0)) && (
          <Section icon="💼" title="14 · Complexity & industrial notes">
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

        {/* 15 · Related challenges */}
        {related.length > 0 && (
          <Section icon="🔗" title="15 · Related challenges">
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
    </article>
  );
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
