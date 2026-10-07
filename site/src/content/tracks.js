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
    line: 'Your own device, your own accounts. Public, de-identified, non-sensitive content only.',
    points: ['The newest features, including image and video generation', 'Free plans exist; paid plans remove most of the waiting', 'You are responsible for what you paste in'],
    file: 'workflows/TRACK-PERSONAL.md',
  },
  {
    id: 'corporate',
    name: 'Corporate track',
    line: 'Your hospital-issued device, with Copilot in Teams, Pair and Agentsea, as your institution allows.',
    points: ['Cleared for work information, where your documents already live', 'Fewer media features; no video generator found', 'What you get depends on your licence and local settings'],
    file: 'workflows/TRACK-CORPORATE.md',
  },
]

export const workflows = [
  { n: 1, name: 'Storyboard to video', need: 'A short video that explains or teaches', file: 'workflows/01-storyboard-to-video.md' },
  { n: 2, name: 'Infographic or poster', need: 'A poster or infographic that fits on one page', file: 'workflows/02-infographic-poster.md' },
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
    line: 'Assistants and agents that answer from your sources and line up the next step.',
    steps: [
      { tool: 'Copilot in Teams: New agent', track: 'corporate', note: 'Build your own from files and pages' },
      { tool: 'Agentsea agent', track: 'corporate', note: 'Microsoft SharePoint as the document hub' },
      { tool: 'Pair Chat', track: 'corporate', note: 'for.sg as the document hub' },
      { tool: 'NotebookLM, Claude or ChatGPT projects', track: 'personal', note: 'Public material only' },
      { tool: 'Claude Code or Codex', track: 'personal', note: 'Writes the code for tools, including this site' },
    ],
    workflow: 5,
  },
  {
    id: 'show',
    name: 'Show',
    line: 'Infographics, posters and slides, each starting from a content plan.',
    steps: [
      { tool: 'Canva', track: 'both', note: 'Familiar on both tracks; AI uses capped monthly' },
      { tool: 'Claude Design, export to PowerPoint', track: 'personal', note: 'Design first, then a PowerPoint file' },
      { tool: 'Codex or code, to Google Slides', track: 'personal', note: 'Codex’s Google Drive plugin works with Slides' },
      { tool: 'Copilot in PowerPoint', track: 'corporate', note: 'Needs the paid licence' },
    ],
    workflow: 2,
  },
  {
    id: 'move',
    name: 'Move',
    line: 'The agent prepares the storyboard and the prompts. The generators make the clips.',
    steps: [
      { tool: 'Google Slides, to Google Vids', track: 'personal', note: 'Your slides become a narrated video' },
      { tool: 'Gemini, Nano Banana and Flow', track: 'personal', note: 'Clips, images and assembly; daily and monthly credits' },
      { tool: 'OpenRouter API: Kling AI, Seedance, Veo', track: 'personal', note: 'One API key, several video generators' },
      { tool: 'Clipchamp, if enabled', track: 'corporate', note: 'Assemble your own footage; no generated clips found' },
    ],
    workflow: 1,
  },
]
