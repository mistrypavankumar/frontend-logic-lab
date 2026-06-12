// Single source of truth: merges every lesson/challenge data file into the
// arrays the app consumes. Add new data files here and the whole app picks
// them up. Pages should import from "@/data" — not the individual files.

import { Lesson, Challenge, LessonCategory } from "@/lib/types";

// --- lessons ---
import { lessons as coreLessons } from "./lessons";
import { modernArrayLessons } from "./lessons.modern.array";
import { modernObjectLessons } from "./lessons.modern.objects";
import { modernSetLessons } from "./lessons.modern.set";
import { modernAsyncLessons } from "./lessons.modern.async";
import { internalsLessons } from "./lessons.internals";

// --- challenges ---
import { challenges as coreChallenges } from "./challenges";
import { arrayChallenges } from "./challenges.array";
import { objectChallenges } from "./challenges.objects";
import { stringChallenges } from "./challenges.strings";
import { asyncChallenges } from "./challenges.async";
import { industrialChallenges } from "./challenges.industrial";
import { debugChallenges } from "./challenges.debug";

export const allLessons: Lesson[] = [
  ...coreLessons,
  ...modernArrayLessons,
  ...modernObjectLessons,
  ...modernSetLessons,
  ...modernAsyncLessons,
  ...internalsLessons,
];

export const allChallenges: Challenge[] = [
  ...coreChallenges,
  ...arrayChallenges,
  ...objectChallenges,
  ...stringChallenges,
  ...asyncChallenges,
  ...industrialChallenges,
  ...debugChallenges,
];

// --- ordered / filtered views ---
export const orderedLessons = [...allLessons].sort((a, b) => a.order - b.order);
export const modernMethodLessons = orderedLessons.filter((l) => l.isModernMethod);
export const debugChallengeList = allChallenges.filter((c) => c.isDebugChallenge);
export const internalsLessonList = orderedLessons.filter(
  (l) => l.category === "JavaScript Internals"
);

// --- lookups ---
export function getLesson(slug: string): Lesson | undefined {
  return allLessons.find((l) => l.slug === slug);
}
export function getChallenge(slug: string): Challenge | undefined {
  return allChallenges.find((c) => c.slug === slug);
}

// --- derived filter options ---
export const lessonCategories: LessonCategory[] = Array.from(
  new Set(allLessons.map((l) => l.category))
);

export const challengeTopics: string[] = Array.from(
  new Set(allChallenges.map((c) => c.category))
).sort();

/** All method names referenced anywhere (for the challenge "Method" filter). */
export const allMethods: string[] = Array.from(
  new Set([
    ...allLessons.flatMap((l) => l.relatedMethods ?? []),
    ...allChallenges.flatMap((c) => c.relatedMethods ?? []),
  ])
).sort();
