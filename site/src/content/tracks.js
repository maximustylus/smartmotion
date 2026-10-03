/*
  The take-home. Two tracks and five workflows, from workflows/ at the
  repository root (version 0.2, the owner's). The site links to the files;
  it does not copy them.
*/
const REPO = 'https://github.com/maximustylus/smartmotion/blob/main/'

export const tracks = [
  {
    id: 'personal',
    name: 'Personal track',
    line: 'Your own device and your own accounts. Public, de-identified, non-sensitive content only.',
    points: ['Newest features, including image and video generation', 'Free tiers exist; paid plans remove most waiting', 'You are responsible for what you paste in'],
    file: 'workflows/TRACK-PERSONAL.md',
  },
  {
    id: 'corporate',
    name: 'Corporate track',
    line: 'Hospital-issued device with Microsoft 365 Copilot, Pair and Agentsea, as your institution allows.',
    points: ['Cleared for work information, where your documents already live', 'Fewer media features; no generated video found', 'What you get depends on your licence and local settings'],
    file: 'workflows/TRACK-CORPORATE.md',
  },
]

export const workflows = [
  { n: 1, name: 'Storyboard to video', need: 'A short explainer or tutorial video', file: 'workflows/01-storyboard-to-video.md' },
  { n: 2, name: 'Infographic or poster', need: 'A one-page poster or infographic', file: 'workflows/02-infographic-poster.md' },
  { n: 3, name: 'Process or app flow', need: 'A flow diagram of a process, pathway or app', file: 'workflows/03-process-or-app-flow.md' },
  { n: 4, name: 'Pitch slides', need: 'A short slide deck to pitch an idea', file: 'workflows/04-pitch-slides.md' },
  { n: 5, name: 'Source-of-truth assistant', need: 'An assistant that answers only from your own documents', file: 'workflows/05-source-of-truth-assistant.md' },
]

export const compare = { file: 'workflows/COMPARE.md', name: 'Compare the two tracks' }
export const link = (file) => REPO + file

/*
  The tool map. Three lanes, as the owner uses them on 3 October 2026:
  build the agent, make it show, make it move. Badges say which track a
  tool belongs to. Routes between tools are the owner's practice; the
  limits live in workflows/COMPARE.md and change without notice.
*/
export const lanes = [
  {
    id: 'build',
    name: 'Build',
    line: 'Agents that answer from your sources and curate the next step.',
    steps: [
      { tool: 'Pair assistant', track: 'corporate', note: 'Upload documents, share with your team' },
      { tool: 'Agentsea agent', track: 'corporate', note: 'Reference files, Knowledge Spaces, SharePoint' },
      { tool: 'NotebookLM, Claude or ChatGPT projects', track: 'personal', note: 'Public material only' },
      { tool: 'Claude Code or Codex', track: 'personal', note: 'Code that builds the tool, and this site' },
    ],
    workflow: 5,
  },
  {
    id: 'show',
    name: 'Show',
    line: 'Infographics, posters and slides, from a content plan.',
    steps: [
      { tool: 'Canva', track: 'both', note: 'Familiar on both tracks; AI uses are metered' },
      { tool: 'Claude Design, export to PowerPoint', track: 'personal', note: 'Design first, then a .pptx', verify: true },
      { tool: 'Codex or code, to Google Slides', track: 'personal', note: 'Slides generated from an outline', verify: true },
      { tool: 'Copilot in PowerPoint', track: 'corporate', note: 'Needs the paid licence' },
    ],
    workflow: 2,
  },
  {
    id: 'move',
    name: 'Move',
    line: 'The agent curates the storyboard and the prompts; the generators make the clips.',
    steps: [
      { tool: 'Google Slides, to Google Vids', track: 'personal', note: 'A deck becomes a narrated video', verify: true },
      { tool: 'Gemini with Veo, Nano Banana and Flow', track: 'personal', note: 'Clips, images and assembly; credits are daily', verify: true },
      { tool: 'MCP to OpenRouter: Kling AI, Seedance, Veo', track: 'personal', note: 'One connector, several video models', verify: true },
      { tool: 'Clipchamp, if enabled', track: 'corporate', note: 'Assemble your own footage; no generated clips found' },
    ],
    workflow: 1,
  },
]
