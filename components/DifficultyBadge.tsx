import { Difficulty } from "@/lib/types";

const styles: Record<Difficulty, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-rose-100 text-rose-700",
  Industrial: "bg-indigo-100 text-indigo-700",
  Expert: "bg-slate-800 text-slate-100",
};

export default function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[level]}`}
    >
      {level}
    </span>
  );
}
