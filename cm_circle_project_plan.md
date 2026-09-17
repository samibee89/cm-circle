# Local Women's Community App — Project Plan
(Working name TBD — placeholder: "CM Circle" throughout this doc, rename anytime)

## Vision
A personal-first app for women actually LIVING in Chiang Mai (not passing-through
travelers) — starts as a private, richly-detailed place journal (solving "I have 200
random Google Maps pins and no idea what half of them are"), with an invite-only social
layer added later for coordinating specific activities/hangouts. Free, invite-only,
built in phases — no pressure for it to "succeed" as a business, built primarily to learn
and to genuinely use.

## Core principles (read before building)
- **Solo value first**: Phase 1 must be genuinely useful with only ONE user (Sami).
  Never depend on other people existing for it to work.
- **No open signup**: invite-only from day one, enforced properly (not just "in spirit")
- **Privacy and data safety are not optional extras** — Row Level Security (RLS) must be
  applied to every table from the start, not retrofitted later
- **Residents, not tourists**: the whole differentiator vs. apps like NomadTable is that
  this is for people who live here long-term, not visitors passing through
- **Low social pressure**: when the social layer comes (Phase 3), it should be
  activity-specific and time-boxed ("Hiking Saturday, 2 spots"), never an open group chat
  that can go silent and feel awkward

## Tech stack
- React + Vite (same pattern as the Client Dashboard project)
- Supabase: Auth, Postgres database, Storage (for photos), Realtime (for Phase 3 chat/live
  updates)
- Map: use Leaflet + OpenStreetMap tiles (free, no API key, no usage costs) — NOT Google
  Maps, which has real costs at scale
- PWA setup (manifest + service worker) so it installs to phones like an app — no App
  Store/Play Store needed
- Hosting: GitHub (code) → Cloudflare Pages (not Netlify — keeping this project's hosting
  usage separate from Sami's other Netlify-hosted portfolio sites)

## PHASE 1 — Build this first (shared journal, just you + your friend)

### What it does
Sami and one trusted friend log in and see a SHARED map of Chiang Mai places — both can
add places, both can see everything either of them adds. Not open to the public yet —
just the two of you for now, informally (no invite-code system needed yet at this small
scale, but structure the code so one can be added later for Phase 2's wider circle).

### Database tables needed
**profiles**
- id (matches Supabase auth user id)
- display_name
- years_in_chiang_mai (optional, text or number)
- created_at

**places**
- id
- owner_id (references profiles — tracks WHO added it, but doesn't restrict who can SEE it)
- name
- category (one of: Hike, Cafe, Workshop, Wellness, Coworking, Food, Other)
- notes (free text — this is the "why I saved this" context that Google Maps lacks)
- photo_url (optional, stored in Supabase Storage, compress images client-side before
  upload like the Life Hub project did)
- latitude, longitude
- created_at

### Screens
1. **Login/Signup** — email + password via Supabase Auth. Signup stays open for now since
   it's just Sami and one friend — share the signup link directly with her rather than
   posting it publicly. Structure the code so a proper invite-code system can be added in
   Phase 2 without a rebuild
2. **Map view** — shows ALL places (from both Sami and her friend) as pins on a Leaflet
   map of Chiang Mai, tap a pin to see its details and who added it
3. **List/category view** — same shared places, browsable as a list, filterable by category
4. **Add/Edit place** — form to add a new place: name, category (dropdown), notes,
   optional photo upload, and either drop a pin on the map or search/type an address.
   Users can edit/delete their OWN places only, not each other's

### Row Level Security for Phase 1
- All logged-in users can SELECT (view) all rows in `places` — this is the shared part
- Users can only INSERT their own places, and only UPDATE/DELETE places where
  owner_id = auth.uid() (can't edit or delete someone else's entry)
- Users can view their own `profiles` row; viewing other users' basic display_name is fine
  (needed to show "added by [name]" on shared places), but keep other profile fields
  private to the owner for now

## PHASE 2 — Invite-code system + wider small circle (build after Phase 1 works)
- Add a proper invite-code system (e.g. an `invite_codes` table — a code must exist and
  be unmarked as used for someone to sign up) — this is what closes off open signup and
  lets you widen beyond just you + your friend, deliberately and safely
- Add light profile fields: a few interest tags, "years living in Chiang Mai"
- Consider whether ALL places should stay universally shared, or whether to add a
  "private note" option per place for personal-only context

## PHASE 3 — Add "Plan a Hangout" (build once Phase 2 has real, active users)
- New table: `hangouts` (id, host_id, title, description, date_time, max_spots, location
  reference to a place, created_at)
- New table: `hangout_attendees` (hangout_id, user_id, joined_at) — simple "I'm in" join,
  no chat needed yet at this stage
- RLS: only members can see/join hangouts; only the host can edit/cancel their own hangout
- Optional: Supabase Realtime so the attendee list updates live without refreshing

## PHASE 4 — Only if it's genuinely working
- Simple chat per hangout (Supabase Realtime)
- Basic report/block mechanism
- Decide then whether to widen invites, expand to other cities, or leave it as-is

## Security & privacy requirements (apply from Phase 1 onward)
- RLS on every table, always — never rely only on the app's own code to hide data
- Never store a user's live/exact current location — only places they've deliberately
  chosen to save
- Supabase secret key NEVER appears in the app's code or gets pushed to GitHub — only
  used in private scripts/settings, same rule as the Client Dashboard project
- Publishable key only in the actual app code (this is safe, same as before)

## Branding
No name or visual identity decided yet — build Phase 1 functionally first, decide on a
name/look once it's working and Sami has used it herself for a bit. Does NOT need to use
the VAontheGO brand style — this is a separate, personal project.

## Notes for Claude Code
- Build ONLY Phase 1 for now — do not build Phase 2/3/4 features yet, they're documented
  here for future context only
- Set up the project folder structure so it's easy to add Phase 2/3 features later without
  a rebuild (e.g. plan the database schema with future fields in mind, even if unused yet)
- Follow the same review-before-applying pattern as previous projects
