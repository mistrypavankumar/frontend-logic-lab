import Link from "next/link";
import { allChallenges, allLessons, getChallenge } from "@/data";
import ChallengeCard from "@/components/ChallengeCard";
import ChallengeWorkspace from "@/components/ChallengeWorkspace";

export const metadata = { title: "Async Lab — Frontend Logic Lab" };

export default function AsyncLabPage() {
  const demo = getChallenge("retry-promise");
  const asyncChallenges = allChallenges.filter((c) => c.flags?.async);
  const asyncLessons = allLessons.filter((l) => l.category === "Async JavaScript");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">⚡ Async JavaScript Lab</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Promises, retries, timeouts, concurrency limits, cancellation, caching,
          and race-condition prevention. Try the live demo, then work the bank.
        </p>
      </header>

      {demo && (
        <section className="mb-10 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-1 text-lg font-bold text-slate-800">Try it: {demo.title}</h2>
          <p className="mb-3 text-sm text-slate-600">{demo.problem}</p>
          <ChallengeWorkspace starterCode={demo.starterCode} tests={demo.tests} />
          <Link href={`/practice/${demo.slug}`} className="mt-3 inline-block text-sm font-medium text-brand-600 hover:underline">
            Open full challenge (built-in · manual · internal · edge cases) →
          </Link>
        </section>
      )}

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-slate-800">Concepts</h2>
        <div className="flex flex-wrap gap-2">
          {asyncLessons.map((l) => (
            <Link
              key={l.id}
              href={`/learn/${l.slug}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:border-brand-300 hover:text-brand-700"
            >
              {l.title}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-800">
          Async challenges <span className="text-sm font-normal text-slate-400">({asyncChallenges.length})</span>
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {asyncChallenges.map((c) => <ChallengeCard key={c.id} challenge={c} />)}
        </div>
      </section>
    </div>
  );
}
