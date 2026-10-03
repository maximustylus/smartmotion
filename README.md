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
