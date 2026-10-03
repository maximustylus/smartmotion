import { gsap } from 'gsap'
import { defaultRoute } from '../content/routes.js'

/*
  The owner's avatar in the top bar. Tapping it genies a card down from the
  photo, in the manner of a window minimising in reverse: a thin stretch
  from the avatar that fills out and settles. Linktree does not allow
  itself to be framed, so the card carries the link.
*/

const LINK = 'https://linktr.ee/muhammad.alif'
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function createProfile(topbar, root) {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'avatar'
  btn.setAttribute('aria-label', `About ${defaultRoute.speaker.name}`)
  btn.setAttribute('aria-expanded', 'false')
  btn.innerHTML = `<img src="/profile/alif.jpg" alt="" width="44" height="44">`
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
      ${defaultRoute.speaker.roles.map((r) => `<p class="pcard__role">${r}</p>`).join('')}
      <a class="btn pcard__link" href="${LINK}" target="_blank" rel="noopener">All my links <span aria-hidden="true">&nearr;</span></a>
      <p class="pcard__handle">linktr.ee/muhammad.alif</p>
    </div>
  `
  root.append(card)

  let open = false
  function show() {
    open = true
    card.hidden = false
    btn.setAttribute('aria-expanded', 'true')
    if (reduce()) return gsap.set(card, { clearProps: 'all' })
    // The genie: a sliver drops from the avatar, bulges, then settles.
    gsap.timeline()
      .fromTo(card, { scaleX: 0.08, scaleY: 0.02, skewX: 18, opacity: 0.6, transformOrigin: '92% 0%' }, { scaleY: 0.9, scaleX: 0.3, skewX: 10, opacity: 1, duration: 0.22, ease: 'power2.in' })
      .to(card, { scaleX: 1.04, scaleY: 1.02, skewX: -4, duration: 0.26, ease: 'power3.out' })
      .to(card, { scaleX: 1, scaleY: 1, skewX: 0, duration: 0.45, ease: 'elastic.out(1, 0.55)' })
    card.querySelector('.pcard__link').focus({ preventScroll: true })
  }
  function hide() {
    if (!open) return
    open = false
    btn.setAttribute('aria-expanded', 'false')
    if (reduce()) {
      card.hidden = true
      return
    }
    gsap.timeline({ onComplete: () => (card.hidden = true) })
      .to(card, { scaleX: 0.3, scaleY: 0.9, skewX: 10, duration: 0.18, ease: 'power2.in', transformOrigin: '92% 0%' })
      .to(card, { scaleX: 0.08, scaleY: 0.02, skewX: 18, opacity: 0.4, duration: 0.2, ease: 'power3.in' })
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation()
    open ? hide() : show()
  })
  document.addEventListener('click', (e) => open && !card.contains(e.target) && hide())
  window.addEventListener('keydown', (e) => e.key === 'Escape' && hide())
  return { show, hide }
}
