/*
  Use cases, by track. The personal track is one unified use case: the
  owner's own tools, built on his own devices and accounts. The corporate
  track is what SingHealth staff can use at work today, as named by the owner
  on 6 October 2026.

  Smart Queue Live replaced C.A.R.E. on 6 October 2026 at the owner's
  request; its line, and NEXUS's (7 October), are condensed from his own
  descriptions. ImmersiFit's line (7 October) joins the owner's own words
  (a feasibility study for adolescents exercising immersively in a headset)
  with its README; the study protocol stays out. Every
  utility score, are the owner's to write (content/use-cases.md). The
  SingHealth Office of Digital Empowerment posters the owner shared are not
  for circulation and are not used anywhere in this site.
*/
export const usecases = {
  personal: {
    title: 'Personal track: one maker, four tools',
    lead: 'Built on my own devices and accounts, with public material only.',
    items: [
      { name: 'Smart Motion', icon: '/usecases/smart-motion.png', line: 'This playbook and talk. Built with Claude Code from a written brief, in {{active}} of active time.' },
      // icon: the app's own icon, supplied by the owner on 6 October 2026.
      // video: the owner's own YouTube Short, opened in the lightbox.
      { name: 'NEXUS, with AURA', icon: '/usecases/nexus.png', line: 'A dashboard web app. Individuals: community screening and resources. Professionals: rostering, social battery and a dashboard. Demo mode to try.', url: 'https://smartdashboard.web.app', short: 'NEXUS', video: 'VEMsfBM_tdM', videoTitle: 'NEXUS, with AURA' },
      { name: 'Smart Queue Live', icon: '/usecases/smart-queue-live.png', line: 'Queue to try Apple Vision Pro health apps, with a headset guide, posters, feedback and photos. The team side runs the queue.', url: 'https://smartqueuelive.web.app', short: 'Smart Queue Live', video: 'hoDLo3XJBBw', videoTitle: 'Smart Queue Live' },
      { name: 'ImmersiFit', icon: '/usecases/immersifit.png', line: 'A feasibility study: adolescents exercise immersively in Apple Vision Pro with an AI coach. An iPad companion lets the exercise physiologist watch heart rate live.', video: '/usecases/immersifit-kkh.mp4', videoTitle: 'ImmersiFit at KKH', landscape: true },
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
