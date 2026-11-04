# Prompt log: Stars

**Brief given to the agent (user story #5 from PLAN.md):**
> As a dog owner, I want to star my favorite places and see a "Starred" view, so that my go-to spots are one tap away.

Plus the assignment rule: *all stars live in one `stars` junction table where each row references a user and an item, not one table per user.*

**What the agent built:** migration `003_stars.sql` (primary key = user_id + place_id, so you can't star the same place twice), a ☆/★ button on every place card and detail page, and an "All / ⭐ Starred" toggle on the places list.
