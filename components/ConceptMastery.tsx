import { allChallenges } from "@/data";
import { ChallengeScore } from "@/lib/progress";
import ProgressBar from "./ProgressBar";

// Mastery per concept (by the methods a challenge drills), so progress reads as
// "filter: 4/5, 3 solved solo" instead of just a global count. Only shows
// concepts the learner has actually started, sorted by how far along they are.
export default function ConceptMastery({
  completedChallenges,
  scores,
}: {
  completedChallenges: string[];
  scores: Record<string, ChallengeScore>;
}) {
  const done = new Set(completedChallenges);
  const byConcept = new Map<
    string,
    { total: number; solved: number; mastered: number }
  >();

  for (const c of allChallenges) {
    for (const concept of c.relatedMethods ?? []) {
      const e = byConcept.get(concept) ?? { total: 0, solved: 0, mastered: 0 };
      e.total++;
      if (done.has(c.id)) e.solved++;
      if (scores[c.id]?.solvedWithoutSolution) e.mastered++;
      byConcept.set(concept, e);
    }
  }

  const rows = [...byConcept.entries()]
    .filter(([, e]) => e.total >= 2 && e.solved > 0) // meaningful + started
    .sort((a, b) => b[1].solved / b[1].total - a[1].solved / a[1].total)
    .slice(0, 12);

  if (rows.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-semibold text-slate-800">Concept mastery</h2>
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {rows.map(([concept, e]) => (
          <div key={concept}>
            <ProgressBar value={e.solved} total={e.total} label={concept} />
            {e.mastered > 0 && (
              <p className="mt-0.5 text-xs text-green-600">
                {e.mastered} solved without the solution
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
