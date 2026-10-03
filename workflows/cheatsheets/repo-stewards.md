# Cheat sheet: a repository as a governed knowledge base

This repository is itself an example. A coding assistant such as Claude Code or
OpenAI Codex does not rely on memory between sessions. It reads files in the
project folder. So the files are the knowledge base, and a few of them act as
stewards that keep the work honest.

You do not need to code to use the idea. The same pattern works in a
SharePoint library.

## The steward files

| Steward | File | What it holds | Question it answers |
|---|---|---|---|
| Brief | BRIEF.md | Purpose, audience, scope, definition of done | What are we building, and when is it finished? |
| Standing rules | CLAUDE.md (Claude Code) or AGENTS.md (Codex and others) | Rules the assistant reads at the start of every session | How must work be done here? |
| Front door | README.md | What this is and how to use it | Where do I start? |
| Version | A version line in each document, and release tags | Version number and date | Which one is current? |
| Change log | CHANGELOG.md | What changed, when and why | What is different from last time? |
| Quality control | QC checklist (for example QC.md) | Checks to pass before release | Is it fit to release? |
| Sources | references.md | Every source, in one citation style | Where did this claim come from? |
| Credits | CREDITS.md | Origin and licence of every logo, image and font | May we use this? |

## How the assistant uses them

1. It reads the standing rules and the brief before it writes anything.
2. It works in a branch, a private copy, so the live version is untouched.
3. Skills supply repeatable procedures, such as "run the quality checklist".
4. A second agent can act as reviewer, checking the work against the checklist
   and the brief.
5. It stops at each checkpoint, reports what is done, what is verified and
   what is still to do, and waits for a person to approve.
6. On approval, the change is merged, the version moves up, and the change log
   gets a line.

The assistant proposes. A person approves. That order never reverses.

## The same pattern without code

| In a repository | In SharePoint or OneDrive |
|---|---|
| README.md | A "Start here" page in the library |
| BRIEF.md | A one-page brief with the approver named |
| CLAUDE.md or AGENTS.md | The instructions you give your Pair assistant, Agentsea agent or Copilot |
| Branch | A draft copy |
| Merge after review | Approval, then publish |
| Version tag | Version history and a version table in the document |
| CHANGELOG.md | A change log table at the end of the document |
| QC checklist | A review checklist signed by the reviewer |

## A starter checklist for any release

- Does it meet the definition of done in the brief?
- Is every fact traceable to the sources file?
- Are there any placeholders or TODO markers left?
- Does it carry a version number and date?
- Is the change recorded in the change log?
- Has a named person approved it?

## Personal versus corporate

| | Personal track | Corporate track |
|---|---|---|
| Where the knowledge lives | A repository on GitHub, or a notebook | A SharePoint library or OneDrive folder |
| Who reads it | Claude Code, Codex and similar assistants | Copilot, Pair assistants, Agentsea agents |
| Version history | Built in | Built in |
| Suitable content | Public, non-sensitive | As policy allows |
