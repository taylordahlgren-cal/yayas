-- Yayas: ONE-TIME SETUP. Paste this whole file into Supabase → SQL Editor → Run.
-- (It is all 4 migrations from supabase/migrations/, in order. Safe to run more than once.)

-- ===== supabase/migrations/001_users.sql =====
-- 001: users table. Every account created through Supabase Auth gets a row here.
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  share_token text unique default replace(gen_random_uuid()::text, '-', ''),
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

drop policy if exists "users see only themselves" on public.users;
create policy "users see only themselves" on public.users
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- When someone signs up, copy them into public.users automatically.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email) values (new.id, new.email);
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===== supabase/migrations/002_places_outings.sql =====
-- 002: places (my dog spots) and outings (each trip to a place).
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.users(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  type text not null default 'park' check (type in ('trail','park','beach','neighborhood','treat stop')),
  -- amenities
  fenced boolean not null default false,
  off_leash boolean not null default false,
  swimming boolean not null default false,
  walkable_from_home boolean not null default false,
  -- warnings
  crowded boolean not null default false,
  bikers boolean not null default false,
  kids boolean not null default false,
  dont_go boolean not null default false,
  share_with_sitter boolean not null default false,
  tips text,
  created_at timestamptz not null default now()
);

create table if not exists public.outings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.users(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete cascade,
  date date not null,
  minutes integer check (minutes is null or minutes >= 0),
  miles numeric(5,2) check (miles is null or miles >= 0),
  dog_rating integer not null check (dog_rating between 1 and 5),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists places_user_idx on public.places(user_id);
create index if not exists outings_place_idx on public.outings(place_id);
create index if not exists outings_user_idx on public.outings(user_id);

-- Row Level Security: each user can only see and change their own rows.
alter table public.places enable row level security;
alter table public.outings enable row level security;

drop policy if exists "own places" on public.places;
create policy "own places" on public.places
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own outings" on public.outings;
create policy "own outings" on public.outings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ===== supabase/migrations/003_stars.sql =====
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

-- ===== supabase/migrations/004_sitter_share.sql =====
-- 004: public read-only sitter link.
-- Visitors (not logged in) can't read the places table at all; row-level security blocks them.
-- Instead they call this one function, which returns ONLY:
--   * places belonging to the user who owns this exact share_token
--   * that are marked share_with_sitter = true
--   * and are not marked 🚫 Don't go
--   * and only safe columns (no user ids, no outings, no email).
create or replace function public.get_shared_places(token text)
returns table (
  owner_name text, name text, type text,
  fenced boolean, off_leash boolean, swimming boolean, walkable_from_home boolean,
  crowded boolean, bikers boolean, kids boolean, tips text
)
language sql stable security definer set search_path = public as $$
  select split_part(u.email, '@', 1), p.name, p.type,
         p.fenced, p.off_leash, p.swimming, p.walkable_from_home,
         p.crowded, p.bikers, p.kids, p.tips
  from public.users u
  join public.places p on p.user_id = u.id
  where token is not null and length(token) >= 16
    and u.share_token = token
    and p.share_with_sitter
    and not p.dont_go
    and p.type <> 'treat stop'
  order by p.walkable_from_home desc, p.name;
$$;

-- Make a brand-new link (the old link stops working).
create or replace function public.reset_share_token()
returns text language sql security definer set search_path = public as $$
  update public.users set share_token = replace(gen_random_uuid()::text, '-', '')
  where id = auth.uid()
  returning share_token;
$$;

revoke all on function public.get_shared_places(text) from public;
grant execute on function public.get_shared_places(text) to anon, authenticated;
revoke all on function public.reset_share_token() from public, anon;
grant execute on function public.reset_share_token() to authenticated;
