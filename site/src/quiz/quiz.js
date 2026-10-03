import { gsap } from 'gsap'
import QRCode from 'qrcode'
import '../styles/quiz.css'
import { levels, question, types, PLAY_URL, AIRQ_URL } from './tools.js'

/*
  The icebreaker. Lives in section 1 of the story, one part per beat:
    beat 0  scan: QR code and link
    beat 1  part 1: tap the tools you know
    beat 2  part 2: which type are you
    beat 3  your result, sent to the room once
    beat 4  live room totals

  Part 1 is a self-placement on the four AI Ready Quiz levels; the full quiz
  is linked for attendees to take in their own time.

  Everything personal stays on this device. The room only ever receives
  three counters going up by one. One submission per device, remembered in
  localStorage. If the room cannot be reached the person still gets their
  result and the totals say so, never silently.
*/

const KEY = 'smartmotion.quiz'
const BASELINE = 'smartmotion.baseline'
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const store = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) ?? null
    } catch {
      return null
    }
  },
  set(v) {
    try {
      localStorage.setItem(KEY, JSON.stringify(v))
    } catch {
      /* private mode: lasts for this page only */
    }
  },
}

const todo = (text) => `<span class="todo">${text}</span>`
const levelLabel = (id) => levels[id - 1]?.label ?? todo(`Level ${id} label`)
const typeLabel = (id) => types[id - 1].label ?? todo(`Type ${id} name`)

export async function mountQuiz(sceneEl, { go }) {
  const beats = [...sceneEl.querySelectorAll('.beat')]
  const state = { level: null, type: null, result: store.get() }
  let room = null

  // ---------- Beat 0: QR ----------

  const qr = beats[0].querySelector('.qr')
  try {
    qr.innerHTML = await QRCode.toString(PLAY_URL, { type: 'svg', margin: 0, errorCorrectionLevel: 'M' })
  } catch {
    qr.textContent = PLAY_URL
  }

  // ---------- Beat 1: readiness level ----------

  const levelsEl = beats[1].querySelector('.options')
  levelsEl.innerHTML = levels
    .map(
      (l) => `<button type="button" class="option" data-level="${l.id}">
        <span class="option__label">${l.label}</span>
        <span class="option__hint">${l.hint}</span>
      </button>`,
    )
    .join('')
  levelsEl.addEventListener('click', (e) => {
    const b = e.target.closest('.option')
    if (!b) return
    state.level = +b.dataset.level
    go(2)
  })
  for (const a of sceneEl.querySelectorAll('[data-airq]')) a.href = AIRQ_URL

  // ---------- Beat 2: type ----------

  const options = beats[2].querySelector('.options')
  options.innerHTML = types
    .map(
      (t) => `<button type="button" class="option" data-type="${t.id}">
        <span class="option__label">${typeLabel(t.id)}</span>
        <span class="option__hint">${t.hint}</span>
      </button>`,
    )
    .join('')
  options.addEventListener('click', (e) => {
    const b = e.target.closest('.option')
    if (!b) return
    state.type = +b.dataset.type
    finish()
  })

  // ---------- Beat 3: result ----------

  const resultEl = beats[3].querySelector('.result')
  const status = beats[3].querySelector('.status')

  function renderResult() {
    const r = state.result
    resultEl.innerHTML = `
      <p class="result__line">You placed yourself at</p>
      <p class="result__big">${levelLabel(r.level)}</p>
      <p class="result__line">And you are</p>
      <p class="result__big">${typeLabel(r.type)}</p>
    `
    if (!reduce()) gsap.from(resultEl.children, { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' })
  }

  async function finish() {
    if (!state.level) {
      go(1)
      return
    }
    state.result = { level: state.level, type: state.type, sent: false }
    store.set(state.result)
    renderResult()
    go(3)
    status.textContent = 'Sending to the room…'
    try {
      room ??= await import('./room.js')
      await room.submit(state.result.level, state.result.type)
      state.result.sent = true
      store.set(state.result)
      status.textContent = 'Counted in the room totals.'
    } catch (err) {
      console.warn('[smartmotion] submission failed', err)
      status.innerHTML = 'Your result is on this device, but it could not reach the room. The totals will not include you.'
    }
  }

  // Already played on this device: skip straight to the result.
  if (state.result) {
    renderResult()
    status.textContent = state.result.sent ? 'Already counted in the room totals.' : 'Your earlier result did not reach the room.'
    for (const b of [beats[1], beats[2]]) {
      b.querySelector('.played').hidden = false
      b.querySelector('.played [data-go]').addEventListener('click', () => go(3))
      // No second go: the room only counts a device once.
      for (const el of b.querySelectorAll('.options')) el.hidden = true
    }
  }
  beats[3].querySelector('[data-next]').addEventListener('click', () => go(4))

  // ---------- Beat 4: live totals ----------

  const totalsEl = beats[4]
  const bars = {}
  for (const row of totalsEl.querySelectorAll('[data-key]')) bars[row.dataset.key] = row
  const note = totalsEl.querySelector('.totals__note')
  const subs = totalsEl.querySelector('[data-submissions]')
  let latest = null
  let baseline = {}
  try {
    baseline = JSON.parse(localStorage.getItem(BASELINE)) ?? {}
  } catch {
    baseline = {}
  }

  function render(t) {
    latest = t
    const shown = Object.fromEntries(Object.entries(t).map(([k, v]) => [k, Math.max(0, v - (baseline[k] ?? 0))]))
    const maxL = Math.max(1, shown.level_1, shown.level_2, shown.level_3)
    const maxT = Math.max(1, shown.type_1, shown.type_2, shown.type_3, shown.type_4)
    for (const [k, row] of Object.entries(bars)) {
      const v = shown[k]
      const share = v / (k.startsWith('level') ? maxL : maxT)
      const fill = row.querySelector('.bar__fill')
      const num = row.querySelector('.bar__num')
      const cur = +num.textContent || 0
      if (reduce()) {
        fill.style.transform = `scaleX(${share})`
        num.textContent = v
      } else {
        gsap.to(fill, { scaleX: share, duration: 1.1, ease: 'power3.out', overwrite: true })
        gsap.to({ n: cur }, { n: v, duration: 1.1, ease: 'power3.out', snap: 'n', onUpdate() { num.textContent = this.targets()[0].n } })
      }
    }
    subs.textContent = shown.submissions
    note.textContent = ''
  }

  let watching = false
  function watch() {
    if (watching) return
    watching = true
    note.textContent = 'Connecting to the room…'
    import('./room.js')
      .then((m) => {
        room = m
        m.watchTotals(render, (err) => {
          console.warn('[smartmotion] totals unavailable', err)
          note.textContent = 'Room totals are unavailable right now. Your own result still stands.'
        })
      })
      .catch(() => (note.textContent = 'Room totals are unavailable right now. Your own result still stands.'))
  }

  // Presenter reset: show totals from this moment on. Clients cannot clear
  // the counters, so the shared screen subtracts what was there before.
  window.addEventListener('smartmotion:reset-totals', () => {
    if (!latest) return
    baseline = { ...latest }
    try {
      localStorage.setItem(BASELINE, JSON.stringify(baseline))
    } catch {
      /* ignore */
    }
    render(latest)
    note.textContent = 'Totals reset on this screen.'
  })

  return {
    onBeat(bi) {
      if (bi === 4) watch()
    },
  }
}
