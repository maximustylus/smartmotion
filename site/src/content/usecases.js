/*
  Use cases, by track. The personal track is one unified use case: the
  owner's own tools, built on his own devices and accounts. The corporate
  track is what SingHealth staff can use at work today, as named by the owner
  on 6 October 2026.

  The one-line descriptions of NEXUS, C.A.R.E. and ImmersiFit, and every
  utility score, are the owner's to write (content/use-cases.md). The
  SingHealth Office of Digital Empowerment posters the owner shared are not
  for circulation and are not used anywhere in this site.
*/
export const usecases = {
  personal: {
    title: 'Personal track: one maker, four tools',
    lead: 'Built on my own devices and accounts, with public material only.',
    items: [
      { name: 'Smart Motion', line: 'This playbook and talk. Built with Claude Code from a written brief, in {{active}} of active time.' },
      { name: 'NEXUS, with AURA', line: '[[TODO: one line on NEXUS and AURA, from the owner]]' },
      { name: 'C.A.R.E.', line: '[[TODO: one line on C.A.R.E., from the owner]]' },
      { name: 'ImmersiFit', line: '[[TODO: one line on ImmersiFit, from the owner]]' },
    ],
  },
  corporate: {
    title: 'Corporate track: already in your Teams',
    lead: 'Cleared for work information, as your institution allows.',
    items: [
      { name: 'Copilot agents in Teams', line: 'Prompt Coach, AI Learning Advisor and Idea Coach are ready to use. New agent lets you build your own.' },
      { name: 'Agentsea', line: 'Agents that answer from your documents, with Microsoft SharePoint as the document hub.' },
      { name: 'Pair', line: 'Pair Chat, with for.sg as the document hub.' },
    ],
  },
}

/*
  Build your first agent at work: Agent Builder (New agent) in Microsoft 365
  Copilot in Teams. Steps and limits from Microsoft Learn, read 6 October
  2026 (references.md). Kept to what a member of staff can do without IT.
*/
export const firstAgent = {
  heading: 'Your first agent, in Teams',
  lead: 'No code and nothing to install. Copilot in Microsoft Teams has a New agent button.',
  steps: [
    { title: 'Pick one real task', body: 'Something you answer or redo every week, such as where a form lives or what a new starter needs.' },
    { title: 'Open New agent', body: 'In Teams, open Copilot and choose New agent. Describe what it should do in plain words.' },
    { title: 'Give it your sources', body: 'Add the files or public pages it should answer from, then switch on Only use specified sources.' },
    { title: 'Try it before you share it', body: 'On the Try it tab, ask ten real questions and check each answer against its source.' },
    { title: 'Share small first', body: 'Share with a few colleagues. A wider release goes through your administrators.' },
  ],
  note: 'Never add patient or identifying data. SharePoint sources depend on your licence. Actions, flows and connections to other systems need Copilot Studio: ask your IT team first.',
  promptIntro: 'Paste this into the Describe tab, then fill the brackets.',
  prompt: `I want an agent that helps [who] with [one task].

Answer only from the files and pages I add. If the answer is not there, say so plainly and do not guess.

Never give medical advice, diagnose, or make a decision about a patient, and never ask for patient or identifying details.

Keep answers short, in UK English, and name the document each answer comes from.

Suggest three starter prompts my colleagues would actually type.

Before we finish, list ten test questions I should try, each with the answer I should expect from my sources.`,
}
