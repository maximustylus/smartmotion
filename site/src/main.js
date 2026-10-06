import './styles/tokens.css'
import './styles/base.css'
import { initTheme } from './lib/theme.js'
import { routes, defaultRoute } from './content/routes.js'
import { shouldSplash, splash } from './story/splash.js'

initTheme()

const app = document.getElementById('app')
const path = location.pathname.replace(/\/+$/, '') || '/'

if (path === '/styleguide') {
  import('./styleguide.js').then((m) => m.mount(app))
} else if (path === '/glossary') {
  import('./pages/pages.js').then((m) => m.mountGlossary(app))
} else if (path === '/contact') {
  import('./pages/pages.js').then((m) => m.mountContact(app))
} else if (path === '/motus-info') {
  import('./pages/pages.js').then((m) => m.mountMotusInfo(app))
} else if (path === '/talk' || path.startsWith('/talk/') || path === '/play') {
  if (path !== '/play' && shouldSplash()) splash(app)
  // /talk is the first route. /play is the QR link: the same route, opened
  // on its quiz. /talk/<id> picks another route when there are more.
  const id = path.split('/')[2]
  const route = routes[id] ?? defaultRoute
  // /play opens on Part 1 (the scan beat is for the shared screen) and marks
  // this tab as an attendee's, so the quiz never treats it as the presenter's.
  if (path === '/play') {
    try { sessionStorage.setItem('smartmotion.attendee', '1') } catch {}
    history.replaceState(null, '', '/talk#quiz-2')
  }
  import('./story/story.js').then((m) => m.mount(app, { mode: 'route', route }))
} else {
  if (shouldSplash()) splash(app)
  import('./story/story.js').then((m) => m.mount(app, { mode: 'playbook' }))
}
