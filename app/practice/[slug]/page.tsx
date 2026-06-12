import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getChallenge, allChallenges } from "@/data";
import ChallengeView from "./ChallengeView";

// Pre-render every challenge at build time (static).
export function generateStaticParams() {
  return allChallenges.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const challenge = getChallenge(params.slug);
  if (!challenge) return { title: "Challenge not found — Frontend Logic Lab" };
  return {
    title: `${challenge.title} — Frontend Logic Lab`,
    description: challenge.problem,
  };
}

export default function ChallengePage({
  params,
}: {
  params: { slug: string };
}) {
  const challenge = getChallenge(params.slug);
  if (!challenge) notFound();
  return <ChallengeView challenge={challenge} />;
}
