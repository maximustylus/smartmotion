import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText)

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/*
  Scroll model.

  Each scene is (beats + 1) viewports tall and its content is sticky, so it
  stays on screen while the person scrolls through its beats. Beat k is
  current while the scroll position is k viewports into the scene. Keys jump
  to the middle of a beat's range, so the shared screen never rests on a
  half state. Everything is vertical, on every device.
*/

export function createScroll(root, scenes, { onScene, onProgress }) {
  const els = scenes.map((s) => root.querySelector(`#scene-${s.id}`))
  const beatEls = els.map((el) => [...el.querySelectorAll('.beat')])
  const state = { scene: -1, beat: -1 }
  let started = false
  let vh = () => els[0].querySelector('.scene__pin').offsetHeight || window.innerHeight

  // ---------- Beat copy: masked line reveals ----------

  // Lines are split again whenever the web font arrives or the width
  // changes (a rotated phone, a resized window, the fit guard), so the
  // breaks always match what is on screen. After a re-split the lines of a
  // visible beat are simply shown; hidden beats wait below their masks.
  function prepare(beat) {
    if (beat._lines) return beat._lines
    const targets = [...beat.querySelectorAll('h1, h2, h3, p, li')].filter((t) => !t.closest('[data-no-split]'))
    beat._lines = []
    if (targets.length) {
      beat._splitter = SplitText.create(targets, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'ln',
        // A TODO chip inside a paragraph is one unit; splitting into it
        // throws the line detection off and leaves ragged breaks.
        ignore: '.todo',
        autoSplit: true,
        onSplit(self) {
          beat._lines = self.lines
          const shown = gsap.getProperty(beat, 'visibility') === 'visible'
          gsap.set(self.lines, { yPercent: shown ? 0 : 110, xPercent: 0, autoAlpha: 1 })
        },
      })
    }
    gsap.set(beat, { autoAlpha: 0 })
    gsap.set(beat._lines, { yPercent: 110 })
    return beat._lines
  }

  /*
    Entrances by ADDIE phase, so each part of the journey moves differently:
      analyse    lines rise, the heading pulls into focus
      design     lines rise, the panel's rules draw themselves
      develop    the whole beat stacks up from below
      implement  lines slide in from the side, inside the guardrail
      evaluate   lines rise, every number counts up
      era        the year counts across the gap, the quote settles slowly
  */
  // A line that has wrapped inside its own mask means the column changed
  // width after the split. Split again before the lines are shown.
  function freshLines(beat) {
    const lines = prepare(beat)
    const wrapped = lines.some((l) => {
      const cs = getComputedStyle(l)
      const one = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.3
      return l.offsetHeight > one * 1.6
    })
    if (wrapped && beat._splitter) beat._splitter.split(beat._splitter.vars)
    return beat._lines
  }

  function showBeat(beat, animate) {
    const lines = freshLines(beat)
    gsap.killTweensOf([beat, ...lines])
    const scene = beat.closest('.scene')
    const phase = scene?.classList.contains('scene--era') ? 'era' : scene?.dataset.phase || ''
    const nums = [...beat.querySelectorAll('[data-year], [data-num]')]
    if (!animate || reduce()) {
      gsap.set(lines, { yPercent: 0, xPercent: 0, filter: 'none' })
      gsap.set(beat, { '--draw': 1, scale: 1, y: 0 })
      if (beat.querySelector('.addie')) {
        gsap.set(beat.querySelector('.addie').children, { yPercent: 0, opacity: 1, rotateX: 0 })
        gsap.set(beat.querySelector('.addie'), { '--fill': 1 })
      }
      nums.forEach((n) => (n.textContent = n.dataset.to ?? n.textContent))
      gsap.to(beat, { autoAlpha: 1, duration: reduce() ? 0.3 : 0 })
      return
    }
    gsap.set(beat, { autoAlpha: 1, '--draw': 0, scale: 1, y: 0 })
    const rise = (delay = 0) =>
      gsap.fromTo(lines, { yPercent: 110, xPercent: 0 }, { yPercent: 0, duration: 1.2, stagger: 0.09, ease: 'power4.out', delay })
    const count = (dur = 1.4) =>
      nums.forEach((n) => {
        const to = +(n.dataset.to ?? n.textContent)
        const from = +(n.dataset.from ?? 0)
        const o = { v: from }
        gsap.to(o, { v: to, duration: dur, ease: 'power3.out', snap: 'v', onUpdate: () => (n.textContent = o.v) })
      })
    // The ADDIE strip: letters tip up one after another, then the current
    // letter fills with colour from the baseline to the cap.
    const strip = beat.querySelector('.addie')
    if (strip) {
      gsap.fromTo(strip.children, { yPercent: 70, opacity: 0, rotateX: -80 }, { yPercent: 0, opacity: 1, rotateX: 0, transformPerspective: 600, duration: 1.1, stagger: 0.08, ease: 'power4.out' })
      gsap.fromTo(strip, { '--fill': 0 }, { '--fill': 1, duration: 1.4, delay: 0.6, ease: 'power2.inOut' })
    }
    switch (phase) {
      case 'analyse': {
        rise()
        const h = beat.querySelector('h1, h2, h3')
        if (h) gsap.fromTo(h, { filter: 'blur(14px)' }, { filter: 'blur(0px)', duration: 1.4, ease: 'power2.out' })
        break
      }
      case 'design':
        rise(0.15)
        gsap.to(beat, { '--draw': 1, duration: 1.1, ease: 'power3.inOut' })
        break
      case 'develop':
        gsap.set(lines, { yPercent: 0 })
        gsap.fromTo(beat, { y: 48, scale: 0.97, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 1.0, ease: 'power3.out' })
        break
      case 'implement':
        gsap.fromTo(lines, { xPercent: -12, yPercent: 0, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 1.0, stagger: 0.08, ease: 'power3.out' })
        gsap.to(beat, { '--draw': 1, duration: 1.4, ease: 'power2.out' })
        break
      case 'evaluate':
        rise()
        count()
        break
      case 'era':
        rise()
        count(1.8)
        break
      default:
        rise()
    }
  }

  function hideBeat(beat, animate) {
    const lines = prepare(beat)
    gsap.killTweensOf([beat, ...lines])
    if (!animate || reduce()) return gsap.set(beat, { autoAlpha: 0 })
    gsap.to(lines, { yPercent: -60, duration: 0.4, ease: 'power2.in', stagger: { amount: 0.1 } })
    gsap.to(beat, { autoAlpha: 0, duration: 0.4, onComplete: () => gsap.set(lines, { yPercent: 110, xPercent: 0, filter: 'none' }) })
  }

  function setCurrent(si, bi, animate = true) {
    if (si === state.scene && bi === state.beat) return
    const sceneChanged = si !== state.scene
    const prev = { ...state }
    state.scene = si
    state.beat = bi
    beatEls.forEach((beats, i) =>
      beats.forEach((b, k) => {
        const on = i === si && k === bi
        const wasOn = i === prev.scene && k === prev.beat
        if (on) showBeat(b, animate)
        else if (wasOn || b.style.visibility === 'visible') hideBeat(b, animate && wasOn)
      }),
    )
    els.forEach((el, i) => el.classList.toggle('is-current', i === si))
    history.replaceState(null, '', `#${scenes[si].id}${bi ? `-${bi + 1}` : ''}`)
    onScene?.(si, bi, sceneChanged)
  }

  // ---------- Triggers ----------

  els.forEach((el, i) => {
    const beats = beatEls[i].length
    ScrollTrigger.create({
      trigger: el,
      start: 'top 50%',
      end: 'bottom 50%',
      onUpdate: (self) => {
        // Progress through the pinned range, then which beat that is.
        const top = el.offsetTop
        const p = gsap.utils.clamp(0, 1, (window.scrollY - top) / (beats * vh()))
        const k = Math.min(beats - 1, Math.floor(p * beats))
        if (!started) return
        if (self.isActive) setCurrent(i, k)
        onProgress?.(i, p, (p * beats) % 1)
      },
      onToggle: (self) => {
        if (!started || !self.isActive) return
        const top = el.offsetTop
        const p = gsap.utils.clamp(0, 1, (window.scrollY - top) / (beats * vh()))
        setCurrent(i, Math.min(beats - 1, Math.floor(p * beats)))
      },
    })
  })

  // ---------- Key jumps ----------

  const beatY = (si, bi) => els[si].offsetTop + (bi + 0.5) * vh()

  function goTo(si, bi = 0, { instant = false } = {}) {
    si = gsap.utils.clamp(0, scenes.length - 1, si)
    bi = gsap.utils.clamp(0, beatEls[si].length - 1, bi)
    const y = beatY(si, bi)
    if (instant || reduce()) {
      window.scrollTo(0, y)
      ScrollTrigger.update()
      return
    }
    gsap.to(window, { scrollTo: y, duration: 1.1, ease: 'power3.inOut', overwrite: 'auto' })
  }

  const next = () => {
    const { scene, beat } = state
    if (beat < beatEls[scene].length - 1) goTo(scene, beat + 1)
    else goTo(scene + 1, 0)
  }
  const prev = () => {
    const { scene, beat } = state
    if (beat > 0) goTo(scene, beat - 1)
    else if (scene > 0) goTo(scene - 1, beatEls[scene - 1].length - 1)
  }

  function fromHash() {
    const m = location.hash.match(/^#([a-z]+)(?:-(\d+))?$/)
    if (!m) return [0, 0]
    const si = scenes.findIndex((s) => s.id === m[1])
    return si < 0 ? [0, 0] : [si, (+m[2] || 1) - 1]
  }

  function start() {
    const [si, bi] = fromHash()
    // Prepare every beat hidden, then land and reveal the first one.
    beatEls.flat().forEach(prepare)
    started = true
    goTo(si, bi, { instant: true })
    ScrollTrigger.refresh()
    setCurrent(si, bi, true)
  }

  window.addEventListener('hashchange', () => {
    const [si, bi] = fromHash()
    if (si !== state.scene || bi !== state.beat) goTo(si, bi, { instant: true })
  })

  return { next, prev, goTo, start, scenes, get state() { return state }, refresh: () => ScrollTrigger.refresh() }
}
