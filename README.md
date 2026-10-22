# Orkiva

A project management dashboard for small product and agency teams: projects, tasks, meetings, team chat and an AI assistant in one place.

Orkiva is a **front-end demo**. It runs entirely in the browser with realistic sample data, so you can click through every screen without a backend or an account.

## Features

- **Dashboard**:
  - Task totals with labeled progress meters.
  - Task statistics by week, month or year.
  - The next deadline and the most recently completed task.
  - A chart of tasks done per day, week or month.
  - What's due this week.
  - Project health, team workload and recent activity.
- **Projects**:
  - Kanban board (To do → In progress → In review → Done) with drag and drop.
  - Filters for priority, "assigned to me" and text search.
  - Create, edit and delete tasks and projects.
- **Calendar and Meetings**:
  - A weekly schedule.
  - Meetings can have attendees and be linked to a project.
  - Click a project card to filter the schedule to that project.
- **Inbox**: team chats. Sent messages are kept after a reload.
- **AI Assistant**:
  - A daily brief.
  - A "Needs your attention" list with one-click fixes: mark done, push the due date, open the board.
  - A project focus selector.
  - Chat history.
  - A floating **Ask AI Orkiva** button on every page.
- **Search and notifications**:
  - Search projects, clients, tasks, people and meetings from the top bar.
  - A live notifications bell.
- **Settings**: account, notification and general settings are saved.
- **Auth flow**: login, sign up, email verification and password reset (all simulated).

## Demo login

The login form is pre-filled:

| Email | Password |
| --- | --- |
| `james@orkiva.io` | `orkiva123` |

Any email with a password of 6+ characters also works, and sign-up accepts any 6-digit verification code.

## Getting started

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint with Oxlint |

## How the demo works

- **Data:**
  - All data lives in your browser's `localStorage`, so changes survive a reload.
  - Seed dates are relative to today, so deadlines and meetings always look current.
- **Reset:** use **profile menu → Reset demo data** to restore the sample data.
- **AI assistant:**
  - It is rule-based: it answers from the live projects, tasks and meetings data, and no AI model or API is called.
  - Try "What's overdue?", "Plan my week", "Status of Primor", "Team workload" or "create task: Review pricing page".
- **Simulated features:** nothing is sent to a server. Email, video calls and file uploads are simulated.

## Tech stack

- [React 19](https://react.dev) + TypeScript
- [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com). Theme tokens are in `src/index.css`: emerald primary, slate neutrals.
- [React Router v7](https://reactrouter.com)
- [Oxlint](https://oxc.rs) for linting

## Project structure

```text
src/
├── App.tsx          Routes, auth guard and app layout
├── index.css        Tailwind theme tokens
├── pages/           One folder per screen (dashboard, projects, calendar, ai, …)
├── components/      UI grouped by feature (dashboard, projects, ai, layout, ui, …)
├── data/            Stores, seed data and derived insights
│   ├── projects.ts      Projects, tasks and task actions
│   ├── insights.ts      Totals, project health, workload, activity
│   ├── assistant.ts     AI assistant replies and chat history
│   └── …                meetings, inbox, notifications, people, session
├── lib/             Store helper (localStorage) and date utilities
└── hooks/           Small shared hooks
```

To change the theme, edit the `--color-*` tokens in `src/index.css`. Every page picks them up.

## Deploying to Vercel

1. Push the repo to GitHub and choose **Add New → Project** in Vercel.
2. Import the repo. Vercel detects Vite automatically (build `npm run build`, output `dist`).
3. Deploy. `vercel.json` already rewrites every route to `index.html` so deep links like `/projects` work, and caches hashed assets for a year.

No environment variables are needed.
