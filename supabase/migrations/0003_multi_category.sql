-- CM Circle — places.category becomes a multi-select array
-- Run this in the Supabase SQL editor after 0001 and 0002.

-- USING array[category] wraps each existing single value in a one-item
-- array — no data is lost, and old rows keep displaying correctly with
-- no separate backfill step needed.
alter table places
  alter column category type text[]
  using array[category];
