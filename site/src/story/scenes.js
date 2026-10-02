import { sections } from './sections.js'

/*
  Scenes. One per section, each pinned to the screen while scrolling moves
  through its beats. Every beat is a block of copy; the particle field behind
  takes the scene's form (see field.js).

  Phase 1 ships the running order with placeholders. Content arrives in
  Phases 2 and 3.
*/

const todo = (text) => `<span class="todo">${text}</span>`

// What each section will contain, straight from brief.md.
const planned = {
  1: ['QR code and short link', 'Tap the AI tools you know', 'Which of four types are you?', 'Live room totals'],
  2: ['Vibe × coding', 'Garbage in, garbage out', 'Both factors needed', 'An aside on strolling and wandering minds'],
  3: ['The utility formula, adapted from assessment', 'Set any factor to zero and the product collapses', 'Cost (a): capability versus cost per task', 'Cost (b): total cost of ownership'],
  4: ['Idea: 5 minutes', 'Working demo: 2 hours', 'The final 10%: 6 months', 'The march of nines'],
  5: ['NEXUS and AURA', 'C.A.R.E.', 'ImmersiFit', 'Each scored against the utility formula'],
  6: ['6PoLD', "Miller's pyramid", 'R2C2', 'Zone of Proximal Development', 'Take-home workflows'],
  7: ['The Will Smith spaghetti benchmark, 2023 versus 2025', 'The Pandan Reservoir crocodile image case', 'Safe use', 'Questions'],
}

// Which form the particle field takes for each section.
const forms = {
  0: 'cloud',
  1: 'grid',
  2: 'pair',
  3: 'columns',
  4: 'bar',
  5: 'clusters',
  6: 'pyramid',
  7: 'timeline',
}

const title = {
  id: 's0',
  section: 0,
  title: 'GAi GAi with me',
  form: forms[0],
  beats: [
    {
      html: `
        <p class="eyebrow">CGH Educator Lunch and Learn Series</p>
        <h1>GAi GAi with me</h1>
        <p class="lead">A casual stroll into generative AI for educators. <span class="voice">Ai MAi?</span></p>
        <div class="chips">
          <span class="chip">7 October 2026</span>
          <span class="chip">1 to 2 pm</span>
          <span class="chip">Zoom</span>
        </div>
        <div class="speaker">
          <p class="speaker__name">Muhammad Alif</p>
          <p>Lead and Senior Clinical Exercise Physiologist, KK Women’s and Children’s Hospital</p>
          <p>Vice Chair, Educational Innovation and Research, SingHealth College of Allied Health</p>
        </div>
        <p class="hint">Scroll, or press <kbd>→</kbd></p>
      `,
    },
  ],
}

function sectionScene(s) {
  const phase = s.n === 1 ? 2 : 3
  return {
    id: `s${s.n}`,
    section: s.n,
    title: s.title,
    form: forms[s.n],
    beats: [
      {
        html: `
          <p class="eyebrow">Part ${s.n} of 7 <span class="eyebrow__sep">·</span> ${s.minutes} min</p>
          <h2>${s.title}</h2>
          <p class="lead">${s.summary}</p>
        `,
      },
      {
        html: `
          <p class="eyebrow">${s.title}</p>
          <h3>Coming up</h3>
          <ul class="rows">
            ${planned[s.n].map((p) => `<li>${p}</li>`).join('')}
          </ul>
          <p class="note">${todo(`Placeholder. Content arrives in Phase ${phase}.`)}</p>
        `,
      },
    ],
  }
}

export const scenes = [title, ...sections.filter((s) => s.n > 0).map(sectionScene)]
