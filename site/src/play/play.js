import { gsap } from 'gsap'
import '../styles/play.css'
import { reducedMotion } from '../lib/motion.js'

// Phase 1 placeholder. The icebreaker quiz arrives in Phase 2.
export function mount(root) {
  document.title = 'Play: GAi GAi with me'
  root.innerHTML = `
    <main class="play">
      <div class="play__panel card">
        <img class="play__mark" src="/icon.svg" alt="" data-in>
        <p class="eyebrow" data-in>GAi GAi with me</p>
        <h1 data-in>Scan and <span class="grad-text">play</span></h1>
        <p class="lead" data-in>A quick icebreaker for this session. Your answers stay on your device. Only anonymous room totals are shared.</p>
        <p data-in><span class="todo">Quiz arrives in Phase 2</span></p>
      </div>
    </main>
  `
  if (!reducedMotion()) {
    gsap.from(root.querySelectorAll('[data-in]'), { opacity: 0, y: 16, duration: 0.6, stagger: 0.07, ease: 'power3.out' })
  }
}
