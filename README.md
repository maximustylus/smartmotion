# Smart Motion

Smart moves, with you in charge.

A digital interactive playbook of smart moves for building, teaching and
presenting with AI assistants. Eight moves, each with a framework, a worked
example and a cheatsheet you can paste into any assistant. Routes string
moves into sessions; the first route, the talk "GAi GAi with me", was
given at the CGH Educator Lunch and Learn Series on 7 October 2026.

- design.md: what Smart Motion is, the moves, the routes, the design system.
- references.md: every source the app cites.
- workflows/: the owner's five workflows and the two tracks.
- skills/: the eight move prompts as Claude skills, built from the prompts by scripts/build-skills.mjs.
- archive/: dated documents from the build and the talk (the brief, the
  handover, the rehearsal checklist).
- site/: the Vite app, deployed to smartmotion.web.app on Firebase Hosting.
- firestore.rules: anonymous quiz counters, increments only.

## Run it

```bash
cd site && npm install && npm run dev
```

Keys on the shared screen: arrows move between beats, `O` overview, `T`
timer, `B` blackout, `F` full screen, `D` theme, `Z` reset room totals,
`?` help.

## Motus, the companion

Motus is the pixel robot at the bottom right. It travels with the story,
snoozes when left alone, and opens a chat that answers from this repository
through Google's Gemini API, as AURA in NEXUS does. The browser never holds the key: requests go to
`/api/motus`, a Cloud Function in `functions/`.

To switch it on:

1. Put the project on the Blaze plan in the Firebase console (Cloud Functions
   need it). Done on 6 October 2026, with a budget alert.
2. Create a Gemini API key in a Google Cloud project that has billing on
   (the smartmotus project qualifies). Google's terms let it use unpaid-tier
   conversations to improve its products; paid-tier ones it does not. Then
   store the key as a secret, once:

```bash
firebase functions:secrets:set GEMINI_API_KEY --project smartmotus
```

3. Rebuild the knowledge base whenever content changes, then deploy:

```bash
node scripts/build-kb.mjs && firebase deploy --only functions --project smartmotus
```

For local work, run the brain beside the dev server with the key in your
shell; the site proxies `/api` to it:

```bash
cd functions && GEMINI_API_KEY=... node local.mjs
```

Motus answers only from `functions/kb.json`, which is built from README,
design.md, the archived brief, references.md, content/, workflows/, the
info card and the app's own
moves and journey. Fill content/profile.md so it can answer about the
owner. Conversations are not stored.

Governance follows the owner's NEXUS pattern for AURA:
`MOTUS-GUARDRAILS.md` (the sixteen rules, and what is enforced versus only
asked) and `MOTUS-INFO-CARD.md` (the public card, after the IMDA
Transparency Guidelines for Generative AI Chatbots, at `/motus-info`). The
owner signed version 1.0 of both on 6 October 2026 and Motus went live on
Gemini that day; version 1.2, after the final quality-control round, was
signed off on 7 October 2026. Tests: `cd functions && npm test`.

Still to do: read a set of real turns as NEXUS did.
