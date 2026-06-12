import Link from "next/link";

export const metadata = {
  title: "About — Frontend Logic Lab",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">About Frontend Logic Lab</h1>

      <div className="mt-6 space-y-6 text-slate-700">
        <p className="text-lg">
          Most tutorials make you <em>watch</em> someone else code. Frontend
          Logic Lab is built on the opposite idea: you learn by{" "}
          <strong>thinking and writing code yourself</strong>.
        </p>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-800">How we teach</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>📖 <strong>Tiny theory.</strong> Short, plain-English explanations with real-life examples.</li>
            <li>🎯 <strong>Immediate practice.</strong> Every lesson ends with a task to try.</li>
            <li>🧠 <strong>Logic challenges.</strong> A bank of problems to train problem-solving.</li>
            <li>💡 <strong>Hints, not spoilers.</strong> Reveal help step by step, solutions only when ready.</li>
            <li>📈 <strong>Your pace.</strong> Progress saves in your browser — no sign-up.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-800">What you&apos;ll cover</h2>
          <p className="mt-2 text-sm">
            HTML structure, CSS layout, Flexbox, Grid, JavaScript basics, arrays
            &amp; objects, conditions, loops, functions, React components, props,
            state, events, plus logic challenges like filtering, searching,
            sorting, pagination, form validation, tabs, accordions and more.
          </p>
        </div>

        <div className="rounded-lg bg-brand-50 p-6 text-center">
          <p className="font-medium text-slate-800">Ready to train your frontend logic?</p>
          <Link
            href="/learn"
            className="mt-3 inline-block rounded-lg bg-brand-600 px-6 py-2.5 font-semibold text-white hover:bg-brand-700"
          >
            Start the learning path →
          </Link>
        </div>
      </div>
    </div>
  );
}
