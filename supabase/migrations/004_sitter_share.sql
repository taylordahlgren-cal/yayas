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
