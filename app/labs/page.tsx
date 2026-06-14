import Link from "next/link";

export const metadata = { title: "Labs — Frontend Logic Lab" };

const labs = [
  { href: "/labs/async", icon: "⚡", title: "Async JavaScript Lab", desc: "Promises, retries, timeouts, concurrency, cancellation, caching." },
  { href: "/labs/data", icon: "🔀", title: "Data Transformation Lab", desc: "Normalize, group, flatten, trees, breadcrumbs, query strings, merge." },
  { href: "/practice?flag=aiReview", icon: "🤖", title: "AI Code Review", desc: "Judge AI-written code, catch the bug it confidently shipped, then fix it — the #1 skill when AI writes the first draft." },
  { href: "/practice?flag=testWriting", icon: "🧪", title: "Write the Tests", desc: "Don't write the code — write the tests. Design a suite that accepts the correct solution and catches every buggy one." },
];

export default function LabsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Labs</h1>
        <p className="mt-2 text-slate-600">
          Focused, hands-on playgrounds that combine the lessons and challenges
          for a topic — with a live editor to try right away.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {labs.map((lab) => (
          <Link
            key={lab.href}
            href={lab.href}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
          >
            <div className="text-3xl">{lab.icon}</div>
            <h2 className="mt-3 text-lg font-semibold text-slate-800">{lab.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{lab.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
