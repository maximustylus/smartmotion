import { gsap } from 'gsap'
import { reducedMotion, timing } from '../lib/motion.js'
import { sections, totalMinutes } from './sections.js'

const NEXT_KEYS = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'])
const PREV_KEYS = new Set(['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'])

const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n))
const mmss = (ms) => {
  const t = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}

export function createDeck(root, slides) {
  const budgeted = sections.filter((s) => s.minutes > 0)

  root.className = 'presenter'
  root.innerHTML = `
    <div class="ambient" aria-hidden="true"></div>
    <main class="stage-wrap">
      <div class="stage" role="region" aria-roledescription="slide deck" aria-label="Slides">
        ${slides
          .map(
            (s, i) => `
          <section class="slide ${s.className ?? ''}" id="slide-${s.id}" data-section="${s.section}"
            aria-roledescription="slide" aria-label="${escapeAttr(`${i + 1} of ${slides.length}: ${s.title}`)}" inert>
            ${s.html}
          </section>`,
          )
          .join('')}
        <div class="progress" aria-hidden="true">
          ${budgeted
            .map(
              (s) => `<div class="progress__seg" data-section="${s.n}" style="flex:${s.minutes}"><div class="progress__fill"></div></div>`,
            )
            .join('')}
        </div>
      </div>
    </main>
    <div class="nav-buttons">
      <button type="button" data-nav="prev" aria-label="Previous">&larr;</button>
      <button type="button" data-nav="next" aria-label="Next">&rarr;</button>
    </div>
    <div class="hud" hidden></div>
    <div class="overlay overview" role="dialog" aria-label="Slide overview" hidden></div>
    <div class="overlay help" role="dialog" aria-label="Keyboard shortcuts" hidden></div>
    <div class="blackout" aria-hidden="true"></div>
    <p class="visually-hidden" aria-live="polite"></p>
  `

  const stage = root.querySelector('.stage')
  const els = [...root.querySelectorAll('.slide')]
  const fills = [...root.querySelectorAll('.progress__fill')]
  const hud = root.querySelector('.hud')
  const overview = root.querySelector('.overview')
  const help = root.querySelector('.help')
  const live = root.querySelector('[aria-live]')

  const stepCounts = slides.map(
    (s, i) => s.steps ?? Math.max(0, ...[...els[i].querySelectorAll('[data-step]')].map((e) => +e.dataset.step)),
  )

  let index = -1
  let step = 0
  let tl = null
  const stagePx = () => stage.clientWidth / 1920

  // ---------- Steps within a slide ----------

  function applySteps(animate) {
    const el = els[index]
    const def = slides[index]
    const ctx = { animate: animate && !reducedMotion(), px: stagePx() }
    if (def.step) return def.step(el, step, ctx)
    for (const item of el.querySelectorAll('[data-step]')) {
      const show = +item.dataset.step <= step
      if (!ctx.animate) {
        gsap.set(item, { autoAlpha: show ? 1 : 0, y: 0 })
      } else if (show && item.style.visibility === 'hidden') {
        gsap.fromTo(item, { autoAlpha: 0, y: timing.rise * ctx.px }, { autoAlpha: 1, y: 0, duration: 0.6, ease: timing.ease })
      } else if (!show) {
        gsap.to(item, { autoAlpha: 0, duration: 0.3 })
      }
    }
  }

  function setStep(n, animate = true) {
    n = clamp(n, 0, stepCounts[index])
    if (n === step) return
    step = n
    applySteps(animate)
  }

  // ---------- Slide transitions ----------

  function goTo(i, startStep = 0, { instant = false } = {}) {
    i = clamp(i, 0, slides.length - 1)
    if (i === index) return setStep(startStep)

    // A fast double tap should still land cleanly: finish the running transition first.
    if (tl) tl.progress(1).kill()

    const prevIndex = index
    const prevEl = els[prevIndex]
    const nextEl = els[i]
    const def = slides[i]
    const dir = i > prevIndex ? 1 : -1
    const reduce = instant || reducedMotion()

    if (prevEl) {
      slides[prevIndex].leave?.(prevEl)
      prevEl.inert = true
    }

    index = i
    step = clamp(startStep, 0, stepCounts[i])
    nextEl.inert = false
    applySteps(false)
    trackSection(def.section)
    updateChrome()

    const reveals = nextEl.querySelectorAll('[data-reveal]')
    tl = gsap.timeline({ onComplete: () => def.enter?.(nextEl, { px: stagePx() }) })

    if (reduce) {
      if (prevEl) tl.to(prevEl, { autoAlpha: 0, duration: instant ? 0 : 0.2 })
      tl.set(reveals, { opacity: 1, y: 0 })
      tl.to(nextEl, { autoAlpha: 1, duration: instant ? 0 : 0.3 })
      return
    }

    const px = stagePx()
    if (prevEl) {
      tl.to(prevEl, { autoAlpha: 0, y: -timing.rise * px * 0.5 * dir, duration: timing.slideOut, ease: 'power2.in' })
      tl.set(prevEl, { y: 0 })
    }
    tl.set(nextEl, { autoAlpha: 1 })
    tl.fromTo(
      reveals,
      { opacity: 0, y: timing.rise * px * dir },
      { opacity: 1, y: 0, duration: timing.reveal, stagger: timing.stagger, ease: timing.ease },
    )
  }

  const next = () => (step < stepCounts[index] ? setStep(step + 1) : goTo(index + 1))
  const prev = () => (step > 0 ? setStep(step - 1) : goTo(index - 1, Infinity))

  // ---------- Chrome: progress, URL, live region ----------

  const sectionRange = new Map()
  slides.forEach((s, i) => {
    const r = sectionRange.get(s.section) ?? { first: i, last: i }
    r.last = i
    sectionRange.set(s.section, r)
  })

  function updateChrome() {
    const cur = slides[index].section
    root.dataset.section = cur
    budgeted.forEach((s, k) => {
      let f = 0
      if (s.n < cur) f = 1
      else if (s.n === cur) {
        const r = sectionRange.get(s.n)
        f = (index - r.first + 1) / (r.last - r.first + 1)
      }
      fills[k].style.transform = `scaleX(${f})`
    })
    history.replaceState(null, '', `#${slides[index].id}`)
    live.textContent = `Slide ${index + 1} of ${slides.length}: ${slides[index].title}`
    if (!overview.hidden) renderOverview()
  }

  // ---------- Rehearsal timer (presenter only, hidden by default) ----------

  const timer = { start: null, section: 0, enteredAt: 0, spent: {} }

  function trackSection(n) {
    const now = performance.now()
    if (timer.start === null && n > 0) {
      timer.start = now
      timer.enteredAt = now
      timer.section = n
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
      hud.innerHTML = `Timer starts when you leave the title slide`
      return
    }
    const now = performance.now()
    const total = now - timer.start
    const s = sections[timer.section]
    const inSection = (timer.spent[timer.section] ?? 0) + (now - timer.enteredAt)
    const over = (ms, min) => (min && ms > min * 60000 ? 'over' : '')
    hud.innerHTML = `
      <span class="${over(total, totalMinutes)}"><strong>${mmss(total)}</strong> / ${totalMinutes}:00</span>
      <span>Part ${s.n}</span>
      <span class="${over(inSection, s.minutes)}"><strong>${mmss(inSection)}</strong> / ${s.minutes}:00</span>
    `
  }

  setInterval(renderHud, 500)

  // ---------- Overlays ----------

  function renderOverview() {
    const todoCount = stage.querySelectorAll('.todo').length
    overview.innerHTML = `
      <h2>Overview</h2>
      <p class="overlay__sub">${slides.length} slides. ${
        todoCount ? `<span class="todo">${todoCount} markers in visible content.</span>` : 'No TODO markers left.'
      } Press <kbd>Esc</kbd> to close.</p>
      ${sections
        .map((sec) => {
          const r = sectionRange.get(sec.n)
          if (!r) return ''
          const cards = slides
            .slice(r.first, r.last + 1)
            .map((s, k) => {
              const i = r.first + k
              const hasTodo = els[i].querySelector('.todo')
              return `<button type="button" class="overview__card" data-section="${sec.n}" data-go="${i}" aria-current="${i === index}">
                <span class="n">${i + 1}</span>
                <span class="t">${s.title}</span>
                ${hasTodo ? '<span class="todo">open</span>' : ''}
              </button>`
            })
            .join('')
          return `<section class="overview__section" data-section="${sec.n}">
            <h3>${sec.n ? `Part ${sec.n}: ` : ''}${sec.title}${sec.minutes ? `, ${sec.minutes} min` : ''}</h3>
            <div class="overview__grid">${cards}</div>
          </section>`
        })
        .join('')}
    `
  }

  help.innerHTML = `
    <h2>Keyboard shortcuts</h2>
    <p class="overlay__sub">Press <kbd>Esc</kbd> to close.</p>
    <dl>
      <dt><kbd>&rarr;</kbd> <kbd>&darr;</kbd> <kbd>Space</kbd> <kbd>PgDn</kbd>, scroll down</dt><dd>Next step or slide</dd>
      <dt><kbd>&larr;</kbd> <kbd>&uarr;</kbd> <kbd>PgUp</kbd>, scroll up</dt><dd>Previous step or slide</dd>
      <dt><kbd>Home</kbd> <kbd>End</kbd></dt><dd>First or last slide</dd>
      <dt><kbd>O</kbd></dt><dd>Overview, with TODO count</dd>
      <dt><kbd>T</kbd></dt><dd>Show or hide the rehearsal timer</dd>
      <dt><kbd>Shift</kbd> + <kbd>R</kbd></dt><dd>Reset the timer</dd>
      <dt><kbd>B</kbd> or <kbd>.</kbd></dt><dd>Black screen</dd>
      <dt><kbd>F</kbd></dt><dd>Full screen</dd>
      <dt><kbd>?</kbd></dt><dd>This help</dd>
    </dl>
  `

  function toggleOverlay(el, force) {
    const open = force ?? el.hidden
    for (const o of [overview, help]) o.hidden = true
    el.hidden = !open
    if (open && el === overview) {
      renderOverview()
      overview.querySelector('[aria-current="true"]')?.focus()
    }
  }

  overview.addEventListener('click', (e) => {
    const card = e.target.closest('[data-go]')
    if (!card) return
    toggleOverlay(overview, false)
    goTo(+card.dataset.go)
  })

  // ---------- Input ----------

  function ownsKeys(target) {
    return target.closest?.('input, textarea, select, [contenteditable], [data-own-keys]')
  }

  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || ownsKeys(e.target)) return
    const overlayOpen = !overview.hidden || !help.hidden

    if (e.key === 'Escape') return toggleOverlay(overview, false)
    if (e.key === 'o' || e.key === 'O') return toggleOverlay(overview)
    if (e.key === '?') return toggleOverlay(help)
    if (overlayOpen) return

    // Space and Enter would otherwise also press a focused button.
    if (NEXT_KEYS.has(e.key) || PREV_KEYS.has(e.key)) e.preventDefault()
    if (root.classList.contains('is-blackout') && (NEXT_KEYS.has(e.key) || PREV_KEYS.has(e.key))) {
      return root.classList.remove('is-blackout')
    }

    if (NEXT_KEYS.has(e.key)) next()
    else if (PREV_KEYS.has(e.key)) prev()
    else if (e.key === 'Home') goTo(0)
    else if (e.key === 'End') goTo(slides.length - 1)
    else if (e.key === 't' || e.key === 'T') {
      hud.hidden = !hud.hidden
      renderHud()
    } else if (e.key === 'R') {
      Object.assign(timer, { start: null, section: 0, enteredAt: 0, spent: {} })
      trackSection(slides[index].section)
      renderHud()
    } else if (e.key === 'b' || e.key === 'B' || e.key === '.') root.classList.toggle('is-blackout')
    else if (e.key === 'f' || e.key === 'F') {
      if (document.fullscreenElement) document.exitFullscreen()
      else document.documentElement.requestFullscreen?.().catch(() => {})
    }
  })

  // Scroll: one gesture moves one step. Trackpads fire a long tail of
  // inertial events, so stay locked until the wheel has gone quiet.
  let wheelAcc = 0
  let wheelLocked = false
  let wheelLockedUntil = 0
  let lastWheel = 0
  window.addEventListener(
    'wheel',
    (e) => {
      if (!overview.hidden || !help.hidden || ownsKeys(e.target)) return
      e.preventDefault()
      const now = performance.now()
      const gap = now - lastWheel
      lastWheel = now
      if (wheelLocked) {
        if (now < wheelLockedUntil || gap < 160) return
        wheelLocked = false
      }
      if (gap > 160) wheelAcc = 0
      wheelAcc += e.deltaY
      if (Math.abs(wheelAcc) > 50) {
        wheelAcc > 0 ? next() : prev()
        wheelAcc = 0
        wheelLocked = true
        wheelLockedUntil = now + 700
      }
    },
    { passive: false },
  )

  // Swipe, for touch screens.
  let touchX = null
  let touchY = null
  stage.addEventListener('touchstart', (e) => ([touchX, touchY] = [e.touches[0].clientX, e.touches[0].clientY]), {
    passive: true,
  })
  stage.addEventListener('touchend', (e) => {
    if (touchX === null) return
    const dx = e.changedTouches[0].clientX - touchX
    const dy = e.changedTouches[0].clientY - touchY
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? next() : prev()
    touchX = null
  })

  root.querySelector('[data-nav="prev"]').addEventListener('click', prev)
  root.querySelector('[data-nav="next"]').addEventListener('click', next)

  // Mouse controls appear only while the pointer moves.
  let controlsTimer
  window.addEventListener('mousemove', () => {
    root.classList.add('show-controls')
    clearTimeout(controlsTimer)
    controlsTimer = setTimeout(() => root.classList.remove('show-controls'), 2000)
  })

  // ---------- Start ----------

  const fromHash = () => {
    const i = slides.findIndex((s) => `#${s.id}` === location.hash)
    return i < 0 ? 0 : i
  }
  window.addEventListener('hashchange', () => goTo(fromHash(), 0, { instant: true }))
  goTo(fromHash(), 0, { instant: true })

  const todoCount = stage.querySelectorAll('.todo').length
  if (todoCount) console.info(`[smartmotion] ${todoCount} TODO markers in visible content. Press O for the overview.`)

  return { next, prev, goTo, get index() { return index }, get step() { return step } }
}
