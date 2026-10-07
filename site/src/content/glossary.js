/*
  Glossary and site map. Each term links to where it lives in the app and,
  where there is one, to the original source. Links to originals are listed
  in references.md; anything not yet confirmed carries a TODO.
*/
export const glossary = [
  { term: '6PoLD, Six Principles of Learning Design', def: 'Six principles for designing learning that starts from the outcome. By Helen Bound and Arthur Chia (2020).', scene: 'frameworks', source: 'https://www.ial.edu.sg/getmedia/15f7ede5-0974-49ef-8d0a-b69613ca902b/The-Six-Principles-of-Learning-Design_21092020.pdf' },
  { term: 'AI Ready Quiz (AIRQ)', def: 'Up to twelve questions, four levels of AI readiness: AI not-yet Aware, AI Aware, AI Literate, AI Fluent. By the Singapore Institute of Technology, with the Skills and Workforce Development Agency. Take it in your own time.', scene: 'quiz', source: 'https://sit.qualtrics.com/jfe/form/SV_9Ro76PBrKGPCpTM' },
  { term: 'ADDIE', def: 'The five phases this playbook follows: Analyse, Design, Develop, Implement, Evaluate. Each phase holds one or two of the eight moves.', scene: 'phaseanalyse' },
  { term: 'AI psychosis', def: 'The press’s name, from 2025, for delusions reported around heavy chatbot use. Not a clinical diagnosis. Østergaard raised the hypothesis in 2023.', scene: 'safe', source: 'https://doi.org/10.1093/schbul/sbad128' },
  { term: 'Agents', def: 'Assistants that take several steps on their own, once you give them a goal, tools and permission. Meta’s Muse, OpenAI’s dots and Claude Code mods arrived in September and October 2026.', scene: 'agents' },
  { term: 'Agent Builder (New agent)', def: 'The New agent button in Copilot in Microsoft Teams. Build an agent from instructions and your own files or pages, with no code. It cannot take actions; that needs Copilot Studio.', scene: 'takehome' },
  { term: 'Begin with the end in mind', def: 'Picture the finished result before you start, then work towards it. Stephen R. Covey’s second habit, and the first move in this playbook.', scene: 'end', source: 'https://openlibrary.org/isbn/0671663984' },
  { term: 'Prompt', def: 'Your words to an assistant are a prompt. Each move ends with a short one, labelled Try it, to copy and paste.', scene: 'end-4' },
  { term: 'Corporate track', def: 'The take-home track for work: your hospital-issued device, with Microsoft 365 Copilot, Pair and Agentsea, as policy allows.', path: '/glossary#tracks', file: 'workflows/TRACK-CORPORATE.md' },
  { term: 'Deep Blue', def: 'IBM’s chess machine. On 11 May 1997 it beat Garry Kasparov, then the world chess champion.', scene: 'logic', source: 'https://www.history.com/this-day-in-history/may-11/deep-blue-defeats-garry-kasparov-in-chess-match' },
  { term: 'Gates', def: 'The points where a tool makes you wait, pay or accept less: limits that reset over time (rolling windows), daily caps, slowed replies (throttling) and drops to a weaker version (downgrades).', scene: 'test', file: 'workflows/COMPARE.md' },
  { term: 'Guardrails', def: 'The habits and limits that keep AI use safe: a real source over an invented answer, no patient data, a label on AI-made media, and a step where a person approves.', scene: 'safe', file: 'workflows/cheatsheets/connectors-mcp-plugins.md' },
  { term: 'Hallucination', def: 'A made-up answer, delivered as smoothly as a true one. The textbook case is Mata v. Avianca, 2023: six court cases, all invented.', scene: 'chat', source: 'https://storage.courtlistener.com/recap/gov.uscourts.nysd.575368/gov.uscourts.nysd.575368.54.0_3.pdf' },
  { term: 'March of nines', def: 'The climb from working 90% of the time to 99%, then 99.9%. Every nine is the same amount of work. Andrej Karpathy on the Dwarkesh Podcast, 17 October 2025.', scene: 'reality', source: 'https://www.dwarkesh.com/p/andrej-karpathy' },
  { term: 'Miller’s pyramid', def: 'Four levels of competence, from knowing to doing: knows, knows how, shows how, does. Miller (1990).', scene: 'frameworks', source: 'https://doi.org/10.1097/00001888-199009000-00045' },
  { term: 'Model Context Protocol (MCP)', def: 'A common way to connect an assistant to other services, like an agreed plug and socket. It is an open standard, so one connection works with many assistants.', file: 'workflows/cheatsheets/connectors-mcp-plugins.md' },
  { term: 'Motus', def: 'Your companion: the small pixel robot at the bottom right. It travels with you and answers questions from what is written in this playbook.', scene: 'cover' },
  { term: 'Personal track', def: 'The take-home track for your own device and accounts. Public and non-sensitive content only.', file: 'workflows/TRACK-PERSONAL.md' },
  { term: 'R2C2', def: 'A model for feedback conversations, named for its four parts: relationship, reactions, content, coaching. Sargeant et al. (2015).', scene: 'frameworks', source: 'https://doi.org/10.1097/ACM.0000000000000809' },
  { term: 'Utility formula', def: 'How useful a tool is: five scores multiplied. Utility = Validity × Reliability × Educational Impact × Acceptability × Cost. Any zero makes it zero. Adapted from assessment: van der Vleuten (1996).', scene: 'test', source: 'https://doi.org/10.1007/BF00596229' },
  { term: 'Vibe coding', def: 'Building software by describing what you want, without reading the code. Andrej Karpathy’s name for it, 2 February 2025: fully giving in to the vibes and forgetting the code exists.', scene: 'agents', source: 'https://x.com/karpathy/status/1886192184808149383' },
  { term: 'Zone of Proximal Development', def: 'What a learner can do with help, but not yet alone. Not too easy, not out of reach. Vygotsky (1978). In this playbook, it is where engagement lives.', scene: 'hook', source: 'https://doi.org/10.2307/j.ctvjf9vz4' },
]

export const sitemap = [
  { path: '/', label: 'Playbook', note: 'Eight moves under ADDIE, with five eras between' },
  { path: '/talk', label: 'GAi GAi with me', note: 'The talk route, 7 October 2026' },
  { path: '/play', label: 'Play the quiz', note: 'The icebreaker, on your phone' },
  { path: '/glossary', label: 'Glossary', note: 'This page' },
  { path: '/contact', label: 'Contact', note: 'Muhammad Alif' },
  { path: '/motus-info', label: 'Motus info card', note: 'How the AI companion works, its limits and your data' },
  { path: '/styleguide', label: 'Design system', note: 'Colour, type and components' },
]
