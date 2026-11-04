# Prompt log: Validation

**Brief given to the agent (user story #4 from PLAN.md):**
> As a dog owner, I want a friendly message if I leave a place name, outing date or dog rating blank, so that I don't save half-empty entries.

**What the agent built:** `lib/validate.js` with friendly, dog-themed messages ("How much did your dog like it? Pick 1–5 paws."). Invalid fields get a red border, and nothing is sent to the database until the form is valid. The agent also blocked future dates and negative miles/minutes, which weren't in my plan.

**Two layers of protection:** the form checks first (friendly message), and the database has its own checks from migration 002 (e.g. `dog_rating between 1 and 5`) as a safety net.
