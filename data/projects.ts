import { Project } from "@/lib/types";

// Mini project ideas that combine many lessons + challenges.
export const projects: Project[] = [
  {
    id: "p1",
    slug: "todo-app",
    title: "Todo App",
    difficulty: "Beginner",
    description:
      "A classic. Add tasks, mark them done, and delete them. Great for practicing state and immutable list updates.",
    features: ["Add a todo", "Toggle done", "Delete a todo", "Show remaining count"],
    skills: ["state-events", "toggle-todos", "conditions-loops"],
  },
  {
    id: "p2",
    slug: "product-catalog",
    title: "Product Catalog with Filter & Search",
    difficulty: "Intermediate",
    description:
      "Show a grid of products. Let users search by name and filter by category at the same time.",
    features: ["Search box", "Category filter", "Responsive card grid", "Empty state"],
    skills: ["filter-products-by-category", "search-users-by-name", "css-grid"],
  },
  {
    id: "p3",
    slug: "data-table",
    title: "Sortable & Paginated Data Table",
    difficulty: "Advanced",
    description:
      "A reusable table that sorts by column and splits rows into pages. The most practical real-world UI skill.",
    features: ["Reusable columns", "Sort by column", "Pagination", "Row count"],
    skills: ["reusable-table", "sort-orders-by-price", "build-pagination"],
  },
  {
    id: "p4",
    slug: "quiz-app",
    title: "Quiz App",
    difficulty: "Intermediate",
    description:
      "Show one question at a time, track answers, and reveal the score at the end.",
    features: ["One question per screen", "Track answers", "Score screen", "Restart"],
    skills: ["quiz-logic", "state-events", "multi-step-form"],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
