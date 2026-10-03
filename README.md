# Smart Motion

A digital interactive playbook of smart moves for building, teaching and
presenting with AI assistants. Eight moves, each with a framework, a worked
example and a cheatsheet you can paste into any assistant. Routes string
moves into sessions; the first route is the talk "GAi GAi with me" for the
CGH Educator Lunch and Learn Series on 7 October 2026.

- brief.md: what the talk needs and the rules for content.
- design.md: what Smart Motion is, the moves, the routes, the design system.
- workflows/: the cheatsheets as plain prompts.
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
through the Claude API. The browser never holds the key: requests go to
`/api/motus`, a Cloud Function in `functions/`.

To switch it on:

1. Put the project on the Blaze plan in the Firebase console (Cloud Functions
   need it). The spend ceiling that matters is the usage limit in the
   Anthropic console; set one before the talk.
2. Store the key as a secret, once:

```bash
firebase functions:secrets:set ANTHROPIC_API_KEY --project smartmotus
```

3. Rebuild the knowledge base whenever content changes, then deploy:

```bash
node scripts/build-kb.mjs && firebase deploy --only functions --project smartmotus
```

For local work, run the brain beside the dev server with the key in your
shell; the site proxies `/api` to it:

```bash
cd functions && ANTHROPIC_API_KEY=... node local.mjs
```

Motus answers only from `functions/kb.json`, which is built from README,
design.md, BRIEF.md, HANDOVER.md, references.md, content/, workflows/ and
the app's own moves and journey. Fill content/profile.md so it can answer
about the owner. Conversations are not stored.
