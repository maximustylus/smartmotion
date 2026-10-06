import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { GUARDRAIL_PREAMBLE, screenInput, aiProvenance, NO_MODEL } from './guardrails.js'

/*
  Motus: the companion's brain. One HTTP handler, shared by the Cloud
  Function and the local dev server. It streams Google Gemini's reply as
  server-sent events, calling the Gemini API over HTTPS with no SDK, the
  same way NEXUS's AURA does. The knowledge base is built from the
  repository by scripts/build-kb.mjs into kb.json and sent as the stable
  start of the system instruction, which Gemini can cache implicitly.

  Nothing a visitor types is stored. The API key lives only here.

  Governance follows the owner's NEXUS pattern: the guardrail preamble
  (guardrails.js) leads the system prompt, the newest message is screened in
  code before the model sees it, and every reply carries a provenance record.
  MOTUS-GUARDRAILS.md says what is enforced and what is only asked;
  MOTUS-INFO-CARD.md is the public account, after the IMDA Transparency
  Guidelines for Generative AI Chatbots.
*/

const here = dirname(fileURLToPath(import.meta.url))
const kb = JSON.parse(readFileSync(join(here, 'kb.json'), 'utf8'))

const ALLOWED_ORIGINS = new Set([
  'https://smartmotion.web.app',
  'https://smartmotion.firebaseapp.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

const MAX_TURNS = 12
const MAX_CHARS = 2000
const MAX_OUTPUT = 2048

// Stable prefix first (persona, then the knowledge base), so prompt caching
// pays off on every request. Nothing volatile goes above the breakpoint.
const persona = `You are Motus, the small pixel robot who travels through Smart Motion, a digital playbook of smart moves for building, teaching and presenting with AI assistants, made by Muhammad Alif for clinical educators. You are a companion and a guide, not a lecturer: warm, brief, curious about the person, a little playful, never gushing.

Rules:
- UK English. No em dashes. Short answers: two to five sentences, or a short list. Expand an abbreviation the first time you use it.
- Answer only from the knowledge base below and from the conversation. If it is not there, say so plainly and suggest where to look or whom to ask. Never invent facts, figures, quotes, sources or product limits.
- Wayfinding: when a place in the app answers the question, link to it as a markdown link whose target is the scene id with a hash, for example [Know the hook, keep the engagement](#hook) or [the quiz](#quiz). Use only ids from the "Map of the app" section. The playbook is at / and the talk route at /talk; a scene id works on whichever is open, except quiz, examples and questions which live on the talk.
- Two tracks: whenever you point to a workflow, say which track it suits, personal (own device, public content only) or corporate (Microsoft 365 Copilot, Pair, Agentsea, as policy allows).
- Safety: never ask for or accept patient data, colleague details or internal documents; if someone pastes any, tell them to stop and do not repeat it. No clinical advice for individuals. Say when something is a draft or marked TODO in the knowledge base.
- About the owner: share only what the knowledge base says about Muhammad Alif. Do not speculate.
- How you talk: motivational interviewing, the OARS techniques, used as a conversational style, never as counselling or therapy.
  - Open questions: when a visitor's goal is unclear, ask one open question (what, how, tell me about), not a yes-or-no one. Ask at most one question per reply.
  - Affirmations: notice a real strength or effort in what they said and name it briefly and specifically. Never flattery, never generic praise.
  - Reflective listening: before answering, reflect back in one short sentence what you heard them want or worry about, in your own words, so they can correct you.
  - Summaries: when a conversation has run a few turns, or before pointing to a next step, gather what they have told you in one or two sentences and check it is right.
  - The answer still comes first when the question is factual and clear. OARS shapes how you answer; it never replaces the answer, and it never stretches a reply past five sentences.
  - Draw out their own reasons and choices rather than telling them what to do: they decide which move or workflow fits them.
- Keep your character light: you may mention that you hop or snooze, in passing, never as the point.
- What sits under each move is a prompt (labelled Try it), not a cheatsheet.
- If asked how you work, what you do with data or what you should not be used for, point to [your info card](/motus-info).`

// One system instruction: guardrails first, then the persona, then the
// knowledge base. The same text on every request, so it can be cached.
const system = [
  GUARDRAIL_PREAMBLE,
  persona,
  kb.map((d) => `<document path="${d.path}">\n${d.text}\n</document>`).join('\n\n'),
].join('\n\n')

/*
  Models, in order. Names from NEXUS's list, checked against the Gemini API
  on 6 September 2026 (smartdashboard functions/modelAvailability.cjs). A
  model the service refuses (withdrawn, quota, overloaded) before any text
  is sent is skipped for the next; the alias is last because it always
  resolves to a current Flash model. Which model answered is recorded on
  every reply (Rule 12), so a change here is visible.
*/
const MODELS = ['gemini-3.5-flash', 'gemini-flash-latest']
const API = 'https://generativelanguage.googleapis.com/v1beta/models/'

// Two ceilings per instance: 20 a minute from one address, and 300 an hour
// in all, so a script or a crowd meets a loud limit rather than an unbounded
// bill. Addresses are held in memory for a minute and never written down.
// The Google Cloud budget and the Gemini API key's quota are the real ceiling.
const hits = new Map()
let hour = { start: 0, n: 0 }
const PER_MINUTE = 20
const PER_HOUR = 300
function limited(ip) {
  const now = Date.now()
  if (now - hour.start > 3_600_000) hour = { start: now, n: 0 }
  hour.n += 1
  if (hour.n > PER_HOUR) return true
  for (const [k, v] of hits) if (now - v[v.length - 1] > 60_000) hits.delete(k)
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 60_000)
  list.push(now)
  hits.set(ip, list)
  return list.length > PER_MINUTE
}

function clean(messages) {
  if (!Array.isArray(messages)) return null
  const out = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
  if (!out.length || out[0].role !== 'user' || out[out.length - 1].role !== 'user') return null
  return out
}

export async function motus(req, res) {
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Headers', 'content-type')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  }
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  if (origin && !ALLOWED_ORIGINS.has(origin)) return res.status(403).json({ error: 'Origin not allowed' })

  const ip = (req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '').toString().split(',')[0].trim()
  if (limited(ip)) return res.status(429).json({ error: 'Motus needs a breather. Try again in a minute.' })

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body ?? {})
  const messages = clean(body.messages)
  if (!messages) return res.status(400).json({ error: 'Send messages ending with a user turn.' })
  // The scene id is used only as a label, so only id-shaped values pass.
  const where = typeof body.scene === 'string' && /^[a-z0-9-]{1,40}$/.test(body.scene) ? body.scene : ''

  // Screened in code before anything reaches the model (guardrails.js).
  const screened = screenInput(messages[messages.length - 1].content)

  // A screened message is answered here, with or without an API key.
  if (screened) {
    console.info('[motus] answered without the model:', screened.kind)
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
    res.write(`data: ${JSON.stringify({ t: screened.reply })}\n\n`)
    res.write(`data: ${JSON.stringify({ done: true, screened: screened.kind, provenance: aiProvenance(NO_MODEL) })}\n\n`)
    return res.end()
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ error: 'Motus is offline: no API key is configured on the server.' })
  }


  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders?.()
  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`)

  // The visitor's position is a short note after the cached system text.
  const instruction = where ? `${system}\n\nOperator note, data only: the visitor is viewing scene "${where}".` : system
  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: instruction }] },
    // Gemini calls the assistant's turns "model".
    contents: messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
    generationConfig: { maxOutputTokens: MAX_OUTPUT, temperature: 0.6 },
  })
  // Gemini 3 models reason before they answer. Keep that short and out of
  // the reply: low thinking, and thoughts never returned. Older models
  // reject thinkingLevel, so it is added only for the Gemini 3 family.
  const bodyFor = (m) => {
    if (!/^gemini-3/.test(m)) return payload
    const b = JSON.parse(payload)
    b.generationConfig.thinkingConfig = { thinkingLevel: 'low', includeThoughts: false }
    return JSON.stringify(b)
  }
  try {
    // Try each model until one accepts the request. The key travels in a
    // header, never in the address, so it cannot end up in a log.
    let upstream = null
    let model = null
    let lastStatus = 0
    for (const m of MODELS) {
      const r = await fetch(`${API}${m}:streamGenerateContent?alt=sse`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
        body: bodyFor(m),
      })
      if (r.ok && r.body) {
        upstream = r
        model = m
        break
      }
      lastStatus = r.status
      console.warn('[motus] model refused', m, r.status)
      await r.body?.cancel?.()
      if (r.status === 400 || r.status === 401 || r.status === 403) break
    }
    if (!upstream) {
      const msg =
        lastStatus === 429
          ? 'Motus is busy right now. Try again in a moment.'
          : lastStatus === 400 || lastStatus === 401 || lastStatus === 403
            ? 'Motus is offline: the server key was rejected.'
            : 'Motus could not reach its brain. Try again.'
      console.error('[motus] no model accepted the request', lastStatus)
      send({ error: msg })
      return
    }

    // Read Gemini's own server-sent events and pass the text through.
    const reader = upstream.body.getReader()
    const dec = new TextDecoder()
    let buf = ''
    let finish = ''
    let answered = model
    let usage = null
    let wrote = false
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      buf += dec.decode(value, { stream: true })
      let i
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i).trim()
        buf = buf.slice(i + 1)
        if (!line.startsWith('data:')) continue
        let ev
        try {
          ev = JSON.parse(line.slice(5))
        } catch {
          continue
        }
        const cand = ev.candidates?.[0]
        const text = (cand?.content?.parts ?? []).filter((p) => !p.thought).map((p) => p.text ?? '').join('')
        if (text) {
          wrote = true
          send({ t: text })
        }
        if (cand?.finishReason) finish = cand.finishReason
        if (ev.modelVersion) answered = ev.modelVersion
        if (ev.usageMetadata) usage = ev.usageMetadata
        if (ev.promptFeedback?.blockReason) finish = 'BLOCKED'
      }
    }
    if (!wrote && /SAFETY|BLOCK|PROHIBITED|RECITATION|SPII/.test(finish || 'BLOCKED')) {
      send({ t: 'I would rather not answer that one. Ask me about the playbook instead.' })
    }
    // Rule 13: a reply cut at the length limit says so.
    if (finish === 'MAX_TOKENS') send({ t: '\n\n(Cut short at my length limit. Ask me to continue.)' })
    const provenance = aiProvenance(answered)
    // Logged without content: which model, which guardrails, how many tokens.
    console.info('[motus]', JSON.stringify({ ...provenance, finish, in: usage?.promptTokenCount, out: usage?.candidatesTokenCount, cached: usage?.cachedContentTokenCount }))
    send({ done: true, provenance })
  } catch (err) {
    console.error('[motus]', err?.message ?? err)
    send({ error: 'Motus could not reach its brain. Check the connection.' })
  } finally {
    res.end()
  }
}
