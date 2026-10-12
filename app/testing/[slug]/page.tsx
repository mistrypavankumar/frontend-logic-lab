import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { testingLessons, getTestingLesson } from "@/data/testing";
import TestingLessonView from "./TestingLessonView";

// Pre-render every Testing lesson at build time (static).
export function generateStaticParams() {
  return testingLessons.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const lesson = getTestingLesson(params.slug);
  if (!lesson) return { title: "Lesson not found — Frontend Logic Lab" };
  return { title: `${lesson.title} · Testing — Frontend Logic Lab`, description: lesson.summary };
}

export default function TestingLessonPage({ params }: { params: { slug: string } }) {
  const lesson = getTestingLesson(params.slug);
  if (!lesson) notFound();
  return <TestingLessonView lesson={lesson} />;
}
