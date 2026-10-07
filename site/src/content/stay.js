/*
  Here to stay: the talk's closing, before Questions. Added at the owner's
  request on 7 October 2026, from his findings on the IMDA Singapore Digital
  Economy Report 2026. Every figure was checked against CNA's report that
  day (Yow, 2026, references.md); the IMDA report itself was not read.
*/
const CNA = 'https://www.channelnewsasia.com/singapore/digital-economy-ai-adoption-2025-singapore-imda-6432161'

export const stay = {
  label: 'Here to stay',
  now: {
    heading: 'AI is already at work in Singapore',
    stats: [
      { big: '23.5%', line: 'of enterprises used AI in 2025, up from 14.7% a year earlier' },
      { big: '86%', line: 'of workers use AI at work in 2026, up from 78% in 2025' },
      { big: '37%', line: 'took AI training in the past year, though 68% say they need it' },
    ],
  },
  gap: {
    heading: 'The gap is training',
    lead: 'AI and emerging tech are here to stay. Of the workers who did not train:',
    rows: [
      { why: 'About 35% were not nominated by their employer', act: 'Nominate them' },
      { why: 'A similar share lacked the time', act: 'Make the time' },
      { why: 'About one in four did not know which course to take', act: 'Point to the course' },
    ],
    close: 'Workers are already using AI. Training is what lags, and educators can close that gap.',
  },
  source: `IMDA Singapore Digital Economy Report 2026, as reported by [CNA, 5 October 2026](${CNA}).`,
}
