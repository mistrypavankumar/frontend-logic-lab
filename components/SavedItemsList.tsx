"use client";

import Link from "next/link";
import { allLessons, allChallenges } from "@/data";
import { BookmarkKind } from "@/lib/progress";

const lessonById = new Map(allLessons.map((l) => [l.id, l]));
const challengeById = new Map(allChallenges.map((c) => [c.id, c]));

interface Resolved {
  kind: BookmarkKind;
  id: string;
  title: string;
  href: string;
}

// Turn namespaced keys ("lesson:<id>" | "challenge:<id>") into renderable items.
function resolve(keys: string[]): Resolved[] {
  return keys
    .map((key): Resolved | null => {
      const [kind, id] = key.split(":") as [BookmarkKind, string];
      if (kind === "lesson") {
        const l = lessonById.get(id);
        return l ? { kind, id, title: l.title, href: `/learn/${l.slug}` } : null;
      }
      const c = challengeById.get(id);
      return c ? { kind, id, title: c.title, href: `/practice/${c.slug}` } : null;
    })
    .filter((x): x is Resolved => x !== null);
}

export default function SavedItemsList({
  keys,
  onRemove,
  removeLabel,
  emptyText,
}: {
  keys: string[];
  onRemove: (kind: BookmarkKind, id: string) => void;
  removeLabel: string;
  emptyText: string;
}) {
  const items = resolve(keys);

  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        {emptyText}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {items.map((item) => (
        <li key={`${item.kind}:${item.id}`} className="flex items-center justify-between gap-3 px-4 py-3">
          <Link href={item.href} className="flex items-center gap-2 text-sm text-slate-700 hover:text-brand-700">
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
              {item.kind === "lesson" ? "Lesson" : "Challenge"}
            </span>
            {item.title}
          </Link>
          <button
            onClick={() => onRemove(item.kind, item.id)}
            className="shrink-0 text-xs font-medium text-slate-400 hover:text-rose-600"
          >
            {removeLabel}
          </button>
        </li>
      ))}
    </ul>
  );
}
