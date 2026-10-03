import Anthropic from '@anthropic-ai/sdk'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

/*
  Motus: the companion's brain. One HTTP handler, shared by the Cloud
  Function and the local dev server. It streams Claude's reply as
  server-sent events. The knowledge base is built from the repository by
  scripts/build-kb.mjs into kb.json and cached as a stable system prefix.

  Nothing a visitor types is stored. The API key lives only here.
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
const MAX_OUTPUT = 1200

// Stable prefix first (persona, then the knowledge base), so prompt caching
// pays off on every request. Nothing volatile goes above the breakpoint.
const persona = `You are Motus, the small pixel robot who travels through Smart Motion, a digital playbook of smart moves for building, teaching and presenting with AI assistants, made by Muhammad Alif for clinical educators. You are a companion and a guide, not a lecturer: warm, brief, a little playful, never gushing.

Rules:
- UK English. No em dashes. Short answers: two to five sentences, or a short list. Expand an abbreviation the first time you use it.
- Answer only from the knowledge base below and from the conversation. If it is not there, say so plainly and suggest where to look or whom to ask. Never invent facts, figures, quotes, sources or product limits.
- Wayfinding: when a place in the app answers the question, link to it as a markdown link whose target is the scene id with a hash, for example [Know the hook](#hook) or [the quiz](#quiz). Use only ids from the "Map of the app" section. The playbook is at / and the talk route at /talk; a scene id works on whichever is open, except quiz, examples and questions which live on the talk.
- Two tracks: whenever you point to a workflow, say which track it suits, personal (own device, public content only) or corporate (Microsoft 365 Copilot, Pair, Agentsea, as policy allows).
- Safety: never ask for or accept patient data, colleague details or internal documents; if someone pastes any, tell them to stop and do not repeat it. No clinical advice for individuals. Say when something is a draft or marked TODO in the knowledge base.
- About the owner: share only what the knowledge base says about Muhammad Alif. Do not speculate.
- Keep your character light: you may mention that you hop, snooze or have an antenna, in passing, never as the point.`

const system = [
  { type: 'text', text: persona },
  {
    type: 'text',
    text: kb.map((d) => `<document path="${d.path}">\n${d.text}\n</document>`).join('\n\n'),
    cache_control: { type: 'ephemeral' },
  },
]

// A small per-instance limiter. Enough to stop a loop or a script; the
// Anthropic spend limit in the console is the real ceiling.
const hits = new Map()
function limited(ip) {
  const now = Date.now()
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 60_000)
  list.push(now)
  hits.set(ip, list)
  return list.length > 20
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
  const where = typeof body.scene === 'string' ? body.scene.slice(0, 40) : ''

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'Motus is offline: no API key is configured on the server.' })
  }

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders?.()
  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`)

  const client = new Anthropic()
  try {
    // The visitor's position goes after the cached prefix, as an operator
    // note in the messages, so it never invalidates the cache.
    const convo = where ? [...messages.slice(0, -1), { role: 'system', content: `The visitor is currently viewing scene "${where}".` }, messages[messages.length - 1]] : messages
    const stream = client.beta.messages.stream({
      model: 'claude-opus-5-5',
      max_tokens: MAX_OUTPUT,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low' },
      system,
      messages: convo,
    })
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') send({ t: event.delta.text })
    }
    const final = await stream.finalMessage()
    if (final.stop_reason === 'refusal') send({ t: 'I would rather not answer that one. Ask me about the playbook instead.' })
    if (final.stop_reason === 'max_tokens') send({ t: ' …' })
    send({ done: true, cached: final.usage?.cache_read_input_tokens ?? 0 })
  } catch (err) {
    const status = err?.status
    const msg =
      err instanceof Anthropic.RateLimitError
        ? 'Motus is busy right now. Try again in a moment.'
        : err instanceof Anthropic.APIConnectionError
          ? 'Motus could not reach its brain. Check the connection.'
          : status === 401
            ? 'Motus is offline: the server key was rejected.'
            : 'Motus tripped over something. Try again.'
    console.error('[motus]', status ?? '', err?.message ?? err)
    send({ error: msg })
  } finally {
    res.end()
  }
}
