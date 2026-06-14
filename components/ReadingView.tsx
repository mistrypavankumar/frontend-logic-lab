"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Article } from "@/lib/types";
import DifficultyBadge from "./DifficultyBadge";
import { useReadingLog } from "@/lib/readingLog";

// Splits a paragraph into sentences, keeping terminal punctuation (and any
// trailing quote/bracket). Good enough for clean prose.
function splitSentences(text: string): string[] {
  const matches = text.match(/[^.!?]+[.!?]+["'”’)\]]*|\S[^.!?]*$/g);
  return (matches ?? [text]).map((s) => s.trim()).filter(Boolean);
}

export default function ReadingView({ article }: { article: Article }) {
  const { log, loaded, recordRead } = useReadingLog();
  const [focus, setFocus] = useState(true); // larger, easier-to-track type
  const [guided, setGuided] = useState(false); // sentence-by-sentence stepper
  const [cur, setCur] = useState(0);

  // Flatten paragraphs into sentences with stable global indices.
  const { paras, offsets, total } = useMemo(() => {
    const paras = article.body.map(splitSentences);
    const offsets: number[] = [];
    let n = 0;
    for (const p of paras) {
      offsets.push(n);
      n += p.length;
    }
    return { paras, offsets, total: n };
  }, [article.body]);

  const activeRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (guided) activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [cur, guided]);

  // Arrow keys step sentences while guided.
  useEffect(() => {
    if (!guided) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setCur((c) => Math.min(total - 1, c + 1));
      if (e.key === "ArrowLeft") setCur((c) => Math.max(0, c - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [guided, total]);

  const readCount = loaded ? log.counts[article.slug] ?? 0 : 0;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/read" className="text-sm text-brand-600 hover:underline">
        ← Reading room
      </Link>

      <header className="mt-4 border-b border-slate-200 pb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <DifficultyBadge level={article.level} />
          <span className="text-xs text-slate-400">📖 {article.minutes} min read</span>
          {article.tags.map((t) => (
            <span key={t} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {t}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{article.title}</h1>
        <p className="mt-2 text-slate-600">{article.summary}</p>
      </header>

      {/* Read-aloud practice tips */}
      <details className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-emerald-800">
          🗣️ How to use this for read-aloud practice
        </summary>
        <div className="mt-2 space-y-2 text-sm text-emerald-900">
          <p>
            Warm up with one easy paragraph. Then read each paragraph aloud{" "}
            <strong>three times</strong> — it gets smoother every pass.
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Turn on <strong>Guided reading</strong> to focus one sentence at a time (arrow keys to step).</li>
            <li>Let your eyes sit a few words ahead of your voice. Go slow.</li>
            <li>Don't stop to fix every slip — keep the flow, aim at the meaning.</li>
          </ul>
          <p>
            Doing the full routine?{" "}
            <Link href="/read" className="font-medium underline">
              See the daily plan
            </Link>
            .
          </p>
        </div>
      </details>

      {/* Reading controls */}
      <div className="sticky top-16 z-10 mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur">
        <button
          onClick={() => setFocus((f) => !f)}
          aria-pressed={focus}
          className={
            "rounded-lg px-3 py-1.5 text-sm font-medium transition " +
            (focus ? "bg-brand-100 text-brand-700" : "border border-slate-300 text-slate-600 hover:bg-slate-100")
          }
        >
          🔎 Focus type
        </button>
        <button
          onClick={() => {
            setGuided((g) => !g);
            setCur(0);
          }}
          aria-pressed={guided}
          className={
            "rounded-lg px-3 py-1.5 text-sm font-medium transition " +
            (guided ? "bg-amber-100 text-amber-700" : "border border-slate-300 text-slate-600 hover:bg-slate-100")
          }
        >
          🎯 Guided reading
        </button>

        {guided && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCur((c) => Math.max(0, c - 1))}
              disabled={cur === 0}
              className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              ← Prev
            </button>
            <button
              onClick={() => setCur((c) => Math.min(total - 1, c + 1))}
              disabled={cur >= total - 1}
              className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-40"
            >
              Next →
            </button>
            <span className="text-xs text-slate-400">
              {cur + 1} / {total}
            </span>
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          {readCount > 0 && (
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
              Read aloud ×{readCount}
            </span>
          )}
          <button
            onClick={() => recordRead(article.slug)}
            className="rounded-lg border border-green-500 px-3 py-1.5 text-sm font-semibold text-green-700 hover:bg-green-50"
          >
            ✓ I read it aloud
          </button>
        </div>
      </div>

      {/* Body */}
      <div
        className={
          "mt-6 " +
          (focus
            ? "mx-auto max-w-2xl space-y-6 text-xl leading-loose text-slate-800"
            : "space-y-4 text-lg leading-relaxed text-slate-700")
        }
      >
        {paras.map((sents, pi) => (
          <p key={pi}>
            {sents.map((s, si) => {
              const idx = offsets[pi] + si;
              const active = guided && idx === cur;
              const dim = guided && idx !== cur;
              return (
                <span
                  key={si}
                  ref={active ? activeRef : undefined}
                  onClick={guided ? () => setCur(idx) : undefined}
                  className={
                    (guided ? "cursor-pointer rounded px-0.5 " : "") +
                    (active
                      ? "bg-amber-200 text-slate-900 "
                      : dim
                      ? "text-slate-400 "
                      : "")
                  }
                >
                  {s}{" "}
                </span>
              );
            })}
          </p>
        ))}
      </div>

      {/* Takeaways */}
      <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Takeaways</h2>
        <ul className="ml-5 list-disc space-y-1.5 text-slate-700">
          {article.takeaways.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex items-center justify-between">
        <Link href="/read" className="text-sm font-medium text-brand-600 hover:underline">
          ← More stories
        </Link>
        <button
          onClick={() => recordRead(article.slug)}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          ✓ Finished reading aloud
        </button>
      </div>
    </article>
  );
}
