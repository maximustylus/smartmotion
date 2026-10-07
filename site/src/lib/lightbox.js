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
  box.classList.remove('is-page')
  box.querySelector('.lightbox__frame').innerHTML = hosted
    ? `<video src="${id}" poster="${id.replace(/\.mp4$/, '-poster.jpg')}" controls autoplay playsinline preload="metadata"></video>`
    : `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1" title="${title.replace(/"/g, '&quot;')}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`
  document.documentElement.classList.add('overlay-open')
  genieIn(box.querySelector('.lightbox__win'), '50% 100%', () => box.querySelector('.lightbox__light').focus({ preventScroll: true }))
  box.hidden = false
}

/*
  Sources that open in a window rather than a new tab, at the owner's
  request on 7 October 2026: the spaghetti clip plays here, and the
  Mothership report opens as a page here. Our own copy still gives no name,
  nationality or image for the Pandan case.
*/
const WINDOWS = {
  'https://www.youtube.com/watch?v=xdZt4V50cic': { video: 'xdZt4V50cic', title: 'Will Smith eating spaghetti: AI in 2023, 2025 and 2026' },
  'https://mothership.sg/2026/09/fake-crocodile-photo/': { page: true, title: 'Mothership, 28 September 2026' },
}

// A web page in the window, tall, with a button to open it in a tab too.
export function openPage(url, title = 'Page') {
  if (!/^https:\/\//.test(url)) return false
  if (!box) build()
  lastFocus = document.activeElement
  box.querySelector('.lightbox__title').textContent = title
  box.classList.remove('is-portrait')
  box.classList.add('is-page')
  const safe = url.replace(/"/g, '%22')
  box.querySelector('.lightbox__frame').innerHTML = `<iframe src="${safe}" title="${title.replace(/"/g, '&quot;')}" referrerpolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe><a class="lightbox__out" href="${safe}" target="_blank" rel="noopener">Open in a new tab <span aria-hidden="true">&nearr;</span></a>`
  document.documentElement.classList.add('overlay-open')
  genieIn(box.querySelector('.lightbox__win'), '50% 100%', () => box.querySelector('.lightbox__light').focus({ preventScroll: true }))
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
  const w = a && !a.closest('.lightbox') && WINDOWS[a.href]
  if (w) {
    e.preventDefault()
    return w.video ? openVideo(w.video, w.title, { portrait: false }) : openPage(a.href, w.title)
  }
  const t = e.target.closest?.('[data-video]')
  if (!t) return
  e.preventDefault()
  openVideo(t.dataset.video, t.dataset.title || t.textContent.trim(), { portrait: !('landscape' in t.dataset) })
})
