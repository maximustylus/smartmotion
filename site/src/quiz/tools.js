/*
  Quiz content.

  Part 1: the grid of AI tool logos. The owner supplies the list. Each tool
  needs a real logo from the company's own brand or press kit, saved in
  site/assets/logos, with its source listed in site/assets/logos/CREDITS.md.
  Until then the grid shows numbered placeholder tiles so the mechanics can
  be rehearsed. Nothing here guesses the list.

  Part 2: one question that sorts people into four types. A fun sorter, not
  a validated instrument. Type names confirmed by the owner on 5 October 2026.
*/

// TODO owner: supply the tool list.
// Shape: { id: 'example', name: 'Example', logo: 'example.svg' }
export const tools = []

// Number of placeholder tiles shown while the list above is empty.
export const PLACEHOLDER_COUNT = 12

// Part 1: self-placement on the four AI readiness levels of the AI Ready
// Quiz (AIRQ) by the Singapore Institute of Technology, with the Skills and
// Workforce Development Agency (checked 6 October 2026). Wording as shown on the quiz's
// opening page, read on 3 October 2026. Attendees take the full quiz in
// their own time at AIRQ_URL.
export const AIRQ_URL = 'https://sit.qualtrics.com/jfe/form/SV_9Ro76PBrKGPCpTM'

export const levels = [
  { id: 1, label: 'AI not-yet Aware', hint: 'I have little understanding of what AI is about.' },
  { id: 2, label: 'AI Aware', hint: 'I understand what AI is, where it appears in everyday life, and its general impact.' },
  { id: 3, label: 'AI Literate', hint: 'I can use AI tools effectively and responsibly, understand their functionality, and critically assess their outputs.' },
  { id: 4, label: 'AI Fluent', hint: 'I can apply AI to solve complex problems in my organisation, redesign and optimise existing workflows, and manage risk responsibly.' },
]

// Part 2. Descriptions are from the brief; names confirmed by the owner, 5 October 2026.
export const question = 'Which of these sounds most like you?'

export const types = [
  { id: 1, label: 'Analyst', hint: 'R, Python, Stata, SPSS. You ask for the sample size first.' },
  { id: 2, label: 'Designer', hint: 'Canva, CMYK, RGB, aspect ratios. You notice the font before you read the words.' },
  { id: 3, label: 'Organiser', hint: 'Protocols, workflows, checklists. You sleep better once the steps are written down.' },
  { id: 4, label: 'Storyteller', hint: 'Stories, cases, a good analogy. You remember the case, not the numbers.' },
]

// The logo grid is no longer part of the icebreaker. The list stays here in
// case it returns as a warm-up.
// Where the QR code and the short link point.
export const PLAY_URL = 'https://smartmotion.web.app/play'
