// /styleguide: the design system on one page, for review. Not linked from the talk.

const colours = ['paper', 'muted', 'faint', 'pink', 'orange', 'yellow', 'lime', 'cyan', 'blue', 'violet', 'todo']
const surfaces = ['ink-950', 'ink-900', 'ink-800', 'ink-700', 'ink-600']

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
  const css = getComputedStyle(document.documentElement)
  const token = (name) => css.getPropertyValue(`--${name}`).trim()
  const bg = token('ink-900')

  const swatch = (name) => {
    const hex = token(name)
    const ratio = contrast(hex, bg)
    const grade = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA large' : 'Fail'
    return `<div class="sg-swatch">
      <div class="sg-chip" style="background:${hex}"></div>
      <strong>--${name}</strong>
      <span>${hex} · ${ratio.toFixed(1)}:1 on ink-900 · ${grade}</span>
    </div>`
  }

  root.innerHTML = `
    <style>
      .sg { max-width: 1100px; margin: 0 auto; padding: 48px 16px 96px; display: grid; gap: 56px; }
      .sg h2 { font-size: 40px; margin-bottom: 20px; }
      .sg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
      .sg-swatch { display: grid; gap: 4px; font-size: 14px; }
      .sg-swatch span { color: var(--muted); }
      .sg-chip { height: 72px; border-radius: 14px; border: 1px solid var(--ink-600); }
      .sg-grad { height: 72px; border-radius: 14px; }
      .sg-type > * + * { margin-top: 16px; }
      .sg-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
    </style>
    <main class="sg">
      <header>
        <p class="eyebrow">smartmotion design system</p>
        <h1 style="font-size:clamp(48px,8vw,96px)">Bright, vibrant, <span class="grad-text">cinematic</span></h1>
      </header>

      <section>
        <h2>Text and accents</h2>
        <div class="sg-grid">${colours.map(swatch).join('')}</div>
      </section>

      <section>
        <h2>Surfaces</h2>
        <div class="sg-grid">${surfaces
          .map((n) => `<div class="sg-swatch"><div class="sg-chip" style="background:${token(n)}"></div><strong>--${n}</strong><span>${token(n)}</span></div>`)
          .join('')}</div>
      </section>

      <section>
        <h2>Gradients</h2>
        <div class="sg-grid">
          ${['sunrise', 'aurora', 'meet']
            .map((g) => `<div class="sg-swatch"><div class="sg-grad" style="background:var(--grad-${g})"></div><strong>--grad-${g}</strong></div>`)
            .join('')}
        </div>
      </section>

      <section class="sg-type">
        <h2>Type</h2>
        <p class="eyebrow">Eyebrow · Inter 650, tracked caps</p>
        <h1 style="font-size:64px">Display · Bricolage Grotesque</h1>
        <h3 style="font-size:36px">Heading · Bricolage Grotesque 700</h3>
        <p style="font-size:20px; max-width:60ch">Body · Inter. On the presenter stage, body text is 42 px on a 1920 px grid, so it stays readable when Zoom shrinks the shared window to a third of the screen.</p>
        <p style="color:var(--muted)">Muted text for secondary lines.</p>
      </section>

      <section>
        <h2>Components</h2>
        <div class="sg-row">
          <button class="btn" type="button">Primary button</button>
          <button class="btn btn--ghost" type="button">Ghost button</button>
          <span class="chip">Chip</span>
          <span class="todo">Owner to supply</span>
          <kbd>O</kbd>
        </div>
        <div class="card" style="padding:24px; margin-top:20px; max-width:420px">
          <h3 style="font-size:28px; margin-bottom:8px">Card</h3>
          <p style="color:var(--muted)">Surface for quiz panels and results.</p>
        </div>
      </section>

      <section>
        <h2>Section accents</h2>
        <div class="sg-row">
          ${[1, 2, 3, 4, 5, 6, 7].map((n) => `<span class="chip" data-section="${n}" style="border-color:var(--accent)">Part ${n}</span>`).join('')}
        </div>
      </section>

      <section>
        <h2>Motion</h2>
        <p style="color:var(--muted); max-width:60ch">Presenter transitions fade out in 0.45 s, then content rises 28 stage px into place over 0.9 s with a gentle stagger. Nothing slides across the full screen. With reduced motion on, slides cross-fade in 0.3 s and nothing moves.</p>
      </section>
    </main>
  `
}
