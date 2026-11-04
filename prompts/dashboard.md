# Prompt log: Dashboard

**Brief given to the agent (user story #7 from PLAN.md):**
> As a dog owner, I want to see total outings, total miles, average dog rating, and a chart of outings per week, so that I know how active we've been.

**What the agent built:** `lib/stats.js` (`computeStats`), a **pure function** that turns outings into numbers. It's kept separate from the page on purpose so the dashboard test can check the math without a database. The page shows 4 stat cards (outings, total miles + hours, average dog rating, 🏆 favorite spot) and a Recharts bar chart of outings per week for the last 8 weeks, with empty weeks shown as 0.

The "favorite spot" card covers part of my bonus "most visited" idea.
