import '../lib/lightbox.js'
import { moves, moveById } from '../content/moves.js'
import { usecases, firstAgent } from '../content/usecases.js'
import { phases, eraBefore, eras } from '../content/journey.js'
import { tracks, workflows, compare, link, lanes } from '../content/tracks.js'
import { ledger } from '../content/ledger.js'
import { stay } from '../content/stay.js'
import { copy } from '../content/copy.js'
import { types } from '../quiz/tools.js'
import { rich, todo } from '../content/render.js'

/*
  Turns content into scenes. Two modes:
    playbook  the home: a cover, the eight moves, and the routes
    route     a guided path for one audience: cover, quiz, chosen moves,
              worked examples, questions
  A scene pins while scrolling moves through its beats. Every beat is a block
  of copy; the particle field behind takes the scene's form.
*/

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
function ledgerBeat(m) {
  const L = ledger
  return {
    form: m.form,
    html: `
      ${eyebrow(m.name, L.label)}
      <h3>${L.heading}</h3>
      <div class="ledger" data-no-split role="table" aria-label="${L.heading}">
        <div class="ledger__row ledger__row--head" role="row">
          <span class="ledger__name" role="columnheader"></span>
          ${L.cols.map((c) => `<span class="ledger__col" role="columnheader">${c}</span>`).join('')}
        </div>
        ${L.rows
          .map(
            (r) => `<div class="ledger__row" role="row">
              <span class="ledger__name" role="rowheader">${r.name}</span>
              ${r.cells.map((c, i) => `<span class="ledger__cell" role="cell" data-col="${L.cols[i]}"><b>${c.big}</b>${c.small ? `<small>${c.small}</small>` : ''}</span>`).join('')}
            </div>`,
          )
          .join('')}
      </div>
      <p class="ledger__catch">${L.catch}</p>
      ${L.learn ? `<p class="ledger__learn">${rich(L.learn)}</p>` : ''}
      <p class="note"><span class="ledger__src">${L.sources} </span><a href="${link(L.report)}" target="_blank" rel="noopener">Full research <span aria-hidden="true">&nearr;</span></a></p>
    `,
  }
}

export function moveBeats(m, n, total = moves.length) {
  const sheet = cheatsheet(m.cheatsheet)
  const source = m.framework?.source
    ? `<span class="source">${m.framework.source}${m.framework.verify ? ` ${todo('verify against the original')}` : ''}</span>`
    : ''
  // Each beat's drawing: the move's own choice (moves.js forms), else the
  // particles nest in a corner.
  const F = m.forms ?? {}
  return [
    {
      form: F.move ?? 'nest',
      html: `
        ${eyebrow(`Move ${n} of ${total}`)}
        <h2>${m.name}</h2>
        <p class="lead">${rich(m.angle)}</p>
        <p>${rich(m.principle)}</p>
      `,
    },
    // A move without a framework (Have an angle) goes straight to its example.
    ...(m.framework
      ? [{
          form: F.framework ?? m.form,
          html: `
            ${eyebrow(m.name, copy.beatLabels.framework)}
            <h3>${rich(m.framework.name)}</h3>
            <p>${rich(m.framework.note)}</p>
            ${source}
          `,
        }]
      : []),
    // A move whose example was removed (Build on solid frameworks) skips it.
    ...(m.example
      ? [{
          form: F.example ?? 'nest',
          html: `
            ${eyebrow(m.name, copy.beatLabels.example)}
            <h3>${rich(m.example.title)}</h3>
            <p>${rich(m.example.body)}</p>
          `,
        }]
      : []),
    // The Test move adds a ledger after its example: what a task costs by
    // hand, with AI and AI alone (content/ledger.js).
    ...(ledger.move === m.id ? [ledgerBeat(m)] : []),
    {
      form: F.prompt ?? 'nest',
      html: `
        ${eyebrow(m.name, copy.beatLabels.cheatsheet)}
        <h3>${m.promptHeading ?? sheet.title}</h3>
        ${sheet.intro ? `<p class="note">${sheet.intro}</p>` : ''}
        <div class="sheet" data-no-split>
          <div class="sheet__card">
            <div class="sheet__bar"><span class="sheet__dot"></span><span class="sheet__dot"></span><span class="sheet__dot"></span><span class="sheet__label">${copy.beatLabels.sheetBar}</span></div>
            ${sheet.missing ? todo(`site/src/content/cheatsheets/${m.cheatsheet}.md is missing`) : `<pre class="sheet__text" tabindex="0">${esc(sheet.prompt)}</pre>`}
          </div>
          <p class="sheet__actions">
            <button type="button" class="btn" data-copy aria-label="Copy the prompt">Copy prompt</button>
            <span class="sheet__hint">Fill in the [brackets] before you send it.</span>
            <span class="sheet__status" aria-live="polite"></span>
          </p>
          <p class="sheet__more"><a href="${link(`site/src/content/cheatsheets/${m.cheatsheet}.md`)}" target="_blank" rel="noopener">This prompt on GitHub <span aria-hidden="true">&nearr;</span></a> <a href="https://github.com/maximustylus/smartmotion/tree/main/workflows" target="_blank" rel="noopener">The five workflows <span aria-hidden="true">&nearr;</span></a></p>
        </div>
      `,
    },
  ]
}

export function moveScene(m, n, { minutes = 0, total = moves.length } = {}) {
  return {
    id: m.id,
    title: m.name,
    minutes,
    phase: m.phase,
    form: m.form,
    mount: (el, ctx) => import('./sheet.js').then((x) => x.mountSheet(el, ctx)),
    beats: moveBeats(m, n, total),
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
    agents: { form: 'agents', anchor: 'stage', cls: 'scene--wide' },
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

// Each phase has its own particle drawing, shown beside the phase intro.
const PHASE_FORM = { analyse: 'lens', design: 'pencil', develop: 'code', implement: 'rocket', evaluate: 'scale' }

export function phaseScene(phase) {
  const list = phase.moves.map((id) => moveById[id].name)
  const at = phases.indexOf(phase)
  // The ADDIE strip: five letters in a row. Phases already passed are
  // solid and quiet, the current one fills with the brand gradient, the
  // ones ahead are outlines.
  const strip = phases
    .map((p, j) => `<span class="addie__l${j === at ? ' is-on' : j < at ? ' is-done' : ''}" data-l="${p.letter}">${p.letter}</span>`)
    .join('')
  const beats = [
    {
      html: `
        ${eyebrow('ADDIE', `Phase ${at + 1} of ${phases.length}`)}
        <p class="addie" aria-hidden="true" data-no-split>${strip}</p>
        <p class="addie__words" data-no-split>${phases.map((p, j) => `<span${j === at ? ' class="is-on"' : ''}>${p.name}</span>`).join('')}</p>
        <h2>${phase.name}</h2>
        <p class="lead">${phase.line}</p>
        <ul class="rows">${list.map((n) => `<li>${n}</li>`).join('')}</ul>
      `,
    },
  ]
  // A quote page keeps a drawing of its own: Turing's short distance ahead
  // is a spyglass, and "Balancing is an act" keeps Evaluate's balance scale.
  const QUOTE_FORM = { analyse: 'spyglass', evaluate: 'scale' }
  if (phase.quote) beats.push({ form: QUOTE_FORM[phase.id] ?? 'nest', html: `${eyebrow('ADDIE', phase.name)}${quoteBlock(phase.quote)}` })
  return { id: `phase${phase.id}`, title: phase.name, minutes: 0, phase: phase.id, className: 'scene--phase', form: PHASE_FORM[phase.id] ?? 'nest', beats }
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
          ${eyebrow(copy.tagline)}
          <p class="cover__lead">${copy.coverLead}</p>
          <div class="chips">
            <a class="chip" href="#${moves[0].id}">Moves</a>
            <a class="chip" href="#wonder">Era</a>
            <a class="chip" href="/talk">Talk</a>
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
          ${eyebrow(copy.closing.eyebrow)}
          <h2>${copy.closing.heading}</h2>
          <p class="lead">${copy.closing.lead}</p>
          <p class="closing__motus">${copy.closing.motus}</p>
          <p class="chips" data-no-split><a class="chip" href="https://github.com/maximustylus/smartmotion/tree/main/site/src/content/cheatsheets" target="_blank" rel="noopener">All eight prompts &nearr;</a><a class="chip" href="https://github.com/maximustylus/smartmotion/tree/main/skills" target="_blank" rel="noopener">As Claude skills &nearr;</a><a class="chip" href="https://github.com/maximustylus/smartmotion/tree/main/workflows" target="_blank" rel="noopener">The five workflows &nearr;</a><a class="chip" href="/glossary">Glossary</a><a class="chip" href="/contact">Contact</a></p>
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
  // The use cases sit before the take-home, as in the talk (owner, 7 October 2026).
  out.push({ ...examplesScene({ title: 'Use cases' }), phase: 'evaluate' })
  out.push(takeHomeScene({ title: 'Take-home' }))
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
    form: 'play',
    className: 'scene--quiz',
    dimFrom: 0,
    mount: (el, ctx) => import('../quiz/quiz.js').then((m) => m.mountQuiz(el, ctx)),
    beats: [
      {
        form: 'play',
        html: `
          ${eyebrow('The hook', `${step.minutes} min`)}
          <h2>${copy.quiz.scanHeading}</h2>
          <div class="scan" data-no-split>
            <a class="qr-link" href="/play" target="_blank" rel="noopener" aria-label="Open the quiz at smartmotion.web.app/play"><div class="qr" role="img" aria-label="QR code for smartmotion.web.app/play"></div></a>
            <div>
              <p class="lead">${copy.quiz.scanLead}</p>
              <p class="scan__link"><a href="/play" target="_blank" rel="noopener">smartmotion.web.app/play</a></p>
            </div>
          </div>
        `,
      },
      {
        form: 'nest',
        html: `
          ${eyebrow('Part 1', 'Readiness')}
          <h3>${copy.quiz.part1Heading}</h3>
          <div data-no-split>
            <div class="played" hidden>
              <p>${copy.quiz.playedLine}</p>
              <p><button type="button" class="btn btn--ghost" data-go>See your result</button></p>
            </div>
            <div class="options" role="group" aria-label="AI readiness levels"></div>
            <p class="note">${copy.quiz.part1Note}</p>
          </div>
        `,
      },
      {
        form: 'nest',
        html: `
          ${eyebrow('Part 2', 'You')}
          <h3>${copy.quiz.part2Heading}</h3>
          <div data-no-split>
            <div class="played" hidden>
              <p>${copy.quiz.playedLine}</p>
              <p><button type="button" class="btn btn--ghost" data-go>See your result</button></p>
            </div>
            <div class="options" role="group" aria-label="Four types"></div>
            <p class="note">${copy.quiz.part2Note}</p>
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
            <p class="chips"><button type="button" class="btn" data-next>See the room</button><a class="chip" href="#" data-airq target="_blank" rel="noopener">Take the full AI Ready Quiz <span aria-hidden="true">&nearr;</span></a></p>
            <p class="note">${copy.quiz.resultNote}</p>
          </div>
        `,
      },
      {
        form: 'nest',
        html: `
          ${eyebrow('The room', '<span data-submissions>0</span> played')}
          <h3>${copy.quiz.roomHeading}</h3>
          <p class="note">${copy.quiz.roomNote}</p>
          <div class="totals" data-no-split>
            <div class="totals__group">
              <h4>By readiness</h4>
              ${bar('level_1', 'AI not-yet Aware')}${bar('level_2', 'AI Aware')}${bar('level_3', 'AI Literate')}${bar('level_4', 'AI Fluent')}
            </div>
            <div class="totals__group">
              <h4>By type</h4>
              ${types.map((t) => bar(`type_${t.id}`, t.label)).join('')}
            </div>
            <p class="totals__note"></p>
          </div>
        `,
      },
    ],
  }
}

// Use cases, by track: what one maker built on the personal track, and
// what staff already have on the corporate track.
function examplesScene(step) {
  const track = (t) => `
    ${eyebrow(copy.quiz.examplesHeading, t.title.split(':')[0])}
    <h3>${t.title.split(': ')[1].replace(/^./, (c) => c.toUpperCase())}</h3>
    <p class="lead">${t.lead}</p>
    <ul class="rows uses">${t.items.map((u) => {
      // The app's icon, if there is one; a play badge on it when it has a video.
      const icon = u.icon ? `<span class="uses__logo" aria-hidden="true"><img src="${u.icon}" alt="" width="40" height="40" decoding="async">${u.video ? '<span class="uses__icon"></span>' : ''}</span>` : u.video ? '<span class="uses__icon" aria-hidden="true"></span>' : ''
      const head = u.video
        ? `<button type="button" class="uses__play" data-video="${u.video}" data-title="${u.videoTitle ?? u.name}"${u.landscape ? ' data-landscape' : ''} aria-label="Watch: ${u.name}">${icon}<strong>${u.name}</strong></button>`
        : `<span class="uses__name">${icon}<strong>${u.name}</strong></span>`
      // A row with an icon is not split into masked lines: the icon would
      // ride inside the first line's mask and the text could not indent.
      // A live web app gets its own link under the line.
      const open = u.url ? ` <a class="uses__open" href="${u.url}" target="_blank" rel="noopener">Open ${u.short ?? u.name} <span aria-hidden="true">&nearr;</span></a>` : ''
      // On a phone: the logo, one short line and one link (open the app, or
      // watch its video). The full line shows on wider screens.
      const tagLink = u.url
        ? `<a class="uses__go" href="${u.url}" target="_blank" rel="noopener">Open <span aria-hidden="true">&nearr;</span></a>`
        : u.video
          ? `<button type="button" class="uses__go" data-video="${u.video}" data-title="${u.videoTitle ?? u.name}"${u.landscape ? ' data-landscape' : ''}>Watch <span aria-hidden="true">&#9654;</span></button>`
          : ''
      const tag = u.tag ? `<span class="uses__tag">${u.tag}${tagLink ? ` ${tagLink}` : ''}</span>` : ''
      return `<li${u.icon ? ' class="has-logo" data-no-split' : ''}>${head}<span class="uses__line">${rich(u.line)}${open}</span>${tag}</li>`
    }).join('')}</ul>
  `
  return {
    id: 'examples',
    title: step.title,
    minutes: step.minutes,
    form: 'clusters',
    beats: [
      {
        html: `
          ${eyebrow('Use cases', `${step.minutes} min`)}
          <h2>${copy.quiz.examplesHeading}</h2>
          <p class="lead">${copy.quiz.examplesLead}</p>
          <ul class="rows"><li>${usecases.personal.title}</li><li>${usecases.corporate.title}</li></ul>
        `,
      },
      // A laptop for the maker's own tools and for what is already in Teams.
      { form: 'laptop', html: track(usecases.personal) },
      { form: 'laptop', html: track(usecases.corporate) },
    ],
  }
}

// The take-home: which track are you on, then the five workflows.
function takeHomeScene(step) {
  const agentBeats = [
    {
      // The highway's two exits rise into a podium: 1st, 2nd and 3rd.
      form: 'highway>podium',
      html: `
        ${eyebrow('Take-home', 'Corporate track')}
        <h2>${firstAgent.heading}</h2>
        <p class="lead">${firstAgent.lead}</p>
        <ol class="flows steps" data-no-split>
          ${firstAgent.steps.map((st, i) => `<li><span class="flows__n">0${i + 1}</span><span class="flows__name">${st.title}</span><span class="flows__need">${st.body}</span></li>`).join('')}
        </ol>
        <p class="note">${firstAgent.note}</p>
      `,
    },
    {
      form: 'agents',
      html: `
        ${eyebrow('Take-home', copy.beatLabels.cheatsheet)}
        <h3>Describe your agent</h3>
        <p class="note">${firstAgent.promptIntro}</p>
        <div class="sheet" data-no-split>
          <div class="sheet__card">
            <div class="sheet__bar"><span class="sheet__dot"></span><span class="sheet__dot"></span><span class="sheet__dot"></span><span class="sheet__label">Prompt · paste into New agent</span></div>
            <pre class="sheet__text" tabindex="0">${esc(firstAgent.prompt)}</pre>
          </div>
          <p class="sheet__actions">
            <button type="button" class="btn" data-copy aria-label="Copy the prompt">Copy prompt</button>
            <span class="sheet__hint">Fill in the [brackets] before you send it.</span>
            <span class="sheet__status" aria-live="polite"></span>
          </p>
        </div>
      `,
    },
  ]
  return {
    id: 'takehome',
    mount: (el, ctx) => import('./sheet.js').then((x) => x.mountSheet(el, ctx)),
    title: step.title ?? 'Take-home',
    minutes: step.minutes ?? 0,
    phase: 'implement',
    form: 'nest',
    beats: [
      {
        // Two tracks: a highway with two exits.
        form: 'highway',
        html: `
          ${eyebrow('Take-home', 'Which track are you on?')}
          <h2>${copy.takehome.tracksHeading}</h2>
          <p class="lead">${copy.takehome.tracksLead}</p>
          <div class="tracks" data-no-split>
            ${tracks
              .map(
                (t) => `<a class="track" href="${link(t.file)}" target="_blank" rel="noopener">
                  <span class="track__name">${t.name}</span>
                  <span class="track__line">${t.line}</span>
                  <ul>${t.points.map((p) => `<li>${p}</li>`).join('')}</ul>
                  <span class="track__cta">Read the cost cards <span aria-hidden="true">&nearr;</span></span>
                </a>`,
              )
              .join('')}
          </div>
          <p class="note"><a href="${link(compare.file)}" target="_blank" rel="noopener">${compare.name}</a>, including the six gates and the tool limits, checked 3 October 2026.</p>
        `,
      },
      {
        form: 'clipboard',
        html: `
          ${eyebrow('Take-home', 'Five workflows')}
          <h2>${copy.takehome.workflowsHeading}</h2>
          <p class="lead">${copy.takehome.workflowsLead}</p>
          <ol class="flows" data-no-split>
            ${workflows
              .map(
                (w) => `<li><a href="${link(w.file)}" target="_blank" rel="noopener"><span class="flows__n">0${w.n}</span><span class="flows__name">${w.name}</span><span class="flows__need">${w.need}</span></a></li>`,
              )
              .join('')}
          </ol>
          <p class="note">All of it lives at <a href="https://github.com/maximustylus/smartmotion/tree/main/workflows" target="_blank" rel="noopener">github.com/maximustylus/smartmotion</a>. The eight move prompts also come as <a href="https://github.com/maximustylus/smartmotion/tree/main/skills" target="_blank" rel="noopener">Claude skills</a>. Reuse and adapt with credit.</p>
        `,
      },
      {
        form: 'toolbox',
        html: `
          ${eyebrow('Take-home', 'The tool map')}
          <h2>${copy.takehome.mapHeading}</h2>
          <p class="lead">${copy.takehome.mapLead}</p>
          <div class="lanes" data-no-split>
            ${lanes
              .map(
                (l) => `<section class="lane lane--${l.id}">
                  <h3 class="lane__name">${l.name}</h3>
                  <p class="lane__line">${l.line}</p>
                  <ol class="lane__steps">
                    ${l.steps
                      .map(
                        (st) => `<li><span class="lane__tool">${st.tool}</span><span class="badge badge--${st.track}">${st.track === 'both' ? 'both tracks' : st.track}</span><span class="lane__note">${st.note}${st.verify ? ` ${todo('verify route and limits')}` : ''}</span></li>`,
                      )
                      .join('')}
                  </ol>
                  <a class="lane__link" href="${link(workflows[l.workflow - 1].file)}" target="_blank" rel="noopener">Workflow 0${l.workflow}: ${workflows[l.workflow - 1].name} <span aria-hidden="true">&nearr;</span></a>
                </section>`,
              )
              .join('')}
          </div>
          <p class="note">Tools and routes as used on 3 October 2026. Limits and prices change; check <a href="${link(compare.file)}" target="_blank" rel="noopener">COMPARE.md</a> before you rely on one.</p>
        `,
      },
      ...agentBeats,
    ],
  }
}

// The talk's closing before Questions: AI is here to stay, and the gap is
// training (content/stay.js).
function stayScene() {
  const S = stay
  return {
    id: 'stay',
    title: S.label,
    minutes: 0,
    form: 'rocket',
    beats: [
      {
        html: `
          ${eyebrow(S.label)}
          <h2>${S.now.heading}</h2>
          <ul class="stats" data-no-split>
            ${S.now.stats.map((x) => `<li><b>${x.big}</b><span>${x.line}</span></li>`).join('')}
          </ul>
          <p class="note">${rich(S.source)}</p>
        `,
      },
      {
        html: `
          ${eyebrow(S.label, 'The gap')}
          <h2>${S.gap.heading}</h2>
          <p class="lead">${S.gap.lead}</p>
          <ul class="gaprows" data-no-split>
            ${S.gap.rows.map((r) => `<li><span>${r.why}</span><b>${r.act}</b></li>`).join('')}
          </ul>
          <p class="stay__close">${S.gap.close}</p>
          <p class="note">${rich(S.source)}</p>
        `,
      },
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
          ${eyebrow(copy.questions.eyebrow)}
          <h2>${copy.questions.heading.replace('Ai MAi?', '<span class="voice">Ai MAi?</span>')}</h2>
          <p class="lead">${copy.questions.lead.replace('smartmotion.web.app', '<a href="/">smartmotion.web.app</a>')}</p>
          <p class="chips" data-no-split><button type="button" class="chip chip--link" data-ask>Ask Motus</button><a class="chip" href="/glossary">Glossary</a><a class="chip" href="/contact">Contact</a></p>
          <p class="note">${copy.questions.note}</p>
        `,
      },
    ],
  }
}

export function routeScenes(route) {
  let prevYear = 1950
  // On a route the moves are numbered by the route itself, so the room
  // sees 1 to 5 of 5 rather than the playbook's numbers out of order.
  const routeMoves = route.steps.filter((st) => st.move).map((st) => st.move)
  return route.steps.map((step) => {
    if (step.scene === 'cover') return routeCover(route)
    if (step.scene === 'quiz') return { ...quizScene(step), phase: 'design' }
    if (step.scene === 'examples') return { ...examplesScene(step), phase: 'evaluate' }
    if (step.scene === 'questions') return questionsScene()
    if (step.scene === 'stay') return stayScene()
    if (step.scene === 'takehome') return takeHomeScene(step)
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
    return moveScene(m, routeMoves.indexOf(step.move) + 1, { minutes: step.minutes, total: routeMoves.length })
  })
}
