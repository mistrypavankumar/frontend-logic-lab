import { TraceStep } from "@/lib/runner";
import VariableTracker from "./VariableTracker";

// Renders the live execution trace captured from the learner's OWN run — loop
// iterations are recorded automatically; trace("label", { x }) adds custom rows.
// Reuses the VariableTracker table so authored and live traces look identical.
export default function LiveTrace({ steps }: { steps: TraceStep[] }) {
  if (steps.length === 0) return null;

  // Columns = union of every variable name seen, in first-seen order.
  const keys: string[] = [];
  for (const s of steps) {
    for (const k of Object.keys(s.vars)) {
      if (!keys.includes(k)) keys.push(k);
    }
  }

  const columns = ["#", "Step", ...keys];
  const rows = steps.map((s) => [
    s.n,
    s.label || "—",
    ...keys.map((k) => s.vars[k] ?? "—"),
  ]);

  return <VariableTracker trace={{ columns, rows }} />;
}
