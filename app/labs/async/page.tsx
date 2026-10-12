import { allChallenges, allLessons, getChallenge } from "@/data";
import LabView from "@/components/LabView";

export const metadata = { title: "Async Lab — Frontend Logic Lab" };

export default function AsyncLabPage() {
  return (
    <LabView
      title="⚡ Async JavaScript Lab"
      intro="Promises, retries, timeouts, concurrency limits, cancellation, caching, and race-condition prevention. Try the live demo, then work the bank."
      demo={getChallenge("retry-promise")}
      lessons={allLessons.filter((l) => l.category === "Async JavaScript")}
      challenges={allChallenges.filter((c) => c.flags?.async)}
      challengesLabel="Async challenges"
    />
  );
}
