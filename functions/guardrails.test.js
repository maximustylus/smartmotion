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
  assert.match(src, /systemInstruction: \{ parts: \[\{ text: instruction \}\] \}/)
})

test('the messages sent to the model are user and model turns only, and the key never goes in the address', () => {
  const src = readFileSync(join(root, 'functions/motus.js'), 'utf8')
  assert.doesNotMatch(src, /role:\s*'system'/)
  assert.match(src, /role: m\.role === 'assistant' \? 'model' : 'user'/)
  assert.match(src, /'x-goog-api-key': process\.env\.GEMINI_API_KEY/)
  assert.doesNotMatch(src, /[?&]key=/)
  assert.doesNotMatch(src, /anthropic/i)
})

test('NRIC and FIN shapes are caught, lookalikes inside longer tokens are not', () => {
  for (const t of ['S1234567D', 'my id is t7654321z.', '(F1234567N)', 'G1234567X please', 'S 1234 567 D', 'S-1234567-D', 'IC: S 1 2 3 4 5 6 7 D', 'S.1234567.D', 'S1234567/D', 'Ｓ１２３４５６７Ｄ']) assert.ok(containsNric(t), t)
  for (const t of ['NS1234567X', 'S12345678', 'S123456D', 'move 4 of 8', 'call 9123 4567', 'S$1234567 budget', '']) assert.ok(!containsNric(t), t)
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
  const p = aiProvenance('gemini-3.5-flash', Date.UTC(2026, 9, 5, 4))
  assert.deepEqual(p, { tool: 'Smart Motion Motus', model: 'gemini-3.5-flash', guardrails: GUARDRAIL_VERSION, generatedAt: '2026-10-05T04:00:00.000Z' })
  assert.equal(aiProvenance('').model, MODEL_UNRECORDED)
  assert.equal(aiProvenance(null).model, MODEL_UNRECORDED)
})

test('the handler answers a screened message without a key and without the model', async () => {
  const saved = process.env.GEMINI_API_KEY
  delete process.env.GEMINI_API_KEY
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
  if (saved !== undefined) process.env.GEMINI_API_KEY = saved
  assert.equal(res.statusCode, 200)
  const events = out.filter((x) => typeof x === 'string').map((x) => JSON.parse(x.replace(/^data: /, '')))
  assert.equal(events[0].t, NRIC_REFUSAL)
  assert.equal(events[1].screened, 'identifier')
  assert.equal(events[1].provenance.model, 'none (fixed reply)')
  assert.ok(res.ended)
})

test('the knowledge base leaves out the unverified cost evidence', () => {
  const kb = JSON.parse(readFileSync(join(root, 'functions/kb.json'), 'utf8'))
  assert.ok(!kb.some((d) => /cost-evidence\.md$/.test(d.path)))
  assert.ok(kb.some((d) => d.path === 'MOTUS-INFO-CARD.md'), 'the info card is in the knowledge base')
})

test('the persona carries the four OARS techniques, as style, not therapy', () => {
  const src = readFileSync(join(root, 'functions/motus.js'), 'utf8')
  const persona = src.slice(src.indexOf('const persona'), src.indexOf('const system'))
  for (const t of ['Open questions', 'Affirmations', 'Reflective listening', 'Summaries']) assert.match(persona, new RegExp(t), t)
  assert.match(persona, /never as counselling or therapy/)
  assert.match(persona, /never replaces the answer/)
  assert.doesNotMatch(persona, /[\u2014\u2013]/)
})

// ---------- Gemini streaming, with the network replaced ----------

function fakeRes() {
  const out = []
  return {
    out,
    headers: {},
    statusCode: 200,
    setHeader(k, v) { this.headers[k] = v },
    flushHeaders() {},
    status(c) { this.statusCode = c; return this },
    json(o) { out.push(o); return this },
    write(s) { out.push(s) },
    end() { this.ended = true },
    events() { return out.filter((x) => typeof x === 'string').map((x) => JSON.parse(x.replace(/^data: /, ''))) },
  }
}
const sse = (...events) => new Response(events.map((e) => `data: ${JSON.stringify(e)}\r\n\r\n`).join(''), { status: 200 })
async function ask(fetchImpl, text = 'What is ADDIE?') {
  const savedFetch = globalThis.fetch
  const savedKey = process.env.GEMINI_API_KEY
  const calls = []
  globalThis.fetch = async (url, init) => { calls.push({ url: String(url), init }); return fetchImpl(calls.length) }
  process.env.GEMINI_API_KEY = 'test-key'
  const { motus } = await import('./motus.js')
  const res = fakeRes()
  await motus({ method: 'POST', headers: {}, socket: { remoteAddress: 'gem-' + Math.random() }, body: { messages: [{ role: 'user', content: text }], scene: 'hook' } }, res)
  globalThis.fetch = savedFetch
  if (savedKey === undefined) delete process.env.GEMINI_API_KEY
  else process.env.GEMINI_API_KEY = savedKey
  return { res, calls }
}

test('Gemini text streams through, and the model that answered is recorded', async () => {
  const { res, calls } = await ask(() => sse(
    { candidates: [{ content: { role: 'model', parts: [{ text: 'ADDIE is ' }] } }], modelVersion: 'gemini-3.5-flash-001' },
    { candidates: [{ content: { role: 'model', parts: [{ text: 'five phases.' }] }, finishReason: 'STOP' }], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 4 } },
  ))
  const ev = res.events()
  assert.equal(ev.filter((e) => e.t).map((e) => e.t).join(''), 'ADDIE is five phases.')
  assert.equal(ev.at(-1).done, true)
  assert.equal(ev.at(-1).provenance.model, 'gemini-3.5-flash-001')
  assert.match(calls[0].url, /gemini-3\.5-flash:streamGenerateContent\?alt=sse$/)
  assert.equal(calls[0].init.headers['x-goog-api-key'], 'test-key')
  const sent = JSON.parse(calls[0].init.body)
  assert.match(sent.systemInstruction.parts[0].text, /^GOVERNING RULES/)
  assert.match(sent.systemInstruction.parts[0].text, /viewing scene "hook"/)
  assert.deepEqual(sent.contents, [{ role: 'user', parts: [{ text: 'What is ADDIE?' }] }])
})

test('a refused model falls back to the alias; thought parts are never shown', async () => {
  const { res, calls } = await ask((n) => (n === 1 ? new Response('gone', { status: 404 }) : sse(
    { candidates: [{ content: { parts: [{ text: 'thinking...', thought: true }, { text: 'Hello.' }] }, finishReason: 'STOP' }] },
  )))
  assert.equal(calls.length, 2)
  assert.match(calls[1].url, /gemini-flash-latest/)
  const ev = res.events()
  assert.equal(ev.filter((e) => e.t).map((e) => e.t).join(''), 'Hello.')
  assert.equal(ev.at(-1).provenance.model, 'gemini-flash-latest')
})

test('a rejected key stops at once with a plain message', async () => {
  const { res, calls } = await ask(() => new Response('bad key', { status: 403 }))
  assert.equal(calls.length, 1)
  assert.equal(res.events().at(-1).error, 'Motus is offline: the server key was rejected.')
})

test('a reply cut at the length limit says so, and a blocked one gets a fixed line', async () => {
  const cut = await ask(() => sse({ candidates: [{ content: { parts: [{ text: 'Long answer' }] }, finishReason: 'MAX_TOKENS' }] }))
  assert.match(cut.res.events().filter((e) => e.t).map((e) => e.t).join(''), /Cut short at my length limit/)
  const blocked = await ask(() => sse({ promptFeedback: { blockReason: 'SAFETY' } }))
  assert.match(blocked.res.events().filter((e) => e.t).map((e) => e.t).join(''), /rather not answer/)
})

test('a body that is not JSON gets a plain 400, not a crash', async () => {
  const { motus } = await import('./motus.js')
  const res = fakeRes()
  await motus({ method: 'POST', headers: {}, socket: { remoteAddress: 'json-test' }, body: '{not json' }, res)
  assert.equal(res.statusCode, 400)
})

test('the persona gives no instruction to praise (Rule 11, v1.2)', () => {
  const src = readFileSync(join(root, 'functions/motus.js'), 'utf8')
  const persona = src.slice(src.indexOf('const persona'), src.indexOf('const system'))
  assert.match(persona, /without praise/)
  assert.match(persona, /never use exclamation marks/)
  assert.doesNotMatch(persona, /name it briefly and specifically/)
})
