/*
  The words that are not a move, an era or a phase: the cover, the labels
  on every move's beats, the quiz, the take-home headings, the two closing
  pages and the About section. Kept here, apart from the code that lays
  them out, so the copy can be read and edited in one place.
*/
export const copy = {
  tagline: 'Smart moves, with you in charge',
  coverLead: 'A playbook of eight moves for building, teaching and presenting with AI assistants. Each tells you why, shows you how and hands you a prompt. Walk with me.',
  beatLabels: {
    framework: 'See why',
    example: 'See how',
    cheatsheet: 'Try it',
    sheetBar: 'Prompt · paste into your assistant',
  },
  closing: {
    eyebrow: 'Before you go',
    heading: 'The next move is yours',
    lead: 'Pick one move. Try its prompt on something small this week. Check what comes back. The assistant brings speed. You bring judgement.',
  },
  questions: {
    eyebrow: 'Thank you',
    heading: 'Questions, Ai MAi?',
    lead: 'Ask the room, or ask Motus, the robot in the corner. All eight moves and every prompt stay at smartmotion.web.app. Stroll back at your own pace.',
    note: 'To keep the playbook, add it to your home screen from your browser menu.',
  },
  quiz: {
    scanHeading: 'Scan and play',
    scanLead: 'Two questions on your phone. No names.',
    part1Heading: 'Where are you with AI today?',
    part1Note: 'The four levels come from the AI Ready Quiz by the Singapore Institute of Technology, with the Skills and Workforce Development Agency.',
    part2Heading: 'Which one sounds most like you?',
    part2Note: 'A fun sorter, not a validated instrument.',
    playedLine: 'You have already played. One go per device.',
    resultNote: 'The full AI Ready Quiz takes fifteen to twenty minutes and emails you a profile. Do it in your own time.',
    roomHeading: 'The room, live',
    examplesHeading: 'Use cases',
    examplesLead: 'What one maker built at home, and what work already offers.',
  },
  takehome: {
    tracksHeading: 'Two tracks, same prompts',
    tracksLead: 'Every workflow runs on both. Your track decides which tool you paste into, what it costs you and where it stops.',
    workflowsHeading: 'Copy, paste, check',
    workflowsLead: 'Five workflows, one pattern. Say what done looks like. Give the assistant your source. Plan first. Make it. Then check.',
    mapHeading: 'Build. Show. Move.',
    mapLead: 'Three lanes, three results: an assistant that answers, a page that shows, a video that plays. Each badge names the track.',
  },
  about: {
    aboutPara: 'Smart Motion is a digital playbook of smart moves for anyone who builds, teaches or presents with AI assistants. I built it with an AI assistant, so the site is its own worked example. The code behind it is public on GitHub, where anyone can read it.',
    steps: [
      {
        title: 'Write the brief',
        body: 'One page, before any code: purpose, audience, the tools to build with (the stack), running order, rules for data and content, and what done means. The assistant reads it first, every time.',
      },
      {
        title: 'Let the assistant ask first',
        body: 'Before the redesign, the assistant asked me about layout, motion, theme and devices. It showed options. I chose. The decisions went back into the brief and a design file.',
      },
      {
        title: 'Build in phases',
        body: 'First the look and the frame (the design system and shell), then the quiz and live totals, then the content. Each phase stops for my approval, with a list of what is built, checked and still to do.',
      },
      {
        title: 'Direct in plain words',
        body: 'I work in a tool called Claude Code. I describe what I want, or what looks wrong. The assistant proposes, builds and explains what it did.',
      },
      {
        title: 'Keep it moving from the phone',
        body: 'I left the build running in Claude Code on my Mac and headed out. From my phone, I carried on in the Claude app, through Dispatch. The assistant kept working, notifying me at each milestone. I sent the next instruction.',
      },
      {
        title: 'Check in a real browser',
        body: 'Each change is opened in a browser, at phone size and wider, and looked at before it is saved. Errors in the browser’s log, called the console, count as failures.',
      },
      {
        title: 'Save each checked change',
        body: 'Each checked change becomes a small save point, called a commit, with a plain message. Commits are sent to GitHub, so any step can be read or undone.',
      },
      {
        title: 'Keep the keys',
        body: 'I publish the site myself, using Firebase Hosting, the service that puts it online. Passwords and access keys, called secrets, never pass through the assistant. The database, Firestore, stores anonymous counters only.',
      },
      {
        title: 'Source every claim',
        body: 'Facts, dates and quotes are listed in a file, references.md. Anything not yet checked against the original is marked TODO on the page until it is.',
      },
    ],
  },
}
