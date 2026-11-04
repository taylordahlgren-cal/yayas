# Prompt log: Data isolation test

**Prompt:** "Write a test for PLAN.md test #1: User B cannot see User A's data. It should run against the real Supabase database, not a fake, because the privacy rules live in the database."

**What the agent built:** `tests/isolation.test.js`. It uses the secret key to create two throwaway users, logs in as User A to add "Tilden Park," then logs in as User B and asks for **all** places with no filter. Row-level security has to be what hides A's data, not app code. It deletes both test users at the end.

**Red / green plan:** temporarily turn off row-level security on `places` in the Supabase SQL Editor (`alter table places disable row level security;`), re-run the test (red), turn it back on (`... enable row level security;`), and re-run (green).
