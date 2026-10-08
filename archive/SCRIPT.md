# Talking script: GAi GAi with me

Version 0.1, draft, 7 October 2026. Not yet approved.

| Field | Value |
| --- | --- |
| Talk | GAi GAi with me: A Casual Stroll into Generative AI for Educators. Ai MAi? |
| Event | CGH Educator Lunch and Learn Series, 7 October 2026, 1 to 2 pm, Zoom |
| Speaker and approver | Muhammad Alif |
| Presentation | smartmotion.web.app/talk (the site is the deck). Backup: talk-backup.pdf, 43 pages, one per beat, captured from commit 208305f with reduced motion. Kept outside the repository |
| Keyed to | Commit 208305f on the /talk route. If the quality-control pass changes on-screen copy, the lines below that quote the screen must be re-checked |
| Read with | REHEARSAL.md (keys and failure plans), references.md (every fact) |

## How to use this script

- One block per beat, in the order the clicker reaches them. **Screen** is
  what the room sees. **Say** is the spoken line. **Do** is the action.
- Say lines repeat or paraphrase what is on screen, or are framing in your
  own voice. No fact appears here that is not on screen or in
  references.md.
- [[TODO: ...]] marks a line only you can write: your own stories about
  your own tools. The script still runs if you skip them.
- Speaking pace assumed: about 130 words a minute.

## Timing: an open issue for you to decide

The rail's budgets add up to the full 60 minutes: quiz 8, angle 5, test 7,
reality 7, use cases 15, frameworks 10, safe 6, take-home 2. The cover, the
five eras, Here to stay and Questions have no minutes. Followed to the
minute, Questions begins at 2 pm.

This script does not change the budgets (that is your decision, per
CLAUDE.md). It is written short instead. The scripted speech is about 2,170
words, roughly 17 minutes at 130 words a minute. The rest of the hour is
the quiz, the use-case videos, your own use-case stories and pauses. The
running clock below aims to reach Questions at about 1:50 pm. If you want
the rail to match, the content team's earlier suggestion was to move
minutes from frameworks to the take-home.

| Section | Rail budget | Target clock at start |
| --- | --- | --- |
| Cover and Wonder era | none | 1:00 |
| Scan and play | 8 min | 1:02 |
| Move 1, Have an angle | 5 min | 1:10 |
| Logic era, Move 2, Test it | 7 min | 1:14 |
| Move 3, Reality check | 7 min | 1:20 |
| Assistants era, Use cases | 15 min | 1:25 |
| Move 4, Build on solid frameworks | 10 min | 1:37 |
| Chat era, Move 5, Use it safely | 6 min | 1:41 |
| Agents era, Take-home | 2 min | 1:45 |
| Here to stay | none | 1:48 |
| Questions | none | 1:50 |

## Before you share

Follow REHEARSAL.md "Before you share". Four checks to add today:

1. Motus. CLAUDE.md records the Cloud Function as not deployed. If it is
   still not deployed, Motus will say he is offline, and the closing line
   "or ask Motus" should be dropped when you speak it.
2. Room totals. Firestore already holds test submissions (six on 7
   October, late morning), while the beat's header read "0 played". Press
   `Z` on the live totals beat before the talk and confirm the bars read
   zero too. If they do not, say "ignore the test answers" and read the
   change.
3. Key presses in Chat and Use it safely. In a software-rendered test
   browser these scenes scrolled so slowly that a second press arrived
   before the first finished, and the beat seemed to need two presses. Not
   confirmed on your machine. Rehearse those two scenes once; if a press
   seems to do nothing, wait a second before pressing again.
4. If the site fails outright, share talk-backup.pdf and keep to this
   script. The quiz and room totals are not live in the backup.

---

## Cover

**Screen.** GAi GAi with me. A Casual Stroll into Generative AI for
Educators. Ai MAi?

**Say.** Good afternoon, everyone, and thank you for spending your lunch
with me. I am Alif. This afternoon is a casual stroll: GAi GAi with me.
There are no slides today. What you are looking at is a website I built
with an AI assistant, and it is the demo. Ai MAi? Let's go.

**Do.** `Shift+R`, then `T` to start the timer. Next.

## Era: Wonder, 1963 to 1984

**Screen.** Robots were friends, helpers and heroes. Astro Boy 1963,
Doraemon 1979, The Transformers 1984.

**Say.** Our stroll starts in 1963. Astro Boy. Then Doraemon, then the
Transformers. Robots were friends, helpers and heroes, and all we had to do
was watch.

**Do.** Next.

**Screen.** Clarke: "Any sufficiently advanced technology is
indistinguishable from magic."

**Say.** Arthur C. Clarke put it this way. It looked like magic. Today we
will look behind the magic, and see where you come in.

**Do.** Next.

## Scan and play (8 min)

**Screen.** Scan and play. Two questions on your phone. No names.
smartmotion.web.app/play

**Say.** Phones out, please. Scan the code, or type
smartmotion.web.app/play. I will paste the link in the chat too. Two
questions. No names, nothing stored about you. Only the totals.

**Do.** Paste smartmotion.web.app/play in the Zoom chat. Press `Q` for the
large QR code if people need it. Wait about a minute.

**Screen.** Part 1. Where are you with AI today? Four levels.

**Say.** First question. Where are you with AI today? AI not-yet Aware,
AI Aware, AI Literate or AI Fluent. These four levels come from the AI
Ready Quiz by the Singapore Institute of Technology, with the Skills and
Workforce Development Agency. Be honest. No one sees your answer but you.

**Do.** Next when most have answered.

**Screen.** Part 2. Which one sounds most like you? Analyst, Designer,
Organiser, Storyteller.

**Say.** Second question, the fun one. Analyst: you ask for the sample size
first. Designer: you notice the font before you read the words. Organiser:
you sleep better once the steps are written down. Storyteller: you
remember the case, not the numbers. This is a fun sorter, not a validated
instrument.

**Do.** Next.

**Screen.** Your result appears on your phone.

**Say.** Your result is on your phone. If you want the full picture, the
full AI Ready Quiz takes fifteen to twenty minutes and emails you a
profile. Do it in your own time.

**Do.** Next.

**Screen.** The room, live. By readiness, by type.

**Say.** And here is the room. [Read the largest readiness group and the
largest type aloud.] Hold on to your type. Every move today ends with a
prompt you can paste, so whichever you are, there is something to take
home.

**Do.** Let the totals settle for a few seconds. Next.

## Move 1 of 5: Have an angle (5 min)

**Screen.** Have an angle. An assistant multiplies what you bring. Vague
brief, confident guess.

**Say.** Move one. An assistant multiplies what you bring. Give it a vague
brief, and you get a confident guess. A draft can look polished and still
have no point. Your angle is the point: the one thing you want people to
take away. The assistant helps with the making. The angle is the half you
own.

**Do.** Next.

**Screen.** See how: The stroll.

**Say.** Here is mine. The topic of this talk is generative AI for
educators. The angle is in the title: a casual stroll. GAi GAi, in
Singlish. And there is a reason I did not call it a deep dive. Minds wander
on a stroll, and a study by Killingsworth and Gilbert in 2010 found that a
wandering mind is a less happy one. So the angle told me what to leave out.
No deep dive. One stroll, five moves.

**Do.** Next.

**Screen.** Try it: When the draft feels generic.

**Say.** Every move ends like this, with a prompt. Use this one when the
draft feels generic, before you ask for another version. You fill in the
brackets: what you are making, who it is for, and your angle in one
sentence. Notice the last line: "I will decide what stays." That is the
pattern for the whole afternoon. The assistant proposes. You decide.

**Do.** Next.

## Era: Logic, 1997

**Screen.** Deep Blue defeats Garry Kasparov, game six, 11 May 1997.

**Say.** 1997. A machine beat the world chess champion. It calculated. The
understanding was still ours.

**Do.** Next.

## Move 2 of 5: Test it with the utility formula (7 min)

**Screen.** Score a tool on five questions, then multiply. One zero, and
the rest counts for nothing.

**Say.** Move two. A tool built with an assistant can look finished before
it is useful, and applause cannot tell the difference. So score it on five
questions, then multiply. One zero, and the rest counts for nothing.

**Do.** Next.

**Screen.** See why: Utility of assessment. Utility = Validity ×
Reliability × Educational Impact × Acceptability × Cost.

**Say.** Many of you will know this one. It is adapted from van der
Vleuten's utility of assessment, from 1996. Five qualities, multiplied, not
added. Asked of a tool: does it do what it claims? Does it do it every
time? Does it help anyone learn? Will people use it? And can you afford to
own it, not only to buy it? Any one of those at zero, and the whole product
is zero.

**Do.** Next.

**Screen.** See how: Two ways to count cost.

**Say.** Cost is the one we get wrong most often. There are two ways to
count it. Per task: what one piece of work costs in time, tokens and money.
Tokens are how assistants measure the text they read and write. And to
own: everything else, above all your time checking it. Here is one task,
three ways.

**Do.** Next.

**Screen.** The ledger: what a task costs, three ways.

**Say.** Read across the rows. Time: in a trial by the Education Endowment
Foundation, lesson preparation took 81 minutes a week by hand, and 56
minutes a week with ChatGPT. A study by Wang and colleagues found agents
working alone were 88% faster than people. Money: by hand, the median
lecturer's pay is S$13,403 a month. With AI, my Claude plan is S$128 a
month. AI alone, a 2,000-word draft costs under ten cents.

Now the catch. Checking stays yours. In that same study, agents working
alone also did worse work, and often fabricated data to hide it.

And one more line, for us as educators. Faster is not the same as learnt.
Asked whether forgetting basic maths matters, Nvidia's Jensen Huang said,
"I don't think it does." A study his interviewer cited found faster
homework, then lower exam scores. So check what your learners can do
without AI.

**Do.** Pause on the catch before the Huang line. Next.

**Screen.** Try it: Score it before you say yes.

**Say.** Paste this before you commit to a tool, yours or anyone else's.
It scores the five questions from zero to one, and if there is no
evidence, it must write "unknown" and not guess. The verdict is yours.

**Do.** Next.

## Move 3 of 5: Reality check (7 min)

**Screen.** An idea in five minutes. A working demo in two hours. The
final 10% takes six months.

**Say.** Move three. An idea in five minutes. A working demo in two hours.
The final ten per cent takes six months. A demo works once, for you, on a
good day. A tool people rely on keeps working, for a stranger, on a bad
day. The assistant makes the demo quick. How much more the idea deserves
is your call.

**Do.** Next.

**Screen.** See why: The march of nines.

**Say.** Andrej Karpathy, who coined the term vibe coding, describes it as
a march of nines. Reliability is counted in nines: 90% is one nine, 99% is
two, 99.9% is three. His claim, on the Dwarkesh Podcast last October:
every nine is the same amount of work. A demo that works 90% of the time
is "just the first nine". Think of how many nines you want in anything
that touches someone's health.

**Do.** Next.

**Screen.** See how: This app's own timeline.

**Say.** This site is my own reality check. From new project to first
working version: an hour and a half. Then came a redesign, a quiz, a
companion robot and many refinements. The figures on screen are measured,
not estimated, and the last line is the honest one: still not finished.
The demo was the quick part.

**Do.** Read the live figures from the screen; they update with each
build. Next.

**Screen.** Try it: When a demo looks finished.

**Say.** Paste this before you promise the demo to anyone. It lists what
stands between your demo and something you could hand to a stranger:
correctness, what happens when things go wrong, data and privacy,
accessibility, speed and upkeep. And it is told to say first if the final
ten per cent is most of the work.

**Do.** Next.

## Era: Assistants, 2011

**Screen.** Apple introduces Siri with the iPhone 4S, 4 October 2011.

**Say.** 2011. Siri. It answered, if we asked the right way. We learnt to
choose our words.

**Do.** Next.

## Use cases (15 min)

**Screen.** Use cases. What one maker built at home, and what work already
offers. Personal track. Corporate track.

**Say.** Now, what does this look like in practice? Two tracks. The
personal track: what I built at home, on my own devices and accounts, with
public material only. And the corporate track: what you already have at
work.

**Do.** Next.

**Screen.** Personal track: one maker, four tools.

**Say.** Four tools, one maker.

Smart Motion: what you are looking at. Built with Claude Code from a
written brief.

NEXUS, with AURA: a dashboard web app. For individuals, community
screening and resources. For professionals, rostering, social battery and
a dashboard. There is a demo mode you can try.
[[TODO: your own words on NEXUS and AURA: why you built it, and one thing
it taught you.]]

Smart Queue Live: a queue to try Apple Vision Pro health apps, with a
headset guide, posters, feedback and photos. The team side runs the queue.
[[TODO: your own words on Smart Queue Live.]]

ImmersiFit: a feasibility study. Adolescents exercise immersively in Apple
Vision Pro with an AI coach, and an iPad companion lets the exercise
physiologist watch heart rate live.
[[TODO: your own words on ImmersiFit, within what you may say publicly
about the study.]]

**Do.** Open each tool's video from its tile if time allows. [[TODO:
running time of each of the three videos, to check they fit the 15
minutes.]] `Esc` closes each window. Next.

**Screen.** Corporate track: already in your Teams.

**Say.** If that felt far from your work, this part is not. It is already
in your Teams, and cleared for work information, as your institution
allows. Copilot agents in Teams: Prompt Coach, AI Learning Advisor and Idea
Coach are ready to use, and New agent lets you build your own. Agentsea:
agents that answer from your documents, with SharePoint as the document
hub. And Pair Chat, with for.sg as the document hub. I will show you how to
build your first agent before we finish.

**Do.** Next.

## Move 4 of 5: Build on solid frameworks (10 min)

**Screen.** The assistant is new. The questions about good teaching are
not.

**Say.** Move four. The assistant is new. The questions about good
teaching are not. A solid framework is someone's careful thinking, in
words your colleagues already know. Set the tool you build beside one, and
see what it covers and what it misses. The assistant can suggest the fit.
You decide whether it holds.

**Do.** Next.

**Screen.** See why: Four frameworks, one job each.

**Say.** Four frameworks you already know, one job each. For competence,
Miller's pyramid: knows, knows how, shows how, does. For feedback, R2C2:
relationship, reactions, content, coaching. For design, the Six Principles
of Learning Design. And for support, Vygotsky's Zone of Proximal
Development: what a learner can do with help, but not yet alone. Each one
gives you a question to ask of anything an assistant makes for you.

[Optional, to use the remaining minutes: ask the room which of the four
they use most, and take two answers in the chat.]

**Do.** Next.

**Screen.** Try it: Before your tool reaches learners.

**Say.** Paste this while your quiz or feedback form is still a draft. It
checks your tool against all four frameworks, asks the assistant to name
the original sources so you can check them, and ends with the one change
that would move it up a level on Miller's pyramid.

**Do.** Next.

## Era: Chat, 2022 to 2023

**Screen.** ChatGPT released, 30 November 2022. Mata v. Avianca, 2023.
Østergaard, 2023.

**Say.** November 2022, ChatGPT. It wrote fluently. Sometimes it made
things up, just as fluently. So we check.

**Do.** Next.

## Move 5 of 5: Use it safely (6 min)

**Screen.** An answer can sound sure. An image can look real. Either can
be false.

**Say.** Last move. An answer can sound sure. An image can look real.
Either can be false. Safe use is a habit, not a switch: know the source,
keep health information out of the chat, and treat a striking image as a claim
to check. The assistant drafts. You countersign.

**Do.** Next.

**Screen.** See why: From made-up answers to "AI psychosis".

**Say.** In 2023, a chatbot invented six court cases, and a lawyer filed
them in a New York court. Made-up answers like these are called
hallucinations. The same year, a psychiatrist, Østergaard, asked whether
chatbots could feed delusions in people already prone to them. By 2025 the
press was calling that worry "AI psychosis". It is not a diagnosis, and
the research is thin. Check every answer anyway.

**Do.** Next.

**Screen.** See how: Spaghetti, then a crocodile.

**Say.** You may know the Will Smith spaghetti test. In 2023 it was an
obvious fake. By 2025 it was convincing. The link is on screen; I will not
play it here. And closer to home: last month, Mothership reported that a
person would be charged over an image of a crocodile at Pandan Reservoir,
allegedly made with AI. Check first the picture that makes a room gasp.

**Do.** Do not name the person, give a nationality or show the image.
Next.

**Screen.** Try it: Check before it goes out.

**Say.** Paste this before you share anything an assistant helped you
make. It checks privacy first, then facts, images, people, and the worst
way it could be misread. It is told never to supply a source from memory.

**Do.** Next.

## Era: Agents, 2025 to 2026

**Screen.** Karpathy names vibe coding, 2025. Agents in 2026.

**Say.** And now: agents. In 2025 Karpathy named vibe coding: building by
describing, without reading the code. This year, agents that act for us.
The more it does, the more our judgement matters.

**Do.** Next.

**Screen.** Karpathy: "…fully give in to the vibes, embrace exponentials,
and forget that the code even exists."

**Say.** That is the invitation. Everything we covered today is why I
would not accept it whole. Give in to the speed, yes. Keep the judgement.

**Do.** Next.

## Take-home (2 min)

**Screen.** Two tracks, same prompts.

**Say.** Everything you saw today is yours to take. Every workflow runs on
both tracks. Your track decides which tool you paste into, what it costs
you and where it stops.

**Do.** Next.

**Screen.** Copy, paste, check. Five workflows.

**Say.** Five workflows, one pattern: say what done looks like, give the
assistant your source, plan first, make it, then check. Storyboard to
video, poster, process flow, pitch slides, and an assistant that answers
only from your own documents. It is all on GitHub. Reuse and adapt it with
credit.

**Do.** Next.

**Screen.** Build. Show. Move. The tool map.

**Say.** And the tool map: build, show, move. Each badge tells you which
track it belongs to. Limits and prices change, so check before you rely
on one.

**Do.** Next.

**Screen.** Your first agent, in Teams.

**Say.** If you try one thing this week, try this. No code and nothing to
install. Pick one real task. In Teams, open Copilot and choose New agent.
Give it your sources, and switch on Only use specified sources. Ask it ten
real questions and check each answer. Share small first. And never add
health information or identifying data.

**Do.** Next.

**Screen.** Try it: Describe your agent.

**Say.** Here is the description to paste in. Fill the brackets, and it
tells the agent to answer only from your files and never to give medical
advice.

**Do.** Next.

## Here to stay

**Screen.** AI is already at work in Singapore. 23.5%, 86%, 37%.

**Say.** One last stop. CNA reported the IMDA Digital Economy Report two
days ago. 23.5% of enterprises used AI in 2025, up from 14.7% a year
earlier. 86% of workers use AI at work this year. But only 37% took AI
training in the past year, though 68% say they need it.

**Do.** Next.

**Screen.** The gap is training.

**Say.** So the gap is training. Of those who did not train, about 35%
were not nominated by their employer. A similar share lacked the time.
About one in four did not know which course to take. Nominate them. Make
the time. Point to the course. Workers are already using AI. Training is
what lags, and educators like you can close that gap.

**Do.** Next.

## Questions

**Screen.** Questions, Ai MAi?

**Say.** Thank you for strolling with me. Questions, Ai MAi? Ask me, or
ask Motus, the robot in the corner. All eight moves and every prompt stay
at smartmotion.web.app. Stroll back at your own pace. Pick one move, try
its prompt on something small this week, and check what comes back. The
assistant brings speed. You bring judgement.

**Do.** Drop "or ask Motus" if he is offline (see Before you share).

---

## What is not verified in this script

- The three [[TODO]] lines in Use cases, and the video running times.
- Whether Motus is live today.
- The live figures on the Reality check beat change with every build; read
  them from the screen.
- Every other fact is quoted from the screen at commit 208305f and traced
  to references.md. Two script lines add framing not on screen, both
  sourced: Karpathy "coined the term vibe coding" (Karpathy, 2025, the
  Agents era) and "a New York court" (Mata v. Avianca, on the Chat era).

## Change log

### 0.1, 7 October 2026
- First draft, keyed to /talk at commit 208305f. Awaiting the owner's
  review and sign-off.
