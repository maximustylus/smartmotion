/*
  Glossary and site map. Each term links to where it lives in the app and,
  where there is one, to the original source. Links to originals are listed
  in references.md; anything not yet confirmed carries a TODO.
*/
export const glossary = [
  { term: '6PoLD, Six Principles of Learning Design', def: 'Helen Bound and Arthur Chia’s six principles for designing learning that starts from the outcome.', scene: 'frameworks', source: null, sourceTodo: 'URL to Bound and Chia’s original publication' },
  { term: 'AI Ready Quiz (AIRQ)', def: 'A twelve-question assessment of AI readiness by SkillsFuture Singapore and the Singapore Institute of Technology, with four levels: AI not-yet Aware, AI Aware, AI Literate, AI Fluent. Attendees take it in their own time.', scene: 'quiz', source: 'https://sit.qualtrics.com/jfe/form/SV_9Ro76PBrKGPCpTM' },
  { term: 'ADDIE', def: 'Analyse, Design, Develop, Implement, Evaluate. The spine of this playbook.', scene: 'phaseanalyse' },
  { term: 'AI psychosis', def: 'A press term from 2025 for delusions reported around heavy chatbot use. Not a clinical diagnosis. The hypothesis was raised by Østergaard in 2023.', scene: 'safe', source: 'https://doi.org/10.1093/schbul/sbad128', verify: true },
  { term: 'Agents', def: 'Assistants given a goal, tools and permission to take several steps on their own. Meta Muse, OpenAI Dots and Claude Code mods arrived in September and October 2026.', scene: 'agents' },
  { term: 'Begin with the end in mind', def: 'Stephen R. Covey’s second habit, and this playbook’s first move.', scene: 'end', source: null, sourceTodo: 'The 7 Habits of Highly Effective People (1989)' },
  { term: 'Cheatsheet', def: 'A short prompt under each move that pastes into any assistant.', scene: 'end-4' },
  { term: 'Corporate track', def: 'Hospital-issued device with Microsoft 365 Copilot, Pair and Agentsea, as policy allows.', path: '/glossary#tracks', file: 'workflows/TRACK-CORPORATE.md' },
  { term: 'Deep Blue', def: 'IBM’s chess machine that beat Garry Kasparov on 11 May 1997.', scene: 'logic', source: 'https://www.ibm.com/history/deep-blue' },
  { term: 'Gates', def: 'The points where a tool makes you wait, pay or accept less: rolling windows, daily caps, throttling, downgrades.', scene: 'test', file: 'workflows/COMPARE.md' },
  { term: 'Guardrails', def: 'The habits and limits that keep AI use safe: source over invention, no patient data, label generated media, keep a human approval step.', scene: 'safe', file: 'workflows/cheatsheets/connectors-mcp-plugins.md' },
  { term: 'Hallucination', def: 'A fluent answer that is made up. The canonical case is Mata v. Avianca, 2023, six invented court cases.', scene: 'chat', source: 'https://en.wikipedia.org/wiki/Mata_v._Avianca,_Inc.', verify: true },
  { term: 'March of nines', def: 'Each extra nine of reliability costs as much as everything before it. Andrej Karpathy on the Dwarkesh Podcast, 2025.', scene: 'reality', source: null, sourceTodo: 'Episode, date and timestamp of the interview' },
  { term: 'Miller’s pyramid', def: 'Knows, knows how, shows how, does. Miller (1990).', scene: 'frameworks', source: null, sourceTodo: 'DOI for Miller (1990), Academic Medicine' },
  { term: 'Model Context Protocol (MCP)', def: 'An open standard for links between assistants and services, so one link works with many assistants.', file: 'workflows/cheatsheets/connectors-mcp-plugins.md' },
  { term: 'Motus', def: 'The companion at the bottom right. A pixel robot that travels with you and answers from this playbook.', scene: 'cover' },
  { term: 'Personal track', def: 'Your own device and accounts, public and non-sensitive content only.', file: 'workflows/TRACK-PERSONAL.md' },
  { term: 'R2C2', def: 'Relationship, reaction, content, coaching: a model for feedback conversations. Sargeant et al. (2015).', scene: 'frameworks', source: null, sourceTodo: 'DOI for Sargeant et al. (2015), Academic Medicine' },
  { term: 'Utility formula', def: 'Utility = Validity × Reliability × Educational Impact × Acceptability × Cost, adapted from van der Vleuten (1996). A product: any zero collapses it.', scene: 'test', source: null, sourceTodo: 'DOI for van der Vleuten (1996)' },
  { term: 'Vibe coding', def: 'Andrej Karpathy’s name, 2 February 2025, for fully giving in to the assistant and forgetting the code exists.', scene: 'agents', source: 'https://en.wikipedia.org/wiki/Vibe_coding', verify: true },
  { term: 'Zone of Proximal Development', def: 'Vygotsky (1978): what a learner can do with help but not yet alone. Where engagement lives.', scene: 'hook', source: null, sourceTodo: 'Vygotsky (1978), Mind in Society' },
]

export const sitemap = [
  { path: '/', label: 'Playbook', note: 'Eight moves under ADDIE, with five eras between' },
  { path: '/talk', label: 'GAi GAi with me', note: 'The talk route, 7 October 2026' },
  { path: '/play', label: 'Play the quiz', note: 'The icebreaker, on your phone' },
  { path: '/glossary', label: 'Glossary', note: 'This page' },
  { path: '/contact', label: 'Contact', note: 'Muhammad Alif' },
  { path: '/styleguide', label: 'Design system', note: 'Colour, type and components' },
]
