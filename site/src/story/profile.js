import { genieIn, genieOut } from '../lib/genie.js'

/*
  The button in the top bar. Tapping it genies a card down from the button,
  in the manner of a window minimising in reverse: a thin stretch that
  fills out and settles. The card points to Firstletter Lab, which makes
  Smart Motion (owner, 26 November 2026).
*/

const NAME = 'Firstletter Lab'
const LINK = 'https://firstletterlab.sg'

export function createProfile(topbar, root) {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'avatar'
  btn.setAttribute('aria-label', `About ${NAME}`)
  btn.setAttribute('aria-expanded', 'false')
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
      <circle cx="12" cy="8.5" r="3.6"/>
      <path d="M4.5 19.5c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4"/>
    </svg>`
  topbar.append(btn)

  const card = document.createElement('div')
  card.className = 'pcard pcard--org'
  card.hidden = true
  card.setAttribute('role', 'dialog')
  card.setAttribute('aria-label', NAME)
  card.innerHTML = `
    <div class="pcard__body">
      <p class="pcard__name">${NAME}</p>
      <a class="btn pcard__link" href="${LINK}" target="_blank" rel="noopener">firstletterlab.sg <span aria-hidden="true">&nearr;</span></a>
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
