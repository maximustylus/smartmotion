import { genieIn, genieOut } from './genie.js'

/*
  The lightbox: a video in a window over the story, opened with the genie
  like every other window. Any element with data-video opens it: a YouTube
  id, or a path to a video hosted with the site (/usecases/....mp4).
  data-title names the window; data-landscape gives it a 16:9 frame.
  YouTube's privacy-enhanced player
  (youtube-nocookie.com) is used, and the player is removed on close so
  nothing keeps playing or loading behind the story.

  Keys: Esc closes. While it is open, the story's arrow and space keys are
  held back, so a presenter cannot move the story under the video.
*/
let box = null
let lastFocus = null

function build() {
  box = document.createElement('div')
  box.className = 'lightbox'
  box.hidden = true
  box.innerHTML = `
    <div class="lightbox__scrim" data-close></div>
    <div class="lightbox__win" role="dialog" aria-modal="true" aria-labelledby="lightbox-title">
      <div class="lightbox__head">
        <button type="button" class="lightbox__light" data-close aria-label="Close video"></button>
        <span class="lightbox__dot"></span><span class="lightbox__dot"></span>
        <span class="lightbox__title" id="lightbox-title"></span>
      </div>
      <div class="lightbox__frame"></div>
    </div>`
  document.body.append(box)
  box.addEventListener('click', (e) => e.target.closest('[data-close]') && close())
  window.addEventListener(
    'keydown',
    (e) => {
      if (box.hidden) return
      if (e.key === 'Escape') close()
      if (!e.target.closest?.('.lightbox')) e.stopImmediatePropagation()
    },
    true,
  )
}

export function openVideo(id, title = 'Video', { portrait = true } = {}) {
  const hosted = /^\/usecases\/[\w-]+\.mp4$/.test(id)
  if (!hosted && !/^[\w-]{6,20}$/.test(id)) return
  if (!box) build()
  lastFocus = document.activeElement
  box.querySelector('.lightbox__title').textContent = title
  box.classList.toggle('is-portrait', portrait)
  box.classList.remove('is-card')
  box.querySelector('.lightbox__frame').innerHTML = hosted
    ? `<video src="${id}" poster="${id.replace(/\.mp4$/, '-poster.jpg')}" controls autoplay playsinline preload="metadata"></video>`
    : `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1" title="${title.replace(/"/g, '&quot;')}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`
  document.documentElement.classList.add('overlay-open')
  genieIn(box.querySelector('.lightbox__win'), '50% 100%', () => box.querySelector('.lightbox__light').focus({ preventScroll: true }))
  box.hidden = false
}

/*
  Link windows: some sources open in the lightbox as a card, not a page.
  Will Smith clips are links only, with no likeness, and the Pandan
  Reservoir report must show no name, nationality or image (CLAUDE.md), so
  the window describes the source and the button opens it in a new tab.
*/
const CARDS = {
  'https://www.youtube.com/watch?v=xdZt4V50cic': {
    title: 'The Will Smith spaghetti test',
    source: 'YouTube, Apple_100K, 8 September 2026',
    line: 'The same prompt, made with AI in 2023, 2025 and 2026: an obvious fake, then a convincing one. Shown as a link only, never played here.',
    cta: 'Watch on YouTube',
  },
  'https://mothership.sg/2026/09/fake-crocodile-photo/': {
    title: 'A crocodile at Pandan Reservoir',
    source: 'Mothership, 28 September 2026',
    line: 'A person would be charged over an image of a crocodile at Pandan Reservoir, allegedly made with AI.',
    cta: 'Read on Mothership',
  },
}
const escHtml = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

export function openCard(url) {
  const c = CARDS[url]
  if (!c) return false
  if (!box) build()
  lastFocus = document.activeElement
  box.querySelector('.lightbox__title').textContent = c.source
  box.classList.remove('is-portrait')
  box.classList.add('is-card')
  box.querySelector('.lightbox__frame').innerHTML = `
    <div class="lightbox__card">
      <h3>${escHtml(c.title)}</h3>
      <p>${escHtml(c.line)}</p>
      <a class="btn" href="${escHtml(url)}" target="_blank" rel="noopener">${escHtml(c.cta)} <span aria-hidden="true">&nearr;</span></a>
    </div>`
  document.documentElement.classList.add('overlay-open')
  genieIn(box.querySelector('.lightbox__win'), '50% 100%', () => box.querySelector('.lightbox__card .btn').focus({ preventScroll: true }))
  box.hidden = false
  return true
}

export function close() {
  if (!box || box.hidden) return
  genieOut(box.querySelector('.lightbox__win'), '50% 100%', () => {
    box.hidden = true
    box.querySelector('.lightbox__frame').innerHTML = ''
    document.documentElement.classList.remove('overlay-open')
    // Focus goes back only for keyboard users; after a mouse click it would
    // let Space reopen the window instead of moving the talk on.
    if (lastFocus?.matches?.(':focus-visible')) lastFocus.focus({ preventScroll: true })
    else document.activeElement?.blur?.()
  })
}

// One listener for the whole app: any [data-video] opens the lightbox, and
// a link to a carded source opens its window.
document.addEventListener('click', (e) => {
  const a = e.target.closest?.('a[href]')
  if (a && !a.closest('.lightbox') && CARDS[a.href] && openCard(a.href)) return e.preventDefault()
  const t = e.target.closest?.('[data-video]')
  if (!t) return
  e.preventDefault()
  openVideo(t.dataset.video, t.dataset.title || t.textContent.trim(), { portrait: !('landscape' in t.dataset) })
})
