# 🐾 Yayas

**Where my dogs go to get their yayas out.**

Yayas is a web app for logging the parks, trails, beaches and neighborhood walks you take your dogs to: what each place has (fenced, off-leash, swimming, walkable from home), what to watch out for (crowds, bikers, kids), tips for next time, and how much your dog liked each outing.

**Live app:** https://yayas-9vpb.vercel.app

## What you can do
- **Sign up / log in.** Every account sees only its own data.
- **Places:** add, view, edit, and delete (with an "are you sure?" check). Each place has amenity and warning checkboxes, a 🚫 Don't-go flag, and 📌 "remember for next time" tips.
- **Outings:** log a visit with date, minutes, miles, a 1–5 🐾 dog rating, and notes.
- **⭐ Stars** and a Starred view.
- **Find:** search names and tips, filter by amenities, hide warnings, and sort by newest, rating, most visited, or A→Z.
- **Dashboard:** total outings, miles, average dog rating, favorite spot, and an outings-per-week chart.
- **🎲 Random pick:** "Where should we go today?" with optional filters. It never picks 🚫 places.
- **🔗 Sitter link:** a public read-only page with the places you choose and their tips, for your dog sitter (no account needed).
- **🌙 Dog Mode:** dark theme, paw prints, 💩 delete buttons, and secret 🦴 treat stops that only appear in Dog Mode.

## Tools
| What | Tool |
|---|---|
| Coding agent | Claude Code |
| Framework | Next.js (React) + Tailwind CSS |
| Database + login | Supabase (Postgres + Auth, row-level security) |
| Hosting | Vercel (auto-deploys when a PR merges to `main`) |
| Chart | Recharts |
| Tests | Vitest, run by GitHub Actions on every PR |

## Run it yourself
1. **Supabase:** create a project. In **SQL Editor**, paste and run [`supabase/setup.sql`](supabase/setup.sql). Under **Authentication → Sign In / Providers**, turn off **Confirm email**.
2. **Clone and configure:**
   ```bash
   git clone https://github.com/taylordahlgren-cal/yayas.git
   cd yayas
   npm install
   cp .env.example .env.local   # then paste your Supabase Project URL + publishable (anon) key
   ```
3. **Run:** `npm run dev`, then open http://localhost:3000.
4. **Tests:** `npm test`. The data-isolation test also needs `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` set (in CI these are GitHub Actions secrets).

## How it's built (the short version)
- **Pages** live in `app/` (e.g. `app/places/[id]/page.js` is a place's detail page).
- **All database calls** are in `lib/data.js`. The browser talks to Supabase directly, and **row-level security** in the database makes sure each user only ever gets their own rows.
- **Pure logic** (stats, filters, random pick, validation) lives in `lib/` with no database calls, so it can be tested on its own.
- **Database design:** see [`schema.md`](schema.md). **Plan:** see [`PLAN.md`](PLAN.md). **Prompt logs:** see [`prompts/`](prompts/).
