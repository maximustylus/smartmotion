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
  tree(n, r) {
    // A folder tree: one root, three children, nine grandchildren.
    const a = new Float32Array(n * 3)
    const nodes = [[0, 0.85]]
    for (let i = 0; i < 3; i++) nodes.push([(i - 1) * 1.0, 0.1])
    for (let i = 0; i < 9; i++) nodes.push([(Math.floor(i / 3) - 1) * 1.0 + ((i % 3) - 1) * 0.3, -0.7])
    for (let i = 0; i < n; i++) {
      const onEdge = i % 4 === 0
      if (onEdge) {
        // Points along the links between levels.
        const child = 1 + ((i >> 2) % 12)
        const parent = child <= 3 ? 0 : 1 + Math.floor((child - 4) / 3)
        const t = r()
        const [px, py] = nodes[parent], [cx, cy] = nodes[child]
        a[i * 3] = px + (cx - px) * t + gauss(r) * 0.01
        a[i * 3 + 1] = py + (cy - py) * t + gauss(r) * 0.01
      } else {
        const [x, y] = nodes[i % nodes.length]
        a[i * 3] = x + gauss(r) * 0.07
        a[i * 3 + 1] = y + gauss(r) * 0.07
      }
      a[i * 3 + 2] = gauss(r) * 0.06
    }
    return a
  },
  rings(n, r) {
    // Three concentric rings: alone, with help, out of reach.
    const a = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const ring = i % 3
      const rad = [0.35, 0.7, 1.05][ring] + gauss(r) * 0.03
      const t = r() * Math.PI * 2
      a[i * 3] = Math.cos(t) * rad * 1.1
      a[i * 3 + 1] = Math.sin(t) * rad * 0.85
      a[i * 3 + 2] = gauss(r) * 0.05
    }
    return a
  },
  // The nest: a small, tight cloud the field rests in while a beat is copy only.
  nest(n, r) {
    const a = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const t = r() * Math.PI * 2, u = r() * 2 - 1
      const rad = 0.9 * Math.cbrt(r())
      const sq = Math.sqrt(1 - u * u)
      a[i * 3] = Math.cos(t) * sq * rad * 1.2
      a[i * 3 + 1] = u * rad + gauss(r) * 0.04
      a[i * 3 + 2] = Math.sin(t) * sq * rad
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

// Rasterise words and sample the ink, so the field can spell the wordmark.
function textForm(text, n, r) {
  const lines = text.split('\n')
  const W = 1024, H = 640
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  g.fillStyle = '#000'
  g.fillRect(0, 0, W, H)
  const size = Math.min(230, (H * 0.8) / lines.length)
  g.font = `700 ${size}px 'Geist Variable', system-ui, sans-serif`
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillStyle = '#fff'
  const gap = size * 1.02
  lines.forEach((ln, i) => g.fillText(ln, W / 2, H / 2 + (i - (lines.length - 1) / 2) * gap))
  const px = g.getImageData(0, 0, W, H).data
  const ink = []
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (px[(y * W + x) * 4] > 128) ink.push(x, y)
  const a = new Float32Array(n * 3)
  const count = ink.length / 2
  for (let i = 0; i < n; i++) {
    const k = Math.floor(r() * count)
    a[i * 3] = ((ink[k * 2] / W) - 0.5) * 3.4 + gauss(r) * 0.004
    a[i * 3 + 1] = (0.5 - ink[k * 2 + 1] / H) * 2.1 + gauss(r) * 0.004
    a[i * 3 + 2] = gauss(r) * 0.04
  }
  return a
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
  uniform float uLoupe;
  uniform float uFidelity;
  uniform float uCell;
  uniform float uPxPerUnit;
  varying float vFade;
  varying float vLens;
  varying float vFid;

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

    p.xy = p.xy * uScale + uOffset;
    p.z *= uScale;

    // Low fidelity snaps every point to a coarse grid: a dot matrix.
    vec2 snapped = (floor(p.xy / uCell) + 0.5) * uCell;
    p.xy = mix(snapped, p.xy, smoothstep(0.0, 0.45, uFidelity));
    p.z = mix(0.0, p.z, smoothstep(0.1, 0.6, uFidelity));

    // The loupe: points under the pointer part like a lens and brighten.
    vec2 d = p.xy - uPointer;
    float dist = length(d);
    float lens = smoothstep(uLoupe, 0.0, dist);
    p.xy += normalize(d + 0.0001) * lens * uLoupe * 0.55;
    vLens = lens;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    // Nearer points are larger and brighter: a little depth of field.
    float depth = clamp(0.5 + p.z * 0.6, 0.35, 1.0);
    // Size: fixed cells at low fidelity, varied and depth-sized at high, and
    // large soft splats at the top end.
    float base = aSize * uPixelRatio * uScale * (9.0 / -mv.z) * (0.7 + 0.6 * depth);
    float cellPx = uCell * uPxPerUnit * 0.82;
    float splat = base * (1.0 + 1.8 * smoothstep(0.7, 1.0, uFidelity));
    gl_PointSize = mix(cellPx, splat, smoothstep(0.0, 0.5, uFidelity)) * (1.0 + vLens * 1.4);
    vFade = mix(0.42, (0.45 + 0.55 * aSeed) * depth, smoothstep(0.2, 0.7, uFidelity));
    vFid = uFidelity;
  }
`

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vFade;
  varying float vLens;
  varying float vFid;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    // Four looks, blended by fidelity: a hard square pixel, a crisp dot, a
    // soft disc, and a gaussian splat with a long faint skirt.
    float square = step(max(abs(c.x), abs(c.y)), 0.42);
    float dot = smoothstep(0.5, 0.42, d);
    float soft = smoothstep(0.5, 0.18, d);
    float splat = exp(-d * d * 9.0) * 0.55;
    float shape = mix(mix(square, dot, smoothstep(0.0, 0.3, vFid)), mix(soft, splat, smoothstep(0.65, 1.0, vFid)), smoothstep(0.3, 0.65, vFid));
    float a = shape * uAlpha * (vFade + vLens * 0.8);
    if (a < 0.01) discard;
    gl_FragColor = vec4(mix(uColor, vec3(1.0), vLens * 0.35), min(a, 1.0));
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
    sizes[i] = 1.2 + r() * r() * 3.2
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
    uLoupe: { value: 0.6 },
    uFidelity: { value: 1 },
    uCell: { value: 0.12 },
    uPxPerUnit: { value: 100 },
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
    const css = getComputedStyle(host.parentElement ?? document.documentElement)
    const next = css.getPropertyValue('--field').trim() || '#2f4bff'
    if (reduce()) uniforms.uColor.value.set(next)
    else gsap.to(uniforms.uColor.value, { ...new THREE.Color(next), duration: 1.6, ease: 'power2.inOut', overwrite: true })
    uniforms.uAlpha.value = parseFloat(css.getPropertyValue('--field-alpha')) || 0.6
    const dark = getComputedStyle(document.documentElement).colorScheme.includes('dark')
    mat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending
    mat.needsUpdate = true
  }

  // ---------- Layout: portrait stacks, landscape splits ----------

  const view = { w: 1, h: 1, portrait: false, stage: { x: 0, y: 0, s: 1 }, nest: { x: 0, y: 0, s: 1 } }
  let mode = 'stage'
  function place(instant = false) {
    const t = view[mode]
    if (instant || reduce()) {
      uniforms.uOffset.value.set(t.x, t.y)
      uniforms.uScale.value = t.s
      return
    }
    gsap.to(uniforms.uOffset.value, { x: t.x, y: t.y, duration: 1.8, ease: 'power3.inOut', overwrite: true })
    gsap.to(uniforms.uScale, { value: t.s, duration: 1.8, ease: 'power3.inOut', overwrite: true })
  }
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
    view.stage = { x: view.portrait ? 0 : visW * 0.25, y: view.portrait ? visH * 0.24 : 0, s: Math.min(availW / 3.4, availH / 2.2) }
    // The nest: tucked top right, under the top bar, out of the copy's way.
    view.nest = { x: visW * 0.36, y: visH * 0.3, s: Math.min(visW, visH) * 0.085 }
    uniforms.uLoupe.value = Math.min(visW, visH) * 0.14
    // Dot-matrix cell: about 14 cells across the shorter edge of the stage form.
    uniforms.uCell.value = Math.max(0.03, view.stage.s * 3.4 / 46)
    uniforms.uPxPerUnit.value = (h * renderer.getPixelRatio()) / visH
    place(true)
  }
  resize()
  theme()
  addEventListener('resize', resize)

  // ---------- Pointer nudge ----------

  const target = new THREE.Vector2(99, 99)
  const toWorld = (x, y) => {
    const px = (x / innerWidth - 0.5) * view.w
    const py = -(y / innerHeight - 0.5) * view.h
    target.set(px, py)
  }
  addEventListener('pointermove', (e) => toWorld(e.clientX, e.clientY), { passive: true })
  addEventListener('pointerleave', () => target.set(99, 99))

  // ---------- Morphing ----------

  let current = 'cloud'
  const cache = { cloud: Float32Array.from(to) }
  function morphTo(name, { instant = false } = {}) {
    const isText = name.startsWith('text:')
    if ((!isText && !forms[name]) || name === current) return
    current = name
    const next = name === 'nest' ? 'nest' : 'stage'
    if (next !== mode) {
      mode = next
      place(instant)
    }
    const target = (cache[name] ??= isText ? textForm(name.slice(5), N, rng(name.length * 31)) : forms[name](N, rng(name.length * 31)))
    // Freeze wherever the points are right now, then head for the new form.
    const fromA = geo.attributes.aFrom.array
    const toA = geo.attributes.aTo.array
    const mix = uniforms.uMix.value
    for (let i = 0; i < N; i++) {
      let m = Math.min(1, Math.max(0, mix * 1.35 - seeds[i] * 0.35))
      m = m * m * (3 - 2 * m)
      for (let k = 0; k < 3; k++) fromA[i * 3 + k] = fromA[i * 3 + k] + (toA[i * 3 + k] - fromA[i * 3 + k]) * m
    }
    toA.set(target)
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
      gsap.to(uniforms.uSpin, { value: (p - 0.5) * (mode === 'nest' ? 1.2 : 0.5), duration: 0.6, ease: 'power2.out', overwrite: true })
    },
    get mode() { return mode },
    // 0 is a dot matrix, 1 is soft high-resolution splats. Tweened so the
    // picture resolves rather than switches.
    setFidelity(f, { instant = false } = {}) {
      if (instant || reduce()) uniforms.uFidelity.value = f
      else gsap.to(uniforms.uFidelity, { value: f, duration: 2.4, ease: 'power2.inOut', overwrite: true })
    },
    get count() { return N },
  }
}
