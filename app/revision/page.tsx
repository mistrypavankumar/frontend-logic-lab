"use client";

import SavedItemsList from "@/components/SavedItemsList";
import { useProgress } from "@/lib/useProgress";

export default function RevisionPage() {
  const { state, loaded, toggleRevision } = useProgress();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">↻ Revision List</h1>
        <p className="mt-2 text-slate-600">
          Things you flagged to come back to. Revisit them until they stick, then
          remove them.
        </p>
      </header>

      <SavedItemsList
        keys={loaded ? state.revision : []}
        onRemove={(kind, id) => toggleRevision(kind, id)}
        removeLabel="Done revising"
        emptyText='Nothing flagged for revision. Use "Add to revision" on a lesson or challenge.'
      />
    </div>
  );
}
