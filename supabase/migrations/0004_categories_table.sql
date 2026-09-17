-- CM Circle — categories move from hardcoded to a shared, editable table
-- Run this in the Supabase SQL editor after 0001-0003.

-- `value` is the slug already stored in places.category (text[]), used
-- directly as the primary key — no separate id/foreign-key indirection
-- needed for a lookup table this small.
create table categories (
  value      text primary key,
  label      text not null,
  emoji      text not null,
  created_at timestamptz not null default now()
);

alter table categories enable row level security;

-- Any authenticated member can see the full shared category list.
create policy "categories_select_members"
  on categories for select
  to authenticated
  using (true);

-- Any authenticated member can add a new category — this is the whole
-- point: something one person adds becomes visible to everyone else,
-- immediately, with no approval step.
create policy "categories_insert_members"
  on categories for insert
  to authenticated
  with check (true);

-- Seed with the current fixed list so existing places.category values
-- keep resolving to a label + emoji after this migration.
insert into categories (value, label, emoji) values
  ('coffee', 'Coffee', '☕'),
  ('food', 'Food', '🍽️'),
  ('coworking', 'Coworking', '💻'),
  ('nature', 'Nature', '🌳'),
  ('gym', 'Gym', '🏋️'),
  ('hiking', 'Hiking', '🥾'),
  ('dog-friendly', 'Dog Friendly', '🐾'),
  ('kid-friendly', 'Kid Friendly', '🧒');
