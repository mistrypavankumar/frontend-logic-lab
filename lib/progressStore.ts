"use client";

import {
  ProgressState,
  emptyProgress,
  readProgress,
  writeProgress,
} from "./progress";

// One store for the whole tab. Every useProgress() reads the SAME state and
// re-renders together on any change — no more divergent per-component copies.
let current: ProgressState | null = null; // null = not yet hydrated from storage
const SERVER_SNAPSHOT = emptyProgress(); // stable ref for SSR / first paint
const listeners = new Set<() => void>();

function hydrated(): ProgressState {
  if (current === null) current = readProgress();
  return current;
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getSnapshot(): ProgressState {
  return hydrated();
}

// Same stable empty object on the server every render → no hydration mismatch.
export function getServerSnapshot(): ProgressState {
  return SERVER_SNAPSHOT;
}

export function dispatch(fn: (prev: ProgressState) => ProgressState): void {
  const next = fn(hydrated());
  current = next;
  writeProgress(next); // outside React render; writeProgress is crash-safe
  listeners.forEach((l) => l());
}

// Cross-tab sync: another tab wrote → re-read and notify our subscribers.
if (typeof window !== "undefined") {
  window.addEventListener("storage", () => {
    current = readProgress();
    listeners.forEach((l) => l());
  });
}
