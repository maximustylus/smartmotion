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

// A 44px round button with a sun that becomes a moon.
export function themeToggle() {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'theme-toggle'
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <mask id="theme-mask"><rect width="24" height="24" fill="#fff"/><circle class="theme-toggle__bite" cx="19" cy="6" r="7" fill="#000"/></mask>
      <circle class="theme-toggle__sun" cx="12" cy="12" r="5.5" fill="currentColor" mask="url(#theme-mask)"/>
      <g class="theme-toggle__rays" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>
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
