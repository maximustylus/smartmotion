import { genieIn, genieOut } from '../lib/genie.js'
import { defaultRoute } from '../content/routes.js'

/*
  The owner's avatar in the top bar. Tapping it genies a card down from the
  photo, in the manner of a window minimising in reverse: a thin stretch
  from the avatar that fills out and settles. Linktree does not allow
  itself to be framed, so the card carries the link.
*/

const LINK = 'https://linktr.ee/muhammad.alif'

export function createProfile(topbar, root) {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'avatar'
  btn.setAttribute('aria-label', `About ${defaultRoute.speaker.name}`)
  btn.setAttribute('aria-expanded', 'false')
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
      <circle cx="12" cy="8.5" r="3.6"/>
      <path d="M4.5 19.5c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4"/>
    </svg>`
  topbar.append(btn)

  const card = document.createElement('div')
  card.className = 'pcard'
  card.hidden = true
  card.setAttribute('role', 'dialog')
  card.setAttribute('aria-label', defaultRoute.speaker.name)
  card.innerHTML = `
    <img class="pcard__photo" src="/profile/alif.jpg" alt="${defaultRoute.speaker.name}">
    <div class="pcard__body">
      <p class="pcard__name">${defaultRoute.speaker.name}</p>
      <p class="pcard__role">${defaultRoute.speaker.roles.join(' \u00b7 ')}</p>
      <p class="pcard__summary">${defaultRoute.speaker.summary}</p>
      <a class="btn pcard__link" href="${LINK}" target="_blank" rel="noopener">My socials <span aria-hidden="true">&nearr;</span></a>
    </div>
  `
  root.append(card)

  let open = false
  function show() {
    open = true
    btn.setAttribute('aria-expanded', 'true')
    genieIn(card, '92% 0%')
    card.querySelector('.pcard__link').focus({ preventScroll: true })
  }
  function hide() {
    if (!open) return
    open = false
    btn.setAttribute('aria-expanded', 'false')
    genieOut(card, '92% 0%')
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation()
    open ? hide() : show()
  })
  document.addEventListener('click', (e) => open && !card.contains(e.target) && hide())
  window.addEventListener('keydown', (e) => e.key === 'Escape' && hide())
  return { show, hide }
}
