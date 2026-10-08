---
name: know-the-architecture
description: "Smart Motion move \"Understand the file system and architecture\". Use when your assistant is building an app and can see its files. Think of a resuscitation trolley: you did not build it, but you know which drawer holds what."
---

# Understand the file system and architecture

Version 1.0, 8 October 2026. Draft, awaiting sign-off by the owner, Muhammad Alif.
Built by scripts/build-skills.mjs from site/src/content/cheatsheets/know-the-architecture.md. Edit that file, not this one.

## How to run this skill

1. The prompt below has gaps in square brackets. Fill any gap the
   conversation already answers. Ask the person for the rest in one
   message, then wait for their answers.
2. Follow the prompt as if they had pasted it, with their answers in place.
3. Where the prompt says the person decides, stop and let them decide.

## The prompt

This project is [what it is, in one line]. I am [your role] and I do not write code, so use plain words and explain each technical term once.

Do not change anything yet. Look through this project's files. If you cannot see them, say so and stop. Do not guess.

Then:
1. Draw the folders as a tree, two levels deep. Beside each folder, write one line on what lives there and one on what does not belong there.
2. Name the file or folder I would open first to change each of these: the words people read, the look and layout, and what it does.
3. Where one file does more than one of those jobs, say so and propose how to split it.
4. Suppose I ask for this: [one small change, such as rewording one heading]. Which files should it touch, so I know where to check?

End by asking me the one question whose answer would most change the tree you drew.
