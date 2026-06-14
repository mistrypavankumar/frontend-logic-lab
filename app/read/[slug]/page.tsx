import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticle, allArticles } from "@/data";
import ReadingView from "@/components/ReadingView";

// Pre-render every article at build time (static).
export function generateStaticParams() {
  return allArticles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = getArticle(params.slug);
  if (!article) return { title: "Story not found — Frontend Logic Lab" };
  return {
    title: `${article.title} — Frontend Logic Lab`,
    description: article.summary,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();
  return <ReadingView article={article} />;
}
