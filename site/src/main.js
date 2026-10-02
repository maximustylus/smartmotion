import './styles/tokens.css'
import './styles/base.css'

// One app, three views. Each view is its own chunk, so a phone joining /play
// never downloads the presenter deck.
const routes = {
  '/play': () => import('./play/play.js'),
  '/styleguide': () => import('./styleguide.js'),
}

const path = location.pathname.replace(/\/+$/, '') || '/'
const load = routes[path] ?? (() => import('./presenter/presenter.js'))

load().then((view) => view.mount(document.getElementById('app')))
