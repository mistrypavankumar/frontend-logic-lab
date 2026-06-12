"use client";

import { useRef } from "react";

// A lightweight "code editor" feel: a textarea with a synced line-number
// gutter, monospace font, and Tab-to-indent. No heavy editor dependency.
export default function CodeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lineCount = Math.max(value.split("\n").length, 1);

  // Keep the line-number gutter aligned while scrolling.
  const syncScroll = () => {
    if (gutterRef.current && taRef.current) {
      gutterRef.current.scrollTop = taRef.current.scrollTop;
    }
  };

  // Tab inserts two spaces instead of moving focus away.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const next = value.slice(0, start) + "  " + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className="flex overflow-hidden rounded-lg border border-slate-700 bg-slate-900 font-mono text-sm">
      <div
        ref={gutterRef}
        aria-hidden
        className="select-none overflow-hidden py-3 pl-3 pr-2 text-right text-slate-600"
        style={{ lineHeight: "1.6rem" }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={taRef}
        value={value}
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onKeyDown={handleKeyDown}
        rows={Math.min(Math.max(lineCount, 6), 20)}
        className="w-full resize-y bg-transparent py-3 pr-3 text-slate-100 caret-brand-500 outline-none"
        style={{ lineHeight: "1.6rem" }}
      />
    </div>
  );
}
