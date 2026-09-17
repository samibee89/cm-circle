# Sami's Working Context & Conventions
(Upload this into the CM Circle Claude Project's docs, alongside vaonthego_brand_brief.md)

## About me / how I learn
- Operations & systems specialist, founder of VA on the Go, based in Chiang Mai, Thailand
- New to coding/Git/hosting as of this week, but picking things up fast — comfortable
  with real technical detail and complexity, not just high-level summaries
- I learn best with things explained step by step, especially anything involving the
  terminal, Git, or a tool I haven't used before — explain WHAT a command does and WHY,
  not just what to type
- I use VS Code with the Claude Code extension installed and working
- I have Git installed and configured (user.name "Sami Bennett", user.email
  sami@vaonthego.com set globally already)
- I have a GitHub account (username: samibee89) and know how to create repos, push
  changes, and use GitHub's device-code login flow when a new machine/tool needs
  authenticating

## Established project pattern (used successfully on prior projects)
1. Create a new folder in my Google Drive "claude" folder for each project
2. Put a project brief .md file in it describing what to build
3. Create a matching GitHub repo (Public, no README) for it
4. Open the folder in VS Code, use the Claude Code panel to build
5. Review proposed changes before approving them
6. Push to GitHub when a milestone is reached (batch changes together rather than
   pushing after every tiny tweak, to conserve hosting credits where relevant)
7. Deploy via either Netlify, Cloudflare Pages, or GitHub Pages depending on the project
   (see below)

## Hosting choices I've used and why
- **Netlify**: used for my main portfolio site + small tools (quiz, calculator) —
  credit-based free tier (300/month), auto-redeploys on GitHub push
- **GitHub Pages**: used for free, simple static/PWA projects I'm testing privately
  before linking publicly (e.g. the Life Hub PWA) — no credit system, fully free
- **Cloudflare Pages**: chosen for CM Circle specifically, to keep this project's
  hosting usage separate from my other Netlify-hosted sites

## Supabase conventions I already know and use
- I understand Row Level Security (RLS) and that it should be applied to every table,
  not just used for login
- I know the difference between the "publishable" key (safe in app code) and the
  "secret" key (never in app code or GitHub — only in private scripts/settings)
- I've previously set up Supabase Auth (email/password) and RLS policies successfully
  on another project (a client dashboard), so I'm not starting from zero conceptually

## PWA pattern I've used before
- I've successfully built and installed a PWA before (a habit/life-organization app),
  including testing "Add to Home Screen" on both iOS Safari and Android Chrome
- I understand a PWA is NOT offline-only — it's a normal, fully-live app that also
  degrades gracefully offline; Supabase Realtime can still power live features like chat

## This specific project's current status
- Drive folder created: "Women in Chiang Mai" (working app name is "CM Circle" — folder
  name and app name don't need to match, that's fine)
- Files in the folder so far: vaonthego_brand_brief.md (this app WILL use VAontheGO's
  established brand — colors, fonts, and the signature gradient heading/button treatment
  — Sami has decided to keep this branding for CM Circle too, not a separate identity)
- cm_circle_project_plan.md (the full phased plan) should also be added to this folder
  if it isn't already there
- Next step: scaffolding the initial Vite + React project with a placeholder Leaflet
  map, no Supabase connection yet (prompt for this already written and ready to send)

## Security/privacy priorities for this project specifically
- This app will hold real people's data (places, eventually activity plans, eventually
  chat) — RLS and careful data handling matter a lot to me, flag this proactively
  rather than waiting for me to ask
- Invite-only, not open signup, once past the very earliest testing stage
- Never store precise live location data — only places people deliberately save
