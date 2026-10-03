import * as THREE from 'three'
import { gsap } from 'gsap'
import '../styles/motus.css'
import { openChat } from './chat.js'

/*
  Motus. A pixel robot built from voxels, rendered small and scaled up with
  no smoothing, so it reads as pixel art. It travels with the story: it hops
  when the scene changes, looks around while you read, lies down and snoozes
  when it is left alone, and wakes when touched. Tapping it opens the chat.
*/

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Voxel map. Each entry: [x, y, z, part]. y up. A round face, like a
// robot emoji: a voxel sphere wearing the brand gradient left to right,
// two eyes, a smile, and an antenna whose tip is the light from the logo.
function buildVoxels() {
  const v = []
  const R = 4.6
  for (let x = -5; x <= 5; x++)
    for (let y = -5; y <= 5; y++)
      for (let z = -5; z <= 5; z++) {
        const d = Math.sqrt(x * x + y * y + z * z)
        if (d > R || d < R - 1.6) continue
        v.push([x, y, z, 'skin'])
      }
  // Face features sit proud of the sphere on the +z side.
  const face = (x, y) => Math.round(Math.sqrt(Math.max(0, R * R - x * x - y * y)))
  for (const [x, y] of [[-2, 1], [-1, 1], [2, 1], [1, 1]]) v.push([x, y, face(x, y) + 1, 'eye'])
  for (const [x, y] of [[-3, -1], [-2, -2], [-1, -3], [0, -3], [1, -3], [2, -2], [3, -1]]) v.push([x, y, face(x, y) + 1, 'mouth'])
  // Antenna and tip.
  v.push([0, 5, 0, 'stem'], [0, 6, 0, 'stem'], [0, 7, 0, 'tip'])
  // Feet, so it can stand and squash.
  v.push([-2, -5, 0, 'foot'], [-2, -5, 1, 'foot'], [2, -5, 0, 'foot'], [2, -5, 1, 'foot'])
  return v
}

// The logo gradient, fuchsia to lime, sampled by x.
const STOPS = [
  [0, '#FF1FB3'],
  [0.36, '#FF6A5A'],
  [0.68, '#FFD23F'],
  [1, '#A6FF1F'],
].map(([t, c]) => [t, new THREE.Color(c)])
function gradient(t) {
  for (let i = 1; i < STOPS.length; i++) {
    if (t <= STOPS[i][0]) {
      const [t0, c0] = STOPS[i - 1], [t1, c1] = STOPS[i]
      return c0.clone().lerp(c1, (t - t0) / (t1 - t0))
    }
  }
  return STOPS[STOPS.length - 1][1].clone()
}

export function createMotus(host, { onOpen } = {}) {
  const wrap = document.createElement('div')
  wrap.className = 'motus'
  wrap.innerHTML = `
    <button type="button" class="motus__btn" aria-label="Motus, your guide. Open the chat"></button>
    <div class="motus__zz" aria-hidden="true"><span>z</span><span>z</span><span>z</span></div>
    <div class="motus__bubble" role="status"></div>
  `
  host.append(wrap)
  const btn = wrap.querySelector('.motus__btn')
  const bubble = wrap.querySelector('.motus__bubble')

  const SIZE = 96 // rendered pixels; CSS scales it up without smoothing
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
  renderer.setPixelRatio(1)
  renderer.setSize(SIZE, SIZE, false)
  renderer.setClearColor(0x000000, 0)
  btn.append(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-8, 8, 8, -8, 0.1, 100)
  camera.position.set(3, 4, 18)
  camera.lookAt(0, 0.6, 0)
  scene.add(new THREE.AmbientLight(0xffffff, 1.1))
  const sun = new THREE.DirectionalLight(0xffffff, 1.1)
  sun.position.set(4, 8, 6)
  scene.add(sun)

  const voxels = buildVoxels()
  const geo = new THREE.BoxGeometry(1, 1, 1)
  const mat = new THREE.MeshLambertMaterial()
  const mesh = new THREE.InstancedMesh(geo, mat, voxels.length)
  const colours = { eye: new THREE.Color('#111114'), mouth: new THREE.Color('#111114'), stem: new THREE.Color('#111114'), tip: new THREE.Color('#FFF8E1'), foot: new THREE.Color('#111114') }
  const colourAttr = new Float32Array(voxels.length * 3)
  mesh.instanceColor = new THREE.InstancedBufferAttribute(colourAttr, 3)
  const m = new THREE.Matrix4()
  const eyes = []
  voxels.forEach(([x, y, z, part], i) => {
    m.makeTranslation(x, y, z)
    mesh.setMatrixAt(i, m)
    if (part === 'eye') eyes.push(i)
  })
  const rig = new THREE.Group()
  rig.add(mesh)
  scene.add(rig)

  // The gradient is the brand, so it stays the same in both themes. The
  // features flip between ink and paper so the face always reads.
  function theme() {
    const dark = getComputedStyle(document.documentElement).colorScheme.includes('dark')
    const ink = new THREE.Color(dark ? '#0b0b0e' : '#111114')
    for (const k of ['eye', 'mouth', 'stem', 'foot']) colours[k].copy(ink)
    voxels.forEach(([x, , , part], i) => mesh.setColorAt(i, part === 'skin' ? gradient((x + 5) / 10) : colours[part]))
    mesh.instanceColor.needsUpdate = true
  }
  theme()

  // ---------- States ----------

  const state = { mode: 'idle', blink: 0, lastTouch: performance.now(), talking: false }
  const IDLE_MS = 28000

  function setEyes(open) {
    for (const i of eyes) {
      const [x, y, z] = voxels[i]
      m.makeScale(1, open ? 1 : 0.15, 1).setPosition(x, y, z)
      mesh.setMatrixAt(i, m)
    }
    mesh.instanceMatrix.needsUpdate = true
  }

  function snooze() {
    if (state.mode === 'snooze') return
    state.mode = 'snooze'
    wrap.classList.add('is-snoozing')
    setEyes(false)
    if (reduce()) rig.rotation.z = 0.9
    else gsap.to(rig.rotation, { z: 0.9, duration: 1.2, ease: 'power3.inOut' })
    gsap.to(rig.position, { y: -1.2, duration: 1.2, ease: 'power3.inOut' })
    say('zzz')
  }

  function wake() {
    state.lastTouch = performance.now()
    if (state.mode !== 'snooze') return
    state.mode = 'idle'
    wrap.classList.remove('is-snoozing')
    setEyes(true)
    gsap.to(rig.rotation, { z: 0, duration: 0.5, ease: 'back.out(2)' })
    gsap.to(rig.position, { y: 0, duration: 0.5, ease: 'back.out(2)' })
    hop()
  }

  function hop() {
    if (reduce() || state.mode === 'snooze') return
    gsap.killTweensOf(rig.scale)
    const tl = gsap.timeline()
    tl.to(rig.scale, { y: 0.8, x: 1.12, duration: 0.12, ease: 'power2.in' })
      .to(rig.position, { y: 2.2, duration: 0.3, ease: 'power2.out' }, '<')
      .to(rig.scale, { y: 1.1, x: 0.95, duration: 0.2 }, '<')
      .to(rig.position, { y: 0, duration: 0.32, ease: 'power2.in' })
      .to(rig.scale, { y: 1, x: 1, duration: 0.25, ease: 'elastic.out(1, 0.5)' })
  }

  let sayTimer
  function say(text, ms = 2600) {
    bubble.textContent = text
    wrap.classList.add('is-saying')
    clearTimeout(sayTimer)
    sayTimer = setTimeout(() => wrap.classList.remove('is-snoozing', 'is-saying') || (state.mode === 'snooze' && wrap.classList.add('is-snoozing')), ms)
  }

  // ---------- Loop ----------

  const clock = new THREE.Clock()
  let running = true
  let nextBlink = 2
  function frame() {
    if (!running) return
    requestAnimationFrame(frame)
    const t = clock.getElapsedTime()
    if (!reduce() && state.mode !== 'snooze') {
      const speed = state.talking ? 7 : 2.2
      const amp = state.talking ? 0.22 : 0.12
      mesh.position.y = Math.sin(t * speed) * amp
      rig.rotation.y = Math.sin(t * 0.6) * 0.3
      mesh.rotation.z = Math.sin(t * 1.3) * 0.03
      if (t > nextBlink) {
        setEyes(false)
        setTimeout(() => state.mode !== 'snooze' && setEyes(true), 120)
        nextBlink = t + 2.5 + Math.random() * 4
      }
    } else if (state.mode === 'snooze' && !reduce()) {
      mesh.position.y = Math.sin(t * 1.1) * 0.05
    }
    if (state.mode === 'idle' && performance.now() - state.lastTouch > IDLE_MS) snooze()
    renderer.render(scene, camera)
  }
  frame()
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden
    if (running) frame()
  })

  // Any attention keeps Motus awake.
  for (const ev of ['pointerdown', 'keydown', 'scroll', 'touchstart']) window.addEventListener(ev, () => (state.lastTouch = performance.now()), { passive: true })
  window.addEventListener('scroll', () => state.mode === 'snooze' && wake(), { passive: true })

  const chat = openChat(wrap, {
    onTalking: (on) => (state.talking = on),
    onOpen: () => {
      wake()
      hop()
      onOpen?.()
    },
  })
  btn.addEventListener('click', () => {
    wake()
    hop()
    chat.toggle()
  })

  return {
    theme,
    // The story calls this when the scene changes: Motus hops along.
    travel(index, total, title) {
      wake()
      hop()
      const drift = total > 1 ? (index / (total - 1)) * 28 : 0
      gsap.to(wrap, { '--drift': `${-drift}px`, duration: 1.2, ease: 'power3.out' })
      chat.setScene(title)
    },
    say,
  }
}
