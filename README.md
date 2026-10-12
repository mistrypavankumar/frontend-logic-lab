# 🧪 Frontend Logic Lab

A beginner-friendly platform to learn frontend development by **solving problems**, not just reading theory. Short, simple explanations are followed immediately by hands-on practice tasks, plus a bank of logic challenges (filtering, sorting, pagination, forms, tabs, accordions and more).

Built with **Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS**. All content is static data and progress is saved in the browser via `localStorage` — **no backend required**.

## Features

- 🛣️ **Roadmap** — one guided path from HTML basics to interview-ready, always showing the next step
- 📖 **50+ lessons** (HTML, CSS, JS, React, array methods, modern JS, async, JS internals) with worked examples, pseudocode, dry runs, "predict the output" and two-stage practice (built-in first, then by hand)
- 🎯 **160+ auto-graded challenges** — filtering, sorting, objects, strings, async, real-world data transformation, debug-this-code, review-the-AI's-code, and write-the-tests
- 🧠 **DSA for interviews** — 20 patterns × 4 problems (hashing, two pointers, sliding window, stacks, binary search, DP, greedy, prefix sum, intervals, linked lists, backtracking, bits, math, strings, trees, **graphs (BFS/DFS), heaps & top-K, tries, tree BFS, sorting algorithms**) plus a "Which pattern?" trainer
- ▶️ **In-browser runner** — runs your code in a Web Worker against visible + hidden edge-case tests, shows a live execution trace, and stops infinite loops after 6s instead of freezing the tab
- ☀️ **Daily Mix & Revision** — spaced repetition, weak-spot review, streaks and a Logic Score that rewards solving without peeking
- 🎤 **Interview mode**, 📚 Reading Room, 🧱 mini projects, bookmarks and a progress dashboard (all in `localStorage`)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open the app
# http://localhost:3000
```

### Other scripts

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # lint (after `npx next lint` setup)
bash scripts/verify.sh   # type-check + run every lesson/challenge test against its own solution
```

## Project structure

```
frontend-logic-lab/
├── app/            # Next.js App Router pages (path, daily, learn, dsa, practice, interview, labs, …)
├── components/     # UI building blocks (ChallengeWorkspace, CodeEditor, DryRun, PredictOutput, …)
├── data/           # All content — lessons.*.ts, challenges.*.ts, dsa.ts, path.ts, articles.ts
│   └── index.ts    # merges every data file; pages import from "@/data"
├── lib/
│   ├── types.ts        # shared types (Lesson, Challenge, DsaTopic, …)
│   ├── runner.ts       # runs learner code in a Web Worker + grades tests
│   ├── instrument.ts   # injects loop tracing for the live execution trace
│   └── progress*.ts    # localStorage progress, streaks, spaced repetition
└── scripts/verify.sh   # content + type verification
```

## How to add content

- **A lesson:** add a `Lesson` object to `data/lessons.ts` (give it a unique `slug`, `order`, and set `nextLessonSlug` on the previous lesson).
- **A challenge:** add a `Challenge` object to the matching `data/challenges.*.ts` file (new files must be added to `data/index.ts`). Give it `tests` (and ideally `hiddenTests` for edge cases), then run `bash scripts/verify.sh` — every test is checked against your `solution`.
- **A DSA problem:** add it to a `data/challenges.dsa*.ts` file and list its slug under its topic in `data/dsa.ts`.
- **A project:** add a `Project` object to `data/projects.ts`.

Types live in `lib/types.ts`, so your editor will tell you exactly what fields are required.

## Notes

- Pages that read progress are client components (`"use client"`) because `localStorage` only exists in the browser. Progress reads are SSR-safe.
- No syntax-highlighting library is used to keep the MVP light; `CodeBlock` includes a copy button.
