import Link from "next/link";
import { CodeSnippet, Difficulty } from "@/lib/types";
import CodeBlock from "./CodeBlock";
import DifficultyBadge from "./DifficultyBadge";

// Side-by-side "built-in vs manual" comparison for a single method, with an
// optional from-scratch internal implementation underneath. Used on the
// Modern JavaScript hub. Stacks to one column on small screens.
export default function MethodCompareCard({
  title,
  href,
  difficulty,
  problemSolved,
  builtIn,
  manual,
  internal,
}: {
  title: string;
  href?: string;
  difficulty?: Difficulty;
  problemSolved?: string;
  builtIn?: CodeSnippet;
  manual?: CodeSnippet;
  internal?: CodeSnippet;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-mono text-lg font-semibold text-slate-800">
          {href ? (
            <Link href={href} className="hover:text-brand-700">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        {difficulty && <DifficultyBadge level={difficulty} />}
      </div>

      {problemSolved && (
        <p className="mb-4 text-sm text-slate-600">{problemSolved}</p>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {builtIn && (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-green-700">
              ✅ Built-in
            </p>
            <CodeBlock code={builtIn.code} language={builtIn.language} />
          </div>
        )}
        {manual && (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              ✋ Manual
            </p>
            <CodeBlock code={manual.code} language={manual.language} />
          </div>
        )}
      </div>

      {internal && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-purple-700">
            🔧 Internal implementation
          </p>
          <CodeBlock code={internal.code} language={internal.language} />
        </div>
      )}

      {href && (
        <Link
          href={href}
          className="mt-4 inline-block text-sm font-medium text-brand-600 hover:underline"
        >
          Deep dive →
        </Link>
      )}
    </div>
  );
}
