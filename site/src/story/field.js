import * as THREE from 'three'
import { gsap } from 'gsap'

/*
  The hero: one particle field that carries the whole talk. Every section
  gives it a form, and scrolling into a section morphs the points from the
  previous form to the next. One draw call, one geometry, no per-point
  objects, so a 2020 mid-range phone keeps 60 fps.

  Colour comes from the --field tokens so both themes own it.
*/

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Deterministic randomness, so forms look the same on every device.
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a += 0x6d2b79f5
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const gauss = (r) => {
  const u = 1 - r(), v = r()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

// Forms live in a box about 3.2 wide, 2 tall, 1 deep, centred on the origin.
const forms = {
  cloud(n, r) {
    const a = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const t = r() * Math.PI * 2
      const rad = 0.55 + gauss(r) * 0.28
      const band = gauss(r) * 0.22
      a[i * 3] = Math.cos(t) * rad * 1.5
      a[i * 3 + 1] = Math.sin(t) * rad * 0.75 + band * 0.6
      a[i * 3 + 2] = band
    }
    return a
  },
  grid(n, r) {
    const a = new Float32Array(n * 3)
    const cols = 12, rows = 8
    for (let i = 0; i < n; i++) {
      const cell = i % (cols * rows)
      const c = cell % cols, row = Math.floor(cell / cols)
      a[i * 3] = ((c + 0.5) / cols - 0.5) * 3 + gauss(r) * 0.03
      a[i * 3 + 1] = ((row + 0.5) / rows - 0.5) * 2 + gauss(r) * 0.03
      a[i * 3 + 2] = gauss(r) * 0.05
    }
    return a
  },
  pair(n, r) {
    const a = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const left = i % 2 === 0
      a[i * 3] = (left ? -0.7 : 0.7) + gauss(r) * 0.42
      a[i * 3 + 1] = gauss(r) * 0.42
      a[i * 3 + 2] = gauss(r) * 0.3
    }
    return a
  },
  columns(n, r) {
    const a = new Float32Array(n * 3)
    const heights = [0.9, 0.8, 1.0, 0.7, 0.85]
    for (let i = 0; i < n; i++) {
      const c = i % 5
      a[i * 3] = (c - 2) * 0.64 + (r() - 0.5) * 0.36
      a[i * 3 + 1] = -0.9 + r() * heights[c] * 1.8
      a[i * 3 + 2] = (r() - 0.5) * 0.36
    }
    return a
  },
  bar(n, r) {
    const a = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      a[i * 3] = (r() - 0.5) * 3.2
      a[i * 3 + 1] = (r() - 0.5) * 0.24
      a[i * 3 + 2] = (r() - 0.5) * 0.24
    }
    return a
  },
  clusters(n, r) {
    const a = new Float32Array(n * 3)
    const centres = [[-1.05, 0.2], [0, -0.35], [1.05, 0.25]]
    for (let i = 0; i < n; i++) {
      const [cx, cy] = centres[i % 3]
      a[i * 3] = cx + gauss(r) * 0.28
      a[i * 3 + 1] = cy + gauss(r) * 0.28
      a[i * 3 + 2] = gauss(r) * 0.28
    }
    return a
  },
  pyramid(n, r) {
    const a = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      // Four layers, as in Miller. More points at the base.
      const y = 1 - Math.sqrt(r()) * 1
      const w = (1 - (y + 0.0) / 1.05) * 1.5
      a[i * 3] = (r() - 0.5) * 2 * w
      a[i * 3 + 1] = y * 1.8 - 0.9
      a[i * 3 + 2] = (r() - 0.5) * 2 * w * 0.35
    }
    return a
  },
  timeline(n, r) {
    const a = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const onLine = i % 5 !== 0
      const x = (r() - 0.5) * 3.2
      a[i * 3] = x
      a[i * 3 + 1] = onLine ? (r() - 0.5) * 0.06 : gauss(r) * 0.5
      a[i * 3 + 2] = (r() - 0.5) * 0.1
    }
    return a
  },
}

const vertex = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aSeed;
  attribute float aSize;
  uniform float uMix;
  uniform float uTime;
  uniform float uDrift;
  uniform float uSpin;
  uniform vec2 uOffset;
  uniform float uScale;
  uniform vec2 uPointer;
  uniform float uPixelRatio;
  varying float vFade;

  void main() {
    // Each point starts its journey a little after the last, by seed.
    float m = clamp(uMix * 1.35 - aSeed * 0.35, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    vec3 p = mix(aFrom, aTo, m);

    // Gentle life while the field rests.
    float t = uTime * 0.35 + aSeed * 6.2831;
    p += uDrift * vec3(sin(t) * 0.035, cos(t * 1.3) * 0.035, sin(t * 0.7) * 0.05);

    // A slow turn around the vertical axis, driven by scroll.
    float c = cos(uSpin), s = sin(uSpin);
    p.xz = mat2(c, -s, s, c) * p.xz;

    // The pointer pushes nearby points away.
    vec2 d = p.xy - uPointer;
    float dist = length(d);
    p.xy += normalize(d + 0.0001) * smoothstep(0.5, 0.0, dist) * 0.25;

    p.xy = p.xy * uScale + uOffset;
    p.z *= uScale;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * uScale * (9.0 / -mv.z);
    vFade = 0.6 + 0.4 * aSeed;
  }
`

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vFade;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.18, d) * uAlpha * vFade;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
  }
`

export function createField(host) {
  const small = Math.min(innerWidth, innerHeight) < 700 || (navigator.hardwareConcurrency ?? 8) <= 4
  const N = small ? 12000 : 30000
  const r = rng(7)

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
  host.append(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50)
  camera.position.z = 6

  const geo = new THREE.BufferGeometry()
  const from = new Float32Array(N * 3)
  const to = forms.cloud(N, r)
  const seeds = new Float32Array(N)
  const sizes = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    seeds[i] = r()
    sizes[i] = 1.4 + r() * 1.6
  }
  from.set(to)
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3))
  geo.setAttribute('aFrom', new THREE.BufferAttribute(from, 3))
  geo.setAttribute('aTo', new THREE.BufferAttribute(to, 3))
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10)

  const uniforms = {
    uMix: { value: 1 },
    uTime: { value: 0 },
    uDrift: { value: reduce() ? 0 : 1 },
    uSpin: { value: 0 },
    uOffset: { value: new THREE.Vector2() },
    uScale: { value: 1 },
    uPointer: { value: new THREE.Vector2(99, 99) },
    uPixelRatio: { value: renderer.getPixelRatio() },
    uColor: { value: new THREE.Color('#2f4bff') },
    uAlpha: { value: 0.6 },
  }
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  })
  scene.add(new THREE.Points(geo, mat))

  // ---------- Theme ----------

  function theme() {
    const css = getComputedStyle(document.documentElement)
    uniforms.uColor.value.set(css.getPropertyValue('--field').trim() || '#2f4bff')
    uniforms.uAlpha.value = parseFloat(css.getPropertyValue('--field-alpha')) || 0.6
    const dark = css.colorScheme.includes('dark')
    mat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending
    mat.needsUpdate = true
  }

  // ---------- Layout: portrait stacks, landscape splits ----------

  const view = { w: 1, h: 1, portrait: false }
  function resize() {
    const w = host.clientWidth, h = host.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    const visH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
    const visW = visH * camera.aspect
    view.w = visW
    view.h = visH
    view.portrait = h > w || w < 900
    // Forms are about 3.2 by 2. Fit them into the half the copy leaves free.
    const availW = view.portrait ? visW * 0.92 : visW * 0.46
    const availH = view.portrait ? visH * 0.46 : visH * 0.8
    uniforms.uScale.value = Math.min(availW / 3.4, availH / 2.2)
    uniforms.uOffset.value.set(view.portrait ? 0 : visW * 0.25, view.portrait ? visH * 0.24 : 0)
  }
  resize()
  theme()
  addEventListener('resize', resize)

  // ---------- Pointer nudge ----------

  const target = new THREE.Vector2(99, 99)
  const toWorld = (x, y) => {
    const px = (x / innerWidth - 0.5) * view.w
    const py = -(y / innerHeight - 0.5) * view.h
    target.set((px - uniforms.uOffset.value.x) / uniforms.uScale.value, (py - uniforms.uOffset.value.y) / uniforms.uScale.value)
  }
  addEventListener('pointermove', (e) => toWorld(e.clientX, e.clientY), { passive: true })
  addEventListener('pointerleave', () => target.set(99, 99))

  // ---------- Morphing ----------

  let current = 'cloud'
  const cache = { cloud: Float32Array.from(to) }
  function morphTo(name, { instant = false } = {}) {
    if (!forms[name] || name === current) return
    current = name
    const next = (cache[name] ??= forms[name](N, rng(name.length * 31)))
    // Freeze wherever the points are right now, then head for the new form.
    const fromA = geo.attributes.aFrom.array
    const toA = geo.attributes.aTo.array
    const mix = uniforms.uMix.value
    for (let i = 0; i < N; i++) {
      let m = Math.min(1, Math.max(0, mix * 1.35 - seeds[i] * 0.35))
      m = m * m * (3 - 2 * m)
      for (let k = 0; k < 3; k++) fromA[i * 3 + k] = fromA[i * 3 + k] + (toA[i * 3 + k] - fromA[i * 3 + k]) * m
    }
    toA.set(next)
    geo.attributes.aFrom.needsUpdate = true
    geo.attributes.aTo.needsUpdate = true
    gsap.killTweensOf(uniforms.uMix)
    uniforms.uMix.value = 0
    if (instant || reduce()) uniforms.uMix.value = 1
    else gsap.to(uniforms.uMix, { value: 1, duration: 2.2, ease: 'power2.inOut' })
  }

  // ---------- Loop ----------

  const clock = new THREE.Clock()
  let running = true
  function frame() {
    if (!running) return
    requestAnimationFrame(frame)
    uniforms.uTime.value = clock.getElapsedTime()
    uniforms.uPointer.value.lerp(target, 0.08)
    renderer.render(scene, camera)
  }
  frame()
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden
    if (running) frame()
  })

  return {
    morphTo,
    theme,
    resize,
    // Scroll progress within a scene turns the field a little, so it is
    // never a still image on the shared screen.
    setProgress(p) {
      gsap.to(uniforms.uSpin, { value: (p - 0.5) * 0.5, duration: 0.6, ease: 'power2.out', overwrite: true })
    },
    get count() { return N },
  }
}
