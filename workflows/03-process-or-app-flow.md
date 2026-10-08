# Workflow 3: Process or app flow diagram

Turn a process you know well into a clear flow diagram: a clinical pathway, a
teaching session plan, a referral route, or the screens of an app.

## Before you start

You need:
- The steps, in your own words, even if messy
- Who does each step (role, not name)
- Where decisions happen and what the options are
- A text assistant. The diagram is written as Mermaid, a simple text format
  for diagrams. Some assistants display it directly. Otherwise paste the text
  into a Mermaid viewer (search "Mermaid live editor") to see and download it.

## Step 1: Get the steps out of your head

```
I want to map this process: [NAME].
It starts when: [TRIGGER]. It ends when: [END POINT].
People involved (roles only): [ROLES].

Here is how it works, roughly:
[DESCRIBE IT AS YOU WOULD TO A NEW COLLEAGUE]

Rewrite this as a numbered list of steps. For each step give: who does it,
what they do, and what happens next. Mark every decision point and its
options. List anything that is ambiguous or missing as questions for me. Do
not fill gaps with guesses.
```

Answer its questions. This step is where most of the value is.

## Step 2: Draw it

```
Convert the confirmed steps into a Mermaid flowchart.
- Top to bottom
- Rounded boxes for start and end, rectangles for actions, diamonds for
  decisions
- Label every arrow that leaves a decision
- Group steps by role using subgraphs
- Twelve words or fewer per box
Give me only the Mermaid code.
```

## Step 3: Stress-test it

```
Act as a new staff member following this diagram for the first time.
Walk through it for these three cases and tell me where you would get stuck:
1. [THE ROUTINE CASE]
2. [AN UNUSUAL CASE]
3. [WHEN SOMETHING GOES WRONG]
Then list any dead ends, missing exits or steps with no owner.
```

Fix the process description first, then regenerate the diagram.

## Variation: app screen flow

```
Map the user's journey through [APP OR TOOL] as a Mermaid flowchart.
Each box is one screen. Each arrow is one user action, labelled with the
button or choice. Show where the user can go back, and what they see if
something fails.
Screens and actions:
[LIST THEM]
```

## Check before you use it

- Has someone who does the process daily confirmed it is correct?
- Does it match the current approved policy or protocol? If the two differ,
  the policy wins until it is formally changed.
- Are roles used instead of names?
- Does it carry a version number and date?

## Where this came from

I use this to map session workflows and app flows for clinical tools I build,
so that the clinician's console and the device of the person receiving care each have a clear,
agreed sequence before any building starts.
