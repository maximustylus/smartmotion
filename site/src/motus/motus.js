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

// Voxel map. Each entry: [x, y, z, part]. y up. Parts pick a colour.
function buildVoxels() {
  const v = []
  // Body: a rounded block 7 wide, 6 tall, 6 deep.
  for (let x = -3; x <= 3; x++)
    for (let y = 0; y <= 5; y++)
      for (let z = -3; z <= 2; z++) {
        const edge = (Math.abs(x) === 3) + (y === 0 || y === 5) + (z === -3 || z === 2)
        if (edge >= 2) continue
        v.push([x, y, z, 'body'])
      }
  // Face plate, a shade lighter, on the front.
  for (let x = -2; x <= 2; x++) for (let y = 1; y <= 4; y++) v.push([x, y, 3, 'face'])
  // Eyes.
  v.push([-1, 3, 4, 'eye'], [1, 3, 4, 'eye'])
  // Feet.
  v.push([-2, -1, 0, 'foot'], [-2, -1, 1, 'foot'], [2, -1, 0, 'foot'], [2, -1, 1, 'foot'])
  // Antenna and its tip.
  v.push([0, 6, 0, 'body'], [0, 7, 0, 'body'], [0, 8, 0, 'tip'])
  // Little ear blocks.
  v.push([-4, 3, 0, 'foot'], [4, 3, 0, 'foot'])
  return v
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
  const camera = new THREE.OrthographicCamera(-7, 7, 7, -7, 0.1, 100)
  camera.position.set(6, 7, 16)
  camera.lookAt(0, 2.6, 0)
  scene.add(new THREE.AmbientLight(0xffffff, 0.75))
  const sun = new THREE.DirectionalLight(0xffffff, 1.4)
  sun.position.set(4, 8, 6)
  scene.add(sun)

  const voxels = buildVoxels()
  const geo = new THREE.BoxGeometry(1, 1, 1)
  const mat = new THREE.MeshLambertMaterial()
  const mesh = new THREE.InstancedMesh(geo, mat, voxels.length)
  const colours = { body: new THREE.Color(), face: new THREE.Color(), eye: new THREE.Color(), foot: new THREE.Color(), tip: new THREE.Color() }
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

  function theme() {
    const css = getComputedStyle(document.documentElement)
    const get = (k) => css.getPropertyValue(k).trim()
    colours.body.set(get('--accent') || '#2f4bff')
    colours.face.copy(colours.body).lerp(new THREE.Color(get('--bg') || '#fff'), 0.35)
    colours.eye.set(get('--bg') || '#f6f5f2')
    colours.foot.set(get('--fg') || '#111')
    colours.tip.set(get('--second') || '#1f9d55')
    voxels.forEach(([, , , part], i) => mesh.setColorAt(i, colours[part]))
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
    if (reduce()) rig.rotation.z = 1.35
    else gsap.to(rig.rotation, { z: 1.35, duration: 1.2, ease: 'power3.inOut' })
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
      rig.rotation.y = Math.sin(t * 0.6) * 0.35
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
