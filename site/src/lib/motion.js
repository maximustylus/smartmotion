// Shared motion settings. Every animation in the app reads these so that
// prefers-reduced-motion is honoured in one place.
const query = window.matchMedia('(prefers-reduced-motion: reduce)')

export function reducedMotion() {
  return query.matches
}

export function onReducedMotionChange(callback) {
  query.addEventListener('change', () => callback(query.matches))
}

// Presenter timings: slow and deliberate, tuned for Zoom screen share.
export const timing = {
  slideOut: 0.45,
  slideIn: 0.9,
  reveal: 0.8,
  stagger: 0.09,
  rise: 28, // stage px; small vertical drift only, never full-screen motion
  ease: 'power3.out',
}
