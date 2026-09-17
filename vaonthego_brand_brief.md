# VA on the Go — Brand Style Guide
(Include this file, or paste its contents, into every new project brief for Claude Code)

## Colors
- Black: #1A1A1A
- White: #FFFFFF
- Soft blue: #5B8DEF
- Soft pink: #E893C0
- Primary gradient: linear-gradient from soft blue → soft pink (roughly 120deg angle)

## Fonts
- Headings: Playfair Display (bold serif) — via Google Fonts
- Body text / UI / labels: Inter (sans-serif) — via Google Fonts

## Logo
- Black version (on light backgrounds) and white version (on dark/colored backgrounds)
- Logo files: see "Logo Brand Manual" folder — use the plain black or white wordmark only,
  never the bright solid pink/blue versions

## Signature heading + button treatment
This specific combination is the go-to style for headings/results/callouts across projects
— use it consistently rather than plain black text:
1. A small label above the heading, in soft pink, uppercase, letter-spaced, small font size
   (e.g. "YOUR NOMAD TYPE IS")
2. The heading itself in Playfair Display, bold, rendered with a blue-to-pink gradient text
   effect (gradient applied directly to the text, not a solid color)
3. Buttons use the full blue-to-pink gradient as their background, white bold text, rounded/
   pill-shaped

## Tone
Professional but approachable. Confident and clear, not overly playful or emoji-heavy on
client-facing work — but personal projects (things I've built for fun/practice) can have a
bit more warmth and personality in the copy, while keeping the same visual identity.

## Contact CTA pattern (for demo tools/quizzes/calculators)
End with a short, low-pressure line + button, e.g.:
"Curious what this could look like for your business specifically?"
[Contact me] → links to https://vaonthego.com/#contact

## Site structure conventions
- Every new project/page gets its own clearly-named folder (lowercase, no spaces),
  e.g. /quiz/, /calculator/, /dashboard-related-projects-hosted-separately/
- New tools get added to the "Things I've Built" section on the homepage once finished
- Footer credit convention: "Designed & built by Sami Bennett using Claude Code · View
  source on GitHub" (link to the relevant repo), kept small and understated

## Technical defaults
- Plain HTML/CSS/JS for simple tools (quizzes, calculators, static pages)
- React only when genuinely needed (complex interactivity, live data — e.g. dashboards)
- Google Fonts loaded via standard <link> tags
- Mobile-friendly/responsive by default on everything
