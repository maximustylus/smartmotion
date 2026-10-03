/*
  Theme: follows the device setting until the person chooses, then remembers
  that choice on this device. Tokens live in tokens.css under [data-theme].
*/
const KEY = 'smartmotion.theme'
const media = window.matchMedia('(prefers-color-scheme: dark)')
const listeners = new Set()

function stored() {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

export function currentTheme() {
  return stored() ?? (media.matches ? 'dark' : 'light')
}

function apply() {
  const choice = stored()
  if (choice) document.documentElement.dataset.theme = choice
  else delete document.documentElement.dataset.theme
  // The browser chrome and the installed app bar follow the page.
  requestAnimationFrame(() => {
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
    for (const m of document.querySelectorAll('meta[name="theme-color"]')) m.setAttribute('content', bg)
  })
  for (const fn of listeners) fn(currentTheme())
}

export function setTheme(value) {
  try {
    if (value) localStorage.setItem(KEY, value)
    else localStorage.removeItem(KEY)
  } catch {
    /* private mode: the choice lasts for this page only */
  }
  apply()
}

export function toggleTheme() {
  setTheme(currentTheme() === 'dark' ? 'light' : 'dark')
}

export function onThemeChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function initTheme() {
  apply()
  media.addEventListener('change', () => !stored() && apply())
}

// A 44px round button with one glyph: a disc half in light, half in shade,
// that turns over when the theme switches.
export function themeToggle() {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'theme-toggle'
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <g class="theme-toggle__disc">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/>
        <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>
      </g>
    </svg>`
  const label = () => {
    const dark = currentTheme() === 'dark'
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode')
    btn.dataset.theme = dark ? 'dark' : 'light'
  }
  label()
  onThemeChange(label)
  btn.addEventListener('click', toggleTheme)
  return btn
}
