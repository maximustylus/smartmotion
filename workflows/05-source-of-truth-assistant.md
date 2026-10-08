# Workflow 5: Source-of-truth assistant

Build an assistant that answers only from documents you choose, shows where
each answer came from, and says "not found" instead of guessing. Useful for a
course handbook, a set of protocols, accreditation standards or a programme's
past papers.

## First, a correction to a common idea

People say this "controls the temperature". It does not. Temperature is a
setting for how varied a model's wording is, and chat apps do not let you
change it. What you control here is **grounding**: which documents the
assistant may use. Grounding reduces invented answers. It does not remove
them, so you still check.

## Before you start

You need:
- The documents, in their current approved versions
- One owner who keeps the set up to date
- Three test questions with known answers, and one question the documents
  cannot answer

## Step 1: Curate the sources

Fewer, current documents beat a large dump. For each document, record:

| Document | Version | Date | Owner | Supersedes |
|---|---|---|---|---|

Remove drafts and superseded versions. If two documents contradict each other,
resolve it now; the assistant will not.

## Step 2: Load them

**Personal track (public material only).** Create a notebook in NotebookLM, or
a project in another assistant, and add the documents as sources. NotebookLM
answers from your sources and cites the passage it used.

**Corporate track.** Choose where your documents already live:
- **Pair:** create an assistant and upload the documents to it. You can share
  the assistant with your team.
- **Microsoft 365 Copilot with the paid licence:** keep the documents in a
  SharePoint library or OneDrive folder and ask Copilot questions grounded in
  your work files.
- **Agentsea:** build an agent and give it information in one of three ways.

  | You want the agent to | Use | Good for |
  |---|---|---|
  | Follow a file closely | Reference Files (upload, or pick from SharePoint; up to 10 files, 30 MB each) | Templates, sample outputs, style guides, a single short policy |
  | Search across many files | A Knowledge Space attached to the agent | Department procedures, policy libraries, question-and-answer collections |
  | Use a file where it already lives | Browse SharePoint | A work document or folder needed for the task in hand |

  A Knowledge Space has its own access settings (owners, viewers, private or
  public), so decide who may see it when you create it. The agent can only
  open SharePoint files that you are authorised to view. Only add documents
  classified up to Restricted / Sensitive Normal.

  Source: Agentsea in-app guidance, seen 3 October 2026. TODO: confirm these
  figures are current and may be published.

A shared link is not the same as a loaded source. TODO: test whether your tool
can read a document from a short link (for example a for.sg link) or whether
the file itself must be uploaded. Assume upload until tested.

## Step 3: Set the rules

Paste this as the assistant's instructions:

```
You answer questions about [TOPIC] for [AUDIENCE].
Use only the documents provided. Do not use outside knowledge.
For every answer, name the document and section it came from.
If the documents do not contain the answer, reply "Not found in the sources"
and suggest who to ask: [CONTACT OR ROLE].
If two documents disagree, show both and say which is more recent.
Do not give clinical advice about any individual's care.
```

## Step 4: Test before you share

Ask your three known-answer questions and your one unanswerable question.

- Did it answer correctly, with the right document named?
- Did it say "Not found" for the unanswerable one?
- Open each cited passage and confirm it says what the assistant claims.

If any test fails, fix the sources or the rules and test again.

## Step 5: Keep it current

- When a document changes, replace it in the assistant the same day.
- Keep a short change log: date, what changed, who changed it.
- Re-run the four test questions after every change.

## Check before you use it

- Is every source a current, approved version?
- May these documents be loaded into this tool under your data policy?
- Does the assistant name its sources every time?
- Is there a named owner and a review date?

## Where this came from

I keep course and project sources in a notebook so that answers stay tied to
the documents, and I use the same curate, load, rule, test and maintain steps
when building assistants for programme accreditation.
