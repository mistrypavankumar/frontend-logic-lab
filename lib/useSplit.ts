"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A draggable split between two panes (LeetCode-style). Returns the first
 * pane's size as a percentage, a ref for the container being split, and
 * handlers for the divider (pointer drag + arrow keys). The size is remembered
 * in localStorage so it stays the same from problem to problem.
 */
export function useSplit(
  storageKey: string,
  initial: number,
  min = 20,
  max = 80,
  axis: "x" | "y" = "x"
) {
  const [pct, setPct] = useState(initial);
  const ref = useRef<HTMLDivElement>(null);

  // Restore after mount (not during render) so SSR and first paint match.
  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(storageKey));
      if (saved >= min && saved <= max) setPct(saved);
    } catch {
      /* ignore */
    }
  }, [storageKey, min, max]);

  const save = useCallback(
    (value: number) => {
      try {
        window.localStorage.setItem(storageKey, String(Math.round(value)));
      } catch {
        /* ignore */
      }
    },
    [storageKey]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      let last = pct;
      const move = (ev: PointerEvent) => {
        const ratio =
          axis === "x"
            ? (ev.clientX - rect.left) / rect.width
            : (ev.clientY - rect.top) / rect.height;
        last = Math.min(max, Math.max(min, ratio * 100));
        setPct(last);
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        save(last);
      };
      // Keep the resize cursor and stop text selection for the whole drag.
      document.body.style.cursor = axis === "x" ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    },
    [axis, min, max, pct, save]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const back = axis === "x" ? "ArrowLeft" : "ArrowUp";
      const fwd = axis === "x" ? "ArrowRight" : "ArrowDown";
      if (e.key !== back && e.key !== fwd) return;
      e.preventDefault();
      const next = Math.min(max, Math.max(min, pct + (e.key === fwd ? 2 : -2)));
      setPct(next);
      save(next);
    },
    [axis, min, max, pct, save]
  );

  return { pct, ref, onPointerDown, onKeyDown, min, max };
}
