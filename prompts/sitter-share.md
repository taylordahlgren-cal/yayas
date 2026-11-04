# Prompt log: Sitter share link (my feature #2)

**My prompt:** "a public share link could be cool to share with other dog people (like my dog sitter)? I'm often sending suggestions to my dog sitters - so maybe I could include a feature that could be shareable for them?"

**Brief given to the agent (user story #9 from PLAN.md):**
> As a dog owner with a dog sitter, I want a public, read-only link showing only the places I've marked "share with sitter," including their tips, so that my sitter knows where to go and what to watch out for without making an account.

**Risk from PLAN.md section 7:** this is the only page visible without logging in, so it must never leak other data.

**How the agent handled the risk:** logged-out visitors still can't read the `places` table at all. The public page calls one database function, `get_shared_places(token)`, that only returns the owner's places that are shared, not 🚫, and not treat stops, and only safe columns (no outings, no email, no ids). The link uses a long random token, and it can be reset.

**Bug caught:** while building this, the agent found that my earlier migration (`001_users.sql`) used `gen_random_bytes()`, which lives in a different schema on Supabase and would have made **every sign-up fail**. It was switched to the built-in `gen_random_uuid()`. All 4 migrations were then run against a local Postgres to confirm the share function returns only the right places and that User B can't see User A's places.
