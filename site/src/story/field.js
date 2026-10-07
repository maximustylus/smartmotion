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
  // A thin ring and a loose triangle of three clusters, so the nest is not
  // always the same shape.
  nestring(n, r) {
    const a = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const t = r() * Math.PI * 2
      const rad = 0.9 + gauss(r) * 0.06
      a[i * 3] = Math.cos(t) * rad * 1.1
      a[i * 3 + 1] = Math.sin(t) * rad
      a[i * 3 + 2] = gauss(r) * 0.05
    }
    return a
  },
  nesttri(n, r) {
    const a = new Float32Array(n * 3)
    const c = [[-0.8, -0.5], [0.8, -0.5], [0, 0.85]]
    for (let i = 0; i < n; i++) {
      const [cx, cy] = c[i % 3]
      a[i * 3] = cx + gauss(r) * 0.28
      a[i * 3 + 1] = cy + gauss(r) * 0.28
      a[i * 3 + 2] = gauss(r) * 0.2
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

// The brand gradient, sampled by t in 0..1.
const BRAND = [[0, [0xff, 0x1f, 0xb3]], [0.36, [0xff, 0x6a, 0x5a]], [0.68, [0xff, 0xd2, 0x3f]], [1, [0xa6, 0xff, 0x1f]]]
function brand(t) {
  for (let i = 1; i < BRAND.length; i++) {
    if (t <= BRAND[i][0]) {
      const [t0, c0] = BRAND[i - 1], [t1, c1] = BRAND[i], k = (t - t0) / (t1 - t0)
      return c0.map((v, j) => (v + (c1[j] - v) * k) / 255)
    }
  }
  return BRAND[BRAND.length - 1][1].map((v) => v / 255)
}

// The M: two walls of a path to a vanishing point, as in the icon.
// Rasterised and sampled, coloured by the brand gradient across its width.
function logoForm(n, r) {
  const S = 512
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')
  g.fillStyle = '#000'
  g.fillRect(0, 0, S, S)
  g.fillStyle = '#fff'
  for (const pts of [[[76, 384], [190, 128], [304, 384]], [[208, 384], [322, 128], [436, 384]]]) {
    g.beginPath()
    pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)))
    g.closePath()
    g.fill()
  }
  g.fillStyle = '#000'
  g.beginPath()
  g.moveTo(203, 396)
  g.lineTo(309, 396)
  g.lineTo(256, 276)
  g.closePath()
  g.fill()
  const px = g.getImageData(0, 0, S, S).data
  const ink = []
  for (let y = 0; y < S; y += 2) for (let x = 0; x < S; x += 2) if (px[(y * S + x) * 4] > 128) ink.push(x, y)
  const a = new Float32Array(n * 3)
  const col = new Float32Array(n * 4)
  const count = ink.length / 2
  for (let i = 0; i < n; i++) {
    const k = Math.floor(r() * count)
    const x = ink[k * 2], y = ink[k * 2 + 1]
    a[i * 3] = ((x - 256) / 360) * 3.4 + gauss(r) * 0.004
    a[i * 3 + 1] = ((276 - y) / 360) * 3.4 + 0.1 + gauss(r) * 0.004
    a[i * 3 + 2] = gauss(r) * 0.03
    const [cr, cg, cb] = brand((x - 76) / 360)
    col.set([cr, cg, cb, 1], i * 4)
  }
  return { positions: a, colors: col }
}

// Original pixel figures in the spirit of the robot heroes of 1963, 1979
// and 1984. Drawn here, not copied from anywhere. Letters are palette keys.
const PALETTE = { k: [0.07, 0.07, 0.09], w: [0.96, 0.96, 0.94], r: [0.93, 0.2, 0.2], b: [0.15, 0.45, 0.95], y: [1, 0.82, 0.25], s: [0.98, 0.8, 0.65], g: [0.55, 0.57, 0.62], c: [0.2, 0.7, 0.9], d: [0.62, 0.1, 0.12], l: [0.8, 0.82, 0.87] }
const SPRITES = [
  // A boy robot: black spiked hair, a red belt and red boots.
  ['......kk.k......', '.....kkkkkk.....', '....kkssssk.....', '....ksssssk.....', '....kskssks.....', '.....ssssss.....', '......ssss......', '.....ssssss.....', '....ssssssss....', '....s.ssss.s....', '......rrrr......', '......ssss......', '......ssss......', '.....rr..rr.....', '....rrr..rrr....', '....rrr..rrr....'],
  // A round blue cat robot with a white face and a yellow bell.
  ['......bbbb......', '....bbbbbbbb....', '...bbwwwwwwbb...', '...bwwkwwkwwb...', '..bbwwwrwwwwbb..', '..bbwwwwwwwwbb..', '...bwwwwwwwwb...', '....bbwwwwbb....', '.....rrrrrr.....', '....bwwyywwb....', '...bbwwwwwwbb...', '...bbwwwwwwbb...', '....bbwwwwbb....', '.....bb..bb.....', '.....ww..ww.....', '.....ww..ww.....'],
  // A truck robot, taller than the others: blue helmet with ear fins, a
  // light-blue visor, a red chest with two windows, grey arms, blue legs.
  ['......bbbb......', '.....bbbbbb.....', '..b..bbbbbb..b..', '..bb.bccccb.bb..', '..bb.bkkkkb.bb..', '...bbbbbbbbbb...', '....gggggggg....', '..ggrrrrrrrrgg..', '.gg.rrccccrr.gg.', '.gg.rrccccrr.gg.', '.gg.rrrrrrrr.gg.', '.g..rryyyyrr..g.', '.g..rrrrrrrr..g.', '....bbbbbbbb....', '....bbb..bbb....', '....bbb..bbb....', '....bbb..bbb....', '...bbbb..bbbb...', '...kkkk..kkkk...', '..kkkkk..kkkkk..'],
]
// The same truck robot in vehicle mode, seen from the side and facing
// left: a flat-nosed cab with no trailer. Amber marker lights on the roof,
// a windscreen and a side window split by a dark pillar, a silver stripe
// over a blue one, a chrome exhaust stack behind the cab, a yellow
// headlight over a silver bumper, a grey fuel tank, a blue rear deck and
// wheels with grey hubs. It drives in along the timeline, then transforms
// into the standing figure above.
const TRUCK = [
  '..y.y.y...g.....',
  '.rrrrrrrr.g.....',
  'rrrrrrrrrrg.....',
  'rcccdrcccrg.....',
  'rcccdrcccrg.....',
  'rrrrrrrrrrg.....',
  'rlllllllrrg.....',
  'rbbbbbbbrrg.....',
  'rrrrrrrrrrbbbbbb',
  'yrrrrrrrrrbbbbbb',
  'lll.kkkk.gg.kkkk',
  'lll.kggk.gg.kggk',
  '....kkkk....kkkk',
]

// 1997: a chessboard seen from above, dark squares filled, with a few
// pieces standing as small towers.
function chessForm(n, r) {
  const a = new Float32Array(n * 3)
  const sq = 0.3
  const pieces = [[0, 0], [1, 0], [2, 0], [5, 0], [6, 0], [7, 0], [3, 1], [4, 1], [1, 7], [6, 7], [3, 6], [4, 6], [2, 5], [5, 2]]
  const boardN = Math.floor(n * 0.7)
  for (let i = 0; i < boardN; i++) {
    let cx, cy
    do {
      cx = Math.floor(r() * 8)
      cy = Math.floor(r() * 8)
    } while ((cx + cy) % 2 === 0)
    a[i * 3] = (cx - 3.5) * sq + (r() - 0.5) * sq * 0.92
    a[i * 3 + 1] = (cy - 3.5) * sq * 0.72 + (r() - 0.5) * sq * 0.66
    a[i * 3 + 2] = (r() - 0.5) * 0.02
  }
  for (let i = boardN; i < n; i++) {
    const [cx, cy] = pieces[Math.floor(r() * pieces.length)]
    const t = r()
    a[i * 3] = (cx - 3.5) * sq + gauss(r) * 0.03 * (1 - t)
    a[i * 3 + 1] = (cy - 3.5) * sq * 0.72 + t * 0.42
    a[i * 3 + 2] = 0.1 + gauss(r) * 0.03
  }
  return { positions: a }
}

// 2011: a phone, drawn as an outline, with a voice wave speaking inside it.
function phoneForm(n, r) {
  const a = new Float32Array(n * 3)
  const w = 1.1, h = 2.1, rad = 0.22
  const edgeN = Math.floor(n * 0.45)
  for (let i = 0; i < edgeN; i++) {
    // Walk the rounded rectangle by perimeter fraction.
    const t = r()
    const per = 2 * (w - 2 * rad) * 2 + 2 * (h - 2 * rad) * 2 + 2 * Math.PI * rad
    let d = t * per
    let x, y
    const sw = 2 * (w - 2 * rad), sh = 2 * (h - 2 * rad), q = (Math.PI * rad) / 2
    if (d < sw) { x = -(w - 2 * rad) + d; y = h } // top
    else if ((d -= sw) < q) { const an = d / rad; x = (w - 2 * rad) + Math.sin(an) * rad; y = h - rad + Math.cos(an) * rad }
    else if ((d -= q) < sh) { x = w; y = h - rad - d }
    else if ((d -= sh) < q) { const an = d / rad; x = (w - 2 * rad) + Math.cos(an) * rad; y = -(h - rad) - Math.sin(an) * rad }
    else if ((d -= q) < sw) { x = (w - 2 * rad) - d; y = -h }
    else if ((d -= sw) < q) { const an = d / rad; x = -(w - 2 * rad) - Math.sin(an) * rad; y = -(h - rad) - Math.cos(an) * rad }
    else if ((d -= q) < sh) { x = -w; y = -(h - rad) + d }
    else { const an = (d - sh) / rad; x = -(w - 2 * rad) - Math.cos(an) * rad; y = h - rad + Math.sin(an) * rad }
    a[i * 3] = x * 0.5 + gauss(r) * 0.012
    a[i * 3 + 1] = y * 0.5 + gauss(r) * 0.012
    a[i * 3 + 2] = gauss(r) * 0.02
  }
  for (let i = edgeN; i < n; i++) {
    // Bars of a waveform across the middle of the screen.
    const bar = Math.floor(r() * 9)
    const amp = [0.12, 0.3, 0.5, 0.75, 0.95, 0.75, 0.5, 0.3, 0.12][bar]
    a[i * 3] = (bar - 4) * 0.1 + (r() - 0.5) * 0.06
    a[i * 3 + 1] = (r() - 0.5) * amp * 0.9
    a[i * 3 + 2] = gauss(r) * 0.02
  }
  return { positions: a }
}

// 2022: a conversation. Speech bubbles stacking left and right.
function bubblesForm(n, r) {
  const a = new Float32Array(n * 3)
  const bubbles = [[-0.55, 0.75, 1.5, 0.42], [0.55, 0.12, 1.3, 0.42], [-0.45, -0.52, 1.7, 0.42], [0.65, -1.0, 0.9, 0.3]]
  for (let i = 0; i < n; i++) {
    const [cx, cy, bw, bh] = bubbles[i % bubbles.length]
    const x = (r() - 0.5) * bw, y = (r() - 0.5) * bh
    // Rounded corners: reject points outside the rounded box.
    const rx = Math.max(0, Math.abs(x) - bw / 2 + bh / 2), ry = Math.max(0, Math.abs(y) - 0)
    if (rx * rx + ry * ry > (bh / 2) * (bh / 2) && Math.abs(y) > 0) { i--; continue }
    a[i * 3] = cx + x
    a[i * 3 + 1] = cy + y
    a[i * 3 + 2] = gauss(r) * 0.02
  }
  return { positions: a }
}

// A long horizontal timeline, running off both edges of the screen with a
// tick every decade, and the three figures standing on it. Their points
// carry their own colours; the line takes the field colour. The third
// station holds the truck in vehicle mode by default, or the standing
// robot once it has transformed. Both variants share the line and the
// first two figures point for point, so only the truck's points move.
const STATIONS = [-1.2, 0, 1.2]
const LINE_HALF = 3.4
function timeline80sForm(n, r, stage = 'truck') {
  const a = new Float32Array(n * 3)
  const col = new Float32Array(n * 4)
  const cell = 3.4 / 46
  const snapTo = (v) => Math.round(v / cell) * cell
  const lineN = Math.floor(n * 0.36)
  const tickN = Math.floor(n * 0.04)
  for (let i = 0; i < lineN; i++) {
    a[i * 3] = (r() - 0.5) * LINE_HALF * 2
    a[i * 3 + 1] = -0.7 + (r() - 0.5) * 0.05
    a[i * 3 + 2] = (r() - 0.5) * 0.05
  }
  // Decade ticks, short uprights spaced along the whole line.
  const ticks = []
  for (let x = -LINE_HALF + 0.1; x <= LINE_HALF; x += 0.6) ticks.push(snapTo(x))
  for (let i = lineN; i < lineN + tickN; i++) {
    a[i * 3] = ticks[Math.floor(r() * ticks.length)] + (r() - 0.5) * 0.02
    a[i * 3 + 1] = -0.7 - cell * (0.6 + r() * 2.2)
    a[i * 3 + 2] = (r() - 0.5) * 0.04
  }
  const xs = STATIONS.map(snapTo)
  // The figures stand on the line, so the whole picture sits a little
  // low to keep its centre of mass in the middle of the stage.
  const BASE = -0.7
  let i = lineN + tickN
  const per = Math.floor((n - i) / 3)
  const figures = [SPRITES[0], SPRITES[1], stage === 'robot' ? SPRITES[2] : TRUCK]
  figures.forEach((rows, si) => {
    const cells = []
    rows.forEach((row, y) => [...row].forEach((ch, x) => ch !== '.' && cells.push([x, y, PALETTE[ch]])))
    const h = rows.length, w = rows[0].length
    for (let j = 0; j < per && i < n; j++, i++) {
      const [cx, cy, rgb] = cells[Math.floor(r() * cells.length)]
      a[i * 3] = xs[si] + (cx - Math.floor(w / 2) + 0.5) * cell
      a[i * 3 + 1] = BASE + (h - cy + 0.5) * cell
      a[i * 3 + 2] = (r() - 0.5) * 0.04
      col.set([rgb[0], rgb[1], rgb[2], 1], i * 4)
    }
  })
  for (; i < n; i++) {
    a[i * 3] = (r() - 0.5) * LINE_HALF * 2
    a[i * 3 + 1] = -0.7 + (r() - 0.5) * 0.05
  }
  return { positions: a, colors: col }
}

// ---------- ADDIE B-roll ----------
// One drawing per phase, made of weighted parts and coloured with the
// brand gradient from left to right: a magnifying glass for Analyse, a
// pencil drawing a curve for Design, code brackets for Develop, a rocket
// for Implement and a balance scale for Evaluate.
const TAU = Math.PI * 2
const seg = (x0, y0, x1, y1, th = 0.03) => (r) => {
  const t = r()
  return [x0 + (x1 - x0) * t + gauss(r) * th, y0 + (y1 - y0) * t + gauss(r) * th]
}
const arc = (cx, cy, rad, a0, a1, th = 0.02) => (r) => {
  const a = a0 + (a1 - a0) * r(), q = rad + gauss(r) * th
  return [cx + Math.cos(a) * q, cy + Math.sin(a) * q]
}
const disc = (cx, cy, rad) => (r) => {
  const a = r() * TAU, q = Math.sqrt(r()) * rad
  return [cx + Math.cos(a) * q, cy + Math.sin(a) * q]
}
const box = (cx, cy, w, h) => (r) => [cx + (r() - 0.5) * w, cy + (r() - 0.5) * h]
const bezier = (p0, p1, p2, p3, th = 0.015) => (r) => {
  const t = r(), u = 1 - t
  const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t]
  return [0, 1].map((j) => k[0] * p0[j] + k[1] * p1[j] + k[2] * p2[j] + k[3] * p3[j] + gauss(r) * th)
}
function drawing(parts, { rot = 0, sx = 1 } = {}) {
  const total = parts.reduce((sum, p) => sum + p[0], 0)
  const c = Math.cos(rot), sn = Math.sin(rot)
  return (n, r) => {
    const a = new Float32Array(n * 3)
    const col = new Float32Array(n * 4)
    for (let i = 0; i < n; i++) {
      let k = r() * total, j = 0
      while (k > parts[j][0] && j < parts.length - 1) k -= parts[j++][0]
      const [x, y] = parts[j][1](r)
      const X = (x * c - y * sn) * sx, Y = x * sn + y * c
      a[i * 3] = X
      a[i * 3 + 1] = Y
      a[i * 3 + 2] = gauss(r) * 0.03
      // A tagged part is a lightning bolt: amber, and its alpha carries the
      // bolt's number so the shader can strike each one on its own beat.
      if (parts[j][2] !== undefined) col.set([1, 0.78, 0.12, 2 + parts[j][2]], i * 4)
      else {
        const [cr, cg, cb] = brand(Math.min(1, Math.max(0, (X + 1.5) / 3)))
        col.set([cr, cg, cb, 1], i * 4)
      }
    }
    return { positions: a, colors: col }
  }
}

// Zone of Proximal Development: a target. Three rings for the three zones,
// a solid bullseye, and an arrow that has landed in the middle.
const targetForm = (() => {
  const cx = -0.25, cy = -0.05
  // The arrow comes in from the upper right and stops at the centre.
  const dx = 0.82, dy = 0.57
  const tail = [cx + dx * 1.75, cy + dy * 1.75]
  const feather = (side, back) => {
    const base = [cx + dx * (1.45 + back), cy + dy * (1.45 + back)]
    return seg(base[0], base[1], base[0] + dx * 0.28 - dy * 0.2 * side, base[1] + dy * 0.28 + dx * 0.2 * side, 0.012)
  }
  return drawing([
    [22, arc(cx, cy, 0.95, 0, TAU, 0.02)],
    [18, arc(cx, cy, 0.64, 0, TAU, 0.02)],
    [13, arc(cx, cy, 0.34, 0, TAU, 0.018)],
    [10, disc(cx, cy, 0.12)],
    [16, seg(cx, cy, tail[0], tail[1], 0.016)],
    [3, feather(1, 0)],
    [3, feather(-1, 0)],
    [3, feather(1, 0.14)],
    [3, feather(-1, 0.14)],
    // Stand legs, so it reads as a target and not just rings.
    [4, seg(cx - 0.45, cy - 0.84, cx - 0.7, cy - 1.02, 0.016)],
    [4, seg(cx + 0.45, cy - 0.84, cx + 0.7, cy - 1.02, 0.016)],
  ])
})()

// Have an angle: two arms meeting at a vertex, the arc that measures the
// gap between them with a protractor's ticks, and a beam of light filling
// the wedge. The two arms are the two factors; the angle is yours.
const angleForm = (() => {
  const V = [-1.3, -0.78], A = 0.66
  const polar = (rad, a) => [V[0] + Math.cos(a) * rad, V[1] + Math.sin(a) * rad]
  const arm = (a) => (r) => {
    const [x, y] = polar(r() * 2.85, a)
    return [x + gauss(r) * 0.022, y + gauss(r) * 0.022]
  }
  const ticks = (r) => {
    const k = Math.floor(r() * 7)
    return polar(0.95 + r() * (k % 3 === 0 ? 0.16 : 0.09), (A * k) / 6 + gauss(r) * 0.004)
  }
  // The beam thins out as it travels, like light leaving a torch.
  const beam = (r) => polar(1.2 + Math.pow(r(), 1.6) * 1.6, 0.04 + r() * (A - 0.08))
  return drawing([
    [26, arm(0)],
    [26, arm(A)],
    [14, (r) => polar(0.95 + gauss(r) * 0.014, r() * A)],
    [8, ticks],
    [5, disc(V[0], V[1], 0.08)],
    [3, disc(...polar(2.85, 0), 0.06)],
    [3, disc(...polar(2.85, A), 0.06)],
    [15, beam],
  ])
})()

// A smooth curve through a list of points (Catmull-Rom), sampled evenly
// along its length. Closed curves loop; `ripple` scallops the line so an
// outline reads as a row of folds rather than a plain edge.
function curve(pts, { closed = false, th = 0.01, ripple = 0, waves = 0 } = {}) {
  const n = pts.length
  const at = (i) => (closed ? pts[((i % n) + n) % n] : pts[Math.min(n - 1, Math.max(0, i))])
  const segs = closed ? n : n - 1
  const point = (i, t) => {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2)
    const t2 = t * t, t3 = t2 * t
    return [0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3))
  }
  // Segment lengths, so points spread evenly rather than bunching.
  const len = Array.from({ length: segs }, (_, i) => {
    const a = point(i, 0), m = point(i, 0.5), z = point(i, 1)
    return Math.hypot(m[0] - a[0], m[1] - a[1]) + Math.hypot(z[0] - m[0], z[1] - m[1])
  })
  const total = len.reduce((x, y) => x + y, 0)
  return (r) => {
    let d = r() * total, i = 0
    while (d > len[i] && i < segs - 1) d -= len[i++]
    const t = d / len[i]
    const [x, y] = point(i, t)
    if (!ripple) return [x + gauss(r) * th, y + gauss(r) * th]
    // Push the point out along the curve's normal by a scalloped amount.
    const [x2, y2] = point(i, Math.min(1, t + 0.01))
    const nx = -(y2 - y), ny = x2 - x, nl = Math.hypot(nx, ny) || 1
    const done = (len.slice(0, i).reduce((p, q) => p + q, 0) + d) / total
    const off = ripple * Math.abs(Math.sin(done * Math.PI * waves)) + gauss(r) * th
    return [x - (nx / nl) * off, y - (ny / nl) * off]
  }
}

// Begin with the end in mind: a brain seen from the side, facing left,
// with lightning striking it from above. A brainstorm. The outline is
// scalloped into folds; inside run the central and lateral fissures and
// the smaller folds of each lobe; behind and below sit the cerebellum
// with its fine leaves and the brain stem.
const brainForm = (() => {
  const oy = -0.14
  const P = (list) => list.map(([x, y]) => [x, y + oy])
  const outline = P([
    [-0.95, -0.25], [-1.12, -0.05], [-1.12, 0.2], [-0.95, 0.42], [-0.65, 0.56], [-0.25, 0.63], [0.2, 0.62], [0.6, 0.52],
    [0.92, 0.33], [1.08, 0.08], [1.05, -0.18], [0.85, -0.32], [0.55, -0.3], [0.3, -0.36], [0.05, -0.5], [-0.3, -0.55],
    [-0.6, -0.48], [-0.75, -0.34], [-0.85, -0.28],
  ])
  const folds = [
    // Lateral fissure, then the central sulcus with a fold either side.
    [9, [[-0.74, -0.22], [-0.3, -0.08], [0.1, -0.02], [0.46, 0.1]]],
    [6, [[0.0, 0.6], [-0.06, 0.4], [0.05, 0.2], [-0.02, 0.04]]],
    [5, [[-0.35, 0.58], [-0.4, 0.4], [-0.28, 0.24], [-0.34, 0.06]]],
    [5, [[0.3, 0.58], [0.36, 0.42], [0.26, 0.26], [0.33, 0.12]]],
    // Frontal lobe.
    [4, [[-0.98, 0.26], [-0.78, 0.32], [-0.62, 0.2], [-0.48, 0.3]]],
    [4, [[-1.02, 0.02], [-0.82, 0.08], [-0.66, -0.04], [-0.5, 0.06]]],
    [3, [[-0.7, 0.5], [-0.62, 0.4], [-0.5, 0.46]]],
    // Parietal and occipital lobes.
    [4, [[0.52, 0.44], [0.66, 0.3], [0.6, 0.16], [0.8, 0.1]]],
    [3, [[0.78, -0.06], [0.92, -0.1], [0.96, 0.06]]],
    [3, [[0.55, -0.02], [0.68, -0.12], [0.78, -0.24]]],
    // Temporal lobe.
    [5, [[-0.58, -0.33], [-0.26, -0.3], [0.05, -0.24], [0.32, -0.2]]],
    [4, [[-0.36, -0.45], [-0.06, -0.41], [0.2, -0.34]]],
  ]
  const leaf = (k) => (r) => {
    // Cerebellum: nested arcs fanning from its front edge.
    const a = Math.PI * (1.02 + 0.96 * r())
    const q = 0.12 + k * 0.085 + gauss(r) * 0.006
    return [0.7 + Math.cos(a) * q * 1.25, -0.4 + oy + Math.sin(a) * q]
  }
  const bolt = (x, top, hit, k) => {
    const d = top - hit
    const pts = [[x + 0.12, top], [x - 0.1, top - d * 0.38], [x + 0.1, top - d * 0.5], [x - 0.06, top - d * 0.8], [x + 0.02, hit]]
    return [
      [5, (r) => {
        const i = Math.floor(r() * 4), t = r()
        return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t + gauss(r) * 0.012, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t + gauss(r) * 0.012]
      }, k],
      // A spark where it lands, flashing with the bolt.
      [1.5, (r) => { const a = r() * TAU, q = Math.abs(gauss(r)) * 0.07; return [x + 0.02 + Math.cos(a) * q, hit + Math.sin(a) * q] }, k],
    ]
  }
  return drawing([
    [34, curve(outline, { closed: true, th: 0.008, ripple: 0.035, waves: 26 })],
    ...folds.map(([w, pts]) => [w, curve(P(pts), { th: 0.008 })]),
    [5, leaf(0)],
    [5, leaf(1)],
    [6, leaf(2)],
    [3, curve(P([[0.16, -0.46], [0.2, -0.66], [0.27, -0.86]]), { th: 0.008 })],
    [3, curve(P([[0.36, -0.5], [0.38, -0.68], [0.43, -0.86]]), { th: 0.008 })],
    ...bolt(-0.85, 1.12, 0.3, 0),
    ...bolt(-0.42, 1.16, 0.46, 1),
    ...bolt(0.02, 1.1, 0.5, 2),
    ...bolt(0.46, 1.16, 0.42, 3),
    ...bolt(0.86, 1.08, 0.26, 4),
  ])
})()

// Analyse: a magnifying glass over a small bar chart.
const lensForm = drawing([
  [40, arc(-0.2, 0.2, 0.62, 0, TAU, 0.025)],
  [5, arc(-0.2, 0.2, 0.46, 1.9, 2.9, 0.01)],
  [30, seg(0.27, -0.27, 0.85, -0.85, 0.045)],
  [4, box(-0.45, 0.025, 0.12, 0.25)],
  [7, box(-0.2, 0.125, 0.12, 0.45)],
  [10, box(0.05, 0.225, 0.12, 0.65)],
])

// Use it safely: a magnifying glass over a speech bubble. The bubble's
// last line breaks into dashes, a made-up answer, and the lens holds an
// amber question mark: check before it goes out.
const checkForm = (() => {
  const L = -1.35, R = 0.75, T = 0.85, B = -0.35, k = 0.18
  const dash = (x) => seg(x, -0.08, x + 0.16, -0.08, 0.012)
  return drawing([
    [10, seg(L + k, T, R - k, T, 0.016)],
    [10, seg(L + k, B, R - k, B, 0.016)],
    [5, seg(L, B + k, L, T - k, 0.016)],
    [5, seg(R, B + k, R, T - k, 0.016)],
    [2, arc(L + k, T - k, k, Math.PI / 2, Math.PI, 0.012)],
    [2, arc(R - k, T - k, k, 0, Math.PI / 2, 0.012)],
    [2, arc(L + k, B + k, k, Math.PI, 1.5 * Math.PI, 0.012)],
    [2, arc(R - k, B + k, k, 1.5 * Math.PI, TAU, 0.012)],
    [3, seg(L + 0.35, B, L + 0.1, B - 0.38, 0.014)],
    [3, seg(L + 0.1, B - 0.38, L + 0.7, B, 0.014)],
    [7, seg(-1.1, 0.55, 0.45, 0.55, 0.012)],
    [6, seg(-1.1, 0.24, 0.2, 0.24, 0.012)],
    [1.5, dash(-1.1)], [1.5, dash(-0.82)], [1.5, dash(-0.54)], [1.5, dash(-0.26)],
    [26, arc(0.75, -0.3, 0.5, 0, TAU, 0.025)],
    [16, seg(1.1, -0.66, 1.55, -1.1, 0.045)],
    [4, arc(0.75, -0.14, 0.16, -0.5, Math.PI, 0.014), 0],
    [2, seg(0.75, -0.3, 0.75, -0.42, 0.014), 0],
    [1.5, disc(0.75, -0.6, 0.04), 0],
  ])
})()

// Agents: a hub that sends work out along six spokes to six tasks, inside
// a dashed ring for the person who oversees them. Thick strokes, so the
// drawing survives the soft splats of the latest era.
const agentsForm = (() => {
  const parts = [[10, disc(0, 0, 0.2)]]
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + (i * TAU) / 6
    const x = Math.cos(a) * 1.05, y = Math.sin(a) * 0.82
    parts.push([5, seg(Math.cos(a) * 0.26, Math.sin(a) * 0.22, x * 0.78, y * 0.78, 0.03)])
    parts.push([7, arc(x, y, 0.16, 0, TAU, 0.03)])
  }
  for (let i = 0; i < 18; i++) {
    const a0 = (i * TAU) / 18
    parts.push([1.2, (r) => {
      const a = a0 + r() * (TAU / 36), q = 1.42 + gauss(r) * 0.025
      return [Math.cos(a) * q, Math.sin(a) * q * 0.72]
    }])
  }
  return drawing(parts)
})()

// Design: a pencil finishing a curve, with the pen tool's anchors and handle.
const pencilForm = (() => {
  const T = [-0.25, -0.45], u = [0.643, 0.766], v = [-0.766, 0.643], w = 0.13
  const at = (t, sd) => [T[0] + u[0] * t + v[0] * sd, T[1] + u[1] * t + v[1] * sd]
  const span = (t0, t1, half) => (r) => {
    const t = t0 + (t1 - t0) * r()
    return at(t, (r() - 0.5) * 2 * (typeof half === 'function' ? half(t) : half))
  }
  const edge = (sd) => (r) => at(0.35 + r() * 1.1, sd + gauss(r) * 0.012)
  const cone = (t) => (w * t) / 0.35
  return drawing([
    [5, span(0, 0.12, cone)],
    [7, span(0.14, 0.35, cone)],
    [13, edge(w)],
    [13, edge(-w)],
    [7, edge(0)],
    [8, span(0.35, 1.45, w)],
    [6, span(1.47, 1.56, w)],
    [9, span(1.6, 1.78, w)],
    [22, bezier([-1.5, -0.2], [-1.1, 0.55], [-0.7, -1.0], T)],
    [3, box(-1.5, -0.2, 0.1, 0.1)],
    [4, seg(-1.5, -0.2, -1.1, 0.55, 0.006)],
    [3, disc(-1.1, 0.55, 0.05)],
  ])
})()

// Develop: code brackets with a slash between them.
const codeForm = drawing([
  [18, seg(-0.75, 0.7, -1.45, 0, 0.04)],
  [18, seg(-1.45, 0, -0.75, -0.7, 0.04)],
  [18, seg(0.75, 0.7, 1.45, 0, 0.04)],
  [18, seg(1.45, 0, 0.75, -0.7, 0.04)],
  [22, seg(-0.28, -0.85, 0.28, 0.85, 0.04)],
])

// Implement: a rocket leaving, tilted to the right, with its exhaust behind.
const rocketForm = drawing(
  [
    [9, seg(-0.24, -0.35, -0.24, 0.4, 0.018)],
    [9, seg(0.24, -0.35, 0.24, 0.4, 0.018)],
    [8, bezier([-0.24, 0.4], [-0.24, 0.7], [-0.1, 0.9], [0, 0.98], 0.016)],
    [8, bezier([0.24, 0.4], [0.24, 0.7], [0.1, 0.9], [0, 0.98], 0.016)],
    [8, box(0, 0.02, 0.44, 0.74)],
    [6, arc(0, 0.2, 0.11, 0, TAU, 0.012)],
    [4, seg(-0.24, -0.35, 0.24, -0.35, 0.018)],
    [5, seg(-0.24, -0.02, -0.52, -0.5, 0.018)],
    [4, seg(-0.52, -0.5, -0.24, -0.35, 0.018)],
    [5, seg(0.24, -0.02, 0.52, -0.5, 0.018)],
    [4, seg(0.52, -0.5, 0.24, -0.35, 0.018)],
    [24, (r) => { const t = r(); return [gauss(r) * 0.13 * (1 - t * 0.55), -0.4 - t * 0.85] }],
    [6, (r) => { const t = r(); return [gauss(r) * 0.22, -1.0 - t * 0.5] }],
  ],
  { rot: -0.6 },
)

// Evaluate: a balance scale, not quite level. Balancing is an act.
const scaleForm = drawing([
  [12, seg(0, -0.75, 0, 0.72, 0.022)],
  [8, seg(-0.45, -0.8, 0.45, -0.8, 0.028)],
  [4, disc(0, 0.74, 0.07)],
  [16, seg(-1.15, 0.66, 1.15, 0.8, 0.022)],
  [4, seg(-1.15, 0.66, -1.45, -0.05, 0.008)],
  [4, seg(-1.15, 0.66, -0.85, -0.05, 0.008)],
  [4, seg(-1.45, -0.05, -0.85, -0.05, 0.012)],
  [10, arc(-1.15, -0.05, 0.3, Math.PI, TAU, 0.018)],
  [7, disc(-1.15, -0.18, 0.13)],
  [4, seg(1.15, 0.8, 0.85, 0.09, 0.008)],
  [4, seg(1.15, 0.8, 1.45, 0.09, 0.008)],
  [4, seg(0.85, 0.09, 1.45, 0.09, 0.012)],
  [10, arc(1.15, 0.09, 0.3, Math.PI, TAU, 0.018)],
  [3, disc(1.15, 0.0, 0.08)],
])

// ---------- Talk drawings, chosen by the owner on 7 October 2026 ----------

// An outlined rectangle, as four edges.
const rect = (x0, y0, x1, y1, th = 0.018, w = 1) => [
  [3 * w, seg(x0, y0, x1, y0, th)],
  [3 * w, seg(x0, y1, x1, y1, th)],
  [2 * w, seg(x0, y0, x0, y1, th)],
  [2 * w, seg(x1, y0, x1, y1, th)],
]
// A stroke through points, segment by segment.
const poly = (pts, w = 3, th = 0.022) => pts.slice(1).map((q, i) => [w, seg(pts[i][0], pts[i][1], q[0], q[1], th)])

// The utility formula: a toolbox, with a screwdriver and a wrench showing.
const toolboxForm = drawing([
  ...rect(-1.25, -0.85, 1.25, 0.2, 0.02, 4),
  [10, box(0, -0.33, 2.4, 0.95)],
  ...rect(-1.25, 0.2, 1.25, 0.38, 0.016, 2),
  [10, arc(0, 0.38, 0.38, 0, Math.PI, 0.022)],
  [4, box(0, -0.02, 0.26, 0.16)],
  [7, seg(-0.55, 0.38, -0.9, 0.95, 0.03)],
  [3, seg(-0.9, 0.95, -0.98, 1.08, 0.012)],
  [7, seg(0.5, 0.38, 0.78, 0.9, 0.035)],
  [5, arc(0.84, 1.0, 0.13, -0.4, 3.6, 0.018)],
])

// Two ways to count cost: a dollar sign.
const dollarForm = drawing([
  [48, curve([[0.48, 0.55], [0.1, 0.74], [-0.38, 0.62], [-0.42, 0.25], [0, 0.02], [0.42, -0.22], [0.4, -0.6], [-0.08, -0.74], [-0.5, -0.52]], { th: 0.045 })],
  [22, seg(0, -1.0, 0, 1.0, 0.035)],
])

// Score it: a notepad with a tick and ruled lines, and a pencil writing.
const notePencilForm = (() => {
  const T = [0.12, -0.5], u = [0.58, 0.81], v = [-0.81, 0.58], w = 0.1
  const at = (t, sd) => [T[0] + u[0] * t + v[0] * sd, T[1] + u[1] * t + v[1] * sd]
  const span = (t0, t1, half) => (r) => {
    const t = t0 + (t1 - t0) * r()
    return at(t, (r() - 0.5) * 2 * (typeof half === 'function' ? half(t) : half))
  }
  const edge = (sd) => (r) => at(0.28 + r() * 1.25, sd + gauss(r) * 0.01)
  const rings = []
  for (let i = 0; i < 5; i++) rings.push([2, arc(-1.05 + i * 0.3, 0.85, 0.07, 0, TAU, 0.01)])
  const lines = []
  for (let i = 0; i < 4; i++) lines.push([4, seg(-1.1, 0.45 - i * 0.28, -0.05, 0.45 - i * 0.28, 0.01)])
  return drawing([
    ...rect(-1.3, -0.95, 0.15, 0.85, 0.018, 3),
    ...rings,
    ...lines,
    [5, seg(-0.95, -0.6, -0.78, -0.75, 0.02)],
    [7, seg(-0.78, -0.75, -0.42, -0.35, 0.02)],
    [4, span(0, 0.28, (t) => (w * t) / 0.28)],
    [10, edge(w)],
    [10, edge(-w)],
    [6, span(0.28, 1.53, w)],
    [6, span(1.56, 1.72, w)],
  ])
})()

// When a demo looks finished: a runner breaking the tape at the finish.
const runnerForm = (() => {
  const flag = []
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) if ((i + j) % 2 === 0) flag.push([2, box(1.28 + i * 0.1, 0.5 + j * 0.1, 0.09, 0.09)])
  return drawing([
    [10, seg(-1.6, -0.88, 1.6, -0.88, 0.016)],
    [6, disc(0.2, 0.62, 0.14)],
    [7, seg(0.12, 0.45, -0.1, -0.08, 0.035)],
    ...poly([[0.05, 0.32], [0.32, 0.12], [0.5, 0.32]], 3, 0.025),
    ...poly([[0.05, 0.32], [-0.28, 0.2], [-0.36, -0.06]], 3, 0.025),
    ...poly([[-0.1, -0.08], [0.2, -0.42], [0.14, -0.86]], 4, 0.03),
    ...poly([[-0.1, -0.08], [-0.42, -0.42], [-0.75, -0.36]], 4, 0.03),
    [10, seg(1.24, -0.88, 1.24, 0.8, 0.022)],
    [6, seg(0.16, 0.22, 1.24, 0.22, 0.01)],
    [6, bezier([0.08, 0.22], [-0.3, 0.3], [-0.6, 0.0], [-1.05, 0.1], 0.01)],
    ...flag,
  ])
})()

// One maker, and Teams: a laptop.
const laptopForm = (() => {
  const keys = []
  for (let j = 0; j < 3; j++) keys.push([5, (r) => [-1.05 + r() * 2.1, -0.3 - j * 0.09 + gauss(r) * 0.006]])
  return drawing([
    ...rect(-1.05, -0.15, 1.05, 0.95, 0.02, 4),
    ...rect(-0.92, -0.04, 0.92, 0.84, 0.01, 1.5),
    [6, seg(-0.75, 0.62, 0.2, 0.62, 0.01)],
    [6, seg(-0.75, 0.42, 0.5, 0.42, 0.01)],
    [6, seg(-0.75, 0.22, -0.05, 0.22, 0.01)],
    [8, seg(-1.05, -0.15, 1.05, -0.15, 0.018)],
    [8, seg(-1.5, -0.62, 1.5, -0.62, 0.02)],
    [4, seg(-1.05, -0.15, -1.5, -0.62, 0.018)],
    [4, seg(1.05, -0.15, 1.5, -0.62, 0.018)],
    ...keys,
    ...rect(-0.3, -0.58, 0.3, -0.42, 0.008, 0.8),
  ])
})()

// Build on solid frameworks: a hammer.
const hammerForm = drawing(
  [
    [14, seg(-0.07, -1.0, -0.07, 0.48, 0.012)],
    [14, seg(0.07, -1.0, 0.07, 0.48, 0.012)],
    [10, box(0, -0.26, 0.12, 1.45)],
    ...rect(-0.55, 0.48, 0.5, 0.82, 0.016, 2.5),
    [12, box(-0.02, 0.65, 1.0, 0.32)],
    [6, bezier([-0.55, 0.78], [-0.85, 0.82], [-1.0, 0.6], [-1.05, 0.38], 0.03)],
    [5, bezier([-0.55, 0.52], [-0.72, 0.52], [-0.82, 0.42], [-0.86, 0.34], 0.02)],
  ],
  { rot: 0.5 },
)

// Use it safely: a hard hat.
const hardhatForm = drawing([
  [26, arc(0, -0.25, 0.95, 0, Math.PI, 0.025)],
  [12, (r) => { const a = r() * Math.PI, q = Math.sqrt(r()) * 0.93; return [Math.cos(a) * q, -0.25 + Math.sin(a) * q] }],
  [10, seg(-0.16, -0.25, -0.16, 0.66, 0.014)],
  [10, seg(0.16, -0.25, 0.16, 0.66, 0.014)],
  [16, seg(-1.45, -0.27, 1.45, -0.27, 0.03)],
  [6, bezier([-1.45, -0.27], [-1.2, -0.45], [1.2, -0.45], [1.45, -0.27], 0.015)],
])

// Two tracks: a highway into the distance with two exits, one each side.
const highwayForm = (() => {
  const dashes = []
  for (let i = 0; i < 6; i++) {
    const t0 = i / 6, t1 = t0 + 0.07
    const y0 = -0.95 + t0 * 1.85, y1 = -0.95 + t1 * 1.85
    dashes.push([2, seg(0, y0, 0, y1, 0.012)])
  }
  return drawing([
    [14, seg(-1.3, -0.95, -0.18, 0.9, 0.02)],
    [14, seg(1.3, -0.95, 0.18, 0.9, 0.02)],
    ...dashes,
    [9, bezier([-0.82, -0.15], [-1.0, 0.05], [-1.3, 0.2], [-1.65, 0.24], 0.02)],
    [7, bezier([-0.66, 0.12], [-0.85, 0.3], [-1.15, 0.42], [-1.6, 0.46], 0.02)],
    [9, bezier([0.82, -0.15], [1.0, 0.05], [1.3, 0.2], [1.65, 0.24], 0.02)],
    [7, bezier([0.66, 0.12], [0.85, 0.3], [1.15, 0.42], [1.6, 0.46], 0.02)],
    ...rect(-1.45, 0.6, -1.0, 0.85, 0.01, 0.8),
    [2, seg(-1.22, 0.38, -1.22, 0.6, 0.01)],
    ...rect(1.0, 0.6, 1.45, 0.85, 0.01, 0.8),
    [2, seg(1.22, 0.38, 1.22, 0.6, 0.01)],
  ], { sx: 0.62 })
})()

// Your first agent: a podium, first, second and third.
const podiumForm = drawing([
  ...rect(-0.42, -0.9, 0.42, 0.32, 0.02, 4),
  ...rect(-1.3, -0.9, -0.42, -0.12, 0.02, 3),
  ...rect(0.42, -0.9, 1.3, -0.42, 0.02, 2.5),
  [8, box(0, -0.29, 0.8, 1.18)],
  [5, box(-0.86, -0.51, 0.84, 0.74)],
  [4, box(0.86, -0.66, 0.84, 0.44)],
  [5, seg(0, -0.4, 0, 0.12, 0.022)],
  [2, seg(0, 0.12, -0.08, 0.04, 0.02)],
  [5, curve([[-1.0, -0.3], [-0.86, -0.22], [-0.74, -0.32], [-1.0, -0.62], [-0.72, -0.62]], { th: 0.02 })],
  [4, curve([[0.72, -0.56], [0.86, -0.5], [0.94, -0.58], [0.84, -0.65], [0.94, -0.72], [0.86, -0.8], [0.72, -0.76]], { th: 0.02 })],
  [6, disc(0, 0.6, 0.14)],
  [4, seg(0, 0.46, 0, 0.34, 0.03)],
])

// The stroll: a walker on a winding path, footprints behind, a tree ahead.
const strollForm = (() => {
  const steps = []
  for (let i = 0; i < 5; i++) steps.push([1.5, disc(-1.45 + i * 0.22, -0.78 + (i % 2) * 0.07, 0.035)])
  return drawing([
    [14, bezier([-1.65, -0.85], [-0.6, -0.95], [0.4, -0.6], [1.65, -0.72], 0.02)],
    ...steps,
    [6, disc(-0.25, 0.55, 0.13)],
    [7, seg(-0.25, 0.4, -0.22, -0.18, 0.03)],
    ...poly([[-0.24, 0.3], [-0.05, 0.05], [0.0, -0.12]], 3, 0.022),
    ...poly([[-0.24, 0.3], [-0.42, 0.06], [-0.48, -0.1]], 3, 0.022),
    ...poly([[-0.22, -0.18], [-0.05, -0.5], [0.05, -0.8]], 4, 0.026),
    ...poly([[-0.22, -0.18], [-0.38, -0.5], [-0.52, -0.78]], 4, 0.026),
    [6, seg(1.05, -0.68, 1.05, -0.1, 0.03)],
    [14, (r) => { const a = r() * TAU, q = Math.sqrt(r()); return [1.05 + Math.cos(a) * q * 0.42, 0.25 + Math.sin(a) * q * 0.38] }],
  ])
})()

const vertex = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aSeed;
  attribute float aSize;
  attribute vec4 aColor;
  uniform float uMix;
  uniform float uTime;
  uniform float uDrift;
  uniform float uSpin;
  uniform vec2 uOffset;
  uniform vec2 uWobble;
  uniform float uScale;
  uniform vec2 uPointer;
  uniform float uPixelRatio;
  uniform float uLoupe;
  uniform float uFidelity;
  uniform float uCell;
  uniform float uPxPerUnit;
  uniform float uSnap;
  uniform float uCollapse;
  uniform float uReveal;
  uniform float uRevealMode;
  varying float vFade;
  varying float vLens;
  varying float vFid;
  varying float vThin;
  varying vec4 vColor;

  void main() {
    // Alpha above 1 marks a lightning bolt and carries its number.
    float bolt = step(1.5, aColor.a);
    vColor = vec4(aColor.rgb, min(aColor.a, 1.0));
    // Each bolt strikes on its own beat: a hard flash, then an echo.
    float ph = fract(uTime * 0.42 + (aColor.a - 2.0) * 0.37);
    float strike = bolt * ((1.0 - smoothstep(0.03, 0.16, ph)) + 0.55 * step(0.2, ph) * (1.0 - smoothstep(0.22, 0.32, ph)));
    // Each point starts its journey a little after the last, by seed.
    float m = clamp(uMix * 1.35 - aSeed * 0.35, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    vec3 p = mix(aFrom, aTo, m);

    // Scroll-built diagrams. Mode 1 rises from the ground (a pyramid),
    // mode 2 grows from the top down (a tree), mode 3 spreads from the
    // centre (rings), mode 4 sweeps left to right (a timeline, a bar).
    float hidden = 0.0;
    if (uRevealMode > 0.5) {
      float key = uRevealMode < 1.5 ? (p.y + 1.0) / 2.0
                : uRevealMode < 2.5 ? (1.0 - p.y) / 2.0
                : uRevealMode < 3.5 ? length(p.xy) / 1.3
                : (p.x + 1.7) / 3.4;
      hidden = 1.0 - smoothstep(key - 0.08, key + 0.04, uReveal);
      p *= 1.0 - hidden;
    }

    // The utility formula: the last factor drops to zero, then the product.
    if (uCollapse > 0.0) {
      float isLast = step(1.0, p.x);
      float h = p.y + 0.9;
      float lastScale = mix(1.0, 0.02, smoothstep(0.0, 0.55, uCollapse) * isLast);
      float restScale = mix(1.0, 0.05, smoothstep(0.55, 1.0, uCollapse) * (1.0 - isLast));
      p.y = -0.9 + h * lastScale * restScale;
    }

    // Gentle life while the field rests.
    float t = uTime * 0.35 + aSeed * 6.2831;
    p += uDrift * vec3(sin(t) * 0.035, cos(t * 1.3) * 0.035, sin(t * 0.7) * 0.05);

    // A slow turn around the vertical axis, driven by scroll.
    float c = cos(uSpin), s = sin(uSpin);
    p.xz = mat2(c, -s, s, c) * p.xz;

    p.xy = p.xy * uScale + uOffset + uWobble;
    p.z *= uScale;

    // Low fidelity snaps every point to a coarse grid: a dot matrix.
    vec2 snapped = (floor(p.xy / uCell) + 0.5) * uCell;
    p.xy = mix(snapped, p.xy, max(smoothstep(0.0, 0.45, uFidelity), 1.0 - uSnap));
    p.z = mix(0.0, p.z, smoothstep(0.1, 0.6, uFidelity));

    // The loupe: points under the pointer part like a lens and brighten.
    vec2 d = p.xy - uPointer;
    float dist = length(d);
    float lens = smoothstep(uLoupe, 0.0, dist);
    p.xy += normalize(d + 0.0001) * lens * uLoupe * 0.35;
    vLens = lens * 0.7;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    // Nearer points are larger and brighter: a little depth of field.
    float depth = clamp(0.5 + p.z * 0.6, 0.35, 1.0);
    // Size: fixed cells at low fidelity, varied and depth-sized at high, and
    // large soft splats at the top end.
    float base = aSize * uPixelRatio * uScale * (9.0 / -mv.z) * (0.7 + 0.6 * depth);
    float cellPx = uCell * uPxPerUnit * 0.7;
    float splat = base * (1.0 + 1.8 * smoothstep(0.7, 1.0, uFidelity));
    gl_PointSize = mix(cellPx, splat, smoothstep(0.0, 0.5, uFidelity)) * (1.0 + vLens * 1.4);
    vFade = mix(0.09, (0.45 + 0.55 * aSeed) * depth, smoothstep(0.2, 0.7, uFidelity)) * (1.0 - hidden);
    // Bolts are a faint trace between strikes and blaze when they hit.
    vFade *= mix(1.0, 0.12 + strike * 6.0, bolt);
    gl_PointSize *= 1.0 + strike * 0.5;
    vFid = uFidelity;
    vThin = aSeed;
  }
`

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vFade;
  varying float vLens;
  varying float vFid;
  varying float vThin;
  varying vec4 vColor;
  uniform float uUseColor;
  uniform float uSplat;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    // Four looks, blended by fidelity: a hard square pixel, a crisp dot, a
    // soft disc, and a gaussian splat with a long faint skirt.
    float square = step(max(abs(c.x), abs(c.y)), 0.42);
    float dot = smoothstep(0.5, 0.42, d);
    float soft = smoothstep(0.5, 0.18, d);
    float splat = exp(-d * d * 9.0) * uSplat;
    float shape = mix(mix(square, dot, smoothstep(0.0, 0.3, vFid)), mix(soft, splat, smoothstep(0.65, 1.0, vFid)), smoothstep(0.3, 0.65, vFid));
    float a = shape * uAlpha * (vFade + vLens * 0.8);
    if (vFid < 0.3 && vThin > 0.5) discard;
    if (a < 0.01) discard;
    vec3 base = mix(uColor, vColor.rgb, vColor.a * uUseColor);
    gl_FragColor = vec4(mix(base, vec3(1.0), vLens * 0.35), min(a, 1.0));
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
  geo.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(N * 4), 4))
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10)

  const uniforms = {
    uMix: { value: 1 },
    uTime: { value: 0 },
    uDrift: { value: reduce() ? 0 : 1 },
    uSpin: { value: 0 },
    uOffset: { value: new THREE.Vector2() },
    uWobble: { value: new THREE.Vector2() },
    uScale: { value: 1 },
    uPointer: { value: new THREE.Vector2(99, 99) },
    uPixelRatio: { value: renderer.getPixelRatio() },
    uLoupe: { value: 0.6 },
    uFidelity: { value: 1 },
    uCell: { value: 0.12 },
    uPxPerUnit: { value: 100 },
    uUseColor: { value: 0 },
    uSnap: { value: 1 },
    uSplat: { value: 0.55 },
    uCollapse: { value: 0 },
    uReveal: { value: 1 },
    uRevealMode: { value: 0 },
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
    uniforms.uSplat.value = dark ? 0.55 : 0.95
    mat.needsUpdate = true
  }

  // ---------- Layout: portrait stacks, landscape splits ----------

  const view = { w: 1, h: 1, portrait: false, stage: { x: 0, y: 0, s: 1 }, nest: { x: 0, y: 0, s: 1 }, nests: [] }
  let mode = 'stage'
  let nestSlot = 0
  const CELLS = 46 // matrix cells across a form's width
  function place(instant = false) {
    const t = view[mode]
    const cell = Math.max(0.03, (t.s * 3.4) / CELLS)
    if (instant || reduce()) {
      uniforms.uOffset.value.set(t.x, t.y)
      uniforms.uScale.value = t.s
      uniforms.uCell.value = cell
      return
    }
    gsap.to(uniforms.uOffset.value, { x: t.x, y: t.y, duration: 1.8, ease: 'power3.inOut', overwrite: true })
    gsap.to(uniforms.uScale, { value: t.s, duration: 1.8, ease: 'power3.inOut', overwrite: true })
    gsap.to(uniforms.uCell, { value: cell, duration: 1.8, ease: 'power3.inOut', overwrite: true })
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
    // Perches for the nest, away from the copy. Portrait keeps the copy low,
    // so the perches sit high; landscape keeps it left, so they sit right.
    const ns = Math.min(visW, visH) * 0.085
    view.nests = view.portrait
      ? [
          { x: visW * 0.34, y: visH * 0.32, s: ns },
          { x: -visW * 0.34, y: visH * 0.3, s: ns },
          { x: 0, y: visH * 0.36, s: ns * 0.9 },
          { x: visW * 0.3, y: visH * 0.12, s: ns * 0.8 },
        ]
      : [
          { x: visW * 0.38, y: visH * 0.3, s: ns },
          { x: visW * 0.3, y: -visH * 0.22, s: ns },
          { x: visW * 0.12, y: visH * 0.34, s: ns * 0.9 },
          { x: visW * 0.4, y: 0, s: ns * 0.8 },
        ]
    view.nest = view.nests[nestSlot % view.nests.length]
    // Centre stage: the form sits in the upper middle with the copy beneath.
    view.centre = { x: 0, y: visH * 0.25, s: Math.min((visW * 0.86) / 3.4, (visH * 0.38) / 2.4) }
    // Wide: the form fills the screen behind the copy.
    view.wide = { x: 0, y: visH * 0.06, s: Math.min((visW * 0.96) / 3.4, (visH * 0.72) / 2.2) }
    uniforms.uLoupe.value = Math.min(visW, visH) * 0.028
    // Dot-matrix cell: about 14 cells across the shorter edge of the stage form.
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
  const cache = { cloud: { positions: Float32Array.from(to) } }
  const SPECIAL = { logo: logoForm, timeline80s: timeline80sForm, 'timeline80s:robot': (n, r) => timeline80sForm(n, r, 'robot'), chess: chessForm, phone: phoneForm, bubbles: bubblesForm, lens: lensForm, pencil: pencilForm, code: codeForm, rocket: rocketForm, scale: scaleForm, brain: brainForm, angle: angleForm, target: targetForm, check: checkForm, agents: agentsForm, toolbox: toolboxForm, dollar: dollarForm, notepencil: notePencilForm, runner: runnerForm, laptop: laptopForm, hammer: hammerForm, hardhat: hardhatForm, highway: highwayForm, podium: podiumForm, stroll: strollForm }
  function build(name) {
    if (name.startsWith('text:')) return { positions: textForm(name.slice(5), N, rng(name.length * 31)) }
    // Variants after the colon share the base form's seed, so their
    // common points land in the same places.
    if (SPECIAL[name]) return SPECIAL[name](N, rng(name.split(':')[0].length * 31))
    return { positions: forms[name](N, rng(name.length * 31)) }
  }

  const NESTS = ['nest', 'nestring', 'nesttri']
  // Freeze every point where it is right now, so the next move starts
  // from what is on screen rather than from the last target.
  function freeze() {
    const fromA = geo.attributes.aFrom.array
    const toA = geo.attributes.aTo.array
    const mix = uniforms.uMix.value
    for (let i = 0; i < N; i++) {
      let m = Math.min(1, Math.max(0, mix * 1.35 - seeds[i] * 0.35))
      m = m * m * (3 - 2 * m)
      for (let k = 0; k < 3; k++) fromA[i * 3 + k] = fromA[i * 3 + k] + (toA[i * 3 + k] - fromA[i * 3 + k]) * m
    }
  }
  // Move to a new set of positions without changing the current form name.
  function retarget(positions, duration, ease) {
    freeze()
    geo.attributes.aTo.array.set(positions)
    geo.attributes.aFrom.needsUpdate = true
    geo.attributes.aTo.needsUpdate = true
    gsap.killTweensOf(uniforms.uMix)
    uniforms.uMix.value = 0
    gsap.to(uniforms.uMix, { value: 1, duration, ease })
  }
  // Timed follow-ups to an entrance, cleared whenever the form changes.
  let chain = []
  const later = (delay, fn) => chain.push(gsap.delayedCall(delay, fn))
  const clearChain = () => { chain.forEach((c) => c.kill()); chain = [] }

  // 1984: the truck waits off screen to the right while the others drop in,
  // drives along the line to its station, bursts into parts and reassembles
  // as the standing robot.
  function truckSequence(target) {
    const toA = geo.attributes.aTo.array
    const fromA = geo.attributes.aFrom.array
    const parked = Float32Array.from(target.positions)
    const isTruck = (i) => target.colors[i * 4 + 3] > 0 && target.positions[i * 3] > 0.58
    for (let i = 0; i < N; i++) {
      if (!isTruck(i)) continue
      parked[i * 3] += 3.8
      fromA[i * 3] = toA[i * 3] = parked[i * 3]
      fromA[i * 3 + 1] = toA[i * 3 + 1]
    }
    const robot = (cache['timeline80s:robot'] ??= build('timeline80s:robot')).positions
    const burst = Float32Array.from(robot)
    const rr = rng(1984)
    for (let i = 0; i < N; i++) {
      if (!isTruck(i)) continue
      burst[i * 3] += gauss(rr) * 0.22
      burst[i * 3 + 1] += 0.18 + Math.abs(gauss(rr)) * 0.22
      burst[i * 3 + 2] += gauss(rr) * 0.12
    }
    later(2.1, () => retarget(target.positions, 1.8, 'power2.out'))
    later(4.5, () => {
      retarget(burst, 0.55, 'power2.in')
      gsap.fromTo(uniforms.uSpin, { value: 0.025 }, { value: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' })
    })
    later(5.1, () => retarget(robot, 1.1, 'power3.out'))
  }

  // A two-step form, "first>second": show the first, then morph into the
  // second (a toolbox becoming a bar graph, a highway's exits becoming a
  // podium). The pair is the current form, so a re-fit does not replay it.
  function morphTo(name, opts = {}) {
    if (!name.includes('>')) return go(name, opts)
    if (name === current) return
    const [first, second] = name.split('>')
    go(first, opts)
    current = name
    if (opts.instant || reduce()) {
      go(second, { ...opts, instant: true })
      current = name
      return
    }
    later(1.9, () => {
      go(second, { anchor: opts.anchor, slot: opts.slot })
      current = name
    })
  }

  function go(name, { instant = false, anchor, enter, slot = 0 } = {}) {
    // Each nesting picks a perch and a shape from the slot, so the field
    // never returns to the same corner twice in a row.
    if (name === 'nest') {
      nestSlot = slot
      view.nest = view.nests[slot % view.nests.length] ?? view.nest
      name = NESTS[slot % NESTS.length]
    }
    const isNest = NESTS.includes(name)
    if (!name.startsWith('text:') && !SPECIAL[name] && !forms[name]) return
    const next = isNest ? 'nest' : anchor === 'centre' ? 'centre' : anchor === 'wide' ? 'wide' : 'stage'
    if (next !== mode || (isNest && name !== current)) {
      mode = next
      place(instant)
    }
    if (name === current) return
    // A new form cancels any entrance still playing; the same form lets it finish.
    clearChain()
    current = name
    // Without the drive-in, the 1984 station shows the robot already standing.
    const animated = enter === 'drop' && !instant && !reduce()
    const target = name === 'timeline80s' && !animated
      ? (cache['timeline80s:robot'] ??= build('timeline80s:robot'))
      : (cache[name] ??= build(name))
    // Freeze wherever the points are right now, then head for the new form.
    freeze()
    const fromA = geo.attributes.aFrom.array
    const toA = geo.attributes.aTo.array
    toA.set(target.positions)
    // Per-point colours, or none.
    const colA = geo.attributes.aColor.array
    if (target.colors) colA.set(target.colors)
    else colA.fill(0)
    geo.attributes.aColor.needsUpdate = true
    gsap.to(uniforms.uUseColor, { value: target.colors ? 1 : 0, duration: 1.2, overwrite: true })
    gsap.to(uniforms.uSnap, { value: target.snap === false ? 0 : 1, duration: 0.8, overwrite: true })
    // A drop: coloured points start above the screen and fall onto the form.
    if (enter === 'drop' && target.colors && !instant && !reduce()) {
      for (let i = 0; i < N; i++) {
        if (target.colors[i * 4 + 3] > 0) {
          fromA[i * 3] = toA[i * 3]
          fromA[i * 3 + 1] = toA[i * 3 + 1] + 3.2 + seeds[i] * 1.5
          fromA[i * 3 + 2] = toA[i * 3 + 2]
        } else {
          fromA[i * 3] = 0
          fromA[i * 3 + 1] = toA[i * 3 + 1]
          fromA[i * 3 + 2] = toA[i * 3 + 2]
        }
      }
    }
    if (name === 'timeline80s' && animated) truckSequence(target)
    geo.attributes.aFrom.needsUpdate = true
    geo.attributes.aTo.needsUpdate = true
    gsap.killTweensOf(uniforms.uMix)
    uniforms.uMix.value = 0
    if (instant || reduce()) uniforms.uMix.value = 1
    else if (enter === 'drop') gsap.to(uniforms.uMix, { value: 1, duration: 1.9, ease: 'bounce.out' })
    else gsap.to(uniforms.uMix, { value: 1, duration: 2.2, ease: 'power2.inOut' })
  }

  // ---------- Loop ----------

  const timer = new THREE.Timer()
  let running = true
  let lastW = 0, lastH = 0
  let parallax = 0
  // Watchdog: if frames run long for a while, drop the pixel ratio once,
  // and then the alpha a little, rather than stutter through the talk.
  let slow = 0, lastT = performance.now(), degraded = 0
  function watch() {
    const now = performance.now()
    const dt = now - lastT
    lastT = now
    if (dt > 34) slow += 1
    else slow = Math.max(0, slow - 1)
    if (slow > 90 && degraded === 0) {
      degraded = 1
      renderer.setPixelRatio(1)
      uniforms.uPixelRatio.value = 1
      console.info('[smartmotion] field: lowered pixel ratio for smoother frames')
      slow = 0
    } else if (slow > 120 && degraded === 1) {
      degraded = 2
      uniforms.uAlpha.value *= 0.8
      console.info('[smartmotion] field: lightened the field for smoother frames')
      slow = 0
    }
  }
  function frame() {
    if (!running) return
    requestAnimationFrame(frame)
    watch()
    if (host.clientWidth !== lastW || host.clientHeight !== lastH) {
      lastW = host.clientWidth
      lastH = host.clientHeight
      resize()
    }
    uniforms.uTime.value = (timer.update(), timer.getElapsed())
    uniforms.uPointer.value.lerp(target, 0.08)
    // While nested the whole cloud wanders on a slow figure of eight.
    const t = uniforms.uTime.value
    const wob = mode === 'nest' && !reduce() ? 1 : 0
    uniforms.uWobble.value.lerp(new THREE.Vector2(Math.sin(t * 0.21) * view.w * 0.03 * wob, Math.sin(t * 0.42) * view.h * 0.02 * wob - parallax * view.h * 0.06), 0.04)
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
    // Parallax: the form sinks a little as the scene is scrolled away,
    // slower than the copy, so the page has depth.
    setParallax(p) {
      parallax = p
    },
    get mode() { return mode },
    // Scroll-built diagrams: mode picks the direction, v is how much is built.
    setReveal(mode, v) {
      uniforms.uRevealMode.value = mode
      gsap.to(uniforms.uReveal, { value: v, duration: 0.4, ease: 'power2.out', overwrite: true })
    },
    // Scroll-driven: 0 is the formula intact, 1 is everything flat.
    setCollapse(v) {
      gsap.to(uniforms.uCollapse, { value: v, duration: 0.35, ease: 'power2.out', overwrite: true })
    },
    // 0 is a dot matrix, 1 is soft high-resolution splats. Tweened so the
    // picture resolves rather than switches.
    setFidelity(f, { instant = false } = {}) {
      if (instant || reduce()) uniforms.uFidelity.value = f
      else gsap.to(uniforms.uFidelity, { value: f, duration: 2.4, ease: 'power2.inOut', overwrite: true })
    },
    get count() { return N },
    get debug() { return { mode, current, uniforms, geo } },
  }
}
