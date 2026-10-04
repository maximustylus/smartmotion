import '../styles/pages.css'
import { glossary, sitemap } from '../content/glossary.js'
import { defaultRoute } from '../content/routes.js'
import { themeToggle } from '../lib/theme.js'

/*
  Plain pages: glossary with site map, and contact. Readable top to bottom,
  no pinning. Links into the playbook open the right scene.
*/

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
const todo = (t) => `<span class="todo">${t}</span>`
const sceneHref = (id) => (['quiz', 'examples', 'questions'].includes(id.split('-')[0]) ? `/talk#${id}` : `/#${id}`)

const MARK = `<svg class="mark" viewBox="60 110 392 300" aria-hidden="true"><defs><linearGradient id="mark-g" gradientUnits="userSpaceOnUse" x1="76" y1="0" x2="436" y2="0"><stop offset="0" stop-color="#FF1FB3"/><stop offset="0.36" stop-color="#FF6A5A"/><stop offset="0.68" stop-color="#FFD23F"/><stop offset="1" stop-color="#A6FF1F"/></linearGradient><mask id="mark-cut"><rect x="0" y="0" width="512" height="512" fill="#fff"/><polygon points="203,396 309,396 256,276" fill="#000"/></mask></defs><g mask="url(#mark-cut)" fill="url(#mark-g)"><polygon points="76,384 190,128 304,384"/><polygon points="208,384 322,128 436,384"/></g><circle cx="256" cy="276" r="7" fill="#FFF8E1"/></svg>`

// The same top bar as the playbook: the mark on the left, round glass
// buttons on the right. A back button leads the row, since these pages
// have no scroll story to return through.
function shell(eyebrow, title, body) {
  return `
    <header class="page__top">
      <a class="round" href="/" data-back aria-label="Back to the playbook">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
      <a class="wordmark" href="/" aria-label="Smart Motion">${MARK}</a>
      <span class="page__spacer"></span>
    </header>
    <main class="page">
      <header class="page__head">
        <p class="eyebrow">${eyebrow}</p>
        <h1>${title}</h1>
      </header>
      ${body}
      <footer class="page__foot">&copy; Muhammad Alif 2026 <span>v${__APP_VERSION__}</span></footer>
    </main>
  `
}

// Finish the shell: the theme toggle, and a back button that returns to
// the exact scene the visitor came from when they arrived from this site.
function chrome(root) {
  root.querySelector('.page__top').append(themeToggle())
  root.querySelector('[data-back]').addEventListener('click', (e) => {
    let same = false
    try { same = !!document.referrer && new URL(document.referrer).origin === location.origin } catch { /* no referrer */ }
    if (same && history.length > 1) {
      e.preventDefault()
      history.back()
    }
  })
}

export function mountGlossary(root) {
  document.title = 'Glossary · Smart Motion'
  const items = [...glossary].sort((a, b) => a.term.localeCompare(b.term))
  root.className = 'app app--page'
  root.innerHTML = shell(
    'Smart Motion',
    'Glossary',
    `
    <p class="lead">Every term the playbook leans on, where it appears, and where it came from.</p>
    <label class="page__search"><span class="visually-hidden">Filter terms</span><input type="search" id="gl-filter" placeholder="Filter terms" autocomplete="off"></label>
    <dl class="gl">
      ${items
        .map(
          (g) => `<div class="gl__item" data-term="${esc(g.term.toLowerCase())} ${esc(g.def.toLowerCase())}">
            <dt>${esc(g.term)}</dt>
            <dd>
              <p>${esc(g.def)}</p>
              <p class="gl__links">
                ${g.scene ? `<a href="${sceneHref(g.scene)}">Open in the playbook</a>` : ''}
                ${g.path && g.path.startsWith('/glossary') ? '' : ''}
                ${g.file ? `<a href="https://github.com/maximustylus/smartmotion/blob/main/${g.file}" target="_blank" rel="noopener">${esc(g.file)}</a>` : ''}
                ${g.source ? `<a href="${g.source}" target="_blank" rel="noopener">Source</a>${g.verify ? ` ${todo('verify')}` : ''}` : g.sourceTodo ? todo(`Source link: ${g.sourceTodo}`) : ''}
              </p>
            </dd>
          </div>`,
        )
        .join('')}
    </dl>
    <h2 id="tracks">Two tracks</h2>
    <p>Every workflow runs on a personal track, your own device and accounts with public content only, or a corporate track, Microsoft 365 Copilot, Pair and Agentsea as your institution allows. The track files say which tool to paste into, what it costs you and where each track stops.</p>
    <h2>Site map</h2>
    <ul class="sitemap">
      ${sitemap.map((s) => `<li><a href="${s.path}">${esc(s.label)}</a><span>${esc(s.note)}</span></li>`).join('')}
    </ul>
  `,
  )
  chrome(root)
  const input = root.querySelector('#gl-filter')
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase()
    for (const el of root.querySelectorAll('.gl__item')) el.hidden = !!q && !el.dataset.term.includes(q)
  })
}

export function mountContact(root) {
  document.title = 'Contact · Smart Motion'
  const sp = defaultRoute.speaker
  root.className = 'app app--page'
  root.innerHTML = shell(
    'Smart Motion',
    'Contact',
    `
    <div class="contact card">
      <img class="contact__photo" src="/profile/alif.jpg" alt="${esc(sp.name)}">
      <div>
        <p class="contact__name">Muhammad Alif Bin Abu Bakar</p>
        <p class="contact__roles">${sp.roles.map(esc).join(' · ')}</p>
        <p>${esc(sp.summary)}</p>
        <p class="contact__links">
          <a class="btn" href="mailto:muhammad.alif@me.com">Email me</a>
          <a class="btn btn--ghost" href="https://linktr.ee/muhammad.alif" target="_blank" rel="noopener">All my links <span aria-hidden="true">&nearr;</span></a>
        </p>
        <p class="contact__mail">Email <a href="mailto:muhammad.alif@me.com">muhammad.alif@me.com</a></p>
      </div>
    </div>
    <h2>About this site</h2>
    <p>Smart Motion is a digital playbook of smart moves for building, teaching and presenting with AI assistants. It was itself built with an AI assistant against a written brief, in phases, with every claim traced to <a href="https://github.com/maximustylus/smartmotion/blob/main/references.md" target="_blank" rel="noopener">references.md</a>. The source is public at <a href="https://github.com/maximustylus/smartmotion" target="_blank" rel="noopener">github.com/maximustylus/smartmotion</a>.</p>
  `,
  )
  chrome(root)
}
