"use client";

import { useRef, useState } from "react";
import { formatCode } from "@/lib/format";

// A lightweight "code editor" feel: a textarea with a synced line-number gutter,
// monospace font, Tab-to-indent, VS Code-style Enter auto-indent, and a Format
// button (re-indents by bracket depth). No heavy editor dependency.
export default function CodeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const [formatting, setFormatting] = useState(false);

  const lineCount = Math.max(value.split("\n").length, 1);

  // Keep the line-number gutter aligned while scrolling.
  const syncScroll = () => {
    if (gutterRef.current && taRef.current) {
      gutterRef.current.scrollTop = taRef.current.scrollTop;
    }
  };

  // Move the caret after a programmatic edit (value updates on the next render).
  const setCaret = (pos: number) => {
    const ta = taRef.current;
    requestAnimationFrame(() => {
      if (ta) ta.selectionStart = ta.selectionEnd = pos;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;

    // Tab → two spaces.
    if (e.key === "Tab") {
      e.preventDefault();
      onChange(value.slice(0, start) + "  " + value.slice(end));
      setCaret(start + 2);
      return;
    }

    // Enter → keep the current indent, add one level after an opener, and
    // expand `{|}` into a tidy block (VS Code behaviour).
    if (e.key === "Enter") {
      e.preventDefault();
      const before = value.slice(0, start);
      const after = value.slice(end);
      const lineStart = before.lastIndexOf("\n") + 1;
      const indent = (before.slice(lineStart).match(/^[ \t]*/)?.[0]) ?? "";
      const lastChar = before.replace(/[ \t]*$/, "").slice(-1);
      const opensBlock = lastChar === "{" || lastChar === "(" || lastChar === "[";
      const nextChar = after.replace(/^[ \t]*/, "").slice(0, 1);
      const closesNext = nextChar === "}" || nextChar === ")" || nextChar === "]";

      if (opensBlock && closesNext) {
        const inner = indent + "  ";
        const insert = "\n" + inner + "\n" + indent;
        onChange(before + insert + after);
        setCaret(start + 1 + inner.length);
      } else {
        const insert = "\n" + (opensBlock ? indent + "  " : indent);
        onChange(before + insert + after);
        setCaret(start + insert.length);
      }
    }
  };

  // Format with Prettier (loaded on demand so it stays out of the initial
  // bundle). On a syntax error or load failure, fall back to the lightweight
  // brace re-indenter so the button always does something useful.
  const format = async () => {
    setFormatting(true);
    try {
      const [prettier, babel, estree] = await Promise.all([
        import("prettier/standalone"),
        import("prettier/plugins/babel"),
        import("prettier/plugins/estree"),
      ]);
      const plugin = (m: unknown) => (m as { default?: unknown }).default ?? m;
      const out = await prettier.format(value, {
        parser: "babel",
        plugins: [plugin(babel), plugin(estree)] as never,
        tabWidth: 2,
      });
      const trimmed = out.replace(/\n$/, "");
      if (trimmed !== value) onChange(trimmed);
    } catch {
      const fb = formatCode(value);
      if (fb !== value) onChange(fb);
    } finally {
      setFormatting(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-900 font-mono text-sm">
      <div className="flex items-center justify-between border-b border-slate-700 px-3 py-1.5">
        <span className="text-xs uppercase tracking-wide text-slate-500">JS</span>
        <button
          type="button"
          onClick={format}
          disabled={formatting}
          title="Format with Prettier"
          className="rounded px-2 py-0.5 text-xs font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-50"
        >
          {formatting ? "Formatting…" : "✨ Format"}
        </button>
      </div>

      <div className="flex">
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
          wrap="off"
          aria-label="Code editor"
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          onKeyDown={handleKeyDown}
          rows={Math.min(Math.max(lineCount, 6), 20)}
          className="w-full resize-none overflow-x-auto whitespace-pre bg-transparent py-3 pr-3 text-slate-100 caret-brand-500 outline-none"
          style={{ lineHeight: "1.6rem" }}
        />
      </div>
    </div>
  );
}
