// The talk's running order and time budget, from brief.md.
// Section 0 is the title, shown before the talk starts.
export const sections = [
  { n: 0, title: 'Welcome', minutes: 0 },
  { n: 1, title: 'Scan and play', summary: 'An icebreaker quiz on your phone', minutes: 8 },
  { n: 2, title: 'Vibe × coding', summary: 'Garbage in, garbage out. Both factors needed.', minutes: 5 },
  { n: 3, title: 'The test', summary: 'Utility = Validity × Reliability × Educational Impact × Acceptability × Cost', minutes: 7 },
  { n: 4, title: 'Reality check', summary: 'Idea, working demo, the final 10%, and the march of nines', minutes: 7 },
  { n: 5, title: 'Use cases', summary: 'NEXUS and AURA, C.A.R.E., ImmersiFit', minutes: 15 },
  { n: 6, title: 'Frameworks and take-home', summary: "6PoLD, Miller's pyramid, R2C2, Zone of Proximal Development", minutes: 10 },
  { n: 7, title: 'Safe use, then questions', summary: 'From spaghetti to crocodiles', minutes: 8 },
]

export const totalMinutes = sections.reduce((sum, s) => sum + s.minutes, 0)
