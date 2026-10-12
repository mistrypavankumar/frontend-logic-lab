"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { allChallenges, allDsaTopics } from "@/data";
import { Challenge, Difficulty, DIFFICULTIES } from "@/lib/types";
import CodeBlock from "@/components/CodeBlock";
import DifficultyBadge from "@/components/DifficultyBadge";
import ChallengeWorkspace from "@/components/ChallengeWorkspace";
import ProblemLayout, { PanelTab } from "@/components/ProblemLayout";
import { useProgress } from "@/lib/useProgress";

// Interview Mode — a timed mock interview that walks the same four stages a
// real one does: understand & clarify → explain the approach → code it (with
// tests) → review against a model answer and rate yourself. Ratings feed the
// spaced-repetition schedule, so shaky questions come back in the Daily Mix.

type Track = "All" | "DSA" | "Frontend";
type Stage = "clarify" | "approach" | "code" | "review";
type Rating = "nailed" | "helped" | "missed";

const STAGES: { key: Stage; label: string }[] = [
  { key: "clarify", label: "Clarify" },
  { key: "approach", label: "Approach" },
  { key: "code", label: "Code" },
  { key: "review", label: "Review" },
];

// Rough time budgets a real interviewer would allow, by difficulty.
const TARGET_MINUTES: Record<Difficulty, number> = {
  Beginner: 15,
  Intermediate: 25,
  Advanced: 35,
  Industrial: 40,
  Expert: 45,
};

const RATINGS: { key: Rating; label: string; cls: string }[] = [
  { key: "nailed", label: "✅ Nailed it", cls: "bg-green-600 hover:bg-green-700" },
  { key: "helped", label: "🟡 Got there with help", cls: "bg-amber-500 hover:bg-amber-600" },
  { key: "missed", label: "❌ Couldn't solve it", cls: "bg-rose-600 hover:bg-rose-700" },
];

// Questions a strong candidate asks before coding, used when a challenge has
// no specific constraints/edge cases of its own.
const GENERIC_CLARIFY = [
  "What should happen with empty input?",
  "Can the input contain duplicates, negatives, or null/undefined?",
  "Am I allowed to modify the input, or should I return a new value?",
  "How large can the input get — does an O(n²) approach matter?",
];

const isDsa = (c: Challenge) => c.category.startsWith("DSA");

const fmt = (sec: number) =>
  `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

export default function InterviewPage() {
  const questions = useMemo(
    () => allChallenges.filter((c) => c.flags?.interview),
    []
  );

  const [track, setTrack] = useState<Track>("All");
  const [level, setLevel] = useState<"All" | Difficulty>("All");
  const [order, setOrder] = useState<string[] | null>(null); // shuffled ids
  const [i, setI] = useState(0);
  const [results, setResults] = useState<Record<string, { rating: Rating; seconds: number }>>({});

  const inTrack = (q: Challenge, t: Track) => t === "All" || (t === "DSA") === isDsa(q);
  const trackQuestions = questions.filter((q) => inTrack(q, track));
  // Only offer levels this track actually has (DSA has no Industrial/Expert).
  const levelCount = (d: Difficulty) => trackQuestions.filter((q) => q.difficulty === d).length;
  const presentLevels = DIFFICULTIES.filter((d) => levelCount(d) > 0);

  const pickTrack = (t: Track) => {
    setTrack(t);
    setI(0);
    // Drop a level filter the new track has no questions for.
    if (level !== "All" && !questions.some((q) => inTrack(q, t) && q.difficulty === level)) {
      setLevel("All");
    }
  };

  const queue = useMemo(() => {
    const filtered = questions.filter(
      (q) =>
        (track === "All" || (track === "DSA") === isDsa(q)) &&
        (level === "All" || q.difficulty === level)
    );
    if (!order) return filtered;
    const pos = new Map(order.map((id, n) => [id, n]));
    return [...filtered].sort((a, b) => (pos.get(a.id) ?? 0) - (pos.get(b.id) ?? 0));
  }, [questions, track, level, order]);

  const go = (next: number) => setI((next + queue.length) % queue.length);
  const shuffle = () => {
    const ids = questions.map((q) => q.id);
    for (let k = ids.length - 1; k > 0; k--) {
      const r = Math.floor(Math.random() * (k + 1));
      [ids[k], ids[r]] = [ids[r], ids[k]];
    }
    setOrder(ids);
    setI(0);
  };

  const rated = Object.values(results);
  const tally = (r: Rating) => rated.filter((x) => x.rating === r).length;
  const avgTime = rated.length
    ? Math.round(rated.reduce((s, x) => s + x.seconds, 0) / rated.length)
    : 0;

  const chip = (active: boolean) =>
    "rounded-full px-2.5 py-0.5 text-xs font-medium transition " +
    (active
      ? "bg-brand-600 text-white"
      : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-100");
  const navBtn =
    "rounded-md border border-slate-200 px-2 py-0.5 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-40";

  const q = queue[Math.min(i, queue.length - 1)];

  // Filters, question navigation and the session tally — one compact top bar.
  const top = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
      <span className="font-semibold text-slate-800">🎤 Interview</span>
      <div className="flex flex-wrap gap-1">
        {(["All", "DSA", "Frontend"] as Track[]).map((t) => (
          <button key={t} onClick={() => pickTrack(t)} className={chip(track === t)}>
            {t === "Frontend" ? "Frontend / JS" : t}{" "}
            <span className="opacity-60">{questions.filter((q) => inTrack(q, t)).length}</span>
          </button>
        ))}
      </div>
      <span className="h-5 w-px bg-slate-200" aria-hidden />
      <div className="flex flex-wrap gap-1">
        {(["All", ...presentLevels] as ("All" | Difficulty)[]).map((d) => (
          <button key={d} onClick={() => { setLevel(d); setI(0); }} className={chip(level === d)}>
            {d === "All" ? "Any level" : d}
            {d !== "All" && <span className="ml-1 opacity-60">{levelCount(d)}</span>}
          </button>
        ))}
      </div>
      <span className="h-5 w-px bg-slate-200" aria-hidden />
      <div className="flex items-center gap-1.5">
        <button onClick={() => go(i - 1)} disabled={queue.length === 0} className={navBtn} aria-label="Previous question">‹</button>
        <span className="tabular-nums text-slate-600">
          {queue.length > 0 ? `${Math.min(i, queue.length - 1) + 1} / ${queue.length}` : "0 / 0"}
        </span>
        <button onClick={() => go(i + 1)} disabled={queue.length === 0} className={navBtn} aria-label="Next question">›</button>
        <button onClick={shuffle} className={navBtn} title="Shuffle the questions">🎲</button>
      </div>
      {rated.length > 0 && (
        <span className="text-xs text-slate-500">
          This session: ✅ {tally("nailed")} · 🟡 {tally("helped")} · ❌ {tally("missed")} · avg {fmt(avgTime)}
        </span>
      )}
    </div>
  );

  if (!q) {
    return (
      <div className="mx-auto max-w-screen-2xl px-4 py-6 lg:px-8">
        {top}
        <p className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No interview questions match these filters.
        </p>
      </div>
    );
  }

  return (
    <InterviewQuestion
      key={q.id}
      q={q}
      top={top}
      previous={results[q.id]?.rating}
      onRated={(rating, seconds) => {
        setResults((r) => ({ ...r, [q.id]: { rating, seconds } }));
      }}
      onNext={() => go(i + 1)}
    />
  );
}

// ---------------------------------------------------------------------------
// One question. Keyed by id, so every stage/timer/answer resets per question.
// ---------------------------------------------------------------------------

function InterviewQuestion({
  q,
  top,
  previous,
  onRated,
  onNext,
}: {
  q: Challenge;
  /** Filters / navigation, shown in the top bar next to the timer. */
  top: ReactNode;
  previous?: Rating;
  onRated: (rating: Rating, seconds: number) => void;
  onNext: () => void;
}) {
  const { recordReview, recordScore, toggleChallenge, isChallengeDone } = useProgress();

  const [stage, setStage] = useState<Stage>("clarify");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [approach, setApproach] = useState("");
  const [pattern, setPattern] = useState<string | null>(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [testsPassed, setTestsPassed] = useState(false);
  const [rating, setRating] = useState<Rating | null>(previous ?? null);

  // The clock runs while you work. It stops the moment every test passes (your
  // solve time), starts again if a later run fails, and stops for good once
  // you rate yourself.
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const target = TARGET_MINUTES[q.difficulty] * 60;
  const solved = testsPassed && !running;
  const clockCls = solved
    ? "bg-green-100 text-green-700"
    : seconds > target
      ? "bg-rose-100 text-rose-700"
      : seconds > target * 0.75
      ? "bg-amber-100 text-amber-700"
      : "bg-slate-100 text-slate-700";

  // Rules come from the problem; edge cases are what you'd ASK about. Both
  // lists are de-duplicated (several data fields often restate the same case).
  const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const rules = Array.from(new Set(q.constraints ?? []));
  const ruleKeys = new Set(rules.map(norm));
  const edgeCases = Array.from(
    new Map(
      [...(q.edgeCases ?? []), ...(q.inputOutputThinking?.edgeCases ?? [])]
        .filter((e) => !ruleKeys.has(norm(e)))
        .map((e) => [norm(e), e] as const)
    ).values()
  );

  // DSA questions get a "which pattern is this?" check during the approach.
  const topic = allDsaTopics.find((t) => t.problemSlugs.includes(q.slug));
  const patternOptions = useMemo(() => {
    if (!topic) return [];
    const others = allDsaTopics.filter((t) => t.slug !== topic.slug).map((t) => t.name);
    const seed = [...q.slug].reduce((a, ch) => a + ch.charCodeAt(0), 0);
    const picked = Array.from({ length: 3 }, (_, k) => others[(seed + k * 5) % others.length]);
    const unique = Array.from(new Set(picked));
    unique.splice(seed % (unique.length + 1), 0, topic.name);
    return unique;
  }, [q.slug, topic]);

  const stageIndex = STAGES.findIndex((s) => s.key === stage);
  const modelAnswer = q.internalImplementation?.code ?? q.solution;

  const rate = (r: Rating) => {
    setRating(r);
    setRunning(false);
    onRated(r, seconds);
    recordReview(q.id, {
      passed: r !== "missed",
      confidence: r === "nailed" ? 5 : r === "helped" ? 3 : 1,
    });
    if (hintsShown > 0) recordScore(q.id, { usedHints: true });
  };

  const nextBtn = (label: string, to: Stage) => (
    <button
      onClick={() => setStage(to)}
      className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
    >
      {label}
    </button>
  );

  const problemHeader = (
    <header>
      <h1 className="text-2xl font-bold text-slate-900">{q.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <DifficultyBadge level={q.difficulty} />
        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{q.category}</span>
        {previous && <span className="text-xs text-slate-400">Rated this session</span>}
      </div>
    </header>
  );

  const problemBody = (
    <div className="space-y-4">
      <p className="leading-relaxed text-slate-700">{q.problem}</p>
      <div>
        <p className="mb-1 text-sm font-semibold text-slate-800">Example</p>
        <CodeBlock code={`${q.example.input}\n// → ${q.example.output}`} language="js" />
      </div>
    </div>
  );

  // Later stages keep the problem one click away.
  const recap = (
    <details className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2">
      <summary className="cursor-pointer text-sm font-medium text-slate-700">📝 Problem: {q.title}</summary>
      <div className="mt-3">{problemBody}</div>
    </details>
  );

  const tabs: PanelTab[] = [
    {
      key: "clarify",
      content: (
        <div className="space-y-6">
          {problemHeader}
          {problemBody}
          <div className="space-y-3 border-t border-slate-100 pt-5">
            <h3 className="font-semibold text-slate-800">1 · Understand & clarify</h3>
            <p className="mt-1 text-sm text-slate-600">
              Restate the problem in your own words, then ask about the unknowns before
              you write any code.
            </p>
            {rules.length > 0 && (
              <div className="mt-3">
                <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Rules</p>
                <ul className="ml-5 list-disc space-y-1 text-sm text-slate-700">
                  {rules.map((c, n) => <li key={n}>{c}</li>)}
                </ul>
              </div>
            )}
            <div className="mt-3">
              <p className="mb-1 text-xs font-semibold uppercase text-slate-400">
                Edge cases worth asking about
              </p>
              <ul className="ml-5 list-disc space-y-1 text-sm text-slate-700">
                {(edgeCases.length > 0 ? edgeCases : GENERIC_CLARIFY).map((c, n) => (
                  <li key={n}>{c}</li>
                ))}
              </ul>
            </div>
            {nextBtn("I understand it — next: approach →", "approach")}
          </div>
        </div>
      ),
    },
    {
      key: "approach",
      content: (
        <div className="space-y-4">
          {recap}
          <div>
            <h3 className="font-semibold text-slate-800">2 · Explain your approach</h3>
            <p className="mt-1 text-sm text-slate-600">
              Say it out loud (or type it): the brute force first, then how you'd improve it,
              and the time/space complexity you expect.
            </p>
          </div>
          {topic && (
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Which pattern fits?</p>
              <div className="flex flex-wrap gap-2">
                {patternOptions.map((opt) => {
                  const chosen = pattern === opt;
                  const correct = opt === topic.name;
                  return (
                    <button
                      key={opt}
                      onClick={() => !pattern && setPattern(opt)}
                      disabled={!!pattern}
                      className={
                        "rounded-lg border px-3 py-1.5 text-sm transition " +
                        (pattern && correct
                          ? "border-green-500 bg-green-50 text-green-700"
                          : chosen
                          ? "border-rose-400 bg-rose-50 text-rose-700"
                          : "border-slate-300 text-slate-700 hover:bg-slate-100")
                      }
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {pattern && (
                <p className="mt-2 text-sm text-slate-600">
                  {pattern === topic.name ? "✅ Right. " : `❌ It's ${topic.name}. `}
                  {topic.whenToUse}
                </p>
              )}
            </div>
          )}
          <textarea
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
            rows={5}
            placeholder={"Brute force: …\nBetter: …\nTime: O(…)  Space: O(…)"}
            className="w-full rounded-lg border border-slate-300 p-3 font-mono text-sm text-slate-700 focus:border-brand-500 focus:outline-none"
          />
          {nextBtn("Start coding →", "code")}
        </div>
      ),
    },
    {
      key: "code",
      content: (
        <div className="space-y-4">
          {recap}
          <div>
            <h3 className="font-semibold text-slate-800">3 · Code it</h3>
            <p className="mt-1 text-sm text-slate-600">
              Write it in the editor and keep talking while you type. <strong>Run</strong> checks
              the visible tests; <strong>Submit</strong> adds the hidden edge cases and stops the
              clock when everything passes. Then walk one example through by hand.
            </p>
          </div>
          {testsPassed && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
              🎉 All tests pass. Before moving on: what's the complexity, and which edge case worried you most?
            </p>
          )}
          {q.hints.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">
                Stuck? Ask the interviewer for a nudge ({hintsShown}/{q.hints.length} used)
              </p>
              <ol className="space-y-2">
                {q.hints.slice(0, hintsShown).map((h, n) => (
                  <li key={n} className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    💡 {h}
                  </li>
                ))}
              </ol>
              {hintsShown < q.hints.length && (
                <button
                  onClick={() => setHintsShown((n) => n + 1)}
                  className="mt-2 rounded-lg border border-amber-300 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-50"
                >
                  Get a hint
                </button>
              )}
            </div>
          )}
          {nextBtn("I'm done — review →", "review")}
        </div>
      ),
    },
    {
      key: "review",
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-800">4 · Review</h3>
          {approach.trim() && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Your approach</p>
              <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 font-mono text-sm text-slate-700">{approach}</p>
            </div>
          )}
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Model answer</p>
            <CodeBlock code={modelAnswer} language="js" />
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{q.explanation}</p>
            {(q.timeComplexity || q.spaceComplexity) && (
              <p className="mt-2 text-sm text-slate-500">
                Complexity — time: <code className="font-mono">{q.timeComplexity ?? "—"}</code>, space:{" "}
                <code className="font-mono">{q.spaceComplexity ?? "—"}</code>
              </p>
            )}
          </div>
          {q.commonMistakes && q.commonMistakes.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Did you avoid these?</p>
              <ul className="ml-5 list-disc space-y-1 text-sm text-slate-600">
                {q.commonMistakes.map((m, n) => <li key={n}>{m}</li>)}
              </ul>
            </div>
          )}

          <div className="border-t border-slate-100 pt-4">
            <p className="mb-2 text-sm font-medium text-slate-700">
              How did it go? {testsPassed ? "(tests passed)" : "(tests not passed yet)"} · time {fmt(seconds)}
            </p>
            <div className="flex flex-wrap gap-2">
              {RATINGS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => rate(r.key)}
                  className={
                    "rounded-lg px-3 py-1.5 text-sm font-semibold text-white transition " +
                    r.cls +
                    (rating && rating !== r.key ? " opacity-40" : "")
                  }
                >
                  {r.label}
                </button>
              ))}
            </div>
            {rating && (
              <p className="mt-2 text-sm text-slate-500">
                {rating === "nailed"
                  ? "Saved — this one will come back for review in a while."
                  : "Saved — it'll come back sooner in your Daily Mix so you can try again."}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={onNext}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Next question →
              </button>
              <Link href={`/practice/${q.slug}`} className="text-sm font-medium text-brand-600 hover:underline">
                Open the full challenge (dry run, multiple solutions) →
              </Link>
            </div>
          </div>
        </div>
      ),
    },
  ].map((t) => {
    const n = STAGES.findIndex((s) => s.key === t.key);
    return {
      ...t,
      label: `${n < stageIndex ? "✓" : `${n + 1}.`} ${STAGES[n].label}`,
    };
  });

  const topBar = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {top}
      <div className="flex shrink-0 items-center gap-2">
          <span className={`rounded-lg px-2.5 py-0.5 font-mono text-base font-semibold ${clockCls}`} aria-live="off">
            ⏱ {fmt(seconds)} <span className="text-sm font-normal opacity-70">/ {TARGET_MINUTES[q.difficulty]}:00</span>
          </span>
          {solved && !rating && (
            <span className="text-sm font-medium text-green-700">✓ Solved</span>
          )}
          {!rating && !solved && (
            <button
              onClick={() => setRunning((r) => !r)}
              className="rounded-md border border-slate-300 px-2 py-0.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              {running ? "Pause" : "Resume"}
            </button>
          )}

        </div>
    </div>
  );

  return (
    <ProblemLayout
      tabs={tabs}
      tab={stage}
      onTabChange={(k) => setStage(k as Stage)}
      topBar={topBar}
      right={
        <ChallengeWorkspace
          starterCode={q.starterCode}
          tests={q.tests}
          hiddenTests={q.hiddenTests}
          notRunnableHint="Talk it through, then build it in your own project."
          onResult={(passed) => {
            setTestsPassed(passed);
            if (passed) {
              setRunning(false); // solved — freeze the clock at the solve time
            } else {
              recordScore(q.id, { everFailed: true });
              if (!rating) setRunning(true); // a failing submit means you're still working
            }
          }}
          onAllPassed={() => {
            if (!isChallengeDone(q.id)) toggleChallenge(q.id);
          }}
        />
      }
    />
  );
}
