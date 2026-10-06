/*
  The playbook. Eight moves, each with the same anatomy:
    name, angle, principle   the move, its one-line picture and why it matters
    framework                the idea behind it, with its source ("See why")
    example                  a worked case, usually this app itself ("See how")
    promptHeading            the moment to use the prompt ("Try it")
    cheatsheet               the prompt file in ./cheatsheets, copied from the page

  Copy is plain text. [[TODO: ...]] marks something the owner still has to
  supply and shows as a TODO chip; {{active}}, {{elapsed}}, {{commits}},
  {{prompts}} and {{sittings}} are live figures kept by scripts/steward.mjs.
  See render.js. Content rules from BRIEF.md apply: nothing invented, and
  sources listed here must be verified against the originals in
  references.md before publishing.
*/

export const moves = [
  {
    id: 'end',
    phase: 'analyse',
    name: 'Begin with the end in mind',
    angle: 'Decide what done looks like while the page is still blank.',
    principle:
      'There is always one more thing to add. Unless you write down what done means, the work drifts. A few yes-or-no checks will do: the assistant works towards them, and you decide when they are met.',
    framework: {
      name: 'Covey’s second habit',
      source: 'Stephen R. Covey, The 7 Habits of Highly Effective People (1989), Habit 2; Bound and Chia, Six Principles of Learning Design',
      note: 'The habit: start with a clear picture of your destination. Learning design does the same, working back from the outcome to the activity. If you write learning outcomes before you plan a session, you already do this. With an assistant, that picture is a one-page brief.',
      verify: true,
    },
    example: {
      title: 'The brief behind this app',
      body: 'This app was built from a written brief, in phases, with a stop for approval after each. Done is one sentence with four checks: live on the web, rehearsed in full on Zoom, no placeholders marked TODO in view, every claim traceable to a reference. Everything else is negotiable.',
    },
    promptHeading: 'Turn your idea into a brief',
    cheatsheet: 'begin-with-the-end',
    form: 'brain',
  },
  {
    id: 'angle',
    phase: 'analyse',
    name: 'Have an angle',
    angle: 'An assistant multiplies what you bring. Vague brief, confident guess.',
    principle:
      'A draft can look polished and still have no point. Your angle is the point: the one thing you want people to take away. The assistant helps with the making, but the angle is the half you own.',
    framework: {
      name: 'Intent times execution',
      source: null,
      note: 'A rule of thumb: vibe times coding. Vibe is your intent: what you want to say and why. Coding is the execution: how well it gets made. Multiply them: if either is near zero, so is the result. A clear aim, poorly made, stalls. A vague aim, well made, is still the wrong thing. [[TODO: owner to confirm the framework and its source]]',
      verify: true,
    },
    example: {
      title: 'The stroll',
      body: 'The talk behind this playbook has a topic: generative AI for educators. Its angle is in the title: a casual stroll, or GAi GAi in Singlish. Minds wander on a stroll, and a wandering mind is less happy (Killingsworth & Gilbert, 2010). An angle tells you what to leave out.',
    },
    promptHeading: 'When the draft feels generic',
    cheatsheet: 'have-an-angle',
    form: 'angle',
  },
  {
    id: 'hook',
    phase: 'design',
    name: 'Find the hook, hold the room',
    angle: 'Open with something the room does, not something it watches.',
    principle:
      'Attention is lent, not owed. A hook earns it at the start, and seeing everyone’s answers add up holds it. An assistant can suggest both, but you know the room, so you choose.',
    framework: {
      name: 'Zone of Proximal Development',
      source: 'Vygotsky (1978)',
      note: 'Vygotsky’s zone is the gap between what a learner can do alone and what they can do with help. We borrow it for openings. Set a task everyone can start, pitched a little beyond easy, with help close by. The aim: nobody bored, nobody lost.',
      verify: true,
    },
    example: {
      title: 'The icebreaker quiz',
      body: 'The talk behind this playbook opens with an eight-minute quiz on your phone. Place yourself on four levels of AI readiness, pick the type most like you, then watch the room’s totals move. Taking part is the hook. The totals hold the room. One go per device, anonymous totals only.',
    },
    promptHeading: 'Plan your opening',
    cheatsheet: 'know-the-hook',
    form: 'target',
  },
  {
    id: 'architecture',
    phase: 'design',
    name: 'Know your way around the files',
    angle: 'Think of a resuscitation trolley: you did not build it, but you know which drawer holds what.',
    principle:
      'Building an app by describing it, without reading the code, is called vibe coding. The assistant does the filing. You still need to learn where things live, so you can ask for a change and check it was made.',
    framework: {
      name: 'Keep content, structure and behaviour apart',
      source: null,
      note: 'Content is what a page says. Structure is how it is laid out. Behaviour is what happens when you tap or type. Give each its own place, and give every file one job. Then you know where to look, and a change to the words leaves the rest alone. [[TODO: owner to confirm the framework and its source]]',
      verify: true,
    },
    example: {
      title: 'This app, in three folders',
      body: 'The eight moves and their order live in site/src/content. In site/src/story they become the scenes you scroll through. The app’s quiz talks to its database through site/src/quiz. Ask to reword a move and look in the content folder first. If another folder changes too, ask why.',
    },
    promptHeading: 'Before you ask for changes',
    cheatsheet: 'know-the-architecture',
    form: 'tree',
  },
  {
    id: 'frameworks',
    phase: 'develop',
    name: 'Build on solid frameworks',
    angle: 'The assistant is new. The questions about good teaching are not.',
    principle:
      'A solid framework is someone’s careful thinking, in words your colleagues already know. Set the teaching tool you build beside one: see what it covers and what it misses. The assistant suggests the fit. You decide whether it holds.',
    framework: {
      name: 'Four frameworks, one job each',
      source: 'Miller (1990); Sargeant et al. (2015); Bound and Chia; Vygotsky (1978)',
      note: 'For competence, Miller’s pyramid: knows, knows how, shows how, does. For feedback, R2C2: relationship, reaction, content, coaching. For design, the Six Principles of Learning Design (6PoLD). For support, the Zone of Proximal Development: what a learner can do with help, but not yet alone. Each gives you a question to ask.',
      verify: true,
    },
    example: {
      title: 'One tool on Miller’s pyramid',
      body: '[[TODO: worked example, owner to supply from the use cases]]',
    },
    promptHeading: 'Before your tool reaches learners',
    cheatsheet: 'build-on-frameworks',
    form: 'pyramid',
  },
  {
    id: 'safe',
    phase: 'implement',
    name: 'Use it safely',
    angle: 'An answer can sound sure. An image can look real. Either can be false.',
    principle:
      'Safe use is a habit, not a switch: know the source, keep patient data out of the chat, and treat a striking image as a claim to check. The assistant drafts. You countersign.',
    framework: {
      name: 'From made-up answers to “AI psychosis”',
      source: 'Østergaard (2023); Mata v. Avianca (2023)',
      note: 'In 2023 a chatbot invented six court cases and a lawyer filed them. Such answers are called hallucinations. That year a psychiatrist asked whether chatbots could feed delusions in people already prone to them. By 2025 the press called that worry “AI psychosis”. Not a diagnosis, and the research is thin. Check every answer anyway.',
      verify: true,
    },
    example: {
      title: 'Spaghetti, then a crocodile',
      body: '[The Will Smith spaghetti test](https://www.youtube.com/watch?v=xdZt4V50cic) shows it: an obvious fake in 2023, convincing in 2025. On 29 September 2026, [Mothership reported](https://mothership.sg/2026/09/fake-crocodile-photo/) that a person was charged over an image that allegedly showed a crocodile at Pandan Reservoir. The picture that makes a room gasp is the one to check first.',
    },
    promptHeading: 'Check before it goes out',
    cheatsheet: 'use-it-safely',
    form: 'check',
  },
  {
    id: 'test',
    phase: 'evaluate',
    name: 'Test for usefulness, not applause',
    angle: 'Score a tool on five questions, then multiply. One zero, and the rest counts for nothing.',
    principle:
      'A tool built with an assistant can look finished before it is useful, and applause cannot tell the difference. The assistant can sort your evidence and show the gaps, but check its work: the verdict is yours.',
    framework: {
      name: 'Utility of assessment',
      source: 'van der Vleuten (1996)',
      note: 'Adapted from van der Vleuten’s utility of assessment: five qualities multiplied, not added. Asked of a tool: does it do what it claims? Every time? Does it help anyone learn? Will people use it? Is it affordable to own, not only to buy? Utility = Validity × Reliability × Educational Impact × Acceptability × Cost.',
      verify: true,
    },
    example: {
      title: 'Two ways to count cost',
      body: 'Take one of the five questions, cost, and count it two ways. Per task: what each task costs, weighed against how capable the assistant is. To own: the whole cost, people’s time and checking included. [[TODO: cost examples, owner to supply: capability versus cost per task with a retrieval date, and total cost of ownership]]',
    },
    promptHeading: 'Score it before you say yes',
    cheatsheet: 'test-with-utility',
    form: 'columns',
  },
  {
    id: 'reality',
    phase: 'evaluate',
    name: 'Give it a reality check',
    angle: 'An idea in five minutes. A working demo in two hours. The final 10% takes six months.',
    principle:
      'A demo works once, for you, on a good day. A tool people rely on keeps working, for a stranger, on a bad day. The assistant makes the demo quick. How much more the idea deserves is your call.',
    framework: {
      name: 'The march of nines',
      source: 'Karpathy on the Dwarkesh Podcast (2025)',
      note: 'How often something works is its reliability, counted in nines: 90% is one nine, 99% is two, 99.9% is three. [Andrej Karpathy’s claim](https://www.dwarkesh.com/p/andrej-karpathy): each extra nine takes at least as much work as the one before. So treat a working demo as the first nine at best. Plan for the nines you still need. [[TODO: verify the wording against the interview]]',
      verify: true,
    },
    example: {
      title: 'This app’s own timeline',
      body: 'From new project to first working version: 1 h 29 min. Then came a redesign, a quiz, a companion robot and many refinements. So far: {{active}} of building, {{prompts}} prompts to the assistant, {{sittings}} sittings, and still not finished. The demo was the quick part. Leave time for the rest.',
    },
    promptHeading: 'When a demo looks finished',
    cheatsheet: 'reality-check',
    form: 'text:90%\n99%\n99.9%',
  },
]

export const moveById = Object.fromEntries(moves.map((m) => [m.id, m]))
