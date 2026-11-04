# PLAN.md: Yayas 🐾

## 1. Pitch
I'm building **Yayas** (as in "where my dogs go to get their yayas out"), a log of the parks, trails and walks I take my dogs to, because I keep forgetting which places are fenced, which are crowded with bikers, and which ones my dogs actually love. I'm also always texting my dog sitters suggestions from memory. I'll use it **3–5 times a week**: logging an outing after a walk, and deciding where to go before one.

## 2. Features (user stories, in build order)
1. **Sign up and login:** As a new visitor, I want to create an account with my email and a password, log in and log out, so that my spots and outings are private to me.
2. **Data model:** As a dog owner, I want my places and my outings at each place saved, so that my history is still there next time I open the app.
3. **Create / read / update / delete:** As a dog owner, I want to add a place (name, type, fenced, off-leash, swimming, walkable from home, warnings, tips), see my list, open a place's detail page with its outings, edit it, and delete it after an "are you sure?" prompt, so that my list stays accurate. I can also log an outing at a place with a date, minutes, miles, a 1–5 dog rating and notes.
4. **Validation:** As a dog owner, I want a friendly message if I leave a place name, outing date or dog rating blank, so that I don't save half-empty entries.
5. **Stars:** As a dog owner, I want to star my favorite places and see a "Starred" view, so that my go-to spots are one tap away.
6. **Find things:** As a dog owner, I want to search places by name, filter by amenities (fenced, off-leash, swimming, walkable from home) and hide warnings (crowded, bikers, kids), and sort by newest, highest dog rating or most visited, so that I can find the right spot for today.
7. **Dashboard:** As a dog owner, I want to see total outings, total miles, average dog rating, and a chart of outings per week, so that I know how active we've been.
8. **Random pick with filters (my feature):** As a dog owner who can't decide, I want a "Pick a spot for me" button that I can narrow with filters (e.g. fenced + walkable) and that never picks a 🚫 Don't-go place, so that deciding takes zero effort.
9. **Sitter share link (my feature):** As a dog owner with a dog sitter, I want a public, read-only link showing only the places I've marked "share with sitter," including their tips, so that my sitter knows where to go and what to watch out for without making an account.
10. **Dog Mode (my feature):** As a dog owner, I want a Dog Mode toggle that switches the app to a dark theme with paw-print backgrounds, dog emojis and a 💩 delete button, and reveals my secret 🦴 "treat stop" places (pet stores with good treats) that are hidden in normal mode, so that the app is fun to use (and easier on my eyes at night).

*Bonus if time allows:* 🏆 a "Most visited" badge on the place I've logged the most outings at.

## 3. Database

| Table | Column | Type | Notes |
|---|---|---|---|
| **users** | id | uuid | **PK**, same id as the Supabase Auth account |
| | email | text | |
| | share_token | text | random, unique; used for the sitter link |
| | created_at | date/time | |
| **places** | id | uuid | **PK** |
| | user_id | uuid | FK → users.id |
| | name | text | required |
| | type | text | trail / park / beach / neighborhood / treat stop (treat stops only appear in Dog Mode) |
| | fenced, off_leash, swimming, walkable_from_home | true/false | amenities |
| | crowded, bikers, kids | true/false | warnings |
| | dont_go | true/false | 🚫 avoid list |
| | share_with_sitter | true/false | shows on the sitter link |
| | tips | text | "remember for next time" notes |
| | created_at | date/time | |
| **outings** | id | uuid | **PK** |
| | user_id | uuid | FK → users.id |
| | place_id | uuid | FK → places.id (deleting a place deletes its outings) |
| | date | date | required |
| | minutes | number | |
| | miles | number | |
| | dog_rating | number | required, 1–5 |
| | notes | text | |
| **stars** | user_id | uuid | FK → users.id, part of PK |
| | place_id | uuid | FK → places.id, part of PK |
| | created_at | date/time | |

**Relationships**
- users → places: **one-to-many** (a user has many places)
- places → outings: **one-to-many** (a place has many outings)
- users ↔ places via **stars**: **many-to-many junction table** (one row = "this user starred this place")

```
users ──< places ──< outings
  │         │
  └──< stars >┘
```

Privacy is enforced in the database with Supabase Row Level Security: every table only returns rows where `user_id` = the logged-in user.

## 4. Tests
1. **Data isolation:** Given User A has added the place "Tilden Park," when User B logs in and loads their places list, then User B sees zero places and cannot read Tilden Park by its id.
2. **Dashboard stat:** Given a user has logged 3 outings with dog ratings 5, 4 and 3, when the dashboard stats are calculated, then the average dog rating is 4.0 and the total outing count is 3.

## 5. Technologies
- **Coding agent: Claude Code.** It can run the full Issue → branch → PR loop through GitHub for me.
- **Framework: Next.js (React).** One project handles both pages and server logic, and it deploys to Vercel with zero config.
- **Database: Supabase (Postgres).** It's a real relational database with foreign keys and built-in row-level security for per-user privacy.
- **Sign up / login: Supabase Auth with email and password.** It's built in, and I'll turn off email confirmation so live sign-up works instantly in the demo.
- **Hosting: Vercel.** It auto-deploys every time a PR merges into main, so the live URL is always current.
- **Libraries:** Tailwind CSS for fast styling, Recharts for the dashboard chart, Vitest for tests, and GitHub Actions to run the tests on every PR.

## 6. Design
- **Feel:** warm, outdoorsy and friendly, with rounded cards, big tap targets, and lots of emoji icons (🌲 🏖️ 🐕 ⚠️).
- **Colors:** forest green (#2F5D50) primary, cream (#FFF8EC) background, sunset orange (#E9844A) for buttons and stars, and red for 🚫 Don't-go.
- **Dog Mode:** a charcoal background, paw-print pattern, 🐶/🦴/💩 icons, and orange accents.
- **Inspiration:** **AllTrails** (place cards with amenity chips and filter pills) and **Strava** (big summary numbers on the dashboard).

## 7. Risks and cuts
- **Least sure I can build: the sitter share link.** It's the only page anyone can see without logging in, so it must show only that one user's shared places and never anything else. If the privacy rules are wrong, it could leak data.
- **Cut first:** the 🏆 Most-visited badge, then Dog Mode's extra decorations (keeping the plain dark theme).

---

## Plan vs. Reality
*(Filled in at the end. The original plan above is not edited.)*

| Planned feature | Shipped / Changed / Cut | Status | Learning | What changed and why |
|---|---|---|---|---|
| | | | | |
