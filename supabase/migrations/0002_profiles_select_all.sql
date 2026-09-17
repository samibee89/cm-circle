-- CM Circle — widen profiles visibility for "added by [name]"
-- Run this in the Supabase SQL editor after 0001_init_schema.sql.

-- The original policy only let a user read their OWN profile row, which
-- blocks showing who added a shared place. Nothing in `profiles` beyond
-- display_name is sensitive at this stage, so we widen SELECT to any
-- authenticated circle member rather than just the row's owner.

drop policy if exists "profiles_select_own" on profiles;

create policy "profiles_select_all_members"
  on profiles for select
  to authenticated
  using (true);
