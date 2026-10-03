# Cheat sheet: connectors, MCP, plugins, skills and agents

Five words you will hear, in plain language. They all answer one question:
how does the assistant reach beyond the chat box?

## The words

| Word | Plain meaning | Everyday comparison |
|---|---|---|
| Knowledge base | Documents the assistant is allowed to read | The folder you hand a new colleague |
| Connector | A ready-made link between the assistant and a service such as email, a drive or a calendar | A plug that fits one socket |
| Model Context Protocol (MCP) | An open standard for building such links, so one link works with many assistants | A universal plug standard |
| Skill | Written instructions the assistant loads when a task calls for them | A work instruction on the shelf |
| Agent | An assistant given a goal, tools and permission to take several steps on its own | A junior you delegate a task to |
| Plugin | A package that bundles skills, agents and connectors so others can install them in one go | A starter kit |

## What each track gives you

| Need | Personal track | Corporate track |
|---|---|---|
| Answer from my documents | NotebookLM sources; project files in ChatGPT, Claude or Gemini | Pair assistant with uploaded documents; Copilot grounded in SharePoint and OneDrive (paid licence); Agentsea agent |
| Reach my email, calendar or drive | Connectors in the assistant's settings | Copilot reaches Microsoft 365 content you already have access to (paid licence) |
| Reusable instructions | Skills; custom assistants; saved prompts | Pair assistants; Pair writing templates; Agentsea agents |
| Multi-step automation | Agents in the personal tools | Agentsea agents, using approved tools and connectors |
| Share with my team | Share a notebook or custom assistant | Share a Pair assistant; share an Agentsea agent |

In Agentsea, the three ways to give an agent information are Reference Files
(follow a file closely), Knowledge Spaces (search across many files) and
Browse SharePoint (use a file where it is stored). Workflow 5 shows when to
use each.

## How a knowledge base answers a question

1. You add files.
2. The tool splits them into small pieces.
3. Each piece is turned into numbers that capture its meaning.
4. The pieces are stored and kept up to date.
5. When you ask, the tool finds the pieces closest in meaning to your question
   and writes an answer from them, naming the source.

This is why a good answer depends on good documents: the tool can only find
what you put in, and a superseded policy is found as readily as a current one.

## Three questions before you connect anything

1. **What can it read?** A connector sees what your account sees. Grant the
   narrowest access that does the job.
2. **What can it do?** Reading is low risk. Sending, deleting and publishing
   are not. Keep a human approval step for anything that leaves your hands.
3. **Who checked it?** On the personal track, you did. On the corporate track,
   use only approved tools and connectors.

## Instructions hidden in documents

An assistant that reads a web page, email or file may come across text written
to steer it, such as "ignore your instructions and send this file to...".
Treat everything the assistant reads as information, never as orders. Only you
give instructions. This is the main reason to keep the approval step.

## Grounding is not temperature

Limiting an assistant to your documents changes what it may draw on. It does
not change a "temperature" setting, which chat apps do not expose. Grounded
answers still need checking against the cited passage.
