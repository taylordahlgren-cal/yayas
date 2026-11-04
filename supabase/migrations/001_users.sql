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
