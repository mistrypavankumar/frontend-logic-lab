"use client";

import SavedItemsList from "@/components/SavedItemsList";
import { useProgress } from "@/lib/useProgress";

export default function BookmarksPage() {
  const { state, loaded, toggleBookmark } = useProgress();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">★ Bookmarks</h1>
        <p className="mt-2 text-slate-600">
          Lessons and challenges you starred for quick access.
        </p>
      </header>

      <SavedItemsList
        keys={loaded ? state.bookmarks : []}
        onRemove={(kind, id) => toggleBookmark(kind, id)}
        removeLabel="Remove"
        emptyText="No bookmarks yet. Tap ☆ on any lesson or challenge to save it here."
      />
    </div>
  );
}
