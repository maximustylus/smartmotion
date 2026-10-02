import '../styles/presenter.css'
import { createDeck } from './deck.js'
import { slides } from './slides.js'

export function mount(root) {
  document.title = 'GAi GAi with me'
  window.deck = createDeck(root, slides)
}
