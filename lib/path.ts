import { allPathStages, getLesson, getChallenge } from "@/data";

// Resolves the Roadmap against the learner's progress: each step gets a status
// (done / current / upcoming), and we surface the single "next" step so the UI
// can say exactly what to do next.

export type StepStatus = "done" | "current" | "upcoming";

export interface ResolvedStep {
  key: string;
  kind: "lesson" | "challenge" | "milestone";
  title: string;
  href?: string;
  /** difficulty / "Lesson" / "Challenge" label */
  badge?: string;
  why?: string;
  status: StepStatus;
}

export interface ResolvedStage {
  slug: string;
  title: string;
  icon: string;
  goal: string;
  steps: ResolvedStep[];
  doneCount: number;
  total: number; // counts only real (non-milestone) steps
}

export interface ResolvedPath {
  stages: ResolvedStage[];
  next: ResolvedStep | null; // the one thing to do next (null = complete)
  doneCount: number;
  total: number;
}

export function resolvePath(
  isLessonDone: (id: string) => boolean,
  isChallengeDone: (id: string) => boolean
): ResolvedPath {
  let nextFound = false;
  let next: ResolvedStep | null = null;
  let doneCount = 0;
  let total = 0;

  const stages: ResolvedStage[] = allPathStages.map((stage) => {
    let stageDone = 0;
    let stageTotal = 0;

    const steps: ResolvedStep[] = stage.steps.map((step, i) => {
      const key = `${stage.slug}-${i}`;

      if (step.ref.kind === "milestone") {
        // A milestone is "reached" once everything before it is done.
        return {
          key,
          kind: "milestone" as const,
          title: step.ref.text,
          why: step.why,
          status: (nextFound ? "upcoming" : "done") as StepStatus,
        };
      }

      const isLesson = step.ref.kind === "lesson";
      const item = isLesson
        ? getLesson(step.ref.slug)
        : getChallenge(step.ref.slug);

      stageTotal += 1;
      total += 1;

      const done = item
        ? isLesson
          ? isLessonDone((item as { id: string }).id)
          : isChallengeDone((item as { id: string }).id)
        : false;
      if (done) {
        stageDone += 1;
        doneCount += 1;
      }

      let status: StepStatus;
      if (done) status = "done";
      else if (!nextFound) {
        status = "current";
        nextFound = true;
      } else status = "upcoming";

      const resolved: ResolvedStep = {
        key,
        kind: isLesson ? "lesson" : "challenge",
        title: item ? (item as { title: string }).title : step.ref.slug,
        href: item
          ? isLesson
            ? `/learn/${step.ref.slug}`
            : `/practice/${step.ref.slug}`
          : undefined,
        badge: item
          ? (item as { difficulty?: string }).difficulty ??
            (isLesson ? "Lesson" : "Challenge")
          : undefined,
        why: step.why,
        status,
      };

      if (status === "current" && !next) next = resolved;
      return resolved;
    });

    return {
      slug: stage.slug,
      title: stage.title,
      icon: stage.icon,
      goal: stage.goal,
      steps,
      doneCount: stageDone,
      total: stageTotal,
    };
  });

  return { stages, next, doneCount, total };
}
