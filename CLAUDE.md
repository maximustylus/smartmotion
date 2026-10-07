# Smart Motion: working notes for Claude

Smart Motion (smartmotion.web.app) is a digital, interactive playbook of
eight "smart moves" for building, teaching and presenting with AI
assistants. Its first use is the talk "GAi GAi with me: A Casual Stroll
into Generative AI for Educators. Ai MAi?" for the CGH Educator Lunch and
Learn, 7 October 2026, 1 to 2 pm, on Zoom. The owner is Muhammad Alif.
The site replaces slides: a vertical scroll story with pinned scenes,
particle motion graphics and a companion robot, Motus. It must feel like
a motion graphic, not a slide deck.

## Read first

- design.md: what Smart Motion is and its design system.
- content/voice.md: the voice every line of copy follows.
- references.md: nothing may be cited that is not listed there.
- archive/: the build brief, handover and talk documents, dated after the
  talk on 7 October 2026. History, not current guidance.

## Where things live

- site/ is the app: Vite, vanilla JS, GSAP, Three.js. Built to site/dist.
- site/src/content/: the words. moves.js (eight moves), journey.js (ADDIE
  phases and five eras), copy.js (cover, labels, quiz, take-home, closing,
  About), tracks.js, glossary.js, routes.js, cheatsheets/*.md (the prompts).
- site/src/story/: build.js turns content into scenes; scroll.js runs the
  beats; field.js is the particle field and its drawings; story.js mounts it.
- site/src/quiz/: the icebreaker and Firestore counters. site/src/motus/:
  the companion and chat. site/src/pages/: glossary and contact pages.
- workflows/ is the owner's (version 0.2). Never edit it.
- functions/: Motus's Cloud Function, on Google Gemini (the owner's choice,
  6 October 2026, matching NEXUS's AURA). Not deployed; it needs a Gemini API
  key from a billed project, which only the owner sets. Never handle the key.
  functions/guardrails.js carries the owner's sixteen rules (from NEXUS's
  AURA), the NRIC/FIN and crisis screens and the provenance stamp; run
  `cd functions && npm test` after touching it.
- MOTUS-GUARDRAILS.md (rules verbatim plus an honest conformance table) and
  MOTUS-INFO-CARD.md (public card after the IMDA Transparency Guidelines for
  Generative AI Chatbots, served at /motus-info) must change with the code.
  Both were signed off by the owner on 6 October 2026 (version 1.0). Version
  1.1 (stress-test fixes) was signed off the same evening, and version 1.2
  (final QC: no-praise persona, 8,192-token cap, wider NRIC screen,
  per-address hourly cap) on 7 October 2026, and version 1.3 (no "patient"
  wording) the same day; 1.3 is in effect. Any change to the prompt or the controls needs a new version and
  his sign-off again.
- scripts/steward.mjs measures build effort into site/src/content/effort.json
  and runs before every build. In a cloud session the local session logs
  are absent, so it keeps the last measured active time. Never edit the
  figures by hand. scripts/build-kb.mjs rebuilds Motus's knowledge base.

## Commands

    cd site && npm install
    npm run dev          # http://localhost:5173, add ?nosplash to skip the splash
    npm run build        # runs the steward first
    node scripts/build-kb.mjs    # from the repo root, after content changes
    firebase deploy --only hosting   # only when the owner asks

## Rules that do not bend

- Do not invent facts, statistics, dates, quotes, citations or product
  limits. Anything the owner has not supplied stays a TODO, written in copy
  as [[TODO: what is needed]]. Live effort figures are written as
  {{active}}, {{elapsed}}, {{commits}}, {{prompts}}, {{sittings}}.
- UK English. No em dashes or en dashes. No exclamation marks. No hype.
- Items in archive/cost-evidence.md are unverified and must not appear.
- Pandan Reservoir case: "charged" and "allegedly"; no name, nationality
  or image in our own copy. Will Smith clips: no likeness in our own copy or
  images. On 7 October 2026 the owner chose to open both sources (the
  YouTube clip and the Mothership report) inside the in-app window.
- No health information about anyone, colleague details or internal hospital
  documents. The word "patient" does not appear anywhere in Smart Motion, the
  app or Motus (owner, 7 October 2026); say "health information" instead.
- Firestore stores anonymous aggregate counters only.
- Copy has word limits so each beat fits a phone screen: angle 18,
  principle 40, framework note 55, example 50, prompt 170 words.

## How to work here

- Work happens on phase-1, and main is kept level with it (fast-forwarded on
  6 October), because the site's take-home links point at main on GitHub.
  After pushing phase-1, push main too: git push origin phase-1:main
- Commit each verified change with a plain message. Deploy only when asked.
- Check every change in a browser at phone size (375 by 812 and 390 by
  664) and wider. A console error counts as a failure. Each beat must fit
  the screen; story.js has a fit guard, scroll.js re-splits lines.
- Particles are B-roll: they nest in a corner and come out for a drawing.
  Era pages keep their period look (dot matrix in 1963); other pages are
  drawn crisp. Windows open with the genie animation.
- Stop and ask before anything structural: scene order, new scenes, time
  budgets. The owner decides those.
