# Prompt log: Create / read / update / delete

**Brief given to the agent (user story #3 from PLAN.md):**
> As a dog owner, I want to add a place (name, type, fenced, off-leash, swimming, walkable from home, warnings, tips), see my list, open a place's detail page with its outings, edit it, and delete it after an "are you sure?" prompt, so that my list stays accurate. I can also log an outing at a place with a date, minutes, miles, a 1–5 dog rating and notes.

**Key decisions from my prompts:**
- "could I add a notes to remember / for future reference feature?" → the 📌 "Remember for next time" tips box, shown at the top of each place's page.
- "track features like fenced in, off-leash friendly, swimming available, and then maybe some warnings like tends to be crowded, bikers around, or children around, or even a very bad don't go here" → checkboxes grouped as 👍 Good stuff / ⚠️ Warnings, with 🚫 Don't go shown as a red banner.

**What the agent built:** places list, add / edit form, detail page with chips and outings, log-an-outing form, and a two-step "Are you sure?" delete for both places and outings.
