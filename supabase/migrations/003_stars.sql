-- 003: stars. ONE junction table for everyone: each row = "this user starred this place".
create table if not exists public.stars (
  user_id uuid not null default auth.uid() references public.users(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, place_id)   -- a user can star a place only once
);

alter table public.stars enable row level security;

drop policy if exists "own stars" on public.stars;
create policy "own stars" on public.stars
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
