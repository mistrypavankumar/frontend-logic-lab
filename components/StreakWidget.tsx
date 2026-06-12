"use client";

import { useProgress } from "@/lib/useProgress";

// Compact daily-streak display. Streak advances when the learner completes a
// lesson or challenge on a new day (see bumpStreak in lib/progress.ts).
export default function StreakWidget() {
  const { state, loaded } = useProgress();
  const { current, longest } = state.streak;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="text-2xl" aria-hidden>
        {loaded && current > 0 ? "🔥" : "🌱"}
      </div>
      <div className="text-sm">
        <div className="font-semibold text-slate-800">
          {loaded ? current : 0} day streak
        </div>
        <div className="text-slate-500">
          Longest: {loaded ? longest : 0} {longest === 1 ? "day" : "days"}
        </div>
      </div>
    </div>
  );
}
