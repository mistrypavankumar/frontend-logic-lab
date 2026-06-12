import { ReactNode } from "react";

// A labeled content block used to give every lesson the same clear structure.
export default function Section({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">
        <span aria-hidden>{icon}</span>
        {title}
      </h2>
      <div className="text-slate-700">{children}</div>
    </section>
  );
}
