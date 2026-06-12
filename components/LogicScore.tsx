import {
  ChallengeScore,
  LOGIC_SCORE_RULES,
  LOGIC_SCORE_MAX,
  logicPoints,
} from "@/lib/progress";

// Shows HOW a challenge was solved (not just that it was). Rewards thinking:
// solving without the solution, passing edge cases, predicting output, etc.
export default function LogicScore({ score }: { score: ChallengeScore }) {
  const pts = logicPoints(score);
  const earned = LOGIC_SCORE_RULES.filter((r) => score[r.key]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">🏅 Logic Score</h3>
        <span className="text-sm font-bold text-brand-600">
          {pts}
          <span className="text-slate-400"> / {LOGIC_SCORE_MAX}</span>
        </span>
      </div>

      <ul className="mt-3 space-y-1.5 text-sm">
        {LOGIC_SCORE_RULES.map((r) => {
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
      {earned.length === 0 && (
        <p className="mt-2 text-xs text-slate-400">
          Solve the challenge to start earning points.
        </p>
      )}
    </div>
  );
}
