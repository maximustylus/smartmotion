import { gsap } from 'gsap'
import '../styles/splash.css'

/*
  The splash. The Smart Motion mark is drawn as a one-point perspective:
  a horizon, lines running to a single vanishing point dead centre, and the
  two walls of the M traced in the brand gradient. When the walls are drawn
  the light at the far end of the path comes up, and the wordmark follows.
  Then everything gives way to the story.

  Shown on every load. Tap, click or any key skips it.
*/

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function shouldSplash() {
  return !new URLSearchParams(location.search).has('nosplash')
}

export function splash(root) {
  const VP = [256, 276] // the vanishing point, as in the icon
  // Perspective lines fan out from the vanishing point to the edges of a
  // wider frame, so the walls read as standing on a floor that recedes.
  const fan = []
  for (let i = -6; i <= 6; i++) fan.push([VP[0] + i * 160, 700])
  for (let i = -5; i <= 5; i++) fan.push([VP[0] + i * 200, -180])
  const lines = fan.map(([x, y]) => `<line class="sp__ray" x1="${VP[0]}" y1="${VP[1]}" x2="${x}" y2="${y}"/>`).join('')

  const el = document.createElement('div')
  el.className = 'splash'
  el.setAttribute('role', 'presentation')
  el.innerHTML = `
    <svg class="sp" viewBox="0 0 512 512" aria-hidden="true">
      <defs>
        <linearGradient id="sp-g" gradientUnits="userSpaceOnUse" x1="76" y1="0" x2="436" y2="0">
          <stop offset="0" stop-color="#FF1FB3"/><stop offset="0.36" stop-color="#FF6A5A"/>
          <stop offset="0.68" stop-color="#FFD23F"/><stop offset="1" stop-color="#A6FF1F"/>
        </linearGradient>
        <radialGradient id="sp-light" gradientUnits="userSpaceOnUse" cx="256" cy="276" r="120">
          <stop offset="0" stop-color="#FFF8E1" stop-opacity="1"/><stop offset="0.15" stop-color="#FFE9A8" stop-opacity="0.6"/>
          <stop offset="0.5" stop-color="#FFD23F" stop-opacity="0.16"/><stop offset="1" stop-color="#FFD23F" stop-opacity="0"/>
        </radialGradient>
        <mask id="sp-cut"><rect width="512" height="512" fill="#fff"/><polygon points="203,396 309,396 256,276" fill="#000"/></mask>
      </defs>
      <g class="sp__persp">
        <line class="sp__horizon" x1="-200" y1="276" x2="712" y2="276"/>
        ${lines}
      </g>
      <g class="sp__walls" mask="url(#sp-cut)">
        <polygon class="sp__fill" points="76,384 190,128 304,384"/>
        <polygon class="sp__fill" points="208,384 322,128 436,384"/>
        <polygon class="sp__trace" points="76,384 190,128 304,384"/>
        <polygon class="sp__trace" points="208,384 322,128 436,384"/>
      </g>
      <polygon class="sp__path" points="203,396 309,396 256,276"/>
      <circle class="sp__glow" cx="256" cy="276" r="120" fill="url(#sp-light)"/>
      <circle class="sp__core" cx="256" cy="276" r="4" fill="#FFFDF2"/>
      <text class="sp__name" x="256" y="474" textLength="360" lengthAdjust="spacingAndGlyphs" text-anchor="middle">SMARTMOTION</text>
    </svg>
    <div class="sp__word"><span class="sp__tag">A playbook of smart moves</span></div>
  `
  root.before(el)
  const q = (s) => el.querySelectorAll(s)
  const traces = [...q('.sp__trace')]
  for (const t of traces) {
    const len = t.getTotalLength()
    t.style.strokeDasharray = len
    t.style.strokeDashoffset = len
  }

  let done = false
  const finish = () => {
    if (done) return
    done = true
    gsap.to(el, { autoAlpha: 0, duration: reduce() ? 0.2 : 0.9, ease: 'power2.inOut', onComplete: () => el.remove() })
  }
  const skip = (e) => {
    if (e.type === 'keydown' && e.key === 'Tab') return
    finish()
  }
  window.addEventListener('keydown', skip, { once: true })
  el.addEventListener('pointerdown', finish)

  if (reduce()) {
    gsap.set([q('.sp__ray'), q('.sp__horizon'), q('.sp__fill'), q('.sp__glow'), q('.sp__core'), q('.sp__word')], { opacity: 1 })
    gsap.set(traces, { strokeDashoffset: 0 })
    gsap.set(q('.sp__glow'), { scale: 1, transformOrigin: '256px 276px' })
    setTimeout(finish, 1600)
    return
  }

  const tl = gsap.timeline({ onComplete: () => setTimeout(finish, 700) })
  tl.fromTo(q('.sp__horizon'), { scaleX: 0, transformOrigin: '256px 276px', opacity: 1 }, { scaleX: 1, duration: 1.0, ease: 'power3.inOut' })
    .fromTo(q('.sp__ray'), { scale: 0, transformOrigin: '256px 276px', opacity: 1 }, { scale: 1, duration: 1.3, ease: 'power3.out', stagger: { each: 0.03, from: 'center' } }, 0.3)
    .to(traces, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', stagger: 0.25 }, 0.9)
    .to(q('.sp__fill'), { opacity: 1, duration: 1.2, ease: 'power2.out' }, 2.4)
    .fromTo(q('.sp__path'), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 2.6)
    .fromTo(q('.sp__core'), { opacity: 0, scale: 0.2, transformOrigin: '256px 276px' }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, 3.0)
    .fromTo(q('.sp__glow'), { opacity: 0, scale: 0.3, transformOrigin: '256px 276px' }, { opacity: 1, scale: 1, duration: 1.6, ease: 'power2.out' }, 3.05)
    .to(q('.sp__glow'), { scale: 1.12, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 4.6)
    .to(q('.sp__ray'), { opacity: 0.35, duration: 1.0 }, 3.2)
    .fromTo(q('.sp__name'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 3.6)
    .fromTo(q('.sp__tag'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 3.9)
    .to({}, { duration: 0.6 })
}
