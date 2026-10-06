# Chatbot Info Card: Motus (the Smart Motion companion)

**Understanding the AI companion inside Smart Motion: what it can do, how it is kept safe, how your
data is handled, and how to raise a concern.**

| | |
|---|---|
| **Card status** | ⚠️ **Draft, not yet in effect.** Awaiting sign-off by **Muhammad Alif (owner)**, the named approval Rule 12 of the guardrails requires. |
| **Motus status** | ✅ **Live since 6 October 2026.** First checked that day on the live service: real questions answered from the knowledge base with sources named; crisis and NRIC messages answered by the fixed replies without reaching the model; a prompt-injection attempt reported and refused; other websites blocked. |
| **Card version** | 0.5 (draft) |
| **Last updated** | 2026-10-05 |
| **Describes** | Smart Motion **v0.4.0** · Motus guardrails **v1.0** |
| **Framework** | Structured after the **IMDA Transparency Guidelines for Generative AI Chatbots** (Infocomm Media Development Authority, Singapore, published 20 July 2026), Annex B sample format, following the owner's card for AURA in NEXUS. The guidelines are voluntary; Smart Motion adopts them as its transparency baseline. |

---

## 1 · What Motus does

Motus is the small robot at the bottom right of Smart Motion. Tap it and a chat window opens.

### Capabilities

- **Find your way.** Ask where something is and Motus links you to the scene: a move, an era, the
  quiz, the take-home.
- **Explain the playbook.** What a move means, what a framework is, which of the five workflows
  fits your need, and whether it suits the personal or the corporate track.
- **Answer from the playbook only.** Motus's knowledge is a fixed set of documents built from this
  site's own repository (the moves, the eras, the workflows, the brief and this card). It is told
  to name the document it relies on and to say so when the answer is not there.

### How Motus talks

Motus is told to converse using the four techniques of **motivational interviewing**, known as
OARS: **open questions** when your goal is unclear, brief and specific **affirmations**,
**reflective listening** (saying back what it heard so you can correct it) and **summaries**
before suggesting a next step. It is told to draw out your own reasons and choices rather than
tell you what to do. This is a conversational style. **It is not counselling or therapy**, and a
clear factual question still gets the answer first. Whether Motus follows this on every turn is
**not yet verified** (§6).

Motus **cannot act**. It has no tools, no database and no way to send, save or book anything. It
can only reply and point.

### About the AI model

Motus runs on **Google's Gemini**, reached over the Gemini API from a Firebase Cloud Function in
the `asia-southeast1` (Singapore) region, the same model family as AURA in the owner's NEXUS. The
function asks for `gemini-3.5-flash` and, if Google refuses that model, falls back to the
`gemini-flash-latest` alias, so the model can change without notice. **Which model answered is
recorded on every reply** and shown beneath it, with the guardrail version and the time. The model is
Google's; what is Smart Motion's own is the prompting, the knowledge base and the checks around them.

### Accuracy and limitations

- Motus can **hallucinate**: produce something that sounds convincing and is wrong. Treat a reply
  as a pointer to check, not a fact to rely on.
- Motus has **no internet access and no retrieval**. It knows only its fixed knowledge base and the
  conversation. It is told to decline rather than answer from its training, and to name its source;
  whether it does so on every turn is **not yet verified** (§6).
- Parts of the playbook are still marked **TODO** while the owner supplies or checks them. Motus is
  told to say so when it meets one.
- Sixteen working rules govern Motus (`MOTUS-GUARDRAILS.md`). Read its conformance table before
  relying on any of them: some are enforced in code, most are instructions to a language model, and
  an instruction is a request, not a control.

---

## 2 · What Motus shouldn't be used for

- **Medical advice, diagnosis or treatment.** Motus is a guide to a teaching playbook. It gives no
  clinical advice for any person.
- **Crisis support.** Motus is not a crisis service. If you are in danger, contact emergency
  services (§3 gives the fixed reply Motus shows).
- **Patient, colleague or internal hospital information.** Never type it. Smart Motion never needs
  it. A message containing something shaped like an NRIC or FIN number is refused before it reaches
  the model, but **nothing else is checked**: names, record numbers and dates of birth would pass.
  The control on what you type is you.
- **Decisions.** Anything Motus says is for you to check against the source it names.

**Access:** anyone visiting the site can use Motus. There is no sign-in and **no age assurance**.

---

## 3 · Safety and reliability

*For each risk: the safeguards, what is honestly known about how well they work, and what you can
do. Smart Motion publishes **no quantitative effectiveness figures because none have been
measured**; the guidelines permit qualitative statements.*

### Incorrect information

- **Safeguards:** a guardrail preamble leads every request. It forbids invented facts, figures,
  quotes and sources, requires Motus to name the document it relies on, and requires it to say
  when something is missing or marked TODO. The playbook's unverified cost figures are **left out
  of Motus's knowledge base** in code. Output length is capped in code, and a reply cut at the
  limit says so.
- **Effectiveness, honestly:** the code parts are tested. The prompt parts are tested only to
  **reach** the model. Nothing yet shows the model **follows** them; that needs a read of real
  turns, which has not been possible because Motus is not live. In the owner's other project,
  NEXUS, such a read found two prompt rules ignored on every run.
- **What you can do:** open the document Motus names and check it says what Motus said.

### Crisis wording

- **Safeguards:** a short list of phrases that read as someone at risk (for example *kill
  myself*, *suicidal*, *want to die*, *self-harm*) is caught in code. Motus then shows a fixed
  reply, and the message is **never sent to the model**:

  > I am a guide to this playbook, not a crisis service, and I cannot help with this safely. If
  > you or someone near you is in danger now, call 995. To talk to someone at any hour,
  > Samaritans of Singapore (SOS) answers on 1767. Please reach out to a person you trust as well.

- **Effectiveness, honestly:** this is a phrase match, **not** crisis detection. Anything worded
  differently reaches the model, which is told it is not a crisis service. The two phone numbers
  were checked against the services' own websites on 6 October 2026.
- **What you can do:** for real distress, contact a person or a professional service directly.

### Personal data

- **Safeguards:** an NRIC or FIN-shaped token in a message is refused with a fixed reply, in the
  browser and again on the server, and is never sent to the model.
- **Effectiveness, honestly:** one identifier class. **This is not PDPA compliance** and is not
  described as such.
- **What you can do:** use placeholders, never real details.

### Misuse and attempts to redirect Motus

- **Safeguards:** Motus's instructions live only in its system prompt. Its knowledge base, the
  note about which scene you are on and anything you paste are named as data, not instructions.
  The scene note passes only if it is shaped like a scene id. The server answers only this site.
  Rate ceilings per instance: 20 messages a minute from one address and 300 an hour in all, with at
  most five instances, so a script meets a limit rather than an unbounded bill. Gemini's own safety
  filters apply to every reply, and a reply they block gets a fixed line instead.
- **Effectiveness, honestly:** no red-team exercise has been run against Motus.
- **What you can do:** report anything harmful or wrong (§5).

---

## 4 · Data practices

### What is collected

- **Your conversation is kept in your browser tab only** (session storage), the last 12 turns,
  and is cleared when you close the tab. Smart Motion has no database of conversations.
- **What you type is sent** with each question, together with the earlier turns kept in the tab
  and the id of the scene you are on, to Smart Motion's Cloud Function in Singapore, which forwards
  it to Google's Gemini API to write the reply. A message refused by the checks in §3 is not
  forwarded.
- **The server writes no conversation down.** It logs, without any of your words: which model
  answered, the guardrail version, the time and the number of tokens used, and the status of any
  error. Your network address is held in memory for up to a minute for the rate ceiling and is
  never written down.

### Who has access

- Message content is processed by **Google** (the Gemini API) as the model provider, and the
  site runs on **Google Firebase**. No other third party receives chat content. Nothing is sold.

### Whether data is used for model training

Smart Motion trains no models and fine-tunes nothing. Google's Gemini API terms (updated 28 April
2026) treat the two tiers differently. On **paid** use, Google does not use prompts or responses to
improve its products; it logs them for a limited period only to detect misuse. On **unpaid** use,
Google may use them to improve its products and human reviewers may read them. **Motus must run on a
key from a billed (paid) Google Cloud project**; the owner sets the key. Smart Motion has **not
independently verified** Google's handling and does not claim to have.

### Your controls

- Close the tab to clear the conversation. Nothing is stored on the server, so there is nothing to
  ask to delete.

---

## 5 · Feedback and reporting

### How to report

- **Email** Muhammad Alif at **muhammad.alif@me.com**, the address published on the site's
  contact page.

### What you can report

Harmful, offensive or incorrect replies; privacy or data concerns; anything identifying that
should not have been accepted; technical faults.

### What to expect

⚠️ **No response-time commitment is published.** Smart Motion is one person's project, and this
card will not invent a service level it cannot keep.

---

## 6 · Assumptions, gaps and unverified items

*Required by guardrail P1; in the body of the card, not a footnote.*

1. **This card is a draft with no named sign-off.** It is not in effect until the owner approves it.
2. ~~**Motus is not live.**~~ **Live from 6 October 2026.** Struck through, not deleted. The owner set
   the Gemini API key, in the billed smartmotus project, himself.
3. **Prompt-carried safeguards are only spot-checked.** Six live turns on 6 October 2026 followed
   the rules (sources named, OARS style, injection refused). Six turns are not a read of real use;
   a fuller read, as NEXUS ran for AURA, is still the gate before compliance is claimed.
4. ~~**The crisis reply's phone numbers are model-recalled**~~ **Checked 6 October 2026** against
   the services' own websites: 995 is SCDF's emergency ambulance line (scdf.gov.sg) and 1767 is the
   Samaritans of Singapore 24-hour hotline (sos.org.sg). Struck through, not deleted.
5. **The identifier check covers NRIC and FIN shapes only.** Not PDPA compliance.
6. **No age assurance** exists; the site is open to anyone with the link.
7. **Google's data handling is taken from its terms, not verified independently.** It depends on
   the key being on the paid tier (§4); an unpaid key would allow Google to use conversations to
   improve its products.
12. **Google's terms require the API not to power a service directed at, or likely to be used by,
   people under 18.** Smart Motion is made for adult educators and has no age check (gap 6).
8. **The IMDA guidelines were not re-read for this card.** Its structure and framing follow the
   owner's signed AURA card (NEXUS, v1.3), which is structured after the guidelines' Annex B. A
   check against the guidelines themselves is due before sign-off.
9. **The sixteen rules were written for AURA**, a drafting assistant inside a hospital team tool.
   `MOTUS-GUARDRAILS.md` §B says where they fit Motus loosely or not at all.
10. **No quantitative safety metrics exist.** Every effectiveness statement is qualitative by
    necessity.
11. **One model for every request.** Motus does not route by task (Rule 16); the model that
    answered is recorded instead.

---

## Source table

*Required by guardrail P3: claim, source, verification status. "Confirmed" means checked against
the named source on the date shown, not permanently true.*

| Claim (§) | Source | Status |
|---|---|---|
| Motus cannot act: no tools, no database, no sending (§1, §2) | `functions/motus.js`: one streaming call with no `tools` | Confirmed 2026-10-05 |
| Motus is told to use the OARS techniques of motivational interviewing, as style, not therapy (§1) | `functions/motus.js` persona; `functions/guardrails.test.js` | Confirmed 2026-10-05; tested to reach the model, not to be followed |
| Knowledge base built from the repository; cost evidence excluded (§1, §3) | `scripts/build-kb.mjs`; `functions/guardrails.test.js` asserts the exclusion | Confirmed 2026-10-05 |

| Region `asia-southeast1` (§1, §4) | `functions/index.js`; `firebase.json` rewrite | Confirmed 2026-10-05 |
| Provenance on every reply: model that answered, guardrail version, time (§1) | `functions/guardrails.js` `aiProvenance`; `functions/motus.js`; `site/src/motus/chat.js` | Confirmed 2026-10-05; tested |
| Preamble leads every request (§3) | `functions/motus.js` `system`; `functions/guardrails.test.js` | Confirmed 2026-10-05; tested to reach the model, not to be followed |
| NRIC/FIN shape refused, browser and server (§2, §3) | `functions/guardrails.js` `NRIC_SHAPE`; `site/src/motus/chat.js` | Confirmed 2026-10-05; tested |
| Crisis phrases answered with a fixed reply, never sent to the model, with or without a key (§3) | `functions/guardrails.js` `screenInput`; `functions/motus.js` | Confirmed 2026-10-05; tested |
| Phone numbers in the crisis reply (§3) | scdf.gov.sg (995); sos.org.sg (1767) | Confirmed 2026-10-06 |
| Output capped at 1,200 tokens; input 2,000 characters a message, last 12 turns; a cut reply says so (§3) | `functions/motus.js` `MAX_OUTPUT`, `MAX_CHARS`, `MAX_TURNS` | Confirmed 2026-10-05 |
| Rate ceilings and instance cap (§3, §4) | `functions/motus.js` `PER_MINUTE`, `PER_HOUR`; `functions/index.js` `maxInstances` | Confirmed 2026-10-05 |
| Conversation in session storage, last 12 turns, cleared when the tab closes (§4) | `site/src/motus/chat.js` | Confirmed 2026-10-05 |
| Server logs carry no conversation text (§4) | `functions/motus.js` `console.info` and `console.error` calls | Confirmed 2026-10-05 |
| Motus is live (header, gap 2) | Firebase deploy of 2026-10-06; live test turns that day | Confirmed 2026-10-06 |
| Google's data handling, paid versus unpaid tiers (§4) | Gemini API Additional Terms of Service, updated 2026-04-28 | Terms read 2026-10-06; Google's practice **not independently verified** (gap 7) |
| Model requested and fallback (§1) | `functions/motus.js` `MODELS`; names from NEXUS `modelAvailability.cjs` (checked 2026-09-06) | Confirmed in code 2026-10-06; tested with simulated responses, **not yet against the live API** |
| Model follows its prompt-carried rules (§3) | None yet | **Unverifiable until Motus is live** (gap 3) |

---

## Card versioning

Updated when Motus's capabilities, model, guardrails or safety profile change, or a new risk is
found, and reviewed at least once a year. The guardrail version is stamped on every reply, so drift
between this card and the code is visible.

| Card version | Date | Change |
|---|---|---|
| 0.5 (draft) | 2026-10-06 | Motus deployed and live; the first live checks recorded in the header and gap 3. Still awaiting the owner's sign-off. |
| 0.4 (draft) | 2026-10-06 | Model provider changed from Anthropic's Claude to Google's Gemini at the owner's request: §1, §4 and gaps 2, 7 and 12 rewritten for Google's terms. |
| 0.3 (draft) | 2026-10-06 | Crisis phone numbers checked against SCDF and Samaritans of Singapore; gap 4 closed. |
| 0.2 (draft) | 2026-10-05 | §1: Motus converses with the OARS techniques of motivational interviewing, as AURA's wellbeing coach does; stated as a style, not therapy. |
| 0.1 (draft) | 2026-10-05 | First draft, after the owner's AURA card and the IMDA Annex B format. Not signed, not in effect. |
