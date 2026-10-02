// /styleguide: the design system on one page, for review. Not linked from the talk.
import { themeToggle } from './lib/theme.js'

const colours = ['fg', 'muted', 'faint', 'accent', 'second', 'todo', 'field']
const surfaces = ['bg', 'bg-2', 'line', 'accent-soft', 'todo-soft']

function luminance(hex) {
  const [r, g, b] = hex
    .replace('#', '')
    .match(/../g)
    .map((h) => parseInt(h, 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

export function mount(root) {
  document.title = 'Styleguide: smartmotion'

  function render() {
    const css = getComputedStyle(document.documentElement)
    const token = (name) => css.getPropertyValue(`--${name}`).trim()
    const bg = token('bg')
    const swatch = (name) => {
      const hex = token(name)
      const ratio = contrast(hex, bg)
      const grade = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA large' : 'Fail'
      return `<div class="sg-swatch">
        <div class="sg-chip" style="background:${hex}"></div>
        <strong>--${name}</strong>
        <span>${hex} · ${ratio.toFixed(1)}:1 on bg · ${grade}</span>
      </div>`
    }
    root.querySelector('#sg-colours').innerHTML = colours.map(swatch).join('')
    root.querySelector('#sg-surfaces').innerHTML = surfaces
      .map((n) => `<div class="sg-swatch"><div class="sg-chip" style="background:${token(n)}"></div><strong>--${n}</strong><span>${token(n)}</span></div>`)
      .join('')
  }

  root.innerHTML = `
    <style>
      .sg { max-width: 1100px; margin: 0 auto; padding: 48px 16px 96px; display: grid; gap: 56px; }
      .sg header { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
      .sg h2 { font-size: var(--text-h3); margin-bottom: 20px; }
      .sg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
      .sg-swatch { display: grid; gap: 6px; font-size: 14px; color: var(--muted); }
      .sg-swatch strong { color: var(--fg); font-weight: 600; }
      .sg-chip { height: 64px; border-radius: var(--radius-s); border: 1px solid var(--line); }
      .sg-type { display: grid; gap: 20px; }
      .sg-type p { color: var(--muted); max-width: 65ch; }
      .sg-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
    </style>
    <div class="sg">
      <header>
        <div><p class="eyebrow">Design system</p><h1>smartmotion</h1></div>
      </header>
      <section>
        <h2>Colour</h2>
        <div class="sg-grid" id="sg-colours"></div>
      </section>
      <section>
        <h2>Surfaces</h2>
        <div class="sg-grid" id="sg-surfaces"></div>
      </section>
      <section class="sg-type">
        <h2>Type</h2>
        <p class="eyebrow">Eyebrow, Geist 600, tracked</p>
        <h1>Display, Geist 700, tight</h1>
        <h2>Section heading, Geist 600</h2>
        <h3>Beat heading, Geist 600</h3>
        <p class="lead">Lead copy for the first line of a beat. <span class="voice">The talk's own voice is Instrument Serif italic.</span></p>
        <p>Body copy, Geist 400. Sized with the shorter viewport edge so a shrunken Zoom window keeps it large. Running text stays near 65 characters wide, with comfortable line spacing and real content, never filler.</p>
      </section>
      <section>
        <h2>Components</h2>
        <div class="sg-row">
          <button class="btn">Primary action</button>
          <button class="btn btn--ghost">Secondary</button>
          <span class="chip">Chip</span>
          <kbd>&rarr;</kbd>
          <span class="todo">Owner to supply</span>
        </div>
      </section>
    </div>
  `
  root.querySelector('.sg header').append(themeToggle())
  render()
  // Re-measure after a theme switch so the contrast grades stay honest.
  const obs = new MutationObserver(() => requestAnimationFrame(render))
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => requestAnimationFrame(render))
}
