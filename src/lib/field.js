// The builders@uva mark drawn as ASCII density.
// The mark is the two hands from Michelangelo's Creation of Adam. Particles
// ride along the outline of the hands, shimmer, and drift a little across the
// edge; the shading inside breathes. The shape holds at all times and still
// feels alive.

import hands from './hands.json'

export const RAMP = " .:-=+*#%@"
export const BW = 440, BH = 240          // density buffer (2x oversampled)
export const COLS = BW / 2, ROWS = BH / 2 // characters emitted
const N = 900                             // particles on the outline

// Char cells are ~0.6 wide vs 1.08 tall, so a region of the buffer reads at
// its buffer aspect divided by 1.8. Fit the hands to the width and derive height.
const CHAR_ASPECT = 1.8
const MARK_W = BW * 0.94
const MARK_H = MARK_W / (hands.aspect * CHAR_ASPECT)
const X0 = (BW - MARK_W) / 2, Y0 = (BH - MARK_H) / 2
export const MARK = { w: MARK_W / BW, h: MARK_H / BH }

// Shading inside the hands, 0..255, zero outside. Sampled by nearest cell.
const GW = hands.w, GH = hands.h
const SHADE = Uint8Array.from(atob(hands.shade), (c) => c.charCodeAt(0))
function shadeAt(x, y) {
  const gx = (((x - X0) / MARK_W) * GW) | 0, gy = (((y - Y0) / MARK_H) * GH) | 0
  if (gx < 0 || gy < 0 || gx >= GW || gy >= GH) return 0
  return SHADE[gy * GW + gx] / 255
}

// The outline as segments, in buffer space, with cumulative arc length.
function buildPath() {
  const segs = []
  for (const poly of hands.contours) {
    for (let i = 0; i < poly.length; i++) {
      const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % poly.length]
      const a = { x: X0 + ax * MARK_W, y: Y0 + ay * MARK_H }
      const b = { x: X0 + bx * MARK_W, y: Y0 + by * MARK_H }
      const len = Math.hypot(b.x - a.x, b.y - a.y)
      if (len > 0) segs.push({ a, b, len })
    }
  }
  let acc = 0
  for (const g of segs) { g.start = acc; acc += g.len }
  return { segs, total: acc }
}

function buildKernel(rx, ry) {
  const RX = Math.ceil(rx), RY = Math.ceil(ry)
  const sx = 2 * RX + 1, sy = 2 * RY + 1
  const v = new Float32Array(sx * sy)
  for (let j = -RY; j <= RY; j++)
    for (let i = -RX; i <= RX; i++) {
      const d = Math.sqrt((i / rx) ** 2 + (j / ry) ** 2)
      v[(j + RY) * sx + (i + RX)] = d >= 1 ? 0 : d <= 0.25 ? 0.55 + (d / 0.25) * (0.3 - 0.55) : 0.3 * (1 - (d - 0.25) / 0.75) ** 1.3
    }
  return { rx: RX, ry: RY, sx, sy, v }
}

const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s) }
function noise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1)
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

// Per character cell: how much of it the hands cover, and for cells on the
// outline, the contour glyph that follows the edge direction there.
function buildCells() {
  const cover = new Float32Array(COLS * ROWS)
  const S = 4 // subsamples per axis
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      let n = 0
      for (let j = 0; j < S; j++)
        for (let i = 0; i < S; i++)
          if (shadeAt(2 * c + ((i + 0.5) / S) * 2, 2 * r + ((j + 0.5) / S) * 2) > 0) n++
      cover[r * COLS + c] = n / (S * S)
    }
  // smooth a touch so the gradient is stable, then classify
  const sm = new Float32Array(COLS * ROWS)
  for (let r = 1; r < ROWS - 1; r++)
    for (let c = 1; c < COLS - 1; c++) {
      let s = 0
      for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) s += cover[(r + j) * COLS + c + i]
      sm[r * COLS + c] = s / 9
    }
  const glyph = new Array(COLS * ROWS).fill(null)
  for (let r = 1; r < ROWS - 1; r++)
    for (let c = 1; c < COLS - 1; c++) {
      const k = r * COLS + c, cv = cover[k]
      if (cv < 0.12 || cv >= 0.8) continue
      // gradient in isotropic units: cells are 1.8x taller than wide
      const gx = (sm[k + 1] - sm[k - 1]) / 2
      const gy = (sm[k + COLS] - sm[k - COLS]) / 2 / CHAR_ASPECT
      if (gx === 0 && gy === 0) continue
      const ang = ((Math.atan2(-gy, gx) * 180) / Math.PI + 180) % 180
      glyph[k] = ang >= 22.5 && ang < 67.5 ? '\\'
        : ang >= 67.5 && ang < 112.5 ? (gy < 0 ? '_' : '-')
        : ang >= 112.5 && ang < 157.5 ? '/'
        : '|'
    }
  return { cover, glyph }
}

export function createField(rand = Math.random) {
  const path = buildPath()
  const kernel = buildKernel(4.6, 2.6)
  const cells = buildCells()
  const lut = Array.from({ length: 256 }, (_, i) => RAMP[Math.min(RAMP.length - 1, ((i / 255) * RAMP.length) | 0)])
  const buf = new Float32Array(BW * BH)

  // Static shading, at buffer resolution, added back each frame under the decay.
  const base = new Float32Array(BW * BH)
  for (let y = 0; y < BH; y++)
    for (let x = 0; x < BW; x++) base[y * BW + x] = Math.pow(shadeAt(x + 0.5, y + 0.5), 0.75)

  // Point on the outline at arc length s, plus the normal there.
  const starts = path.segs.map((g) => g.start)
  function at(s) {
    s = ((s % path.total) + path.total) % path.total
    let lo = 0, hi = starts.length - 1
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (starts[mid] <= s) lo = mid; else hi = mid - 1 }
    const g = path.segs[lo]
    const t = (s - g.start) / g.len
    const dx = (g.b.x - g.a.x) / g.len, dy = (g.b.y - g.a.y) / g.len
    return { x: g.a.x + (g.b.x - g.a.x) * t, y: g.a.y + (g.b.y - g.a.y) * t, nx: -dy, ny: dx }
  }

  const ps = Array.from({ length: N }, (_, i) => {
    const s0 = (i / N) * path.total
    const p0 = at(s0)
    return {
      s0,
      speed: 0.012 * (0.9 + rand() * 0.2),  // buffer px per ms along the outline
      seed: rand() * 1000,
      x: p0.x, y: p0.y, vx: 0, vy: 0,
    }
  })

  function stamp(x, y, gain) {
    if (gain <= 0) return
    const cx = Math.round(x), cy = Math.round(y)
    for (let j = -kernel.ry; j <= kernel.ry; j++) {
      const row = cy + j
      if (row < 0 || row >= BH) continue
      const rb = row * BW, kb = (j + kernel.ry) * kernel.sx
      for (let i = -kernel.rx; i <= kernel.rx; i++) {
        const col = cx + i
        if (col < 0 || col >= BW) continue
        const k = kernel.v[kb + i + kernel.rx] * gain
        if (k === 0) continue
        const idx = rb + col
        buf[idx] = Math.min(1, buf[idx] + k)
      }
    }
  }

  /** Advance one frame at time `now` (ms) and return the ASCII frame. */
  function step(now) {
    const drift = now * 0.00025
    const t = now * 0.00035
    // decay, then lay the shading back in with a slow breathing across it.
    // steady state is base * 1.05 * breath, clamped to 1 by the stamp; the decay eats 22% a frame.
    for (let y = 0; y < BH; y++) {
      const rb = y * BW
      for (let x = 0; x < BW; x++) {
        const i = rb + x
        let v = buf[i] * 0.78
        const b = base[i]
        if (b > 0) v += b * 1.05 * 0.22 * (0.78 + 0.22 * noise(x * 0.035 + t, y * 0.06 - t * 0.6))
        buf[i] = v
      }
    }

    for (let i = 0; i < ps.length; i++) {
      const p = ps[i]
      const tg = at(p.s0 + now * p.speed)
      // wander a little across the outline so the edge breathes
      const off = (noise(p.seed + now * 0.0006, drift) - 0.5) * 4
      const tx = tg.x + tg.nx * off, ty = tg.y + tg.ny * off

      p.vx += (tx - p.x) * 0.08; p.vy += (ty - p.y) * 0.08
      p.vx += (rand() - 0.5) * 0.06; p.vy += (rand() - 0.5) * 0.06
      p.vx *= 0.72; p.vy *= 0.72
      p.x += p.vx; p.y += p.vy

      // fade while far from the outline and flicker gently
      const dist = Math.hypot(tx - p.x, ty - p.y)
      const near = Math.max(0, 1 - dist / 5)
      const flick = 0.7 + 0.3 * Math.sin(now * 0.004 + i * 0.73)
      stamp(p.x + (rand() - 0.5) * 1.2, p.y + (rand() - 0.5) * 1.2, near * flick)
    }

    // downsample 2x2 and map to glyphs; outline cells take the contour glyph
    let out = ''
    for (let r = 0; r < ROWS; r++) {
      const rb = 2 * r * BW
      for (let c = 0; c < COLS; c++) {
        const cb = 2 * c
        const s = (buf[rb + cb] + buf[rb + cb + 1] + buf[rb + BW + cb] + buf[rb + BW + cb + 1]) / 4
        const g = cells.glyph[r * COLS + c]
        out += g && s > 0.1 ? g : lut[Math.min(255, (s * 255) | 0)]
      }
      if (r < ROWS - 1) out += '\n'
    }
    return out
  }

  return { step }
}
