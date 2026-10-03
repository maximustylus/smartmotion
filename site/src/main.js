import './styles/tokens.css'
import './styles/base.css'
import { initTheme } from './lib/theme.js'
import { routes, defaultRoute } from './content/routes.js'

initTheme()

const app = document.getElementById('app')
const path = location.pathname.replace(/\/+$/, '') || '/'

if (path === '/styleguide') {
  import('./styleguide.js').then((m) => m.mount(app))
} else if (path === '/talk' || path.startsWith('/talk/') || path === '/play') {
  // /talk is the first route. /play is the QR link: the same route, opened
  // on its quiz. /talk/<id> picks another route when there are more.
  const id = path.split('/')[2]
  const route = routes[id] ?? defaultRoute
  if (path === '/play') history.replaceState(null, '', '/talk#quiz')
  import('./story/story.js').then((m) => m.mount(app, { mode: 'route', route }))
} else {
  import('./story/story.js').then((m) => m.mount(app, { mode: 'playbook' }))
}
