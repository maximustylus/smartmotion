/*
  The playbook. Eight moves, each with the same anatomy:
    principle   the move and its angle, in the owner's voice
    framework   the named framework behind it, with its source
    example     a worked case, from the use cases or from building this app
    cheatsheet  a workflow prompt in workflows/ that pastes into any assistant

  Content rules from brief.md apply: nothing invented, anything unsourced is
  marked TODO. Sources listed here must be verified against the originals in
  references.md before publishing.
*/

const todo = (text) => `<span class="todo">${text}</span>`

export const moves = [
  {
    id: 'end',
    phase: 'analyse',
    name: 'Begin with the end in mind',
    angle: 'Decide what done means before you open a single file.',
    principle:
      'A vibecoded tool drifts unless the finish line is written down first. For this app, done is one sentence in the brief: deployed, a full rehearsal on Zoom, no TODO in visible content, every claim traceable to a reference. Everything else is negotiable.',
    framework: {
      name: 'Begin with the end in mind',
      source: 'Stephen R. Covey, The 7 Habits of Highly Effective People (1989), Habit 2; Bound and Chia, Six Principles of Learning Design',
      note: 'Covey\u2019s second habit: start with a clear picture of the destination. Learning design does the same, starting from the outcome and working back to the activity.',
      verify: true,
    },
    example: {
      title: 'The brief that built this app',
      body: 'brief.md names the purpose, the audience, the stack, the running order, the data rules and the definition of done. The app was built in phases against it, stopping for approval after each.',
    },
    cheatsheet: 'begin-with-the-end',
    form: 'timeline',
  },
  {
    id: 'angle',
    phase: 'analyse',
    name: 'Have an angle',
    angle: 'Vibe times coding. Garbage in, garbage out. Both factors are needed.',
    principle:
      'An assistant multiplies what you bring. A sharp intent with weak execution stalls, and strong execution of a vague intent builds the wrong thing. The angle is the half you own.',
    framework: {
      name: 'Garbage in, garbage out',
      source: null,
      note: todo('Framework and source for this move, owner to confirm.'),
      verify: true,
    },
    example: {
      title: 'The stroll',
      body: `A light aside on strolling and wandering minds. ${todo('Killingsworth and Gilbert (2010): verify the finding and cite the original before publishing.')}`,
    },
    cheatsheet: 'have-an-angle',
    form: 'pair',
  },
  {
    id: 'hook',
    phase: 'design',
    name: 'Know the hook, keep the engagement',
    angle: 'Open with something people do, not something they watch.',
    principle:
      'The first eight minutes of the talk are a quiz on your own phone. The hook is participation, and the engagement is seeing the room’s totals move while you sit in it.',
    framework: {
      name: 'Zone of Proximal Development',
      source: 'Vygotsky (1978)',
      note: 'Engagement lives at the edge of what someone can do alone and what they can do with help.',
      verify: true,
    },
    example: {
      title: 'The icebreaker quiz',
      body: 'Tap the tools you know, answer one question, see where the room stands. Aggregate counters only, one play per device, and the personal result still shows if the room is unreachable.',
    },
    cheatsheet: 'know-the-hook',
    form: 'grid',
  },
  {
    id: 'architecture',
    phase: 'design',
    name: 'Understand the file system and architecture',
    angle: 'If you cannot draw the folders, you cannot steer the build.',
    principle:
      'Vibecoding does not excuse you from knowing where things live. A readable tree, one responsibility per file, and content kept apart from code are what let you ask for a change and recognise whether it landed.',
    framework: {
      name: 'Separation of content, structure and behaviour',
      source: null,
      note: todo('Framework and source for this move, owner to confirm.'),
      verify: true,
    },
    example: {
      title: 'This app’s own tree',
      body: 'site/src/content holds the moves and routes. site/src/story turns them into scenes. site/src/quiz talks to Firestore. workflows/ holds the cheatsheets. firestore.rules says what a client may write. Nothing else.',
    },
    cheatsheet: 'know-the-architecture',
    form: 'tree',
  },
  {
    id: 'frameworks',
    phase: 'develop',
    name: 'Build on solid frameworks',
    angle: 'Borrow structure from people who tested theirs.',
    principle:
      'Education already has frameworks for competence, feedback and design. A tool that maps onto one of them inherits its evidence and its vocabulary, and the people in the room already speak it.',
    framework: {
      name: 'Miller’s pyramid, R2C2, 6PoLD, Zone of Proximal Development',
      source: 'Miller (1990); Sargeant et al. (2015); Bound and Chia; Vygotsky (1978)',
      note: 'Knows, knows how, shows how, does. Relationship, reaction, content, coaching. Six principles. The zone.',
      verify: true,
    },
    example: {
      title: 'Mapping a tool to Miller',
      body: todo('Worked example, owner to supply from the use cases.'),
    },
    cheatsheet: 'build-on-frameworks',
    form: 'pyramid',
  },
  {
    id: 'safe',
    phase: 'implement',
    name: 'Use it safely',
    angle: 'The tools got good enough to fool a room. Plan for that.',
    principle:
      'What was an obvious fake in 2023 is convincing in 2025. Safe use is a habit, not a filter: know the source, keep patient data out, and treat a striking image as a claim to check.',
    framework: {
      name: 'From hallucination to AI psychosis',
      source: 'Østergaard (2023); Mata v. Avianca (2023)',
      note: 'In 2023 a chatbot invented six court cases and a lawyer filed them. The same year a psychiatrist asked whether chatbots could feed delusions in people already prone to them. By 2025 the press called it AI psychosis. It is not a diagnosis, and the research is thin, which is exactly why the habit matters.',
      verify: true,
    },
    example: {
      title: 'From spaghetti to crocodiles',
      body: `${todo('Will Smith eating spaghetti, 2023 versus 2025: links only, sources and dates owner to verify.')} Then the Pandan Reservoir image case, reported by Mothership on 29 September 2026, in which a person was charged over an image that allegedly showed a crocodile at the reservoir. ${todo('Link to the article.')}`,
    },
    cheatsheet: 'use-it-safely',
    form: 'rings',
  },

  {
    id: 'test',
    phase: 'evaluate',
    name: 'Test it with the utility formula',
    angle: 'Utility = Validity × Reliability × Educational Impact × Acceptability × Cost.',
    principle:
      'Adapted from assessment to vibecoded tools. It is a product, not a sum. Set any factor to zero and the whole thing collapses, however impressive the rest.',
    framework: {
      name: 'Utility of assessment',
      source: 'van der Vleuten (1996)',
      note: 'Cost is the whole cost of ownership, not the token bill.',
      verify: true,
    },
    example: {
      title: 'Capability versus cost',
      body: todo('Cost (a): capability versus cost per task from the live Artificial Analysis page, with retrieval date. Cost (b): total cost of ownership from content/cost-evidence.md. Owner to supply.'),
    },
    cheatsheet: 'test-with-utility',
    form: 'columns',
  },
  {
    id: 'reality',
    phase: 'evaluate',
    name: 'Reality check',
    angle: 'Idea in five minutes. Working demo in two hours. The final 10% takes six months.',
    principle:
      'The demo is not the product. Each extra nine of reliability costs as much as everything before it, and that is where most vibecoded tools stop.',
    framework: {
      name: 'The march of nines',
      source: 'Karpathy on the Dwarkesh Podcast (2025)',
      note: todo('Cite the interview itself, not summaries of it. Verify the wording.'),
      verify: true,
    },
    example: {
      title: 'This app’s own timeline',
      body: todo('Hours from brief to first deploy, and what the last stretch was spent on. Owner to supply from the commit history.'),
    },
    cheatsheet: 'reality-check',
    form: 'bar',
  },]

export const moveById = Object.fromEntries(moves.map((m) => [m.id, m]))
