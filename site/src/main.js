import './styles/tokens.css'
import './styles/base.css'
import { initTheme } from './lib/theme.js'

initTheme()

const app = document.getElementById('app')
const path = location.pathname.replace(/\/+$/, '') || '/'

if (path === '/styleguide') {
  import('./styleguide.js').then((m) => m.mount(app))
} else {
  // The QR code and short link point at /play. The quiz is section 1 of the
  // same story everyone sees, so /play is simply the story opened there.
  if (path === '/play') history.replaceState(null, '', '/#s1')
  import('./story/story.js').then((m) => m.mount(app))
}
