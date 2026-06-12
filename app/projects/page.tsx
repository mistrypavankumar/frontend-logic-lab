import { projects } from "@/data/projects";
import DifficultyBadge from "@/components/DifficultyBadge";

export const metadata = {
  title: "Mini Projects — Frontend Logic Lab",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Mini Projects</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Combine what you learned into small, real apps. Each project lists the
          features to build and the lessons &amp; challenges it draws on. Build
          them in your own editor!
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">
                {project.title}
              </h2>
              <DifficultyBadge level={project.difficulty} />
            </div>
            <p className="text-sm text-slate-600">{project.description}</p>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Features to build
              </p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {project.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-brand-500">▸</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Skills used
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {project.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
