# Prompt log: Data model

**Brief given to the agent:** PLAN.md section 3 (the database table), plus user story #2:
> As a dog owner, I want my places and my outings at each place saved, so that my history is still there next time I open the app.

**Key decision from my prompts:** "warnings should belong to a place" → crowded / bikers / kids are true/false columns on `places`, not on `outings`.

**What the agent built:** `supabase/migrations/002_places_outings.sql` (places + outings with foreign keys and row-level security) and `schema.md`. The agent also added database checks (rating 1–5, valid place type) that weren't in my plan; these are noted in schema.md.
