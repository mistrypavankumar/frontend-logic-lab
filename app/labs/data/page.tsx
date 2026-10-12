import { allChallenges, allLessons, getChallenge } from "@/data";
import LabView from "@/components/LabView";

export const metadata = { title: "Data Transformation Lab — Frontend Logic Lab" };

export default function DataLabPage() {
  return (
    <LabView
      title="🔀 Data Transformation Lab"
      intro="The shaping work every app does between the API and the UI: normalize, group, flatten, build trees and breadcrumbs, parse/build query strings, and merge config. Try the demo, then work the bank."
      demo={getChallenge("normalize-api-response")}
      lessons={allLessons.filter(
        (l) => l.category === "Data Transformation" || l.category === "Modern Objects & Grouping"
      )}
      challenges={allChallenges.filter((c) => c.flags?.dataTransformation)}
      challengesLabel="Data challenges"
    />
  );
}
