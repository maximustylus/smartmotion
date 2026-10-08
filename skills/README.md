# Smart Motion skills

Version 1.0, 8 October 2026. Draft, awaiting sign-off by the owner,
Muhammad Alif.

The eight prompts from Smart Motion's moves, packaged as Claude skills. A
skill is a folder Claude reads when your request matches it, so you do not
have to find and paste the prompt yourself. The words are the same as the
prompt under each move at smartmotion.web.app.

| Skill | Move | Use it |
|---|---|---|
| begin-with-the-end | Begin with the end in mind | when all you have is an idea |
| have-an-angle | Have an angle | before you ask for another version |
| know-the-hook | Know the hook, keep the engagement | when you sit down to prepare a session |
| know-the-architecture | Understand the file system and architecture | when your assistant is building an app and can see its files |
| build-on-frameworks | Build on solid frameworks | while your quiz or feedback form is still a draft |
| use-it-safely | Use it safely | before you share anything an assistant helped you make |
| test-with-utility | Test it with the utility formula | before you commit to a tool, yours or anyone else's |
| reality-check | Reality check | before you promise the demo to anyone |

## Install

In Claude Code, copy a skill's folder (or all eight) into one of these:

- `.claude/skills/` inside a project, for that project only
- `~/.claude/skills/` in your home folder, for every project

Start a new session. Ask in your own words, for example "help me find my
angle for this poster", or type the skill's name after a slash, such as
`/have-an-angle`.

In the Claude apps, where your plan offers skills, add a skill by uploading
its folder as a zip file from Settings. The menu names can change; Claude's
own help pages have the current steps.

## What a skill does

Each prompt has gaps in square brackets, such as [who it is for]. The skill
tells Claude to fill the gaps the conversation already answers, ask you for
the rest in one message, then follow the prompt. Where the prompt says you
decide, Claude stops and lets you.

## Personal and corporate tracks

These skills are for Claude. On the corporate track (Microsoft 365
Copilot, Pair, Agentsea), use the same prompts by copy and paste from the
site; they work in any assistant. Paste only what your track allows.

## For maintainers

The prompts in `site/src/content/cheatsheets/` are the source. After
editing one, rebuild the skills from the repository root:

    node scripts/build-skills.mjs

Do not edit a `SKILL.md` by hand; the next build overwrites it.
