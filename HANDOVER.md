# Handover to Claude Code

Written 3 October 2026 from the planning conversation with the owner
(Muhammad Alif). Read this with BRIEF.md. Where the two differ, this file is
newer and wins. Your first task is at the end.

## 1. The job in one paragraph

Build and ship smartmotion.web.app: a Progressive Web App that is both the
slides and the audience experience for a 60-minute talk, "GAi GAi with me: A
Casual Stroll into Generative AI for Educators. Ai MAi?", for the Changi
General Hospital (CGH) Educator Lunch and Learn Series on 7 October 2026,
1 to 2 pm, on Zoom. Audience: 60+ clinical educators, mostly non-technical.
The public repository (github.com/maximustylus/smartmotion) is the take-home:
workflows and cheat sheets they can reuse.

## 2. State as last known

- Firebase: project "smartmotus", Hosting site "smartmotion". Firestore
  enabled (asia-southeast1, production mode), as reported by the owner.
- Repository: BRIEF.md, .firebaserc and firebase.json committed. Work is on
  branch phase-1.
- Phase 1 (design system, presenter shell, navigation, PWA) was built and
  tested locally. You asked whether to commit and preview-deploy. Confirm what
  happened next with `git status` and `git log` before doing anything.
- The owner may now be using the Claude Code desktop app instead of the
  terminal, so this may be a fresh session with no chat history.

## 3. Decisions made (do not reopen without asking)

- Name: smartmotion. Not "SmartMove".
- Quiz only, no grouping. Each device shows its own result; the presenter view
  shows live room totals from anonymous Firestore counters.
- Visual style: bright, vibrant, cinematic and sleek. Real tool logos in the
  quiz, from official brand kits, listed in CREDITS.md.
- Use cases to feature: NEXUS and AURA, Smart Queue Live (replaced C.A.R.E. on 6 October 2026), ImmersiFit.
- No separate live demo. The site is the demo.
- Petri Dish Research Playbook: removed entirely.
- Model Context Protocol (MCP) server: deferred until after the talk.
- UK English, no em dashes, abbreviations spelled out on first use, APA 7th
  references, no invented facts. Unsourced items are marked TODO.

## 4. What changed since BRIEF.md was written

### 4.1 The audience wants practical how-tos
Attendees mainly want time-saving, practical methods: storyboarding and video,
posters and infographics, flow diagrams, pitch slides, and grounded
assistants. The four education frameworks (6PoLD, Miller's pyramid, R2C2,
Vygotsky's Zone of Proximal Development) are now a short "why this works"
layer, not the main take-home. Framework workflows have NOT been written.
Ask the owner before building section 6 how much time the frameworks keep.

### 4.2 workflows/ already exists. Do not rewrite it.
The owner supplies workflows/ in this handover (version 0.2). Phase 4 changes
from "write the workflows" to:
- Link to them from the take-home section.
- Add a "Which track are you on?" screen linking to TRACK-PERSONAL.md,
  TRACK-CORPORATE.md and COMPARE.md.
- Build Claude skills in skills/ from the five workflow files, without
  changing the workflow files themselves.

Contents:
- README.md: index and house rules
- COMPARE.md: two tracks side by side, the six "gates", tool limits
- TRACK-PERSONAL.md, TRACK-CORPORATE.md: a cost card per workflow
- 01 to 05: storyboard to video; infographic or poster; process or app flow;
  pitch slides; source-of-truth assistant
- cheatsheets/connectors-mcp-plugins.md, cheatsheets/repo-stewards.md

### 4.3 Two tracks
Every workflow has a personal track (own device, own AI accounts, public
content only) and a corporate track (Microsoft 365 Copilot, Pair, Agentsea).
The site should make this distinction visible wherever it points to a
workflow.

### 4.4 Additions to the talk content
- Section 3, Cost factor, gets two ideas (see content/cost-evidence.md):
  (a) pick the model that is good enough, not the top of the chart;
  (b) cost means total cost of ownership, not the token bill.
- A "gates" idea fits section 3 or 4: tools make you wait, pay or accept less.
  The clearest example is video: ten short clips take about five days on a
  free tier and one day on a paid one (figures in workflows/COMPARE.md).
- Section 7 opens with the "Will Smith eating spaghetti" video benchmark
  (links only), then the Pandan Reservoir AI crocodile image case (Mothership,
  29 September 2026; "charged" and "allegedly"; no name, nationality or image).
- The slot is full. If something is added, say what it displaces.

### 4.5 Zoom constraints
Slow, deliberate transitions. Large text. /play must work on laptop and phone,
reached by QR code and a short link for the Zoom chat. Offline support is low
priority.

## 5. Content files

- content/cost-evidence.md: slide-safe statements with sources. Every item is
  marked for the owner to verify before it appears on screen.
- content/use-cases.md: template only. The owner fills it in. Do not invent
  details of NEXUS, AURA, C.A.R.E. or ImmersiFit.

## 6. Open items only the owner can supply

1. AI tool list for the logo quiz (12 to 16 tools)
2. Three level labels and four type names for the quiz
3. content/use-cases.md
4. Verification of content/cost-evidence.md
5. Sources and dates for the Will Smith clips
6. Whether the frameworks keep a full section or become a short layer
7. Corporate-track TODOs in workflows/ (licence type, Clipchamp, patient data
   rules, quotas, whether Agentsea's in-app figures may be published)
8. Confirmation from the CGH Education Office on public logo use

List these at every checkpoint until closed.

## 7. Do not

- Do not invent facts, statistics, quotes, citations or product limits.
- Do not transcribe figures from screenshots or reuse images found online.
- Do not embed, host or generate any real person's likeness.
- Do not include patient data, colleague details, internal hospital documents
  or Singapore Institute of Technology course materials.
- Do not reproduce Synapxe or Agentsea graphics or mascots.
- Do not deploy to the live site without the owner's explicit go-ahead.
  Use a preview channel for testing.
- Do not start the next phase without approval.

## 8. Priority for 7 October

1. Phase 2: quiz, Firestore counters, security rules, live totals
2. Phase 3: content sections 2 to 7
3. Phase 4 as redefined in 4.2
4. A full rehearsal on Zoom from a preview deploy, then the live deploy

## 9. Your first task

1. Run `git status` and `git log --oneline -10` and report where things stand.
2. Add this file, content/ and workflows/ to the repository without altering
   workflows/.
3. Update BRIEF.md to reflect section 4 above: bump it to version 1.1, add a
   short change log at the end, and keep everything else as it is.
4. Commit on the current branch.
5. Report back with: what is built, what is verified, the open items from
   section 6, and what you propose to do next. Then wait.
