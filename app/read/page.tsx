"use client";

import Link from "next/link";
import { allArticles } from "@/data";
import DifficultyBadge from "@/components/DifficultyBadge";
import { useReadingLog } from "@/lib/readingLog";

export default function ReadingRoomPage() {
  const { log, loaded } = useReadingLog();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">📚 Reading Room</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Short developer stories that build engineering judgment — and double as
          read-aloud practice. Read each one out loud a few times: it sharpens both
          your thinking and your fluency.
        </p>
      </header>

      {/* Reading streak */}
      <div className="mb-8 flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="text-3xl" aria-hidden>
          {loaded && log.streak > 0 ? "🔥" : "🌱"}
        </div>
        <div className="text-sm">
          <div className="font-semibold text-slate-800">
            {loaded ? log.streak : 0}-day reading streak
          </div>
          <div className="text-slate-500">
            Longest: {loaded ? log.longest : 0} · Read aloud daily to keep it alive.
          </div>
        </div>
      </div>

      {/* The daily read-aloud routine */}
      <details className="mb-10 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <summary className="cursor-pointer font-semibold text-emerald-800">
          🗣️ The 10-minute daily read-aloud plan
        </summary>
        <div className="mt-3 space-y-3 text-sm text-emerald-900">
          <p>
            Reading aloud stumbles when you start watching yourself do it. This
            routine rebuilds the relaxed, automatic flow — do it once a day.
          </p>
          <ol className="ml-5 list-decimal space-y-1">
            <li><strong>Warm up (1 min):</strong> breathe, relax your jaw, read a few easy lines.</li>
            <li><strong>Phrase reading (3 min):</strong> read in small chunks, slow, eyes ahead of your voice.</li>
            <li><strong>Repeated reading (3 min):</strong> pick one paragraph, read it aloud 3× — the 3rd is the smoothest.</li>
            <li><strong>Guided pacing (2 min):</strong> turn on Guided reading and step sentence by sentence.</li>
            <li><strong>Reflect (1 min):</strong> note one win. Track wins, not slips.</li>
          </ol>
          <p className="font-medium">Three rules:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Don't stop to fix every slip — keep the flow.</li>
            <li>Aim your attention at the meaning, not at "am I doing it right."</li>
            <li>Short and daily beats long and rare.</li>
          </ul>
        </div>
      </details>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {allArticles.map((a) => {
          const count = loaded ? log.counts[a.slug] ?? 0 : 0;
          return (
            <Link
              key={a.id}
              href={`/read/${a.slug}`}
              className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
            >
              {count > 0 && (
                <span
                  className="absolute right-4 top-4 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700"
                  title="Times read aloud"
                >
                  ×{count}
                </span>
              )}
              <div className="mb-3 flex items-center gap-2">
                <DifficultyBadge level={a.level} />
                <span className="text-xs text-slate-400">📖 {a.minutes} min</span>
              </div>
              <h2 className="mb-1 text-lg font-semibold text-slate-800 group-hover:text-brand-700">
                {a.title}
              </h2>
              <p className="line-clamp-3 flex-1 text-sm text-slate-500">{a.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {a.tags.map((t) => (
                  <span key={t} className="rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
