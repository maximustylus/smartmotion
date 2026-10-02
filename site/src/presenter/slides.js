import { sections } from './sections.js'

/*
  Slide definitions.

  Each slide: { id, section, title, className?, html, enter?, step?, leave? }
  - Elements marked data-reveal animate in when the slide arrives.
  - Elements marked data-step="n" appear one at a time as the presenter
    advances, before the deck moves to the next slide.
  - enter(el, ctx), step(el, n, ctx) and leave(el) are optional hooks for
    custom animation (Phase 3 uses them for the utility formula).

  Phase 1 ships the running order with placeholders. Content arrives in
  Phases 2 and 3.
*/

const todo = (text) => `<span class="todo">${text}</span>`

const titleSlide = {
  id: 'title',
  section: 0,
  title: 'GAi GAi with me',
  className: 'slide--title',
  html: `
    <p class="eyebrow" data-reveal>CGH Educator Lunch and Learn Series</p>
    <h1 data-reveal>G<span class="grad-text">Ai</span> G<span class="grad-text">Ai</span> with me</h1>
    <p class="subtitle" data-reveal>A Casual Stroll into Generative AI for Educators. <span class="grad-text grad-text--meet">Ai MAi?</span></p>
    <div class="meta" data-reveal>
      <span class="chip">7 October 2026</span>
      <span class="chip">1 to 2 pm</span>
      <span class="chip">Zoom</span>
    </div>
    <div class="speaker" data-reveal>
      <p class="speaker__name">Muhammad Alif</p>
      <p>Lead and Senior Clinical Exercise Physiologist, KK Women’s and Children’s Hospital</p>
      <p>Vice Chair, Educational Innovation and Research, SingHealth College of Allied Health</p>
    </div>
  `,
}

function sectionSlide(s) {
  return {
    id: `s${s.n}`,
    section: s.n,
    title: s.title,
    className: 'slide--section',
    html: `
      <div class="section-num" aria-hidden="true" data-reveal>${s.n}</div>
      <p class="eyebrow" data-reveal>Part ${s.n} of 7</p>
      <h2 data-reveal>${s.title}</h2>
      <p class="lead" data-reveal>${s.summary}</p>
      <p class="budget small" data-reveal>${s.minutes} minutes</p>
    `,
  }
}

// What each section will contain, straight from BRIEF.md, revealed step by step.
const planned = {
  1: ['QR code and short link to /play', 'Tap the AI tools you know', 'Which of four types are you?', 'Live room totals'],
  2: ['Vibe × coding', 'Garbage in, garbage out', 'Both factors needed', 'An aside on strolling and wandering minds'],
  3: ['The utility formula, adapted from assessment', 'Set any factor to zero and the product collapses', 'Cost (a): capability versus cost per task', 'Cost (b): total cost of ownership'],
  4: ['Idea: 5 minutes', 'Working demo: 2 hours', 'The final 10%: 6 months', 'The march of nines'],
  5: ['NEXUS and AURA', 'C.A.R.E.', 'ImmersiFit', 'Each scored against the utility formula'],
  6: ['6PoLD', "Miller's pyramid", 'R2C2', 'Zone of Proximal Development', 'Take-home workflows'],
  7: ['The Will Smith spaghetti benchmark, 2023 versus 2025', 'The Pandan Reservoir crocodile image case', 'Safe use', 'Questions'],
}

function placeholderSlide(s) {
  const phase = s.n === 1 ? 2 : 3
  return {
    id: `s${s.n}-plan`,
    section: s.n,
    title: `${s.title}: plan`,
    html: `
      <p class="eyebrow" data-reveal>${s.title}</p>
      <h3 data-reveal>Coming up</h3>
      <ul class="points">
        ${planned[s.n].map((p, i) => `<li data-step="${i + 1}">${p}</li>`).join('')}
      </ul>
      <p class="placeholder-note" data-reveal>${todo(`Placeholder. Content arrives in Phase ${phase}.`)}</p>
    `,
  }
}

export const slides = [
  titleSlide,
  ...sections.filter((s) => s.n > 0).flatMap((s) => [sectionSlide(s), placeholderSlide(s)]),
]
