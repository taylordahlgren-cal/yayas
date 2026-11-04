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
