/*
  The journey. ADDIE is the spine: five phases, each with its own look,
  motion and field behaviour, each holding one or two moves. Between the
  phases sit five eras, from the robot heroes of the 1960s to the agents of
  2026, so the audience feels the technology change under their feet.

  Every date and quote here is listed in references.md. Items marked verify
  were found and dated by the build and still need the owner's check
  against the original.
*/

export const phases = [
  {
    id: 'analyse',
    letter: 'A',
    name: 'Analyse',
    line: 'Know what you want before you ask.',
    moves: ['end', 'angle'],
    quote: {
      text: 'We can only see a short distance ahead, but we can see plenty there that needs to be done.',
      who: 'Alan Turing',
      source: 'Computing Machinery and Intelligence, Mind, 1950',
      verify: true,
    },
  },
  {
    id: 'design',
    letter: 'D',
    name: 'Design',
    line: 'Sketch it before you build it.',
    moves: ['hook', 'architecture'],
  },
  {
    id: 'develop',
    letter: 'D',
    name: 'Develop',
    line: 'Borrow a framework before you invent one.',
    moves: ['frameworks'],
  },
  {
    id: 'implement',
    letter: 'I',
    name: 'Implement',
    line: 'Make it safe before you share it.',
    moves: ['safe'],
  },
  {
    id: 'evaluate',
    letter: 'E',
    name: 'Evaluate',
    line: 'Weigh it honestly before you call it done.',
    moves: ['test', 'reality'],
    quote: { text: 'Balancing is an act.', who: 'Muhammad Alif Bin Abu Bakar', source: 'Smart Motion, 2026' },
  },
]

export const eras = [
  {
    id: 'wonder',
    before: 'analyse',
    years: [1963, 1984],
    title: 'Wonder',
    line: 'Robots were friends, helpers and heroes. All we had to do was watch.',
    facts: [
      { year: 1963, text: 'Astro Boy first airs, 1 January' },
      { year: 1979, text: 'Doraemon first airs, 2 April' },
      { year: 1984, text: 'The Transformers first airs, 17 September' },
    ],
    quote: {
      text: 'Any sufficiently advanced technology is indistinguishable from magic.',
      who: 'Arthur C. Clarke',
      source: 'Profiles of the Future, revised edition, 1973',
      verify: true,
    },
    form: 'cloud',
  },
  {
    id: 'logic',
    before: 'design',
    years: [1997, 1997],
    title: 'Logic',
    line: 'A machine beat the world chess champion. It calculated. The understanding was still ours.',
    facts: [{ year: 1997, text: 'Deep Blue defeats Garry Kasparov, game six, 11 May' }],
    form: 'grid',
  },
  {
    id: 'assistants',
    before: 'develop',
    years: [2011, 2011],
    title: 'Assistants',
    line: 'It answered, if we asked the right way. We learnt to choose our words.',
    facts: [{ year: 2011, text: 'Siri introduced with the iPhone 4S, 4 October' }],
    form: 'pair',
  },
  {
    id: 'chat',
    before: 'implement',
    years: [2022, 2023],
    title: 'Chat',
    line: 'It wrote fluently. Sometimes it made things up, just as fluently. So we check.',
    facts: [
      { year: 2022, text: 'ChatGPT released, 30 November' },
      { year: 2023, text: 'Mata v. Avianca: six invented cases cited in a New York court, sanctions on 22 June' },
      { year: 2023, text: 'Østergaard asks whether chatbots could trigger delusions in people prone to psychosis' },
    ],
    form: 'timeline',
  },
  {
    id: 'agents',
    before: 'evaluate',
    years: [2025, 2026],
    title: 'Agents',
    line: 'Now it acts for us. The more it does, the more our judgement matters.',
    facts: [
      { year: 2025, text: 'Karpathy names vibe coding, 2 February' },
      { year: 2026, text: 'Meta Muse, a personal agent, 8 September' },
      { year: 2026, text: 'OpenAI Dots, always-on agents, 29 September' },
      { year: 2026, text: 'Claude Code mods, 2 October' },
    ],
    quote: {
      text: 'Fully give in to the vibes, embrace exponentials, and forget that the code even exists.',
      who: 'Andrej Karpathy',
      source: 'X, 2 February 2025',
      verify: true,
    },
    form: 'clusters',
  },
]

export const eraBefore = Object.fromEntries(eras.map((e) => [e.before, e]))
