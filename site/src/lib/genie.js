import { gsap } from 'gsap'

/*
  The genie. One treatment for every window in the app: a sliver stretches
  out of its anchor, bulges past full size and settles with a short elastic
  landing; closing pours it back the way it came. `origin` is the anchor as
  a CSS transform-origin, for example '86% 100%' for something rising out
  of the bottom right.
*/
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const busy = new WeakSet()

export function genieIn(el, origin = '50% 0%', onDone) {
  el.hidden = false
  if (reduce()) {
    gsap.set(el, { clearProps: 'transform,opacity' })
    onDone?.()
    return
  }
  if (busy.has(el)) return
  busy.add(el)
  const vertical = origin.split(' ')[1] === '100%' ? -1 : 1
  gsap.timeline({ onComplete: () => { busy.delete(el); onDone?.() } })
    .fromTo(el, { scaleX: 0.06, scaleY: 0.03, skewX: 16 * vertical, opacity: 0.6, transformOrigin: origin }, { scaleY: 0.92, scaleX: 0.28, skewX: 9 * vertical, opacity: 1, duration: 0.22, ease: 'power2.in' })
    .to(el, { scaleX: 1.03, scaleY: 1.02, skewX: -3 * vertical, duration: 0.26, ease: 'power3.out' })
    .to(el, { scaleX: 1, scaleY: 1, skewX: 0, duration: 0.45, ease: 'elastic.out(1, 0.55)' })
}

export function genieOut(el, origin = '50% 0%', onDone) {
  if (el.hidden) return
  if (reduce()) {
    el.hidden = true
    onDone?.()
    return
  }
  if (busy.has(el)) return
  busy.add(el)
  const vertical = origin.split(' ')[1] === '100%' ? -1 : 1
  gsap.timeline({ onComplete: () => { el.hidden = true; busy.delete(el); gsap.set(el, { clearProps: 'transform,opacity' }); onDone?.() } })
    .to(el, { scaleX: 0.28, scaleY: 0.92, skewX: 9 * vertical, duration: 0.18, ease: 'power2.in', transformOrigin: origin })
    .to(el, { scaleX: 0.06, scaleY: 0.03, skewX: 16 * vertical, opacity: 0.4, duration: 0.22, ease: 'power3.in' })
}
