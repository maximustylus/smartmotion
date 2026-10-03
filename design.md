# Smart Motion design brief

Decided in the UI/UX interviews on 3 October 2026. Supplements brief.md.
Where the two differ, this file wins.

## What Smart Motion is

Smart Motion is a digital interactive playbook of smart moves for building,
teaching and presenting with AI assistants. The product is the playbook.
The talk "GAi GAi with me" on 7 October 2026 is its first route: a guided
path through chosen moves for one audience and one time budget.

The playbook demonstrates its own moves. Its file system and architecture
are a move you can open and read, and so is the brief that built it.

### Moves

Eight moves, in this order. Each has the same anatomy: principle and
angle, the framework behind it with its source, a worked example, and a
cheatsheet that pastes into any assistant.

1. Begin with the end in mind
2. Have an angle
3. Know the hook, keep the engagement
4. Understand the file system and architecture
5. Build on solid frameworks
6. Test it with the utility formula
7. Reality check
8. Use it safely

### Routes

A route strings moves into a session. Route steps are moves, or scenes
the route brings with it: cover, quiz, worked examples, questions. The
first route follows the time budget in brief.md.

### Where things live

| Path | Holds |
| --- | --- |
| site/src/content/moves.js | The eight moves |
| site/src/content/routes.js | Routes, starting with the talk |
| site/src/content/examples.js | Worked examples from the owner's tools |
| site/src/story/ | Scroll story, scene builders, field, chrome |
| site/src/quiz/ | The icebreaker and its Firestore client |
| workflows/ | Cheatsheets as plain prompts, one per move |
| skills/ | The same cheatsheets as Claude skills, Phase 4 |
| firestore.rules | What a client may write: counters, up by one |

### URLs

| URL | Shows |
| --- | --- |
| / | The playbook |
| /talk | The talk route |
| /play | The talk route opened on the quiz, for the QR code |
| /styleguide | The design system |

## Decisions

| Topic | Decision |
| --- | --- |
| Architecture | One vertical scroll story for every device. The shared screen scrolls the same story attendees scroll on their phones. |
| Quiz | Inline as section 1 of the story. Live room totals appear right after it. |
| Scroll feel | Pinned scenes. Each section pins while scrolling drives its animation. |
| 3D | One persistent hero object behind the story that transforms per section. |
| Visual tone | Clean editorial, Apple-like. White space, restrained colour, very large type. |
| Theme | Follows the device setting. A corner toggle overrides it, remembered per device. |
| Live control | Arrow keys and clicker jump smoothly between beats. Trackpad still works. Timer and overview stay. |
| First-class layouts | Phone portrait, laptop landscape in a shrunken Zoom window, phone landscape, tablet both ways, installed PWA. |
| Device floor | Mid-range phones from about 2020 run the 3D at full quality. Newer phones get the same scene. |
| Reuse | Keep Vite, PWA, Firebase config, timer, overview, keyboard handling and the TODO tracker. Replace stage, slides and motion. |

## Proposal 1: the hero object

A particle field. Roughly 12,000 points on phones and 30,000 on laptops,
drawn as a single GPU point cloud with per-point targets, so morphing between
shapes costs nothing extra. It carries the story:

| Section | Form the particles take |
| --- | --- |
| Title | A loose drifting cloud, the "stroll". Cursor or touch nudges it. |
| 1 Scan and play | Gathers into a tidy grid that mirrors the logo grid of the quiz. |
| 2 Vibe x coding | Two clouds, one warm and one cool, that only form a shape once they overlap. |
| 3 The test | Five columns, one per factor. Scrolling drags one column to zero and the whole product falls flat. |
| 4 Reality check | A single bar that grows fast, then crawls, with the march of nines ticking along it. |
| 5 Use cases | Three clusters, each scored by how tall its five columns stand. |
| 6 Frameworks | A pyramid for Miller, then a pair of concentric rings for the Zone of Proximal Development. |
| 7 Safe use | Scatters into a timeline, then settles. |
| Questions | Returns to the title cloud. |

Why particles over glass or wireframe: they stay legible after Zoom
compression, they read in both themes (dark dots on paper, lit dots on
ink), they run on 2020 phones, and every section form is also a chart
the talk needs anyway.

Reduced motion: the field holds its section form with no drift and
morphs instantly.

## Proposal 2: type and colour

Type. One family for everything, Geist, variable weight, tight tracking at
display sizes, with Instrument Serif italic reserved for the talk's voice
lines such as "Ai MAi?". Both ship as self-hosted woff2 through fontsource.

Colour. A neutral base with one signature accent and one secondary for
quiz feedback.

| Token | Light | Dark |
| --- | --- | --- |
| Base | #F6F5F2 paper | #0B0B0E ink |
| Text | #111114 | #F2F1EE |
| Muted | #5E5E66 | #A2A2AC |
| Hairline | #E2E0DA | #232329 |
| Accent | #2F4BFF ultramarine | #6E84FF |
| Secondary | #1F9D55 green for quiz feedback | #3FCF7A |
| TODO | #B86E00 | #FFB020 |

The gradients from Phase 1 are retired. The particle field is the only
place colour runs free, and it tints to the current section.

## Layout system

Everything is laid out on a vertical rhythm, not a 1920 x 1080 stage.

- Type scales with the shorter viewport edge, so a shrunken Zoom window
  and a phone both keep headlines large. Minimum body size 18 px on phones,
  22 px equivalent on the shared screen.
- Portrait: the hero field sits behind the text, text stacks top to bottom,
  the pinned scene uses the full height. Thumb zone holds the quiz controls.
- Landscape: text and the hero field split left and right, a 5 to 7 column
  grid. Pinned scenes run the same scroll distance.
- Tablet follows landscape rules above 900 px wide, portrait rules below.
- Installed PWA: safe areas respected, theme colour updates with the
  toggle, no browser chrome assumed for anything.
- Zoom share: no element thinner than 2 px, no text under 22 px equivalent,
  no full-screen fast motion. Pinned scenes animate on scroll, so the
  presenter sets the pace.

## Scroll and control

- GSAP ScrollTrigger pins each section and scrubs its timeline. Beats inside
  a section are scroll positions, not keypresses.
- Arrow keys, space, page keys and clicker jump to the next or previous beat
  with a smooth scroll. The URL hash tracks the beat. Overview and timer
  keep working. Escape, O, T, B and F keep their meanings.
- Scroll direction is vertical everywhere. Swipe is native scrolling.
- Lenis or native smooth scrolling, decided by a test on the device floor.

## Theme

- `prefers-color-scheme` sets the start. A toggle in the top right overrides
  it and stores the choice in localStorage. The toggle animates the switch
  with a soft crossfade, never a hard flip, and respects reduced motion.
- Tokens are CSS custom properties switched on `data-theme`. Three.js reads
  the same tokens for particle and background colours.
- The manifest theme colour follows the live theme.

## Performance budget

- Target 60 fps on an iPhone 11 class device with the particle field and one
  pinned scene active. Measured, not assumed.
- Three.js loaded as its own chunk after first paint. The story is readable
  before the field appears.
- Point count chosen from device pixel ratio and a one-second frame sample on
  load, between the phone and laptop figures above.
- Images and SVG only for logos and diagrams. No video.

## What is reused from Phase 1

Vite config, PWA manifest and service worker, Firebase Hosting config,
rehearsal timer, overview with TODO count, keyboard shortcut handling, hash
routing, the TODO marker component, and the content rules. The 1920 x 1080
stage, the slide definitions, the choreography module and the ambient
background are replaced.

## Revised phases

1. Design system in both themes, layout system, theme toggle, scroll and
   beat navigation, the hero field with its title form, section 0 and the
   section shells. Stop for approval.
2. Quiz inline, Firestore counters, security rules, live totals. The field's
   section 1 form.
3. Content sections 2 to 7 with their field forms.
4. workflows/ and skills/.
5. MCP server, deferred.

## Open for the owner

- Approve or change the two proposals above.
- Reference sites you admire, if any, so the editorial tone matches your eye.
- Everything listed as TODO in brief.md still stands.
