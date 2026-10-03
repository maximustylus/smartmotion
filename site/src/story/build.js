import { moves, moveById } from '../content/moves.js'
import { examples } from '../content/examples.js'
import { phases, eraBefore, eras } from '../content/journey.js'

/*
  Turns content into scenes. Two modes:
    playbook  the home: a cover, the eight moves, and the routes
    route     a guided path for one audience: cover, quiz, chosen moves,
              worked examples, questions
  A scene pins while scrolling moves through its beats. Every beat is a block
  of copy; the particle field behind takes the scene's form.
*/

const todo = (text) => `<span class="todo">${text}</span>`
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')

// One short cheatsheet per move, kept beside the moves. The owner's full
// workflows live in workflows/ at the repository root and are linked, not copied.
const sheets = import.meta.glob('../content/cheatsheets/*.md', { query: '?raw', import: 'default', eager: true })

function cheatsheet(id) {
  const raw = sheets[`../content/cheatsheets/${id}.md`]
  if (!raw) return { title: id, intro: '', prompt: '', missing: true }
  const [head, ...rest] = raw.split('\n---\n')
  const lines = head.trim().split('\n')
  const title = lines[0].replace(/^#\s*/, '')
  const intro = lines.slice(1).join(' ').trim()
  return { title, intro, prompt: rest.join('\n---\n').trim(), missing: false }
}

const eyebrow = (a, b) => `<p class="eyebrow">${a}${b ? ` <span class="eyebrow__sep">·</span> ${b}` : ''}</p>`

// Particles are B-roll: they come out for the framework diagram and nest
// for the beats that are copy.
export function moveBeats(m, n) {
  const sheet = cheatsheet(m.cheatsheet)
  const source = m.framework.source
    ? `<span class="source">${m.framework.source}${m.framework.verify ? ` ${todo('verify against the original')}` : ''}</span>`
    : ''
  return [
    {
      form: 'nest',
      html: `
        ${eyebrow(`Move ${n} of ${moves.length}`)}
        <h2>${m.name}</h2>
        <p class="lead">${m.angle}</p>
        <p>${m.principle}</p>
      `,
    },
    {
      form: m.form,
      html: `
        ${eyebrow(m.name, 'Framework')}
        <h3>${m.framework.name}</h3>
        <p>${m.framework.note}</p>
        ${source}
      `,
    },
    {
      form: 'nest',
      html: `
        ${eyebrow(m.name, 'Worked example')}
        <h3>${m.example.title}</h3>
        <p>${m.example.body}</p>
      `,
    },
    {
      form: 'nest',
      html: `
        ${eyebrow(m.name, 'Cheatsheet')}
        <h3>${sheet.title}</h3>
        ${sheet.intro ? `<p class="note">${sheet.intro}</p>` : ''}
        <div class="sheet" data-no-split>
          ${sheet.missing ? todo(`workflows/${m.cheatsheet}.md is missing`) : `<pre class="sheet__text" tabindex="0">${esc(sheet.prompt)}</pre>`}
          <p class="sheet__actions">
            <button type="button" class="btn" data-copy aria-label="Copy the cheatsheet">Copy</button>
            <span class="sheet__status" aria-live="polite"></span>
          </p>
        </div>
      `,
    },
  ]
}

export function moveScene(m, n, { minutes = 0 } = {}) {
  return {
    id: m.id,
    title: m.name,
    minutes,
    phase: m.phase,
    form: m.form,
    mount: (el, ctx) => import('./sheet.js').then((x) => x.mountSheet(el, ctx)),
    beats: moveBeats(m, n),
  }
}

// ---------- Eras and phases ----------

const quoteBlock = (q) =>
  q
    ? `<blockquote class="quote">
        <p class="quote__text">“${q.text}”</p>
        <footer class="quote__who">${q.who}<span class="quote__source">${q.source}${q.verify ? ` ${todo('verify')}` : ''}</span></footer>
      </blockquote>`
    : ''

export function eraScene(era, prevYear) {
  const [from, to] = era.years
  const beats = [
    {
      years: `${from}${to !== from ? ` to ${to}` : ''}`,
      html: `
        ${eyebrow('The journey', `${from}${to !== from ? ` to ${to}` : ''}`)}
        <p class="era__year" aria-hidden="true" data-no-split><span data-year data-from="${prevYear}" data-to="${from}">${from}</span></p>
        <h2 class="era__title">${era.title}</h2>
        <p class="lead">${era.line}</p>
        <ol class="facts" data-no-split>
          ${era.facts.map((f) => `<li><span class="facts__year">${f.year}</span><span>${f.text}</span></li>`).join('')}
        </ol>
      `,
    },
  ]
  if (era.quote) beats.push({ html: `${eyebrow(era.title)}${quoteBlock(era.quote)}` })
  // Each era has its own composition and form, so the journey never
  // repeats a layout: a timeline the heroes drop onto, a chessboard, a
  // phone, a conversation, then the full-bleed splat field.
  const LOOK = {
    wonder: { form: 'timeline80s', anchor: 'centre', enter: 'drop', cls: 'scene--centre' },
    logic: { form: 'chess', anchor: 'centre', cls: 'scene--centre' },
    assistants: { form: 'phone', anchor: 'stage', cls: 'scene--right' },
    chat: { form: 'bubbles', anchor: 'centre', cls: 'scene--centre' },
    agents: { form: 'clusters', anchor: 'wide', cls: 'scene--wide' },
  }
  const look = LOOK[era.id] ?? { form: era.form }
  return {
    id: era.id,
    title: era.title,
    minutes: 0,
    era: era.id,
    className: `scene--era ${look.cls ?? ''}`,
    form: look.form,
    anchor: look.anchor,
    enter: look.enter,
    beats,
  }
}

export function phaseScene(phase) {
  const list = phase.moves.map((id) => moveById[id].name)
  const beats = [
    {
      html: `
        ${eyebrow('ADDIE', phase.name)}
        <p class="phase__letter" aria-hidden="true" data-no-split>${phase.letter}</p>
        <h2>${phase.name}</h2>
        <p class="lead">${phase.line}</p>
        <ul class="rows">${list.map((n) => `<li>${n}</li>`).join('')}</ul>
      `,
    },
  ]
  if (phase.quote) beats.push({ html: `${eyebrow('ADDIE', phase.name)}${quoteBlock(phase.quote)}` })
  return { id: `phase${phase.id}`, title: phase.name, minutes: 0, phase: phase.id, className: 'scene--phase', form: 'nest', beats }
}

// ---------- Playbook ----------

export function playbookScenes(route) {
  const cover = {
    id: 'cover',
    title: 'Smart Motion',
    minutes: 0,
    form: 'logo',
    anchor: 'centre',
    className: 'scene--cover scene--centre',
    beats: [
      {
        html: `
          <h1 class="visually-hidden">Smart Motion</h1>
          ${eyebrow('A playbook of smart moves')}
          <p class="cover__lead">Build, teach and present with AI assistants. Eight moves, each with a framework, a worked example and a cheatsheet you can paste anywhere.</p>
          <div class="chips">
            <span class="chip">${moves.length} moves</span>
            <span class="chip">5 eras</span>
            <a class="chip chip--link" href="/talk">The talk</a>
          </div>
        `,
      },
    ],
  }
  const list = {
    id: 'routes',
    title: 'Routes',
    minutes: 0,
    form: 'logo',
    anchor: 'centre',
    className: 'scene--centre',
    beats: [
      {
        html: `
          ${eyebrow('Routes')}
          <h2>One playbook, many routes</h2>
          <p class="lead">A route strings moves into a session for one audience and one time budget.</p>
          <ul class="rows">
            <li><a href="/talk">${route.title}</a> <span class="rows__meta">${route.event}, ${route.when[0]}</span></li>
          </ul>
          <p class="chips"><a class="chip chip--link" href="/glossary">Glossary and site map</a><a class="chip" href="/contact">Contact</a></p>
        `,
      },
    ],
  }
  const out = [cover]
  let prevYear = 1950
  for (const ph of phases) {
    const era = eraBefore[ph.id]
    if (era) {
      out.push(eraScene(era, prevYear))
      prevYear = era.years[1]
    }
    out.push(phaseScene(ph))
    for (const id of ph.moves) {
      const m = moveById[id]
      out.push(moveScene(m, moves.indexOf(m) + 1))
    }
  }
  out.push(list)
  return out
}

// ---------- Route ----------

function routeCover(route) {
  return {
    id: 'cover',
    title: route.title,
    minutes: 0,
    form: 'logo',
    anchor: 'centre',
    className: 'scene--cover scene--centre',
    beats: [
      {
        html: `
          <h1 class="visually-hidden">${route.title}</h1>
          ${eyebrow(route.event)}
          <p class="cover__lead">${route.subtitle} <span class="voice">${route.voice}</span></p>
          <div class="chips">${route.when.map((w) => `<span class="chip">${w}</span>`).join('')}</div>
          <div class="speaker">
            <p class="speaker__name">${route.speaker.name}</p>
            ${route.speaker.roles.map((r) => `<p>${r}</p>`).join('')}
          </div>
        `,
      },
    ],
  }
}

function quizScene(step) {
  const bar = (key, label) => `
    <div class="bar" data-key="${key}">
      <div><div class="bar__label">${label}</div><div class="bar__track"><div class="bar__fill"></div></div></div>
      <span class="bar__num">0</span>
    </div>`
  return {
    id: 'quiz',
    title: step.title,
    minutes: step.minutes,
    form: 'grid',
    className: 'scene--quiz',
    dimFrom: 0,
    mount: (el, ctx) => import('../quiz/quiz.js').then((m) => m.mountQuiz(el, ctx)),
    beats: [
      {
        form: 'grid',
        html: `
          ${eyebrow('The hook', `${step.minutes} min`)}
          <h2>Scan and play</h2>
          <div class="scan" data-no-split>
            <div class="qr" aria-label="QR code for smartmotion.web.app/play"></div>
            <div>
              <p class="lead">Open this on your phone.</p>
              <p class="scan__link">smartmotion.web.app/play</p>
            </div>
          </div>
        `,
      },
      {
        form: 'nest',
        html: `
          ${eyebrow('Part 1', 'Tools')}
          <h3>Tap the AI tools you know</h3>
          <div data-no-split>
            <div class="played" hidden>
              <p>You have already played on this device.</p>
              <p><button type="button" class="btn btn--ghost" data-go>See your result</button></p>
            </div>
            <div class="tiles" role="group" aria-label="AI tools"></div>
            <p class="quiz__actions">
              <button type="button" class="btn" data-next>Next</button>
              <span class="quiz__count"><span data-count>0</span> selected</span>
            </p>
            <p class="note">${todo('Tool list and logos, owner to supply.')}</p>
          </div>
        `,
      },
      {
        form: 'nest',
        html: `
          ${eyebrow('Part 2', 'You')}
          <h3>Which of these sounds most like you?</h3>
          <div data-no-split>
            <div class="played" hidden>
              <p>You have already played on this device.</p>
              <p><button type="button" class="btn btn--ghost" data-go>See your result</button></p>
            </div>
            <div class="options" role="group" aria-label="Four types"></div>
            <p class="note">A fun sorter, not a validated instrument.</p>
          </div>
        `,
      },
      {
        form: 'nest',
        html: `
          ${eyebrow('Your result')}
          <div data-no-split>
            <div class="result"></div>
            <p class="status"></p>
            <p><button type="button" class="btn" data-next>See the room</button></p>
          </div>
        `,
      },
      {
        form: 'nest',
        html: `
          ${eyebrow('The room', '<span data-submissions>0</span> played')}
          <h3>Live totals</h3>
          <div class="totals" data-no-split>
            <div class="totals__group">
              <h4>By level</h4>
              ${bar('level_1', 'Level 1')}${bar('level_2', 'Level 2')}${bar('level_3', 'Level 3')}
            </div>
            <div class="totals__group">
              <h4>By type</h4>
              ${bar('type_1', 'Type 1')}${bar('type_2', 'Type 2')}${bar('type_3', 'Type 3')}${bar('type_4', 'Type 4')}
            </div>
            <p class="totals__note"></p>
            <p class="note">${todo('Level and type names, owner to supply.')}</p>
          </div>
        `,
      },
    ],
  }
}

function examplesScene(step) {
  return {
    id: 'examples',
    title: step.title,
    minutes: step.minutes,
    form: 'clusters',
    beats: [
      {
        html: `
          ${eyebrow('Worked examples', `${step.minutes} min`)}
          <h2>${step.title}</h2>
          <p class="lead">Three tools, each scored against the utility formula.</p>
          <ul class="rows">${examples.map((e) => `<li>${e.name}</li>`).join('')}</ul>
        `,
      },
      ...examples.map((e) => ({
        form: 'nest',
        html: `
          ${eyebrow(step.title)}
          <h3>${e.name}</h3>
          <p>${e.body}</p>
        `,
      })),
    ],
  }
}

function questionsScene() {
  return {
    id: 'questions',
    title: 'Questions',
    minutes: 0,
    form: 'logo',
    anchor: 'centre',
    className: 'scene--centre',
    beats: [
      {
        html: `
          ${eyebrow('Thank you')}
          <h2>Questions</h2>
          <p class="lead">The moves, the frameworks and the cheatsheets stay at <a href="/">smartmotion.web.app</a>.</p>
          <p class="note">Install it from your browser menu to keep the playbook on your home screen.</p>
        `,
      },
    ],
  }
}

export function routeScenes(route) {
  let prevYear = 1950
  return route.steps.map((step) => {
    if (step.scene === 'cover') return routeCover(route)
    if (step.scene === 'quiz') return { ...quizScene(step), phase: 'design' }
    if (step.scene === 'examples') return { ...examplesScene(step), phase: 'evaluate' }
    if (step.scene === 'questions') return questionsScene()
    if (step.era) {
      const era = eras.find((e) => e.id === step.era)
      if (!era) throw new Error(`Unknown era in route: ${step.era}`)
      const scene = eraScene(era, prevYear)
      prevYear = era.years[1]
      return scene
    }
    if (step.phase) {
      const ph = phases.find((p) => p.id === step.phase)
      if (!ph) throw new Error(`Unknown phase in route: ${step.phase}`)
      return phaseScene(ph)
    }
    const m = moveById[step.move]
    if (!m) throw new Error(`Unknown move in route: ${step.move}`)
    return moveScene(m, moves.indexOf(m) + 1, { minutes: step.minutes })
  })
}
