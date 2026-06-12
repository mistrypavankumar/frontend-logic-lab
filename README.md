# 🧪 Frontend Logic Lab

A beginner-friendly platform to learn frontend development by **solving problems**, not just reading theory. Short, simple explanations are followed immediately by hands-on practice tasks, plus a bank of logic challenges (filtering, sorting, pagination, forms, tabs, accordions and more).

Built with **Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS**. All content is static data and progress is saved in the browser via `localStorage` — **no backend required**.

## Features (MVP)

- 🏠 Home page with a clear "learn → practice → track" flow
- 🛣️ Learning path with 10 short lessons (HTML → CSS → JS → React)
- 📖 Lesson detail pages: explanation, real-life example, code, practice task, hint, hidden solution + explanation, next lesson
- 🎯 Practice page with 15 logic challenges, live search + difficulty filter
- 🧩 Challenge detail pages: problem, example I/O, starter code, step-by-step hints, hidden solution
- 🧱 Mini projects page (build-it-yourself ideas)
- 📈 Progress dashboard with progress bars and checklists (localStorage)
- 📱 Clean, responsive, mobile-friendly UI

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
```

## Project structure

```
frontend-logic-lab/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout (Navbar + Footer)
│   ├── page.tsx              # Home
│   ├── globals.css
│   ├── learn/
│   │   ├── page.tsx          # Learning path
│   │   └── [slug]/page.tsx   # Lesson detail
│   ├── practice/
│   │   ├── page.tsx          # Challenges list (search + filter)
│   │   └── [slug]/page.tsx   # Challenge detail
│   ├── projects/page.tsx     # Mini projects
│   ├── progress/page.tsx     # Progress dashboard
│   └── about/page.tsx        # About
├── components/               # Reusable UI components
│   ├── Navbar.tsx  Footer.tsx
│   ├── TopicCard.tsx  ChallengeCard.tsx
│   ├── DifficultyBadge.tsx  ProgressBar.tsx
│   ├── CodeBlock.tsx  HintSection.tsx  SolutionToggle.tsx
│   ├── Section.tsx  CompleteButton.tsx
├── data/                     # Static content (easy to extend)
│   ├── lessons.ts            # 10 lessons
│   ├── challenges.ts         # 15 challenges
│   └── projects.ts           # mini projects
└── lib/
    ├── types.ts              # shared TypeScript types
    ├── progress.ts           # localStorage helpers
    └── useProgress.ts        # React hook for progress
```

## How to add content

- **A lesson:** add a `Lesson` object to `data/lessons.ts` (give it a unique `slug`, `order`, and set `nextLessonSlug` on the previous lesson).
- **A challenge:** add a `Challenge` object to `data/challenges.ts`.
- **A project:** add a `Project` object to `data/projects.ts`.

Types live in `lib/types.ts`, so your editor will tell you exactly what fields are required.

## Notes

- Pages that read progress are client components (`"use client"`) because `localStorage` only exists in the browser. Progress reads are SSR-safe.
- No syntax-highlighting library is used to keep the MVP light; `CodeBlock` includes a copy button.
