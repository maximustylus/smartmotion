import '../styles/story.css'
import { gsap } from 'gsap'
import { playbookScenes, routeScenes } from './build.js'
import { defaultRoute } from '../content/routes.js'
import { createScroll } from './scroll.js'
import { createHud } from './hud.js'
import { themeToggle, onThemeChange } from '../lib/theme.js'
import { createProfile } from './profile.js'

const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/*
  Smart Motion. One scroll story on every device, in two modes:
    playbook  the home, every move with its cheatsheet
    route     a guided path, such as the talk, with its quiz and time budget
*/
export function mount(root, { mode = 'playbook', route = defaultRoute } = {}) {
  const scenes = mode === 'route' ? routeScenes(route) : playbookScenes(route)
  document.title = mode === 'route' ? `${route.title} · Smart Motion` : 'Smart Motion'

  // The rail at the top: by time budget on a route, one segment per move at home.
  const railed = scenes.filter((s) => (mode === 'route' ? s.minutes > 0 : s.beats && !s.era && !s.className?.includes('scene--phase') && s.id !== 'cover' && s.id !== 'routes'))
  const moveScenes = scenes.filter((s) => s.phase && !s.className?.includes('scene--phase') && s.id !== 'quiz' && s.id !== 'examples')

  root.className = `app app--${mode}`
  root.innerHTML = `
    <div class="field" aria-hidden="true"></div>
    <div class="rail" aria-hidden="true">
      ${railed.map((s) => `<div class="rail__seg" data-scene="${s.id}" style="flex:${mode === 'route' ? s.minutes : 1}"><div class="rail__fill"></div></div>`).join('')}
    </div>
    <header class="topbar">
      <a class="wordmark" href="/" aria-label="Smart Motion"><svg class="mark" viewBox="60 110 392 300" aria-hidden="true"><defs><linearGradient id="mark-g" gradientUnits="userSpaceOnUse" x1="76" y1="0" x2="436" y2="0"><stop offset="0" stop-color="#FF1FB3"/><stop offset="0.36" stop-color="#FF6A5A"/><stop offset="0.68" stop-color="#FFD23F"/><stop offset="1" stop-color="#A6FF1F"/></linearGradient><mask id="mark-cut"><rect x="0" y="0" width="512" height="512" fill="#fff"/><polygon points="203,396 309,396 256,276" fill="#000"/></mask></defs><g mask="url(#mark-cut)" fill="url(#mark-g)"><polygon points="76,384 190,128 304,384"/><polygon points="208,384 322,128 436,384"/></g><circle cx="256" cy="276" r="7" fill="#FFF8E1"/></svg></a>
      <span class="topbar__spacer"></span>
    </header>
    <main class="story">
      ${scenes
        .map(
          (s) => `
        <section class="scene ${s.className ?? ''}" id="scene-${s.id}" data-form="${s.form}" data-phase="${s.phase ?? ''}"
          style="--beats:${s.beats.length}" aria-label="${escapeAttr(s.title)}">
          <div class="scene__pin">
            <div class="scene__copy">
              ${s.beats.map((b, k) => `<div class="beat" data-beat="${k}">${b.html}</div>`).join('')}
            </div>
          </div>
        </section>`,
        )
        .join('')}
    </main>
    <footer class="colophon"><span>&copy; Muhammad Alif 2026</span><span class="colophon__v">v${__APP_VERSION__}</span></footer>
    <div class="upgrade" aria-hidden="true"></div>
    <div class="cursor" aria-hidden="true"></div>
    <nav class="dots" aria-label="Beats in this scene"></nav>
    <div class="cue" aria-hidden="true"><span></span></div>
  `
  root.querySelector('.topbar').append(themeToggle())
  root.addEventListener('click', (e) => e.target.closest('[data-ask]') && motus?.openChat())
  createProfile(root.querySelector('.topbar'), root)
  const dots = root.querySelector('.dots')
  dots.addEventListener('click', (e) => {
    const b = e.target.closest('button')
    if (b) scroll.goTo(scroll.state.scene, +b.dataset.beat)
  })

  // The fidelity arc: how the picture is rendered moves with the eras,
  // from a 1960s dot matrix to today's soft high-resolution splats.
  const FIDELITY = { '': 0, wonder: 0, logic: 0.25, assistants: 0.5, chat: 0.75, agents: 1 }
  const CRISP = 0.6
  let lastFid = -1
  const fills = Object.fromEntries([...root.querySelectorAll('.rail__seg')].map((el) => [el.dataset.scene, el]))
  let field = null
  let motus = null
  const mounted = new Map()

  const scroll = createScroll(root, scenes, {
    onScene(si, bi, sceneChanged) {
      const s = scenes[si]
      const k = railed.indexOf(s)
      const mi = moveScenes.indexOf(s)
      // Scenes outside the rail count as "between" the last railed scene and the next.
      const done = k >= 0 ? k : railed.findIndex((r) => scenes.indexOf(r) > si)
      railed.forEach((r, j) => {
        const f = k >= 0 ? (j < k ? 1 : j === k ? (bi + 1) / s.beats.length : 0) : j < (done < 0 ? railed.length : done) ? 1 : 0
        fills[r.id].firstElementChild.style.transform = `scaleX(${f})`
        fills[r.id].classList.toggle('is-current', j === k)
      })
      hud?.onScene(si, bi)
      root.classList.toggle('at-cover', si === 0)
      if (sceneChanged || dots.childElementCount !== s.beats.length) {
        dots.innerHTML = s.beats.map((_, k) => `<button type="button" data-beat="${k}" aria-label="Beat ${k + 1}"></button>`).join('')
      }
      ;[...dots.children].forEach((d, k) => d.setAttribute('aria-current', k === bi))
      root.dataset.phase = s.phase ?? ''
      // The field's colour drifts era by era and stays until the next era.
      const era = s.era ?? [...scenes].slice(0, si).reverse().find((x) => x.era)?.era ?? ''
      if (root.dataset.era !== era) {
        root.dataset.era = era
        requestAnimationFrame(() => field?.theme())
        motus?.setFidelity(FIDELITY[era] ?? 1)
        // A scan passes over the picture as it changes resolution.
        if (sceneChanged && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          const bar = root.querySelector('.upgrade')
          gsap.fromTo(bar, { yPercent: -100, opacity: 1 }, { yPercent: 100, opacity: 1, duration: 1.1, ease: 'power2.inOut', overwrite: true, onComplete: () => gsap.set(bar, { opacity: 0 }) })
        }
        // Motus announces the era as the picture changes resolution.
        if (s.era) motus?.say(`${s.title}, ${s.beats[0]?.years ?? ''}`.replace(/, $/, ''), 3200)
      }
      // The era pages keep their period look, dot matrix included. Every
      // other page past the cover is drawn crisp, so the drawings read
      // clearly, and still softens towards splats in the later eras.
      const fid = s.era || !era ? FIDELITY[era] ?? 1 : Math.max(CRISP, FIDELITY[era] ?? 1)
      if (fid !== lastFid) {
        lastFid = fid
        field?.setFidelity(fid)
      }
      root.classList.toggle('field-dim', false)
      mounted.get(si)?.onBeat?.(bi)
      field?.morphTo(s.beats[bi]?.form ?? s.form, { anchor: s.beats[bi]?.anchor ?? s.anchor, enter: sceneChanged ? s.enter : undefined, slot: si * 3 + bi })
      if (sceneChanged) motus?.travel(si, scenes.length, s.title)
      if (sceneChanged && s.id === 'questions') setTimeout(() => motus?.say('Questions? Ask me, or ask the room.', 4000), 1200)
    },
    onProgress(si, p, pb) {
      if (si !== scroll.state.scene) return
      field?.setProgress(p)
      // Cover parallax: the copy lifts faster than the field.
      if (si === 0) {
        root.querySelector('#scene-cover .scene__copy')?.style.setProperty('--lift', String(p))
        field?.setParallax(p)
      } else field?.setParallax(0)
      // The utility formula collapses as you scroll through its framework beat.
      const s = scenes[si]
      const bi = scroll.state.beat
      if (s.id === 'test') field?.setCollapse(bi === 1 ? Math.min(1, Math.max(0, (pb - 0.25) / 0.6)) : bi > 1 ? 1 : 0)
      else field?.setCollapse(0)
      // Framework diagrams build with the scroll: the pyramid rises, the tree
      // grows down, the rings spread, the bar and timeline sweep across.
      const form = s.beats[bi]?.form ?? s.form
      const MODE = { pyramid: 1, tree: 2, rings: 3, bar: 4, timeline: 4, grid: 1, pair: 3, target: 3 }
      if (bi === 1 && s.phase && MODE[form]) field?.setReveal(MODE[form], Math.min(1, Math.max(0, 0.15 + pb * 1.4)))
      else field?.setReveal(0, 1)
    },
  })
  const hud = createHud(root, scenes, scroll)

  // The copy is readable before the field arrives. Three.js is its own chunk
  // and loads once the page has painted.
  document.fonts.ready.then(() => {
    scroll.start()
    // Interactive scenes attach their behaviour once the story is live.
    scenes.forEach((s, i) => {
      if (!s.mount) return
      s.mount(root.querySelector(`#scene-${s.id}`), { go: (bi) => scroll.goTo(i, bi) })
        .then((api) => {
          mounted.set(i, api)
          if (scroll.state.scene === i) api?.onBeat?.(scroll.state.beat)
        })
        .catch((err) => console.error('[smartmotion] scene failed to mount', s.id, err))
    })
    import('./field.js').then((m) => {
      field = m.createField(root.querySelector('.field'))
      window.field = field
      const cur = scenes[scroll.state.scene]
      field.morphTo(cur.beats[scroll.state.beat]?.form ?? cur.form, { instant: true, anchor: cur.beats[scroll.state.beat]?.anchor ?? cur.anchor, slot: scroll.state.scene * 3 + scroll.state.beat })
      field.setFidelity(lastFid < 0 ? (FIDELITY[root.dataset.era] ?? 1) : lastFid, { instant: true })
      onThemeChange(() => field.theme())
      root.classList.add('has-field')
    })
  })

  const todoCount = root.querySelectorAll('.story .todo').length
  if (todoCount) console.info(`[smartmotion] ${todoCount} TODO markers in visible content. Press O for the overview.`)

  // A small ring follows the pointer: the loupe, made visible. Pointer
  // devices only; it hides over anything you can press.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const ring = root.querySelector('.cursor')
    const pos = { x: -100, y: -100 }
    const cur = { x: -100, y: -100 }
    let shown = false
    window.addEventListener('pointermove', (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      const over = e.target.closest?.('button, a, input, textarea, .mchat, .pcard, .overlay, .motus')
      ring.classList.toggle('is-hidden', !!over)
      if (!shown) {
        shown = true
        ring.classList.add('is-on')
      }
    }, { passive: true })
    document.addEventListener('pointerleave', () => ring.classList.remove('is-on'))
    gsap.ticker.add(() => {
      cur.x += (pos.x - cur.x) * 0.22
      cur.y += (pos.y - cur.y) * 0.22
      ring.style.transform = `translate(${cur.x}px, ${cur.y}px) translate(-50%, -50%)`
    })
  }

  // Offer the install when the browser does, once, as a quiet chip.
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    if (root.querySelector('.install')) return
    const chip = document.createElement('button')
    chip.type = 'button'
    chip.className = 'install'
    chip.textContent = 'Keep Smart Motion on your home screen'
    chip.addEventListener('click', async () => {
      chip.remove()
      await e.prompt()
    })
    root.append(chip)
    setTimeout(() => chip.remove(), 20000)
  })

  // Motus joins once the story is live. Its chat reads the scene list.
  scroll.scenes = scenes
  window.story = scroll
  import('../motus/motus.js').then((m) => {
    motus = m.createMotus(root)
    onThemeChange(() => motus.theme())
    motus.travel(scroll.state.scene, scenes.length, scenes[scroll.state.scene].title)
    motus.setFidelity(FIDELITY[root.dataset.era] ?? 1)
    window.motus = motus
  })
}
