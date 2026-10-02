# smartmotion build brief

## Purpose
A Progressive Web App (PWA) at smartmotion.web.app that is both the slides and
the audience experience for a 60-minute talk: "GAi GAi with me: A Casual Stroll
into Generative AI for Educators. Ai MAi?" for the Changi General Hospital
(CGH) Educator Lunch and Learn Series. 7 October 2026, 1 to 2 pm, on Zoom.

Audience: 60+ clinical educators, mostly non-technical. They use Microsoft 365
Copilot at work and personal AI tools on their own devices.

The site itself is the demo of what vibecoding can produce.

## Stack
- Vite, vanilla JS, GSAP, in site/, built to site/dist
- Firebase Hosting: project "smartmotus", site "smartmotion" (configured)
- Firestore for anonymous quiz totals only
- Installable PWA. Offline support is low priority.

## Two views
- Presenter view (/): screen-shared on Zoom. Slow, deliberate transitions, no
  fast full-screen motion, large text legible in a small shared window.
  Arrow keys or scroll.
- Attendee view (/play): works equally on laptop and phone. Reached by QR code
  and a short link for the Zoom chat.

## Talk flow and time budget
1. Scan and play: icebreaker quiz (8 min)
2. Hook: vibe x coding. Garbage in, garbage out. Both factors needed (5 min)
3. The test: Utility = Validity x Reliability x Educational Impact x
   Acceptability x Cost, adapted from assessment to vibecoded tools. Animate
   it: set any factor to zero and the product collapses. Cost gets two screens:
   (a) capability versus cost per task, linking to the live Artificial Analysis
   page with retrieval date, figures TODO for owner; (b) cost means total cost
   of ownership, not the token bill, using content/cost-evidence.md (7 min)
4. Reality check: animated bar (idea 5 minutes, working demo 2 hours, final 10%
   6 months) with the "march of nines" (7 min)
5. Use cases: NEXUS and AURA, C.A.R.E., ImmersiFit, each scored against the
   utility formula. Content from content/use-cases.md (15 min)
6. Frameworks and take-home: 6PoLD, Miller's pyramid, R2C2, Vygotsky's Zone of
   Proximal Development, linking to workflows/ in the repo (10 min)
7. Safe use, then questions (8 min). Opens with the "Will Smith eating
   spaghetti" AI video benchmark (2023 versus 2025) as a timeline with outbound
   links only, leading into the Pandan Reservoir AI crocodile image case
   (Mothership, 29 September 2026).

One light aside in section 1 or 2: a play on "stroll" and wandering minds,
citing Killingsworth and Gilbert (2010).

## Icebreaker quiz (/play)
- Part 1: grid of AI tool logos, tap the ones you know. Count maps to one of
  three levels. Level labels: TODO, owner to supply.
- Part 2: one question sorting people into four types: the stats person
  (R, Python, Stata, SPSS), the design person (Canva, CMYK, RGB, aspect ratios),
  the protocol and workflow person, the storyteller. Type names: TODO, owner to
  confirm. Do not call it DISC. Present it as a fun sorter, not a validated
  instrument.
- Result: each device shows its own level and type, computed locally.
- Live totals: presenter view shows animated room totals by level and type.
- No grouping.

## Data rules
- Firestore stores aggregate counters only. No names, no device identifiers,
  no free text.
- Security rules: clients may only increment the defined counters. Everything
  else denied.
- One submission per device (local flag). Presenter has a reset control.
- If Firestore is unreachable, the personal result still shows and the
  presenter view says totals are unavailable. Never fail silently.

## Logos
- Real logos, from each company's official brand or press kit, stored in
  site/assets/logos, each listed with its source in CREDITS.md.
- Tool list: TODO, owner to supply. Do not guess the list.

## Design
Bright, vibrant, cinematic and sleek. Motion with purpose, generous type,
strong contrast. Respect prefers-reduced-motion. UK English. No em dashes.

## Content rules
- Do not invent facts, statistics, quotes or citations. Anything not supplied
  or sourced is marked TODO and listed at each checkpoint.
- references.md in APA 7th. Sources to verify against the originals before
  publishing: van der Vleuten (1996); Miller (1990); Sargeant et al. (2015);
  Vygotsky (1978); Bound and Chia, Six Principles of Learning Design; Karpathy
  on the Dwarkesh Podcast (2025); Killingsworth and Gilbert (2010).
- Cite the Karpathy interview itself, not summaries of it.
- Pandan Reservoir case: use "charged" and "allegedly". Do not name the person,
  state nationality or reuse any image. Link to the article.
- Will Smith clips: do not embed, host, recreate or generate the clips or any
  likeness. Links only. Sources and dates: TODO, owner to verify.
- Do not transcribe figures from screenshots. Redraw all graphics from scratch.
  Do not reuse images found online.

## Excluded
- Petri Dish Research Playbook
- Singapore Institute of Technology course materials and assignments
- Patient data, colleague details, internal hospital documents

## Phases
Stop after each phase, summarise what is built, what is verified and what is
TODO, and wait for approval.
1. Design system, presenter shell, navigation, PWA
2. Quiz, Firestore counters, security rules, live totals
3. Content sections 2 to 7
4. workflows/ as plain prompts that paste into any assistant, plus the same
   content as Claude skills in skills/
5. Model Context Protocol (MCP) server in mcp/. Deferred until after the talk.

Priority for 7 October: phases 1 to 3, then 4 if time allows.

## Done means
Deployed at smartmotion.web.app, runs a full 60-minute rehearsal on Zoom, no
TODO left in visible content, every claim traceable to references.md.
