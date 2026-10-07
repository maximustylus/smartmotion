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
  // The owner's choice, 7 October 2026: speed is not learning. Huang's own
  // words (content/huang-maths.md); the study is unverified, so it is only
  // "a study his interviewer cited".
  learn: 'Faster is not the same as learnt. Asked whether forgetting basic maths matters, Nvidia’s [Jensen Huang said](https://www.businesstoday.in/technology/news/story/nvidia-ceo-jensen-huang-says-children-may-not-need-to-learn-basic-math-in-this-ai-era-558541-2026-09-30) “I don’t think it does”; a study his interviewer cited found faster homework, then lower exam scores. Check what learners can do without AI.',
  report: 'content/cost-research.md',
  sources: 'EEF (2024); Wang et al. (2025); MOM (2025); Business Today (2026); Anthropic and Google prices, 7 October 2026; S$1.2771 to US$1, ECB.',
}
