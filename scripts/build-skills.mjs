#!/usr/bin/env node
/*
  Builds skills/ from the eight move prompts, so each prompt can also be
  installed as a Claude skill. The prompts in site/src/content/cheatsheets
  are the source: their words are copied unchanged, and nothing here may
  reword them. Run it from the repository root after editing a prompt:

    node scripts/build-skills.mjs

  Each skill's name is the prompt's file name. Its description is built
  from words already on the site: the move's name, the moment of use
  ("Paste this when ...") and the move's angle.
*/
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const VERSION = '1.0'
const DATE = '8 October 2026'
const STATUS = 'Signed off by the owner, Muhammad Alif, on 8 October 2026.'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { moves } = await import(join(root, 'site/src/content/moves.js'))

for (const m of moves) {
  const file = `site/src/content/cheatsheets/${m.cheatsheet}.md`
  const text = readFileSync(join(root, file), 'utf8')
  const [head, ...rest] = text.split(/\n---\n/)
  const prompt = rest.join('\n---\n').trim()
  const use = head.match(/^Paste this (.+?)\.?$/m)?.[1]
  if (!prompt || !use) throw new Error(`${file}: expected a "Paste this ..." line, then --- and the prompt`)
  const description = `Smart Motion move "${m.name}". Use ${use}. ${m.angle}`.replace(/\s+/g, ' ')
  const skill = `---
name: ${m.cheatsheet}
description: ${JSON.stringify(description)}
---

# ${m.name}

Version ${VERSION}, ${DATE}. ${STATUS}
Built by scripts/build-skills.mjs from ${file}. Edit that file, not this one.

## How to run this skill

1. The prompt below has gaps in square brackets. Fill any gap the
   conversation already answers. Ask the person for the rest in one
   message, then wait for their answers.
2. Follow the prompt as if they had pasted it, with their answers in place.
3. Where the prompt says the person decides, stop and let them decide.

## The prompt

${prompt}
`
  const out = join(root, 'skills', m.cheatsheet, 'SKILL.md')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, skill)
  console.log(`skills/${m.cheatsheet}/SKILL.md`)
}
