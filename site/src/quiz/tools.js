/*
  Quiz content.

  Part 1: the grid of AI tool logos. The owner supplies the list. Each tool
  needs a real logo from the company's own brand or press kit, saved in
  site/assets/logos, with its source listed in site/assets/logos/CREDITS.md.
  Until then the grid shows numbered placeholder tiles so the mechanics can
  be rehearsed. Nothing here guesses the list.

  Part 2: one question that sorts people into four types. A fun sorter, not
  a validated instrument. Type names are the owner's to confirm.
*/

// TODO owner: supply the tool list.
// Shape: { id: 'example', name: 'Example', logo: 'example.svg' }
export const tools = []

// Number of placeholder tiles shown while the list above is empty.
export const PLACEHOLDER_COUNT = 12

// Part 1 result. Count of known tools maps to one of three levels by thirds.
// TODO owner: supply the three level labels.
export const levels = [
  { id: 1, label: null },
  { id: 2, label: null },
  { id: 3, label: null },
]

export function levelFor(count, total) {
  const share = total ? count / total : 0
  return share <= 1 / 3 ? 1 : share <= 2 / 3 ? 2 : 3
}

// Part 2. Descriptions are from the brief; names are TODO.
export const question = 'Which of these sounds most like you?'

export const types = [
  { id: 1, label: null, hint: 'R, Python, Stata, SPSS. You trust a clean dataset and a good test.' },
  { id: 2, label: null, hint: 'Canva, CMYK, RGB, aspect ratios. You notice when the margins are off.' },
  { id: 3, label: null, hint: 'Protocols and workflows. You want the steps written down and followed.' },
  { id: 4, label: null, hint: 'The storyteller. You remember the case, not the table.' },
]

// Where the QR code and the short link point.
export const PLAY_URL = 'https://smartmotion.web.app/play'
