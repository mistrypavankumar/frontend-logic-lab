import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLesson, allLessons } from "@/data";
import LessonView from "./LessonView";

// Pre-render every lesson at build time (static).
export function generateStaticParams() {
  return allLessons.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const lesson = getLesson(params.slug);
  if (!lesson) return { title: "Lesson not found — Frontend Logic Lab" };
  return {
    title: `${lesson.title} — Frontend Logic Lab`,
    description: lesson.summary,
  };
}

export default function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = getLesson(params.slug);
  if (!lesson) notFound();
  return <LessonView lesson={lesson} />;
}
