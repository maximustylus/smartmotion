import '../styles/story.css'
import { scenes } from './scenes.js'
import { sections } from './sections.js'
import { createScroll } from './scroll.js'
import { createHud } from './hud.js'
import { themeToggle, onThemeChange } from '../lib/theme.js'

const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

export function mount(root) {
  document.title = 'GAi GAi with me'
  const budgeted = sections.filter((s) => s.minutes > 0)

  root.className = 'app'
  root.innerHTML = `
    <div class="field" aria-hidden="true"></div>
    <div class="rail" aria-hidden="true">
      ${budgeted.map((s) => `<div class="rail__seg" data-section="${s.n}" style="flex:${s.minutes}"><div class="rail__fill"></div></div>`).join('')}
    </div>
    <header class="topbar">
      <a class="wordmark" href="#s0">GAi GAi with me</a>
      <span class="topbar__tag" aria-hidden="true"></span>
    </header>
    <main class="story">
      ${scenes
        .map(
          (s) => `
        <section class="scene" id="scene-${s.id}" data-section="${s.section}" data-form="${s.form}"
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
  `
  root.querySelector('.topbar').append(themeToggle())

  const fills = [...root.querySelectorAll('.rail__fill')]
  const tag = root.querySelector('.topbar__tag')
  let field = null

  const scroll = createScroll(root, scenes, {
    onScene(si, bi, sceneChanged) {
      const s = scenes[si]
      root.dataset.section = s.section
      tag.textContent = s.section ? `Part ${s.section} of 7` : ''
      budgeted.forEach((sec, k) => {
        let f = 0
        if (sec.n < s.section) f = 1
        else if (sec.n === s.section) f = (bi + 1) / s.beats.length
        fills[k].style.transform = `scaleX(${f})`
        fills[k].parentElement.classList.toggle('is-current', sec.n === s.section)
      })
      hud?.onScene(si, bi)
      if (sceneChanged) field?.morphTo(s.form)
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
    import('./field.js').then((m) => {
      field = m.createField(root.querySelector('.field'))
      field.morphTo(scenes[scroll.state.scene].form, { instant: true })
      onThemeChange(() => field.theme())
      root.classList.add('has-field')
    })
  })

  const todoCount = root.querySelectorAll('.story .todo').length
  if (todoCount) console.info(`[smartmotion] ${todoCount} TODO markers in visible content. Press O for the overview.`)

  window.story = scroll
}
