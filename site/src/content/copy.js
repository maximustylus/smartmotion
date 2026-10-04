/*
  The words that are not a move, an era or a phase: the cover, the labels
  on every move's beats, the quiz, the take-home headings, the two closing
  pages and the About section. Kept here, apart from the code that lays
  them out, so the copy can be read and edited in one place.
*/
export const copy = {
  tagline: 'A playbook of smart moves',
  coverLead: 'Build, teach and present with AI assistants. Eight moves, each with a framework, a worked example and a cheatsheet you can paste anywhere.',
  beatLabels: { framework: 'Framework', example: 'Worked example', cheatsheet: 'Cheatsheet', sheetBar: 'Prompt · paste into any assistant' },
  closing: {
    eyebrow: 'Routes',
    heading: 'One playbook, many routes',
    lead: 'A route strings moves into a session for one audience and one time budget.',
  },
  questions: {
    eyebrow: 'Thank you',
    heading: 'Questions',
    lead: 'Ask the room, or ask Motus. The moves, the frameworks and the cheatsheets stay at smartmotion.web.app.',
    note: 'Install it from your browser menu to keep the playbook on your home screen.',
  },
  quiz: {
    scanHeading: 'Scan and play',
    scanLead: 'Open this on your phone.',
    part1Heading: 'Where would you place yourself today?',
    part1Note: 'The four levels of the AI Ready Quiz by SkillsFuture Singapore and the Singapore Institute of Technology.',
    part2Heading: 'Which of these sounds most like you?',
    part2Note: 'A fun sorter, not a validated instrument.',
    playedLine: 'You have already played on this device.',
    resultNote: 'The full quiz takes about fifteen minutes and emails you a profile. Do it in your own time.',
    roomHeading: 'Live totals',
    examplesHeading: 'Use cases',
    examplesLead: 'Three tools, each scored against the utility formula.',
  },
  takehome: {
    tracksHeading: 'Two tracks, same prompts',
    tracksLead: 'Every workflow runs on both. The track decides which tool you paste into, what it costs you and where it stops.',
    workflowsHeading: 'Copy, paste, check',
    workflowsLead: 'Define done first, supply the source, plan before producing, produce, then check. Five recipes that follow the pattern.',
    mapHeading: 'Build. Show. Move.',
    mapLead: 'Three lanes, from an agent that curates to a video that plays. Badges say which track.',
  },
  about: {
    aboutPara: 'Smart Motion is a digital playbook of smart moves for building, teaching and presenting with AI assistants. It was itself built with an AI assistant, so the site is its own worked example.',
    steps: [
      { title: "Write the brief", body: "One page before any code: purpose, audience, stack, running order, data rules, content rules and what done means. The assistant reads it first, every time." },
      { title: "Be interviewed", body: "Before redesigning, the assistant asked me about layout, motion, theme and devices, showed options, and I chose. Decisions went back into the brief and a design file." },
      { title: "Build in phases", body: "Design system and shell, then the quiz and live totals, then content. Each phase stops for my approval, with a list of what is built, what is verified and what is still to do." },
      { title: "Direct in plain language", body: "In Claude Code, I describe what I want or what looks wrong. The assistant proposes, builds and explains what it did." },
      { title: "Keep it moving from my phone", body: "The build ran in Claude Code on my Mac. When I headed out I left the session running and picked it up in the Claude app on my phone, through Dispatch: the assistant kept iterating, sent a notification at each milestone, and I replied with the next instruction from wherever I was." },
      { title: "Check in a real browser", body: "Changes are opened in a browser, at phone size and wider, and looked at before they are saved. Errors in the console count as failures." },
      { title: "Commit each verified change", body: "Small commits with plain messages, pushed to GitHub, so any step can be read or undone." },
      { title: "Keep the keys", body: "I deploy to Firebase Hosting myself, and secrets never pass through the assistant. Firestore stores anonymous counters only." },
      { title: "Source every claim", body: "Facts, dates and quotes are listed in references.md. Anything not yet checked against the original is marked TODO on the page until it is." },
    ],
  },
}
