# Prompt log: README + setup

**Prompt:** "Write a README that lets someone else understand and run the app: what it does, the live URL, the tools, and how to run it. Also give me one SQL file I can paste into Supabase to set up everything."

**What the agent did:** wrote `README.md`, generated `supabase/setup.sql` (all 4 migrations in order), and checked that the file runs cleanly on a local Postgres. It also fixed two small bugs found while screenshot-testing the app with fake data:
- the 🚫 "Don't go" label was jammed against the outing count on the places list
- Dog Mode could overwrite its saved on/off setting before reading it on page load
