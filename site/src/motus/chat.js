/*
  The chat window above Motus. Streams replies from /api/motus. Links in a
  reply that point at a scene id navigate the story. The conversation lives
  in sessionStorage for this tab only and is never sent anywhere except
  with the next question.

  Governance, after the owner's NEXUS pattern (MOTUS-GUARDRAILS.md,
  MOTUS-INFO-CARD.md):
    - a first-use safety statement linking to the info card, until dismissed;
      the header's info button stays for good
    - the same identifier and crisis checks the server runs, imported from the
      server's own module so the two can never drift; a refused message is
      neither shown back, stored nor sent
    - each reply carries its provenance: the model that answered, the
      guardrail version and the time
*/

import { genieIn, genieOut } from '../lib/genie.js'
import { screenInput, GUARDRAIL_VERSION, NO_MODEL } from '../../../functions/guardrails.js'

// Versioned, so a materially revised card can show the notice again.
const NOTICE_KEY = 'smartmotion.motus.notice.v1'
const INFO = '/motus-info'

const KEY = 'smartmotion.motus'
const STARTERS = ['What is Smart Motion?', 'Which workflow should I start with?', 'Personal or corporate track?', 'Take me to the cheatsheets', 'What is ADDIE?']

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Markdown, the small subset Motus uses: paragraphs, bullet lists, bold, links.
function render(md) {
  const inline = (s) =>
    esc(s)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\((#[a-z0-9-]+|\/[a-z/#-]*|https?:\/\/[^\s)]+)\)/g, (_, text, href) => {
        const ext = href.startsWith('http')
        return `<a href="${href}"${ext ? ' target="_blank" rel="noopener"' : ' data-go'}>${text}</a>`
      })
  const blocks = md.trim().split(/\n{2,}/)
  return blocks
    .map((b) => {
      const lines = b.split('\n')
      if (lines.every((l) => /^\s*[-*]\s+/.test(l))) return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('')}</ul>`
      if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\s*\d+\.\s+/, ''))}</li>`).join('')}</ol>`
      return `<p>${inline(lines.join(' '))}</p>`
    })
    .join('')
}

export function openChat(host, { onTalking, onOpen }) {
  const panel = document.createElement('section')
  panel.className = 'mchat'
  panel.hidden = true
  panel.setAttribute('aria-label', 'Chat with Motus')
  panel.innerHTML = `
    <header class="mchat__head">
      <span class="mchat__lights">
        <button type="button" class="mchat__light mchat__light--close" aria-label="Close the chat"></button>
        <button type="button" class="mchat__light mchat__light--min" aria-label="Minimise the chat"></button>
        <button type="button" class="mchat__light mchat__light--max" aria-label="Maximise the chat"></button>
      </span>
      <span class="mchat__title"><span class="mchat__name">Motus</span><span class="mchat__where"></span></span>
      <a class="mchat__info" href="${INFO}" target="_blank" rel="noopener" aria-label="Motus info card: what it does, how it is kept safe, how your data is handled" title="Motus info card">i</a>
    </header>
    <div class="mchat__notice" role="note" hidden>
      <p>Motus is an AI companion. It can state wrong things confidently, so check what it tells you. It is not for medical advice or crises. Never enter patient, colleague or identifying details. <a href="${INFO}" target="_blank" rel="noopener">Info card</a></p>
      <button type="button" class="mchat__notice-x" aria-label="Dismiss the AI safety notice">Got it</button>
    </div>
    <div class="mchat__log" aria-live="polite"></div>
    <div class="mchat__starters"></div>
    <form class="mchat__form">
      <label class="visually-hidden" for="mchat-input">Ask Motus</label>
      <input id="mchat-input" type="text" autocomplete="off" maxlength="2000" placeholder="Ask about a move, a workflow, a framework…" data-own-keys>
      <button type="submit" class="btn" aria-label="Send">Send</button>
    </form>
    <p class="mchat__note">AI replies from the playbook. May be wrong. No patient data, ever. <a href="${INFO}" target="_blank" rel="noopener">How Motus works</a></p>
  `
  host.append(panel)
  const log = panel.querySelector('.mchat__log')
  const form = panel.querySelector('form')
  const input = panel.querySelector('input')
  const starters = panel.querySelector('.mchat__starters')
  const where = panel.querySelector('.mchat__where')
  const notice = panel.querySelector('.mchat__notice')
  // A browser that refuses storage sees the notice every time, which errs
  // towards showing a safety statement, not hiding it.
  try {
    notice.hidden = localStorage.getItem(NOTICE_KEY) === 'seen'
  } catch {
    notice.hidden = false
  }
  panel.querySelector('.mchat__notice-x').addEventListener('click', () => {
    notice.hidden = true
    try {
      localStorage.setItem(NOTICE_KEY, 'seen')
    } catch {
      /* it returns next time, the safe direction */
    }
  })

  let history = []
  try {
    history = JSON.parse(sessionStorage.getItem(KEY)) ?? []
  } catch {
    history = []
  }
  const save = () => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(history.slice(-12)))
    } catch {
      /* ignore */
    }
  }

  function add(role, text) {
    const el = document.createElement('div')
    el.className = `mchat__msg mchat__msg--${role}`
    el.innerHTML = role === 'assistant' ? render(text) : `<p>${esc(text)}</p>`
    log.append(el)
    log.scrollTop = log.scrollHeight
    return el
  }
  // Rule 12: which model answered, under which guardrails, when.
  function stamp(el, p) {
    if (!p) return
    const time = new Date(p.generatedAt)
    const when = Number.isNaN(+time) ? '' : ` · ${time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
    const who = p.model === NO_MODEL ? 'Fixed safety reply, no AI model' : `AI reply · ${p.model}`
    const line = document.createElement('p')
    line.className = 'mchat__prov'
    line.textContent = `${who} · guardrails v${p.guardrails}${when}`
    el.append(line)
  }
  for (const m of history) stamp(add(m.role, m.content), m.provenance)
  if (!history.length) add('assistant', 'Hello. I am Motus. I travel with you through Smart Motion. Ask me where things are, what a move means, or which workflow fits your track.')

  starters.innerHTML = STARTERS.map((s) => `<button type="button" class="chip">${s}</button>`).join('')
  starters.addEventListener('click', (e) => {
    const b = e.target.closest('button')
    if (b) ask(b.textContent)
  })

  log.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-go]')
    if (!a) return
    const href = a.getAttribute('href')
    if (href.startsWith('#')) {
      e.preventDefault()
      const id = href.slice(1)
      const scenes = window.story?.scenes ?? []
      const i = scenes.findIndex((s) => s.id === id)
      if (i >= 0) window.story.goTo(i, 0)
      else if (document.querySelector(`#scene-${id}`)) location.hash = href
      else location.href = `/talk${href}`
    }
  })

  let busy = false
  async function ask(text) {
    text = text.trim()
    if (!text || busy) return
    input.value = ''
    starters.hidden = true
    // Checked here before anything leaves the browser, and again on the
    // server. A refused message is not shown back, stored or sent.
    const screened = screenInput(text)
    if (screened) {
      add('user', screened.kind === 'identifier' ? '(message withheld: it looked like it held an identification number)' : text)
      stamp(add('assistant', screened.reply), { model: NO_MODEL, guardrails: GUARDRAIL_VERSION, generatedAt: new Date().toISOString() })
      return
    }
    busy = true
    add('user', text)
    history.push({ role: 'user', content: text })
    const el = add('assistant', '')
    el.classList.add('is-typing')
    onTalking?.(true)
    let reply = ''
    let provenance = null
    try {
      const res = await fetch('/api/motus', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-12).map(({ role, content }) => ({ role, content })), scene: window.story?.scenes?.[window.story.state.scene]?.id ?? '' }),
      })
      if (!res.ok) {
        let msg = 'Motus is offline right now.'
        try {
          msg = (await res.json()).error ?? msg
        } catch {
          /* keep default */
        }
        throw new Error(msg)
      }
      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let buf = ''
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        let i
        while ((i = buf.indexOf('\n\n')) >= 0) {
          const line = buf.slice(0, i).replace(/^data: /, '')
          buf = buf.slice(i + 2)
          if (!line) continue
          const ev = JSON.parse(line)
          if (ev.t) {
            reply += ev.t
            el.innerHTML = render(reply)
            log.scrollTop = log.scrollHeight
          }
          if (ev.error) throw new Error(ev.error)
          if (ev.done) provenance = ev.provenance ?? null
        }
      }
      if (!reply) throw new Error('Motus had nothing to say. Try again.')
      stamp(el, provenance)
      history.push({ role: 'assistant', content: reply, provenance })
      save()
    } catch (err) {
      el.innerHTML = `<p class="mchat__err">${esc(err.message)}</p>`
      history.pop()
    } finally {
      el.classList.remove('is-typing')
      onTalking?.(false)
      busy = false
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    ask(input.value)
  })
  panel.querySelector('.mchat__light--close').addEventListener('click', () => toggle(false))
  panel.querySelector('.mchat__light--min').addEventListener('click', () => {
    panel.classList.toggle('is-min')
    panel.classList.remove('is-max')
  })
  panel.querySelector('.mchat__light--max').addEventListener('click', () => {
    panel.classList.toggle('is-max')
    panel.classList.remove('is-min')
    log.scrollTop = log.scrollHeight
  })
  panel.querySelector('.mchat__head').addEventListener('dblclick', (e) => !e.target.closest('button') && panel.classList.toggle('is-max'))
  window.addEventListener('keydown', (e) => e.key === 'Escape' && !panel.hidden && toggle(false))

  // The window rises out of Motus, who sits beneath it, and pours back.
  function toggle(force) {
    const open = force ?? panel.hidden
    if (open === !panel.hidden) return
    host.classList.toggle('is-open', open)
    if (open) {
      onOpen?.()
      genieIn(panel, '86% 100%')
      input.focus({ preventScroll: true })
      log.scrollTop = log.scrollHeight
    } else genieOut(panel, '86% 100%')
  }

  return { toggle, setScene: (title) => (where.textContent = title ?? '') }
}
