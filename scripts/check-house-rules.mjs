#!/usr/bin/env node
/*
  Checks the house rules on everything the public can read, before a deploy:
  the site's copy and pages, the prompts and skills, the owner's workflows
  (which the site links to), the archive, Motus's public card and Motus's
  knowledge base.

    no em or en dashes                  (CLAUDE.md: UK English, no dashes)
    no "patient" or "patients"          (owner's rule of 7 October 2026)

  Exits with 1 and lists every breach, so the deploy stops until it is
  fixed. Run it by hand from the repository root:

    node scripts/check-house-rules.mjs
*/
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SCOPE = ['site/src', 'site/index.html', 'skills', 'workflows', 'archive', 'MOTUS-INFO-CARD.md', 'functions/kb.json']
const TEXT = /\.(js|md|html|css|json|txt)$/
const RULES = [
  { name: 'em or en dash', test: /[–—]/ },
  { name: '"patient"', test: /\bpatients?\b/i },
]

const files = []
const walk = (p) => {
  if (statSync(p).isDirectory()) for (const f of readdirSync(p)) walk(join(p, f))
  else if (TEXT.test(p)) files.push(p)
}
for (const s of SCOPE) walk(join(root, s))

const breaches = []
for (const f of files) {
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    for (const r of RULES) if (r.test.test(line)) breaches.push(`${relative(root, f)}:${i + 1}  ${r.name}: ${line.trim().slice(0, 100)}`)
  })
}

if (breaches.length) {
  console.error(`House rules: ${breaches.length} breach(es) in ${files.length} files checked\n` + breaches.join('\n'))
  process.exit(1)
}
console.log(`House rules: ${files.length} files checked, no breaches`)
