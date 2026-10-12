import Link from "next/link";
import { Challenge, Lesson } from "@/lib/types";
import ChallengeCard from "./ChallengeCard";
import ChallengeWorkspace from "./ChallengeWorkspace";
import ProblemLayout from "./ProblemLayout";

// Shared LeetCode-style layout for the Labs: tabs on the left (the demo
// problem, the concept lessons, the full challenge bank) and a live editor on
// the right for the demo challenge.
export default function LabView({
  title,
  intro,
  demo,
  lessons,
  challenges,
  challengesLabel,
}: {
  title: string;
  intro: string;
  demo?: Challenge;
  lessons: Lesson[];
  challenges: Challenge[];
  challengesLabel: string;
}) {
  const tabs = [
    {
      key: "try",
      label: "⚡ Try it",
      content: (
        <div className="space-y-6">
          <header>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-2 text-slate-600">{intro}</p>
          </header>
          {demo && (
            <section className="space-y-3 border-t border-slate-100 pt-6">
              <h2 className="text-lg font-bold text-slate-800">Try it: {demo.title}</h2>
              <p className="leading-relaxed text-slate-700">{demo.problem}</p>
              <Link href={`/practice/${demo.slug}`} className="inline-block text-sm font-medium text-brand-600 hover:underline">
                Open full challenge (built-in · manual · internal · edge cases) →
              </Link>
            </section>
          )}
        </div>
      ),
    },
    {
      key: "concepts",
      label: `📚 Concepts (${lessons.length})`,
      content: (
        <div className="flex flex-wrap gap-2">
          {lessons.map((l) => (
            <Link
              key={l.id}
              href={`/learn/${l.slug}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:border-brand-300 hover:text-brand-700"
            >
              {l.title}
            </Link>
          ))}
        </div>
      ),
    },
    {
      key: "challenges",
      label: `🧩 ${challengesLabel} (${challenges.length})`,
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          {challenges.map((c) => <ChallengeCard key={c.id} challenge={c} />)}
        </div>
      ),
    },
  ];

  return (
    <ProblemLayout
      tabs={tabs}
      right={
        demo && (
          <ChallengeWorkspace
            starterCode={demo.starterCode}
            tests={demo.tests}
            hiddenTests={demo.hiddenTests}
          />
        )
      }
    />
  );
}
