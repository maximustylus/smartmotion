import '../styles/story.css'
import { playbookScenes, routeScenes } from './build.js'
import { defaultRoute } from '../content/routes.js'
import { createScroll } from './scroll.js'
import { createHud } from './hud.js'
import { themeToggle, onThemeChange } from '../lib/theme.js'

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
      <a class="wordmark" href="/"><svg class="mark" viewBox="60 110 392 300" aria-hidden="true"><defs><linearGradient id="mark-g" gradientUnits="userSpaceOnUse" x1="76" y1="0" x2="436" y2="0"><stop offset="0" stop-color="#FF1FB3"/><stop offset="0.36" stop-color="#FF6A5A"/><stop offset="0.68" stop-color="#FFD23F"/><stop offset="1" stop-color="#A6FF1F"/></linearGradient><mask id="mark-cut"><rect x="0" y="0" width="512" height="512" fill="#fff"/><polygon points="203,396 309,396 256,276" fill="#000"/></mask></defs><g mask="url(#mark-cut)" fill="url(#mark-g)"><polygon points="76,384 190,128 304,384"/><polygon points="208,384 322,128 436,384"/></g><circle cx="256" cy="276" r="7" fill="#FFF8E1"/></svg>Smart Motion</a>
      <span class="topbar__tag" aria-hidden="true"></span>
      <a class="topbar__switch" href="${mode === 'route' ? '/' : '/talk'}">${mode === 'route' ? 'Playbook' : route.title}</a>
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
    <nav class="dots" aria-label="Beats in this scene"></nav>
    <div class="counter" aria-hidden="true"><span class="counter__n">01</span><span class="counter__of">/ ${String(scenes.length).padStart(2, '0')}</span></div>
    <div class="cue" aria-hidden="true"><span></span></div>
  `
  root.querySelector('.topbar').append(themeToggle())
  const dots = root.querySelector('.dots')
  const counterN = root.querySelector('.counter__n')
  dots.addEventListener('click', (e) => {
    const b = e.target.closest('button')
    if (b) scroll.goTo(scroll.state.scene, +b.dataset.beat)
  })

  const fills = Object.fromEntries([...root.querySelectorAll('.rail__seg')].map((el) => [el.dataset.scene, el]))
  const tag = root.querySelector('.topbar__tag')
  let field = null
  let motus = null
  const mounted = new Map()

  const scroll = createScroll(root, scenes, {
    onScene(si, bi, sceneChanged) {
      const s = scenes[si]
      const k = railed.indexOf(s)
      const mi = moveScenes.indexOf(s)
      tag.textContent = s.era
        ? `The journey · ${s.title}`
        : s.className?.includes('scene--phase')
          ? `ADDIE · ${s.title}`
          : mi >= 0
            ? `Move ${mi + 1} of ${moveScenes.length}`
            : k >= 0 && mode === 'route'
              ? `${k + 1} of ${railed.length}`
              : ''
      // Scenes outside the rail count as "between" the last railed scene and the next.
      const done = k >= 0 ? k : railed.findIndex((r) => scenes.indexOf(r) > si)
      railed.forEach((r, j) => {
        const f = k >= 0 ? (j < k ? 1 : j === k ? (bi + 1) / s.beats.length : 0) : j < (done < 0 ? railed.length : done) ? 1 : 0
        fills[r.id].firstElementChild.style.transform = `scaleX(${f})`
        fills[r.id].classList.toggle('is-current', j === k)
      })
      hud?.onScene(si, bi)
      counterN.textContent = String(si + 1).padStart(2, '0')
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
      }
      root.classList.toggle('field-dim', false)
      mounted.get(si)?.onBeat?.(bi)
      field?.morphTo(s.beats[bi]?.form ?? s.form)
      if (sceneChanged) motus?.travel(si, scenes.length, s.title)
    },
    onProgress(si, p) {
      if (si === scroll.state.scene) field?.setProgress(p)
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
      const cur = scenes[scroll.state.scene]
      field.morphTo(cur.beats[scroll.state.beat]?.form ?? cur.form, { instant: true })
      onThemeChange(() => field.theme())
      root.classList.add('has-field')
    })
  })

  const todoCount = root.querySelectorAll('.story .todo').length
  if (todoCount) console.info(`[smartmotion] ${todoCount} TODO markers in visible content. Press O for the overview.`)

  // Motus joins once the story is live. Its chat reads the scene list.
  scroll.scenes = scenes
  window.story = scroll
  import('../motus/motus.js').then((m) => {
    motus = m.createMotus(root)
    onThemeChange(() => motus.theme())
    motus.travel(scroll.state.scene, scenes.length, scenes[scroll.state.scene].title)
  })
}
