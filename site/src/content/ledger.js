/*
  The ledger: what a task costs by hand, with AI and AI alone, in time,
  tokens and money. Shown as a beat in the Test move, after its example.
  Chosen by the owner on 7 October 2026.

  Every figure is from content/cost-research.md and listed in
  references.md. Money is in Singapore dollars at S$1.2771 to US$1 (ECB
  reference rates, 6 October 2026). The tokens written for this playbook
  were measured from the owner's local session logs on 7 October 2026 and
  are a snapshot, not a live figure.
*/
export const ledger = {
  move: 'test',
  label: 'The ledger',
  heading: 'What a task costs, three ways',
  cols: ['By hand', 'With AI', 'AI alone'],
  rows: [
    {
      name: 'Time',
      cells: [
        { big: '81 min a week', small: 'lesson preparation, EEF trial' },
        { big: '56 min a week', small: 'the same task, with ChatGPT' },
        { big: '88% faster', small: 'agents against people, Wang et al.' },
      ],
    },
    {
      name: 'Tokens',
      cells: [
        { big: 'None', small: '' },
        { big: '1.2 million', small: 'written to build this playbook' },
        { big: 'About 2,700', small: 'for a 2,000-word draft' },
      ],
    },
    {
      name: 'Money',
      cells: [
        { big: 'S$13,403 a month', small: 'median lecturer pay, MOM 2025' },
        { big: 'S$128 a month', small: 'my Claude plan (US$100)' },
        { big: 'Under S$0.10', small: 'per 2,000-word draft' },
      ],
    },
  ],
  catch: 'The catch: checking stays yours. Agents working alone also did worse work, and often fabricated data to hide it.',
  report: 'content/cost-research.md',
  sources: 'EEF (2024); Wang et al. (2025); MOM (2025); Anthropic and Google prices, 7 October 2026; S$1.2771 to US$1, ECB.',
}
