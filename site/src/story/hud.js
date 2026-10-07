/*
  Presenter chrome: rehearsal timer, overview with TODO count, keyboard
  help, blackout and full screen. Hidden until asked for, so an attendee
  on a phone never sees it unless they go looking.
*/

import { genieIn, genieOut } from '../lib/genie.js'

const mmss = (ms) => {
  const t = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}

export function createHud(root, scenes, scroll) {
  const totalMinutes = scenes.reduce((sum, s) => sum + (s.minutes || 0), 0)
  root.insertAdjacentHTML(
    'beforeend',
    `
    <div class="hud" hidden></div>
    <div class="overlay overview" role="dialog" aria-label="Overview" hidden></div>
    <div class="overlay help" role="dialog" aria-label="Keyboard shortcuts" hidden></div>
    <div class="overlay qr-overlay" role="dialog" aria-label="Scan to play" hidden>
      <div class="qr-overlay__box"><a class="qr-link" href="/play" target="_blank" rel="noopener" aria-label="Open the quiz at smartmotion.web.app/play"><div class="qr qr--big" role="img" aria-label="QR code for smartmotion.web.app/play"></div></a><p class="qr-overlay__link"><a href="/play" target="_blank" rel="noopener">smartmotion.web.app/play</a></p><p class="overlay__sub">Press <kbd>Esc</kbd> to close.</p></div>
    </div>
    <div class="blackout" aria-hidden="true"></div>
    <p class="visually-hidden hud__live" aria-live="polite"></p>
  `,
  )
  const hud = root.querySelector('.hud')
  const overview = root.querySelector('.overview')
  const help = root.querySelector('.help')
  const qrOverlay = root.querySelector('.qr-overlay')
  let qrDrawn = false
  async function drawQr() {
    if (qrDrawn) return
    qrDrawn = true
    const { default: QRCode } = await import('qrcode')
    const { PLAY_URL } = await import('../quiz/tools.js')
    qrOverlay.querySelector('.qr').innerHTML = await QRCode.toString(PLAY_URL, { type: 'svg', margin: 0, errorCorrectionLevel: 'M' })
  }
  const live = root.querySelector(".hud__live")

  // ---------- Timer ----------

  const timer = { start: null, section: 0, enteredAt: 0, spent: {} }

  // n is the scene index. The clock starts when the cover is left.
  function trackSection(n) {
    const now = performance.now()
    if (timer.start === null && n > 0) {
      Object.assign(timer, { start: now, enteredAt: now, section: n })
      return
    }
    if (timer.start !== null && n !== timer.section) {
      timer.spent[timer.section] = (timer.spent[timer.section] ?? 0) + (now - timer.enteredAt)
      timer.section = n
      timer.enteredAt = now
    }
  }

  function renderHud() {
    if (hud.hidden) return
    if (timer.start === null) {
      hud.textContent = 'Timer starts when you leave the title'
      return
    }
    const now = performance.now()
    const total = now - timer.start
    const s = scenes[timer.section]
    const inSection = (timer.spent[timer.section] ?? 0) + (now - timer.enteredAt)
    const over = (ms, min) => (min && ms > min * 60000 ? 'over' : '')
    hud.innerHTML = `
      <span class="${over(total, totalMinutes)}"><strong>${mmss(total)}</strong> / ${totalMinutes}:00</span>
      <span>${s.title}</span>
      <span class="${over(inSection, s.minutes)}"><strong>${mmss(inSection)}</strong> / ${s.minutes || 0}:00</span>
    `
  }
  setInterval(renderHud, 500)

  // ---------- Overview ----------

  function renderOverview() {
    const { scene, beat } = scroll.state
    const todoCount = root.querySelectorAll('.story .todo').length
    overview.innerHTML = `
      <h2>Overview</h2>
      <p class="overlay__sub">${scenes.length} scenes. ${
        todoCount ? `<span class="todo">${todoCount} markers${root.classList.contains('app--clean') ? ', hidden on the shared screen (add ?todo to show)' : ' in visible content'}.</span>` : 'No TODO markers left.'
      } Press <kbd>Esc</kbd> to close.</p>
      <div class="overview__grid">
        ${scenes
          .map((s, i) => {
            const beats = root.querySelectorAll(`#scene-${s.id} .beat`)
            const hasTodo = root.querySelector(`#scene-${s.id} .todo`)
            return `<div class="overview__scene" aria-current="${i === scene}">
              <h3>${s.title}${s.minutes ? `<span>${s.minutes} min</span>` : ''}</h3>
              <div class="overview__beats">
                ${[...beats]
                  .map(
                    (b, k) => `<button type="button" data-go="${i}:${k}" aria-current="${i === scene && k === beat}">
                      <span class="n">${k + 1}</span>
                      <span class="t">${b.querySelector('h1, h2, h3')?.textContent ?? ''}</span>
                    </button>`,
                  )
                  .join('')}
                ${hasTodo ? '<span class="todo">open</span>' : ''}
              </div>
            </div>`
          })
          .join('')}
      </div>
    `
  }

  help.innerHTML = `
    <h2>Keyboard shortcuts</h2>
    <p class="overlay__sub">Press <kbd>Esc</kbd> to close.</p>
    <dl>
      <dt><kbd>&rarr;</kbd> <kbd>&darr;</kbd> <kbd>Space</kbd> <kbd>PgDn</kbd></dt><dd>Next beat</dd>
      <dt><kbd>&larr;</kbd> <kbd>&uarr;</kbd> <kbd>PgUp</kbd></dt><dd>Previous beat</dd>
      <dt><kbd>Home</kbd> <kbd>End</kbd></dt><dd>Title or last scene</dd>
      <dt>Scroll or swipe</dt><dd>Move freely</dd>
      <dt><kbd>O</kbd></dt><dd>Overview, with TODO count</dd>
      <dt><kbd>T</kbd></dt><dd>Show or hide the rehearsal timer</dd>
      <dt><kbd>Shift</kbd> + <kbd>R</kbd></dt><dd>Reset the timer</dd>
      <dt><kbd>B</kbd> or <kbd>.</kbd></dt><dd>Black screen</dd>
      <dt><kbd>F</kbd></dt><dd>Full screen</dd>
      <dt><kbd>Q</kbd></dt><dd>Show the QR code for the quiz, large</dd>
      <dt><kbd>D</kbd></dt><dd>Dark or light</dd>
      <dt><kbd>Z</kbd></dt><dd>Reset the room totals shown on this screen</dd>
      <dt><kbd>?</kbd></dt><dd>This help</dd>
    </dl>
  `

  function toggleOverlay(el, force) {
    const open = force ?? el.hidden
    for (const o of [overview, help, qrOverlay]) if (o !== el && !o.hidden) genieOut(o, '50% 0%')
    document.documentElement.classList.toggle('overlay-open', open)
    if (open) {
      if (el === overview) renderOverview()
      genieIn(el, '50% 0%', () => el === overview && overview.querySelector('button[aria-current="true"]')?.focus())
    } else genieOut(el, '50% 0%')
  }

  overview.addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]')
    if (!b) return
    const [si, bi] = b.dataset.go.split(':').map(Number)
    toggleOverlay(overview, false)
    scroll.goTo(si, bi)
  })

  // ---------- Keys ----------

  // A click with the mouse (not the keyboard) leaves no focus behind on the
  // story's buttons and links, so Space and Enter go back to moving the talk.
  root.addEventListener('click', (e) => {
    if (e.detail === 0) return
    const t = e.target.closest?.('button, a[href]')
    if (t) setTimeout(() => t.blur(), 0)
  })

  const NEXT = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'])
  const PREV = new Set(['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'])
  const ownsKeys = (t) => t.closest?.('input, textarea, select, button, a[href], summary, [role=button], [contenteditable], [data-own-keys]')

  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    // A video or link window is open: it owns the keys (Esc closes it).
    if (document.querySelector('.lightbox:not([hidden])')) return
    if (e.target.closest?.('input, textarea, select, [contenteditable]')) return
    // A focused button or link keeps Enter and Space for itself. The
    // presenter's letter keys still work after a click has left focus there.
    if (ownsKeys(e.target) && (e.key === 'Enter' || e.key === ' ')) return
    if (e.target.closest?.('[data-own-keys]') && !NEXT.has(e.key) && !PREV.has(e.key) && e.key !== 'Escape') return
    const overlayOpen = !overview.hidden || !help.hidden || !qrOverlay.hidden

    if (e.key === 'Escape') return [overview, help, qrOverlay].forEach((o) => !o.hidden && toggleOverlay(o, false))
    if (e.key === 'o' || e.key === 'O') return toggleOverlay(overview)
    if (e.key === '?') return toggleOverlay(help)
    if (e.key === 'q' || e.key === 'Q') {
      drawQr()
      return toggleOverlay(qrOverlay)
    }
    if (overlayOpen) return

    if (NEXT.has(e.key) || PREV.has(e.key)) e.preventDefault()
    if (root.classList.contains('is-blackout') && (NEXT.has(e.key) || PREV.has(e.key))) {
      return root.classList.remove('is-blackout')
    }
    if (NEXT.has(e.key)) scroll.next()
    else if (PREV.has(e.key)) scroll.prev()
    else if (e.key === 'Home') scroll.goTo(0)
    else if (e.key === 'End') scroll.goTo(scenes.length - 1)
    else if (e.key === 't' || e.key === 'T') {
      hud.hidden = !hud.hidden
      renderHud()
    } else if (e.key === 'R') {
      Object.assign(timer, { start: null, section: 0, enteredAt: 0, spent: {} })
      trackSection(scroll.state.scene)
      renderHud()
    } else if (e.key === 'b' || e.key === 'B' || e.key === '.') root.classList.toggle('is-blackout')
    else if (e.key === 'f' || e.key === 'F') {
      if (document.fullscreenElement) document.exitFullscreen()
      else document.documentElement.requestFullscreen?.().catch(() => {})
    } else if (e.key === 'd' || e.key === 'D') root.querySelector('.theme-toggle')?.click()
    else if (e.key === 'z' || e.key === 'Z') window.dispatchEvent(new Event('smartmotion:reset-totals'))
  })


  // Mouse controls appear only while the pointer moves.
  let controlsTimer
  window.addEventListener('mousemove', () => {
    root.classList.add('show-controls')
    clearTimeout(controlsTimer)
    controlsTimer = setTimeout(() => root.classList.remove('show-controls'), 2000)
  })

  return {
    onScene(si, bi) {
      const s = scenes[si]
      trackSection(si)
      live.textContent = `${s.title}, beat ${bi + 1}`
      if (!overview.hidden) renderOverview()
    },
  }
}
