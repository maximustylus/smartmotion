// Builds functions/kb.json, Motus's knowledge base, from the repository.
// Run before deploying: node scripts/build-kb.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf8')
const docs = []
const add = (path, text) => docs.push({ path, text: text.trim() })

// content/cost-evidence.md is deliberately absent: its items are unverified
// and the brief says they must not appear, which includes Motus repeating them.
for (const f of ['README.md', 'design.md', 'BRIEF.md', 'HANDOVER.md', 'references.md', 'content/use-cases.md', 'content/profile.md', 'content/corporate-agents.md', 'content/cost-research.md', 'content/huang-maths.md', 'MOTUS-INFO-CARD.md']) {
  try { add(f, read(f)) } catch { /* optional */ }
}
for (const f of readdirSync(join(root, 'workflows')).filter((f) => f.endsWith('.md'))) add(`workflows/${f}`, read(`workflows/${f}`))
for (const f of readdirSync(join(root, 'workflows/cheatsheets'))) add(`workflows/cheatsheets/${f}`, read(`workflows/cheatsheets/${f}`))
for (const f of readdirSync(join(root, 'site/src/content/cheatsheets')).filter((f) => f.endsWith('.md'))) add(`site/src/content/cheatsheets/${f}`, read(`site/src/content/cheatsheets/${f}`))

// The app's own content, flattened to text, plus a map of scene ids.
const effort = JSON.parse(read('site/src/content/effort.json'))
const hm = (m) => (m == null ? 'not yet measured' : `${Math.floor(m / 60)} h ${m % 60} min`)
const FIG = { active: hm(effort.activeMinutes), elapsed: hm(effort.elapsedMinutes), commits: effort.commits, prompts: effort.prompts, sittings: effort.sittings }
// Copy carries two markers: [[TODO: ...]] for what the owner still owes,
// and {{figure}} for live effort figures. Flatten both for Motus.
const strip = (s) =>
  String(s)
    .replace(/<[^>]+>/g, '')
    .replace(/\[\[TODO:\s*([^\]]*?)\s*\]\]/g, '(TODO, not yet supplied: $1)')
    .replace(/\{\{(\w+)\}\}/g, (_, k) => FIG[k] ?? '')
    .replace(/\s+/g, ' ')
    .trim()
const { moves } = await import(join(root, 'site/src/content/moves.js'))
const { phases, eras } = await import(join(root, 'site/src/content/journey.js'))
const { routes } = await import(join(root, 'site/src/content/routes.js'))
const { copy } = await import(join(root, 'site/src/content/copy.js'))

add(
  'app/moves.md',
  moves.map((m, i) => `## Move ${i + 1}: ${m.name} (scene id: ${m.id}, phase: ${m.phase})\nAngle: ${strip(m.angle)}\n${strip(m.principle)}\nFramework: ${strip(m.framework.name)}. ${strip(m.framework.note)} Source: ${strip(m.framework.source ?? 'TODO')}\nWorked example: ${strip(m.example.title)}. ${strip(m.example.body)}\nPrompt to copy (${strip(m.promptHeading ?? '')}): site/src/content/cheatsheets/${m.cheatsheet}.md`).join('\n\n'),
)
add(
  'app/journey.md',
  `ADDIE phases, in order:\n${phases.map((p) => `- ${p.name} (scene id: phase${p.id}): ${p.line} Moves: ${p.moves.join(', ')}.${p.quote ? ` Quote: "${p.quote.text}" ${p.quote.who}, ${p.quote.source}.` : ''}`).join('\n')}\n\nEras between the phases:\n${eras.map((e) => `- ${e.title} (scene id: ${e.id}, ${e.years.join(' to ')}): ${e.line} Facts: ${e.facts.map((f) => `${f.year} ${f.text}`).join('; ')}.${e.quote ? ` Quote: "${e.quote.text}" ${e.quote.who}, ${e.quote.source}.` : ''}`).join('\n')}`,
)
const r = routes['gai-gai']
add(
  'app/map.md',
  `# Map of the app\n\nPlaybook at / : scene ids in order: cover, ${phases.flatMap((p) => [eras.find((e) => e.before === p.id)?.id, `phase${p.id}`, ...p.moves]).filter(Boolean).join(', ')}, routes.\n\nTalk route "${r.title}" at /talk (${r.event}, ${r.when.join(', ')}): scene ids in order: ${r.steps.map((s) => s.scene ?? s.era ?? s.move).join(', ')}. The quiz (scene id: quiz) is the icebreaker: place yourself on four levels of AI readiness, pick the type that sounds like you, then see the room's live, anonymous totals. /play opens the talk on the quiz.\n\nSpeaker: ${r.speaker.name}. ${r.speaker.roles.join('. ')}.\n\nKeys on the shared screen: arrows move between beats, O overview, T timer, B blackout, F full screen, D theme, Z reset room totals, ? help. Motus (that is you) sits at the bottom right; clicking you opens this chat.`,
)

add(
  'app/copy.md',
  `# The words around the moves

Tagline: ${copy.tagline}
Cover: ${copy.coverLead}
Every move has four beats: the move itself, then "${copy.beatLabels.framework}" (the framework behind it), "${copy.beatLabels.example}" (a worked example) and "${copy.beatLabels.cheatsheet}" (a prompt to copy).
Last page of the playbook: ${copy.closing.heading}. ${copy.closing.lead}
Last page of the talk: ${copy.questions.heading}. ${copy.questions.lead}

How this site was built (About, on the contact page): ${copy.about.aboutPara}
${copy.about.steps.map((st, i) => `${i + 1}. ${st.title}: ${st.body}`).join('\n')}
Effort so far, measured by the steward script: ${FIG.active} of active build time, ${FIG.elapsed} from first commit to latest, ${FIG.prompts} prompts from the owner, ${FIG.commits} commits.`,
)

writeFileSync(join(root, 'functions/kb.json'), JSON.stringify(docs, null, 1))
const chars = docs.reduce((n, d) => n + d.text.length, 0)
console.log(`kb.json: ${docs.length} documents, about ${Math.round(chars / 4)} tokens`)
