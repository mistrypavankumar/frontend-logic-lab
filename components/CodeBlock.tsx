"use client";

import { useState } from "react";

// A simple, dependency-free code block with a copy button.
// (No syntax highlighting library to keep the MVP light.)
export default function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be blocked; ignore silently
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-700 px-3 py-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {language ?? "code"}
        </span>
        <button
          onClick={copy}
          className="rounded px-2 py-0.5 text-xs text-slate-300 hover:bg-slate-700"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-slate-100">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
