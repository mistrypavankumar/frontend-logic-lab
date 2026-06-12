"use client";

import Link from "next/link";
import { allLessons } from "@/data";
import { Lesson } from "@/lib/types";
import { useProgress } from "@/lib/useProgress";

const byId = new Map(allLessons.map((l) => [l.id, l]));

export default function RecentlyViewed() {
  const { state, loaded } = useProgress();
  const items: Lesson[] = loaded
    ? state.recentLessons
        .map((id) => byId.get(id))
        .filter((l): l is Lesson => l !== undefined)
    : [];

  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-slate-800">
        Recently viewed
      </h2>
      <div className="flex flex-wrap gap-2">
        {items.map((l) => (
          <Link
            key={l.id}
            href={`/learn/${l.slug}`}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:border-brand-300 hover:text-brand-700"
          >
            {l.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
