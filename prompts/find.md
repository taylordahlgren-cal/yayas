# Prompt log: Find things (search, filter, sort)

**Brief given to the agent (user story #6 from PLAN.md):**
> As a dog owner, I want to search places by name, filter by amenities (fenced, off-leash, swimming, walkable from home) and hide warnings (crowded, bikers, kids), and sort by newest, highest dog rating or most visited, so that I can find the right spot for today.

**Key decision from my prompts:** the "don't go here" flag. The agent suggested 🚫 places always sink to the bottom of the list, even when sorting, and I agreed.

**What the agent built:** `lib/filters.js` (a pure function, so it's easy to test) and a `FilterBar` with a search box (searches names *and* tips), "Must have" chips, "Hide" chips and a sort dropdown.
