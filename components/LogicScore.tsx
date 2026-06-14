import { ChallengeScore, LOGIC_SCORE_RULES } from "@/lib/progress";

// Shows HOW a challenge was solved (not just that it was). Rewards thinking:
// solving without the solution, passing edge cases, predicting output, etc.
//
// `applicable` lists which signals are achievable for THIS challenge (e.g. only
// challenges with a predict-the-output question can earn that point). When
// given, the list and the max adapt — so a point you can't earn here isn't
// shown as a permanent miss.
export default function LogicScore({
  score,
  applicable,
}: {
  score: ChallengeScore;
  applicable?: (keyof ChallengeScore)[];
}) {
  const rules = applicable
    ? LOGIC_SCORE_RULES.filter((r) => applicable.includes(r.key))
    : LOGIC_SCORE_RULES;

  const max = rules.reduce((s, r) => s + r.points, 0);
  let pts = rules.reduce((s, r) => s + (score[r.key] ? r.points : 0), 0);
  if (score.usedHints && pts > 0) pts = Math.max(0, pts - 1);

  const earnedAny = rules.some((r) => score[r.key]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">🏅 Logic Score</h3>
        <span className="text-sm font-bold text-brand-600">
          {pts}
          <span className="text-slate-400"> / {max}</span>
        </span>
      </div>

      <ul className="mt-3 space-y-1.5 text-sm">
        {rules.map((r) => {
          const got = !!score[r.key];
          return (
            <li
              key={r.key}
              className={"flex items-center gap-2 " + (got ? "text-slate-700" : "text-slate-400")}
            >
              <span>{got ? "✅" : "⬜"}</span>
              <span>{r.label}</span>
              <span className="ml-auto text-xs">+{r.points}</span>
            </li>
          );
        })}
      </ul>

      {score.usedHints && (
        <p className="mt-2 text-xs text-amber-600">💡 Hints used (−1)</p>
      )}
      {!earnedAny && (
        <p className="mt-2 text-xs text-slate-400">
          Solve the challenge to start earning points.
        </p>
      )}
    </div>
  );
}
