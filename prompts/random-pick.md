# Prompt log: Random pick with filters (my feature #1)

**My prompt:** "let's do random pick feature and maybe allow for me to add parameters?"

**Brief given to the agent (user story #8 from PLAN.md):**
> As a dog owner who can't decide, I want a "Pick a spot for me" button that I can narrow with filters (e.g. fenced + walkable) and that never picks a 🚫 Don't-go place, so that deciding takes zero effort.

**What the agent built:** a `/pick` page that reuses the same "Must have" and "Hide" filter chips as the places list. It shows how many places match, picks one at random (never 🚫 Don't-go, never a 🦴 treat stop, never the same place twice in a row), and shows its chips and 📌 tips.
