/*
  Routes. A route is a guided path through the playbook for one audience and
  one time budget. The talk on 7 October is the first route. Each step is a
  move, or a scene the route brings with it (cover, quiz, questions).
*/

export const routes = {
  'gai-gai': {
    id: 'gai-gai',
    title: 'GAi GAi with me',
    subtitle: 'A Casual Stroll into Generative AI for Educators.',
    voice: 'Ai MAi?',
    event: 'CGH Educator Lunch and Learn Series',
    when: ['7 October 2026', '1 to 2 pm', 'Zoom'],
    speaker: {
      name: 'Muhammad Alif',
      roles: ['Innovator in digital health and emerging technologies', 'A scientist and an artist'],
      summary:
        'Innovator in digital health and emerging technologies, a scientist and an artist. He builds tools with and for clinical educators and teaches others to build their own with the same care: a clear brief, a solid framework and an honest test of utility. Balancing is an act.',
    },
    // Time budget from brief.md. Moves carry their beats; the quiz is the hook.
    // Eras are short interludes between the budgeted steps, so the journey
    // from the 1960s to today runs underneath the talk's own order.
    steps: [
      { scene: 'cover' },
      { era: 'wonder' },
      { scene: 'quiz', minutes: 8, title: 'Scan and play' },
      { move: 'angle', minutes: 5 },
      { era: 'logic' },
      { move: 'test', minutes: 7 },
      { move: 'reality', minutes: 7 },
      { era: 'assistants' },
      { scene: 'examples', minutes: 15, title: 'Use cases' },
      { move: 'frameworks', minutes: 10 },
      { era: 'chat' },
      { move: 'safe', minutes: 8 },
      { era: 'agents' },
      { scene: 'questions' },
    ],
  },
}

export const defaultRoute = routes['gai-gai']
