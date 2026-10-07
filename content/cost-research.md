# What a task costs: by hand, with AI, and AI alone

Research for the Test move ("Two ways to count cost"), done on 7 October
2026 at the owner's request. Three ways of working, three currencies: time,
tokens and money. Every figure below was read from the source named beside
it; nothing is estimated. This file is separate from content/cost-evidence.md,
whose items are unverified and must not appear.

**Currency.** All money is in Singapore dollars (S$), converted from the
US dollar prices at S$1.2771 to US$1: the cross rate from the European
Central Bank's euro reference rates of 6 October 2026 (S$1.4392 and
US$1.1269 to €1). The MAS rates page refused automated reading. Prices are
before GST and card charges. The per-million-token price lists stay in
US$, as the providers publish them.

Read the caveats. Most time savings are measured on drafting tasks; checking
time is often left out; self-reported savings run higher than timed ones.

## 1. The owner's own builds (human with AI), measured

From the Claude Code session logs on the owner's Mac, read on 7 October 2026
by a script that reads only counts, model names and timestamps, never message
text. Active time counts the gaps between logged events of 10 minutes or
less (the same rule as scripts/steward.mjs). These are lower bounds: work in
cloud sessions or on other machines is not in these logs, and NEXUS and Smart
Queue Live were built elsewhere, so they are not measured here.

| | Smart Motion | ImmersiFit |
|---|---|---|
| Dates in the logs | 2 to 7 October 2026 | 18 July to 6 September 2026 |
| Active time, human and AI together | 11.1 hours | 49.3 hours |
| Owner's prompts | about 108 | about 243 |
| Tokens written by the AI (output) | 1.2 million | 4.4 million |
| Tokens read by the AI, mostly from cache (cache reads, priced far lower) | 543 million, mostly cache reads | 2.08 billion, mostly cache reads |
| API-equivalent cost at list prices (not what was paid; a lower bound, from local logs only) | about S$562 (US$440), not paid | about S$2,755 (US$2,158), not paid |

**Money, actually paid:** the owner is on Claude Max 5x since July 2026.
Anthropic's pricing page (read 7 October 2026) shows Max "From $100 Per
month", with a choice of 5x or 20x more usage than Pro; 5x is the lower
option, so about S$128 (US$100) a month, about S$511 (US$400) from July to
October. The
API-equivalent figure is what the same tokens would cost if bought one by
one at Anthropic's list prices; it is not what was paid.

**Prices used** (Anthropic, Pricing, platform.claude.com/docs/en/about-claude/pricing,
read 7 October 2026; US$ per million tokens: input / 5-minute cache write /
1-hour cache write / cache read / output): Opus 5.5 4 / 5 / 8 / 0.20 / 20;
Fable 5.1 10 / 12.50 / 20 / 0.25 / 50; Sonnet 5.5 2 / 2.50 / 4 / 0.20 / 10;
Opus 5 5 / 6.25 / 10 / 0.50 / 25; Fable 5 10 / 12.50 / 20 / 1 / 50;
Opus 4.8 5 / 6.25 / 10 / 0.50 / 25. Each logged call was priced at its own
model's rates, with its cache writes split as the logs record them.

**Scale:** Anthropic gives "1 token is approximately 4 characters or 0.75
words in English", and notes Claude 4.7 and later produce about 30% more
tokens for the same text. Output tokens here are mostly code and tool calls,
so they do not convert to pages of prose.

There is no measured "by hand" time for either build, so no human-only
comparison is claimed for them.

## 2. Human without AI against human with AI (time)

Strongest evidence first. Randomised trials are marked RCT.

| Task | Without AI | With AI | Source |
|---|---|---|---|
| Science lesson preparation, 259 teachers, 68 schools (RCT) | 81.5 min a week | 56.2 min a week, 31% less; no difference in quality found by an expert panel | Roy et al. (2024), EEF and NFER |
| Medical MCQ drafting, 258 students (RCT) | 19.6 min per item | 4.2 min per item; student items slightly better at discriminating | Al-Najafi et al. (2026), BMC Medical Education |
| 50 medical graduate exam MCQs | 211 min 33 s for two examiners | 20 min 25 s for ChatGPT, checking not included; quality similar, relevance slightly lower | Cheung et al. (2023), PLOS ONE (with a Singapore assessor) |
| Professional writing, 453 people (RCT) | baseline | 40% less time, quality up 18% | Noy & Zhang (2023), Science |
| Consulting tasks inside AI's reach, 758 consultants | baseline | 25.1% faster, 12.2% more tasks | Dell'Acqua et al. (2026), Organization Science |
| A consulting task outside AI's reach | baseline | 19% less likely to be correct | same |
| Clinical notes, 66 practitioners, 71,487 notes (RCT) | baseline | 0.36 hours a day less on notes; quality held | Afshar et al. (2025), NEJM AI |
| Clinical notes, 238 physicians (RCT) | 4 min 47 s a note | one scribe 9.5% less; the other no significant change | Lukac et al. (2025), NEJM AI |
| Diagnostic reasoning, 50 physicians (RCT) | 565 s, score 74% | 519 s, score 76%; neither difference significant | Goh et al. (2024), JAMA Network Open |
| Programming one web server, 95 developers (RCT) | 160.9 min | 71.2 min, 55.8% faster | Peng et al. (2023) |
| Experienced developers on their own code, 246 real tasks (RCT) | baseline | 19% slower; they believed they were 20% faster | Becker et al. (2025), METR |
| UK civil servants, timed tasks | summarising 41:34; Excel 20:33 | summarising 12:37 and more accurate; Excel 25:01 and less accurate | Department for Business and Trade (2025) |

Self-reported, no control group, so read as upper bounds: Gallup and Walton
Family Foundation (2025), teachers using AI weekly estimate 5.9 hours a week
saved; UK Government Digital Service (2025), 26 minutes a day.

## 3. Money for the human side

No trial found measured the money cost of an educator's task directly. Two
ways to talk about money honestly:

- **At scale, so far, no change in pay or hours.** Danish payroll records for
  25,000 workers in 11 occupations, teachers included: users report saving
  2.8% of work hours, with "no significant impact on earnings or recorded
  hours in any occupation". Humlum & Vestergaard (2025).
- **Time times wage.** Singapore median gross monthly wages, June 2025
  (Ministry of Manpower, Occupational Wages 2025, Table 1): university
  lecturer SGD 13,403; registered nurse SGD 5,210; training or staff
  development professional SGD 5,955; general practitioner or physician
  SGD 7,165. Converting to an hourly rate needs a paid-hours figure that has
  not been sourced: [[TODO: paid hours a month, sourced]].

## 4. AI alone (time, tokens, money)

- **How long a task AI can finish alone.** METR measures the human-expert
  length of task an AI agent finishes half the time. In METR's data (read
  7 October 2026): Claude Mythos Preview about 17.4 hours at 50% success, but
  about 3.1 hours at 80%; Claude Opus 4.6 about 12 hours at 50%, about 1.2
  hours at 80%. This length has doubled about every 129 days since 2023. The
  tasks are software, machine learning and security tasks, well specified
  and machine scored; METR calls ability "jagged".
- **What it costs per task.** SWE-bench Verified (February 2026), 500 coding
  tasks: Claude 4.5 Opus resolved 76.8% at about S$0.96 (US$0.75) per task
  attempted; Gemini 3 Flash 75.8% at about S$0.45 (US$0.36).
- **Against people doing the same work.** Wang et al. (2025): agents were
  "88.3% faster" and cost "90.4-96.2% less", but "produce work of inferior
  quality, yet often mask their deficiencies via data fabrication."
- **Errors.** Clinical note summaries by GPT-4: 1.47% of sentences
  hallucinated, 44% of those major (Asgari et al., 2025). Document
  summarisation leaderboard (Vectara, September 2026): best model 1.8%,
  Claude Opus 4.6 12.2%, Gemini 3.1 Pro Preview 10.4%.
- **A 2,000-word draft, AI alone.** About 2,667 output tokens (at 0.75 words
  a token): about S$0.07 (US$0.05) on Opus 5.5 (US$20 per million output),
  about S$0.03 (US$0.02) on Gemini 3.5 Flash (US$9), plus the prompt. That buys a draft, not
  a checked draft: add the person's checking time.

Current list prices (US$ per million tokens, input / output, read 7 October
2026): Gemini 3.5 Flash 1.50 / 9 (Google, updated 6 October 2026); Gemini 3.1
Pro Preview 2 / 12 up to 200k tokens; Claude Opus 5.5 4 / 20; Sonnet 5.5
2 / 10; Haiku 4.5 1 / 5; OpenAI gpt-6.1-sol 2 / 10, gpt-5.4-mini 0.75 / 4.50.
Batch processing halves these at all three.

## 4b. The organisation's view: does AI cost more than people?

From the owner's own check, "AI Costs More Than People: Key Findings"
(Muhammad Alif Bin Abu Bakar, 7 October 2026), of an opinion piece by a
Forbes contributor (Green, 2026) who also chairs a blockchain energy firm.
Only the checked claims may be used:

| Claim in Forbes | What the source shows | Safe wording |
|---|---|---|
| MIT: AI is worth using instead of people in only 23% of roles | Overstated. Computer vision tasks only: "only 23% of worker wages being paid for vision tasks would be attractive to automate" at 2024 costs (Svanberg et al., 2024; author order and date confirmed on MIT FutureTech's page, 7 October 2026) | "For image-analysis tasks, only about 23% of wages were worth automating" |
| Uber used up its 2026 AI coding budget in four months | Confirmed by the owner: Uber's Chief Technology Officer said AI coding use exceeded expectations, April 2026 (Benzinga) | "Uber reportedly used up its 2026 AI coding budget by April" |
| Uber's Chief Operating Officer: heavy AI use did not clearly mean more useful features | Confirmed by the owner: Rapid Response podcast, May 2026 (MLQ.ai) | Use as stated |
| 84% of Uber engineers used AI agents; 70% of code came from AI | Not confirmed by Uber; secondary sites only | Avoid, or label "reported" |

Not checked, quote only as "reported by Forbes (Green, 2026)": Big Tech
capital spending, layoffs, model waste, Amazon's leaderboard, the 30% to 50%
price rise, and Sequoia's 2024 revenue gap.

The owner's takeaways for educators: judge AI by what it improves for
learners, not how much it gets used; match the tool to the task, as the
biggest model is rarely needed; today's low prices are subsidised, so plan
for costs to rise.

The Benzinga and MLQ.ai items rest on the owner's check; their addresses
are [[TODO: Benzinga and MLQ.ai URLs, from the owner]] before they appear
in the app.

## 5. In five lines

1. With a clear brief, AI cuts drafting time a lot: lesson resources by 31%,
   MCQs from about 20 to about 4 minutes, professional writing by 40%.
2. Where expert judgement is the work, it helps little or slows people down:
   experienced developers 19% slower; physicians' diagnosis no better.
3. Checking is the hidden cost, and it is often not in the figure.
4. People feel faster than they are; timed results beat self-reports.
5. AI alone is fast and cheap per draft, and confidently wrong some of the
   time. Per task it costs cents; to own, it costs your checking, and for an
   organisation the bill can outrun the savings (section 4b).

## Sources

All read on 7 October 2026 unless dated otherwise. Full APA references go
into references.md before any of these appear in the app.

- Afshar, M., et al. (2025). A pragmatic randomized controlled trial of ambient artificial intelligence to improve health practitioner well-being. NEJM AI, 2(12). https://doi.org/10.1056/AIoa2500945
- Al-Najafi, D., et al. (2026). Psychometric performance and student perceptions of AI- versus student-generated multiple-choice questions. BMC Medical Education, 26, 1376. https://doi.org/10.1186/s12909-026-09671-0
- Anthropic. (2026). Pricing. https://platform.claude.com/docs/en/about-claude/pricing and https://claude.com/pricing
- Asgari, E., et al. (2025). A framework to assess clinical safety and hallucination rates of LLMs for medical text summarisation. npj Digital Medicine, 8, 274. https://doi.org/10.1038/s41746-025-01670-7
- Becker, J., Rush, N., Barnes, E., & Rein, D. (2025). Measuring the impact of early-2025 AI on experienced open-source developer productivity. arXiv:2507.09089. https://arxiv.org/abs/2507.09089
- Cheung, B. H. H., et al. (2023). ChatGPT versus human in generating medical graduate exam multiple choice questions. PLOS ONE, 18(8), e0290691. https://doi.org/10.1371/journal.pone.0290691
- Dell'Acqua, F., et al. (2026). Navigating the jagged technological frontier. Organization Science, 37(2), 403-423. https://doi.org/10.1287/orsc.2025.21838
- Department for Business and Trade. (2025). Microsoft 365 Copilot pilot: DBT evaluation report. https://assets.publishing.service.gov.uk/media/68adbe409e1cebdd2c96a19d/dbt-microsoft-365-copilot-evaluation.pdf
- Gallup & Walton Family Foundation. (2025). Teaching for tomorrow: Unlocking six weeks a year with AI.
- Goh, E., et al. (2024). Large language model influence on diagnostic reasoning. JAMA Network Open, 7(10), e2440969. https://doi.org/10.1001/jamanetworkopen.2024.40969
- Green, J. (2026, July 2). AI costs more than the people it replaced. Forbes. https://www.forbes.com/sites/jemmagreen/2026/07/02/ai-costs-more-than-the-people-it-replaced/ (opinion; used only through the owner's check)
- Google. (2026, October 6). Gemini Developer API pricing. https://ai.google.dev/gemini-api/docs/pricing
- Humlum, A., & Vestergaard, E. (2025). Large language models, small labor market effects (BFI Working Paper 2025-56). University of Chicago.
- Kwa, T., et al. (2025). Measuring AI ability to complete long software tasks. arXiv:2503.14499; METR. (2026). Task-completion time horizons of frontier AI models. https://metr.org/time-horizons/
- Lukac, P. J., et al. (2025). Ambient AI scribes in clinical practice: A randomized trial. NEJM AI. https://doi.org/10.1056/AIoa2501000
- Muhammad Alif Bin Abu Bakar. (2026, October 7). AI costs more than people: Key findings [Unpublished summary]. The owner's own check of Green (2026).
- Ministry of Manpower. (2026, June 30). Occupational Wages 2025, Table 1. https://stats.mom.gov.sg/Pages/Occupational-Wages-Tables2025.aspx
- Noy, S., & Zhang, W. (2023). Experimental evidence on the productivity effects of generative artificial intelligence. Science, 381(6654), 187-192. https://doi.org/10.1126/science.adh2586
- OpenAI. (2026). Pricing. https://developers.openai.com/api/docs/pricing
- Peng, S., Kalliamvakou, E., Cihon, P., & Demirer, M. (2023). The impact of AI on developer productivity: Evidence from GitHub Copilot. arXiv:2302.06590. https://arxiv.org/abs/2302.06590
- Roy, P., Poet, H., Staunton, R., Aston, K., & Thomas, D. (2024, December 12). ChatGPT in lesson preparation: A Teacher Choices trial. Education Endowment Foundation and NFER. https://www.nfer.ac.uk/publications/chatgpt-in-lesson-preparation-a-teacher-choices-trial/
- Svanberg, M. S., Li, W., Fleming, M., Goehring, B. C., & Thompson, N. C. (2024, February 8). Beyond AI exposure: Which tasks are cost-effective to automate with computer vision? [Working paper]. MIT FutureTech. https://futuretech.mit.edu/publication/beyond-ai-exposure-which-tasks-are-cost-effective-to-automate-with-computer-vision
- SWE-bench. (2026). Leaderboards. https://www.swebench.com
- UK Government Digital Service. (2025). Microsoft 365 Copilot experiment: Cross-government findings report. https://www.gov.uk/government/publications/microsoft-365-copilot-experiment-cross-government-findings-report
- Vectara. (2026, September 22). Hallucination leaderboard. https://github.com/vectara/hallucination-leaderboard
- Wang, Z. Z., Shao, Y., Shaikh, O., Fried, D., Neubig, G., & Yang, D. (2025). How do AI agents do human work? arXiv:2510.22780. https://arxiv.org/abs/2510.22780

Not opened in full: the EEF report itself (the NFER summary was read), the
publisher pages for Noy & Zhang, Dell'Acqua et al. and Brynjolfsson et al.
(abstracts read), and several clinical papers (PubMed abstracts read).
