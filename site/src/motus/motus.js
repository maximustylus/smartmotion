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

// Voxel map. The round body is fixed; the face is drawn from a pool of
// feature voxels that each expression repositions, so Motus can change
// its face without rebuilding the mesh.
const R = 4.6
const FACE_SLOTS = 22
// k is the resolution: 1 is the coarse 1960s body, 3 is a fine 21st century one.
// Coordinates stay in the same world units; the cubes get smaller.
function buildBody(k = 1) {
  const v = []
  const n = Math.ceil(5 * k)
  for (let i = -n; i <= n; i++)
    for (let j = -n; j <= n; j++)
      for (let l = -n; l <= n; l++) {
        const x = i / k, y = j / k, z = l / k
        const d = Math.sqrt(x * x + y * y + z * z)
        if (d > R || d < R - 1.6 / k) continue
        v.push([x, y, z, 'skin'])
      }
  v.push([-2, -5, 0, 'foot'], [-2, -5, 1, 'foot'], [2, -5, 0, 'foot'], [2, -5, 1, 'foot'])
  return v
}
const faceZ = (x, y) => Math.round(Math.sqrt(Math.max(0, R * R - x * x - y * y))) + 1

// Each expression: a list of [x, y] feature cells on the face.
const EYES = { open: [[-2, 1], [-1, 1], [1, 1], [2, 1]], wide: [[-2, 2], [-2, 1], [-1, 2], [-1, 1], [1, 2], [1, 1], [2, 2], [2, 1]], happy: [[-3, 1], [-2, 2], [-1, 1], [1, 1], [2, 2], [3, 1]], wink: [[-2, 1], [-1, 1], [1, 1], [2, 1], [3, 1]], shut: [[-2, 1], [-1, 1], [1, 1], [2, 1]] }
const MOUTHS = { smile: [[-3, -1], [-2, -2], [-1, -3], [0, -3], [1, -3], [2, -2], [3, -1]], grin: [[-3, -1], [-3, -2], [-2, -3], [-1, -3], [0, -3], [1, -3], [2, -3], [3, -2], [3, -1], [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1]], o: [[-1, -2], [0, -1], [1, -2], [0, -3]], flat: [[-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2]], hmm: [[-2, -3], [-1, -2], [0, -2], [1, -2]], open: [[-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1], [-2, -2], [-1, -3], [0, -3], [1, -3], [2, -2]] }
const FACES = {
  smile: [EYES.open, MOUTHS.smile],
  grin: [EYES.happy, MOUTHS.grin],
  wink: [EYES.wink, MOUTHS.smile],
  surprised: [EYES.wide, MOUTHS.o],
  thinking: [EYES.open, MOUTHS.hmm],
  calm: [EYES.open, MOUTHS.flat],
  sleepy: [EYES.shut, MOUTHS.flat],
  talk: [EYES.open, MOUTHS.open],
}
const AWAKE_FACES = ['smile', 'grin', 'wink', 'surprised', 'thinking', 'calm']

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

  // Rendered pixels. Motus starts coarse and sharpens as the eras pass.
  let SIZE = 96
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setPixelRatio(1)
  renderer.setSize(SIZE, SIZE, false)
  renderer.setClearColor(0x000000, 0)
  btn.append(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-6.8, 6.8, 7.4, -6.2, 0.1, 100)
  camera.position.set(2.5, 3, 18)
  camera.lookAt(0, 0.6, 0)
  scene.add(new THREE.AmbientLight(0xffffff, 1.1))
  const sun = new THREE.DirectionalLight(0xffffff, 1.1)
  sun.position.set(4, 8, 6)
  scene.add(sun)
  const rim = new THREE.DirectionalLight(0xffffff, 0.8)
  rim.position.set(-6, 2, -4)
  scene.add(rim)

  let k = 1
  let voxels = buildBody(k)
  const mat = new THREE.MeshLambertMaterial()
  const ink = new THREE.Color('#111114')
  const m = new THREE.Matrix4()
  const rig = new THREE.Group()
  let mesh
  function buildMesh() {
    if (mesh) {
      rig.remove(mesh)
      mesh.geometry.dispose()
    }
    const cube = 1 / k
    mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(cube, cube, cube), mat, voxels.length + FACE_SLOTS)
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array((voxels.length + FACE_SLOTS) * 3), 3)
    voxels.forEach(([x, y, z], i) => {
      m.makeTranslation(x, y, z)
      mesh.setMatrixAt(i, m)
    })
    rig.add(mesh)
  }
  buildMesh()
  let faceName = 'smile'
  function setFace(name) {
    faceName = name
    if (typeof setSmoothFace === 'function') setSmoothFace(name)
    const [eyes, mouth] = FACES[name]
    const cells = [...eyes.map((c) => [...c, 'eye']), ...mouth.map((c) => [...c, 'mouth'])]
    for (let q = 0; q < FACE_SLOTS; q++) {
      const i = voxels.length + q
      const cell = cells[q]
      if (cell) m.makeScale(k, k, k).setPosition(cell[0], cell[1], faceZ(cell[0], cell[1]))
      else m.makeScale(0.001, 0.001, 0.001).setPosition(0, 0, 0)
      mesh.setMatrixAt(i, m)
    }
    mesh.instanceMatrix.needsUpdate = true
  }
  setFace('smile')
  scene.add(rig)

  // The 21st century Motus: a smooth sphere wearing the gradient, with
  // round eyes and a sculpted mouth. Shown once the eras reach full fidelity.
  const smooth = new THREE.Group()
  smooth.visible = false
  scene.add(smooth)
  const sphereGeo = new THREE.SphereGeometry(4.6, 64, 48)
  {
    const pos = sphereGeo.attributes.position
    const colors = new Float32Array(pos.count * 3)
    for (let i = 0; i < pos.count; i++) {
      const c = gradient((pos.getX(i) + 4.6) / 9.2)
      colors.set([c.r, c.g, c.b], i * 3)
    }
    sphereGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }
  const body = new THREE.Mesh(sphereGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.32, metalness: 0.08 }))
  smooth.add(body)
  const inkMat = new THREE.MeshStandardMaterial({ color: '#111114', roughness: 0.5 })
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 16), inkMat)
  const eyeR = eyeL.clone()
  eyeL.position.set(-1.5, 1.1, 4.25)
  eyeR.position.set(1.5, 1.1, 4.25)
  smooth.add(eyeL, eyeR)
  const mouths = {}
  const arc = (rise, width = 1.6) => {
    const pts = []
    for (let i = 0; i <= 16; i++) {
      const t = i / 16
      const x = (t - 0.5) * 2 * width
      const y = -1.4 - Math.cos((t - 0.5) * Math.PI) * rise
      pts.push(new THREE.Vector3(x, y, Math.sqrt(Math.max(0, 4.6 * 4.6 - x * x - y * y)) + 0.05))
    }
    return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.22, 10, false), inkMat)
  }
  mouths.smile = arc(0.9)
  mouths.grin = arc(1.3, 2.0)
  mouths.flat = arc(0.05, 1.3)
  mouths.hmm = arc(-0.3, 1.1)
  mouths.o = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.2, 12, 24), inkMat)
  mouths.o.position.set(0, -1.8, 4.2)
  mouths.open = new THREE.Mesh(new THREE.SphereGeometry(0.75, 20, 14), inkMat)
  mouths.open.scale.set(1.2, 0.8, 0.5)
  mouths.open.position.set(0, -1.9, 4.25)
  for (const m of Object.values(mouths)) {
    m.visible = false
    smooth.add(m)
  }
  const SMOOTH_FACES = {
    smile: ['open', 'smile'], grin: ['happy', 'grin'], wink: ['wink', 'smile'], surprised: ['wide', 'o'],
    thinking: ['open', 'hmm'], calm: ['open', 'flat'], sleepy: ['shut', 'flat'], talk: ['open', 'open'],
  }
  function setSmoothFace(name) {
    const [eyes, mouth] = SMOOTH_FACES[name] ?? SMOOTH_FACES.smile
    for (const [k, m] of Object.entries(mouths)) m.visible = k === mouth
    const sy = eyes === 'shut' ? 0.12 : eyes === 'happy' ? 0.35 : eyes === 'wide' ? 1.35 : 1
    eyeL.scale.set(1, eyes === 'wink' ? 0.12 : sy, 1)
    eyeR.scale.set(1, sy, 1)
  }
  setSmoothFace('smile')

  // The gradient is the brand, so it stays the same in both themes. The
  // features flip between ink and paper so the face always reads.
  function theme() {
    const dark = getComputedStyle(document.documentElement).colorScheme.includes('dark')
    ink.set(dark ? '#0b0b0e' : '#111114')
    voxels.forEach(([x, , , part], i) => mesh.setColorAt(i, part === 'skin' ? gradient((x + 5) / 10) : ink))
    for (let q = 0; q < FACE_SLOTS; q++) mesh.setColorAt(voxels.length + q, ink)
    mesh.instanceColor.needsUpdate = true
  }
  theme()

  // ---------- States ----------

  const state = { mode: 'idle', blink: 0, lastTouch: performance.now(), talking: false }
  const IDLE_MS = 28000

  let awakeFace = 'smile'
  function setEyes(open) {
    setFace(open ? awakeFace : 'sleepy')
  }
  // A new face every so often while awake, with a little squash to sell it.
  function changeFace() {
    const pick = AWAKE_FACES.filter((f) => f !== awakeFace)
    awakeFace = pick[Math.floor(Math.random() * pick.length)]
    setFace(awakeFace)
    if (!reduce()) gsap.fromTo(rig.scale, { y: 0.9, x: 1.08 }, { y: 1, x: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' })
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
  let nextFace = 6
  let talkTick = 0
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
      smooth.position.y = rig.position.y + mesh.position.y
      smooth.rotation.y = rig.rotation.y
      smooth.rotation.z = rig.rotation.z
      if (state.talking) {
        if (t > talkTick) {
          setFace(faceName === 'talk' ? awakeFace : 'talk')
          talkTick = t + 0.18
        }
      } else {
        if (t > nextBlink) {
          setFace('sleepy')
          setTimeout(() => state.mode !== 'snooze' && !state.talking && setFace(awakeFace), 110)
          nextBlink = t + 2.5 + Math.random() * 4
        }
        if (t > nextFace) {
          changeFace()
          nextFace = t + 5 + Math.random() * 7
        }
      }
    } else if (state.mode === 'snooze' && !reduce()) {
      mesh.position.y = Math.sin(t * 1.1) * 0.05
      smooth.position.y = rig.position.y + mesh.position.y
      smooth.rotation.z = rig.rotation.z
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
    // 0: a 28 pixel sprite. 1: a smooth 256 pixel render.
    setFidelity(f) {
      const px = Math.round(28 + (256 - 28) * f)
      const level = f < 0.3 ? 1 : f < 0.7 ? 2 : 3
      if (level !== k) {
        k = level
        voxels = buildBody(k)
        buildMesh()
        theme()
        setFace(faceName)
      }
      const hi = f > 0.85
      if (hi !== smooth.visible) {
        smooth.visible = hi
        rig.visible = !hi
        if (!reduce()) gsap.fromTo(hi ? smooth.scale : rig.scale, { x: 0.7, y: 0.7, z: 0.7 }, { x: 1, y: 1, z: 1, duration: 0.7, ease: 'back.out(2)' })
      }
      if (px === SIZE) return
      SIZE = px
      renderer.setSize(SIZE, SIZE, false)
      renderer.domElement.style.imageRendering = f > 0.8 ? 'auto' : 'pixelated'
    },
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
