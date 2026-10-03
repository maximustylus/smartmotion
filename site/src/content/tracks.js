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
