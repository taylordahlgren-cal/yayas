# Prompt log: Sign up and login

**Brief given to the agent (user story #1 from PLAN.md):**
> As a new visitor, I want to create an account with my email and a password, log in and log out, so that my spots and outings are private to me.

**Key decisions from my prompts:**
- "you could build it... if that's easiest? I have github, supabase and vercel." → Next.js + Supabase Auth (email/password) + Vercel.
- Every account must be a row in a `users` table → the agent added a database trigger that copies each new Supabase Auth account into `public.users`.

**What the agent built:** sign-up page, login page, log-out button, a `RequireAuth` wrapper that sends logged-out visitors to /login, and migration `001_users.sql`.

**Note for the live demo:** in Supabase → Authentication → Sign In / Providers → Email, turn **off** "Confirm email" so live sign-up logs you straight in.
