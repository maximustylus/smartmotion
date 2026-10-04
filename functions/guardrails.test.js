/*
  What these tests can and cannot say.

  They assert that the guardrail text REACHES the model and that the code
  controls fail closed. No test here can assert that the model FOLLOWS a rule
  in its prompt; that needs real turns, read by a person (MOTUS-GUARDRAILS.md
  §B and the info card's gaps). Run with: node --test
*/
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import {
  GUARDRAIL_PREAMBLE,
  GUARDRAIL_VERSION,
  PREAMBLE_RULE_IDS,
  screenInput,
  containsNric,
  readsAsCrisis,
  aiProvenance,
  MODEL_UNRECORDED,
  CRISIS_REPLY,
  NRIC_REFUSAL,
} from './guardrails.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

test('the preamble carries exactly the rule ids MOTUS-GUARDRAILS.md §B says it does', () => {
  const found = [...GUARDRAIL_PREAMBLE.matchAll(/^(P\d+|\d+)\s/gm)].map((m) => m[1])
  assert.deepEqual(found, [...PREAMBLE_RULE_IDS])
  const doc = readFileSync(join(root, 'MOTUS-GUARDRAILS.md'), 'utf8')
  const table = doc.slice(doc.indexOf('# §B'))
  for (const id of PREAMBLE_RULE_IDS) {
    const row = table.split('\n').find((l) => l.startsWith(`| **${id}**`))
    assert.ok(row, `§B has a row for ${id}`)
    assert.match(row, /PROMPT/, `§B says ${id} is carried by the prompt`)
  }
})

test('the preamble obeys its own house format: no em or en dashes', () => {
  assert.doesNotMatch(GUARDRAIL_PREAMBLE, /[—–]/)
  assert.match(GUARDRAIL_PREAMBLE, new RegExp(`v${GUARDRAIL_VERSION.replace('.', '\\.')}`))
})

test('the preamble reaches the model ahead of the persona and the knowledge base', () => {
  const src = readFileSync(join(root, 'functions/motus.js'), 'utf8')
  const sys = src.slice(src.indexOf('const system = ['))
  assert.ok(sys.indexOf('GUARDRAIL_PREAMBLE') < sys.indexOf('persona'))
  assert.ok(sys.indexOf('persona') < sys.indexOf('kb.map'))
})

test('the messages sent to the model never include a system turn', () => {
  const src = readFileSync(join(root, 'functions/motus.js'), 'utf8')
  assert.doesNotMatch(src, /role:\s*'system'/)
})

test('NRIC and FIN shapes are caught, lookalikes inside longer tokens are not', () => {
  for (const t of ['S1234567D', 'my id is t7654321z.', '(F1234567N)', 'G1234567X please']) assert.ok(containsNric(t), t)
  for (const t of ['NS1234567X', 'S12345678', 'S123456D', 'move 4 of 8', '']) assert.ok(!containsNric(t), t)
  assert.equal(containsNric(undefined), false)
})

test('crisis phrasing is answered with the fixed reply, never sent on', () => {
  for (const t of ['I want to kill myself', 'thinking about suicide', 'I keep hurting myself', 'I want to die', 'self-harm']) {
    const r = screenInput(t)
    assert.equal(r?.kind, 'crisis', t)
    assert.equal(r.reply, CRISIS_REPLY)
  }
  for (const t of ['kill the splash screen', 'this deadline will be the death of me', 'what is ADDIE?']) assert.equal(readsAsCrisis(t), false, t)
})

test('crisis wins over an identifier in the same message', () => {
  assert.equal(screenInput('S1234567D I want to die').kind, 'crisis')
  assert.equal(screenInput('my NRIC is S1234567D').reply, NRIC_REFUSAL)
  assert.equal(screenInput('Which workflow should I start with?'), null)
})

test('the fixed replies obey house format', () => {
  for (const t of [CRISIS_REPLY, NRIC_REFUSAL]) assert.doesNotMatch(t, /[—–!]/)
})

test('provenance records the model that answered, or says it was not recorded', () => {
  const p = aiProvenance('claude-opus-5-5', Date.UTC(2026, 9, 5, 4))
  assert.deepEqual(p, { tool: 'Smart Motion Motus', model: 'claude-opus-5-5', guardrails: GUARDRAIL_VERSION, generatedAt: '2026-10-05T04:00:00.000Z' })
  assert.equal(aiProvenance('').model, MODEL_UNRECORDED)
  assert.equal(aiProvenance(null).model, MODEL_UNRECORDED)
})

test('the handler answers a screened message without a key and without the model', async () => {
  const saved = process.env.ANTHROPIC_API_KEY
  delete process.env.ANTHROPIC_API_KEY
  const { motus } = await import('./motus.js')
  const out = []
  const res = {
    headers: {},
    statusCode: 200,
    setHeader(k, v) { this.headers[k] = v },
    status(c) { this.statusCode = c; return this },
    json(o) { out.push(o); return this },
    write(s) { out.push(s) },
    end() { this.ended = true },
  }
  await motus({ method: 'POST', headers: {}, socket: { remoteAddress: 'test' }, body: { messages: [{ role: 'user', content: 'my FIN is G1234567X' }] } }, res)
  if (saved !== undefined) process.env.ANTHROPIC_API_KEY = saved
  assert.equal(res.statusCode, 200)
  const events = out.filter((x) => typeof x === 'string').map((x) => JSON.parse(x.replace(/^data: /, '')))
  assert.equal(events[0].t, NRIC_REFUSAL)
  assert.equal(events[1].screened, 'identifier')
  assert.equal(events[1].provenance.model, 'none (fixed reply)')
  assert.ok(res.ended)
})

test('the knowledge base leaves out the unverified cost evidence', () => {
  const kb = JSON.parse(readFileSync(join(root, 'functions/kb.json'), 'utf8'))
  assert.ok(!kb.some((d) => d.path === 'content/cost-evidence.md'))
  assert.ok(kb.some((d) => d.path === 'MOTUS-INFO-CARD.md'), 'the info card is in the knowledge base')
})
