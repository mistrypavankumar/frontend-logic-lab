"use client";

import { useCallback, useEffect, useState } from "react";
import { todayKey, addDays } from "./progress";

// Read-aloud practice log — kept in its own localStorage key (independent of
// the main progress store) since it's a separate, lightweight concern.
// Tracks how many times each article was read aloud, plus a daily practice
// streak to encourage the "10 minutes a day" routine.

const KEY = "fll-reading-v1";

export interface ReadingLog {
  /** article slug → times read aloud */
  counts: Record<string, number>;
  lastDate: string | null; // "YYYY-MM-DD"
  streak: number;
  longest: number;
}

function empty(): ReadingLog {
  return { counts: {}, lastDate: null, streak: 0, longest: 0 };
}

function read(): ReadingLog {
  if (typeof window === "undefined") return empty();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<ReadingLog>;
    return { ...empty(), ...parsed, counts: parsed.counts ?? {} };
  } catch {
    return empty();
  }
}

function write(log: ReadingLog): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(log));
  } catch {
    /* quota / private mode — ignore */
  }
}

export function useReadingLog() {
  const [log, setLog] = useState<ReadingLog>(empty);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLog(read());
    setLoaded(true);
  }, []);

  // Count one completed read-aloud of an article and advance the daily streak.
  const recordRead = useCallback((slug: string) => {
    setLog((prev) => {
      const today = todayKey();
      let { streak, longest } = prev;
      if (prev.lastDate !== today) {
        streak = prev.lastDate === addDays(today, -1) ? prev.streak + 1 : 1;
        longest = Math.max(prev.longest, streak);
      }
      const next: ReadingLog = {
        counts: { ...prev.counts, [slug]: (prev.counts[slug] ?? 0) + 1 },
        lastDate: today,
        streak,
        longest,
      };
      write(next);
      return next;
    });
  }, []);

  return { log, loaded, recordRead };
}
