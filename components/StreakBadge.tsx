"use client";

import Link from "next/link";
import { useProgress } from "@/lib/useProgress";

// Compact daily-streak chip for the header. Only appears once a streak exists
// (and after hydration), so it never flashes a "0" or causes a mismatch.
export default function StreakBadge() {
  const { state, loaded } = useProgress();
  const n = loaded ? state.streak.current : 0;
  if (n <= 0) return null;

  return (
    <Link
      href="/progress"
      title={`${n}-day streak — keep it going!`}
      className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 hover:bg-orange-200"
    >
      🔥 {n}
    </Link>
  );
}
