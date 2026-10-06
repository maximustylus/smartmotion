import { genieIn, genieOut } from './genie.js'

/*
  The lightbox: a video in a window over the story, opened with the genie
  like every other window. Any element with data-video="<YouTube id>" opens
  it; data-title names the window. YouTube's privacy-enhanced player
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
  if (!/^[\w-]{6,20}$/.test(id)) return
  if (!box) build()
  lastFocus = document.activeElement
  box.querySelector('.lightbox__title').textContent = title
  box.classList.toggle('is-portrait', portrait)
  box.querySelector('.lightbox__frame').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1" title="${title.replace(/"/g, '&quot;')}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`
  document.documentElement.classList.add('overlay-open')
  genieIn(box.querySelector('.lightbox__win'), '50% 100%', () => box.querySelector('.lightbox__light').focus({ preventScroll: true }))
  box.hidden = false
}

export function close() {
  if (!box || box.hidden) return
  genieOut(box.querySelector('.lightbox__win'), '50% 100%', () => {
    box.hidden = true
    box.querySelector('.lightbox__frame').innerHTML = ''
    document.documentElement.classList.remove('overlay-open')
    lastFocus?.focus?.({ preventScroll: true })
  })
}

// One listener for the whole app: any [data-video] opens the lightbox.
document.addEventListener('click', (e) => {
  const t = e.target.closest?.('[data-video]')
  if (!t) return
  e.preventDefault()
  openVideo(t.dataset.video, t.dataset.title || t.textContent.trim())
})
