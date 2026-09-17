-- CM Circle — Phase 1 schema
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

-- ============================================================
-- Tables
-- ============================================================

create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at   timestamptz not null default now()
);

create table places (
  id         uuid primary key default gen_random_uuid(),
  created_by uuid references profiles(id) on delete set null,
  name       text not null,
  category   text not null,
  lat        double precision not null,
  lng        double precision not null,
  note       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Auto-create a profiles row on signup.
--
-- auth.users is managed by Supabase Auth itself — signing up creates a row
-- there, but nothing creates a matching `profiles` row automatically. The
-- RLS policies below gate access to `places` on "does a profiles row exist
-- for this user", so without this trigger a brand-new user could be fully
-- authenticated yet fail every places policy until a profile exists.
-- `security definer` lets this function insert into `profiles` on the
-- user's behalf even though the trigger fires before the user has any
-- privileges of their own yet.
-- ============================================================

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
--
-- Enabled from this first migration, not retrofitted — Postgres denies all
-- access to a table by default once RLS is on, so every access path has to
-- be explicitly granted by a policy below. Nothing is reachable by accident.
-- ============================================================

alter table profiles enable row level security;
alter table places enable row level security;

-- --- profiles policies ---

-- A user can read their own profile row. (Reading OTHER users' display_name
-- — needed later for "added by [name]" on shared places — is intentionally
-- left out for now; add a broader SELECT policy when that feature is built.)
create policy "profiles_select_own"
  on profiles for select
  to authenticated
  using (auth.uid() = id);

-- A user can create their own profile row. In practice the trigger above
-- does this automatically, but this policy also covers any case where the
-- app itself needs to insert/upsert a profile (e.g. backfilling display_name).
create policy "profiles_insert_own"
  on profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- A user can update only their own profile row — never someone else's.
create policy "profiles_update_own"
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- --- places policies ---

-- Any authenticated user who has a matching profiles row can read ALL
-- places — this is the "shared journal" part: both of you see everything
-- either of you has added, not just your own pins.
create policy "places_select_members"
  on places for select
  to authenticated
  using (exists (select 1 from profiles where profiles.id = auth.uid()));

-- A member can add new places, but only attributed to themselves —
-- created_by must equal their own id, so no one can insert a place and
-- attribute it to someone else.
create policy "places_insert_members"
  on places for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and exists (select 1 from profiles where profiles.id = auth.uid())
  );

-- A member can update only places THEY created — this is what makes the
-- journal shared-but-not-editable-by-anyone: you can see your friend's
-- pins, but only they can change or remove them.
create policy "places_update_own"
  on places for update
  to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

-- Same ownership restriction for deletes.
create policy "places_delete_own"
  on places for delete
  to authenticated
  using (created_by = auth.uid());
