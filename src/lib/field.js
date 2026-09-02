// The builders@uva mark drawn as ASCII density.
// Particles ride along the strokes of the mark, shimmer, and fade out while
// crossing the gaps, so the shape holds at all times and still feels alive.

export const RAMP = " .·'-_:,;!^=+*/|)\\?oO0%#@"
export const BW = 320, BH = 200          // density buffer (2x oversampled)
export const COLS = BW / 2, ROWS = BH / 2 // characters emitted
const N = 560                             // particles

// The mark on a 12-unit grid, as centre-line segments, in stroke order.
const SEGS = [
  [0.5, 2.5, 6.5, 2.5],   // top course, stops short
  [0.5, 2.5, 0.5, 11.5],  // left side
  [0.5, 11.5, 9.5, 11.5], // bottom course
  [9.5, 11.5, 9.5, 5.5],  // right side, stops short
  [9.5, 0.5, 11.5, 0.5],  // corner piece
  [11.5, 0.5, 11.5, 2.5],
]

function buildPath() {
  // Map 12 grid units onto a region that reads as square on screen.
  // Char cells are ~0.6 wide vs 1.08 tall, so the buffer region is 1.8:1.
  const H = 128, W = H * 1.8
  const x0 = (BW - W) / 2, y0 = (BH - H) / 2
  const sx = W / 12, sy = H / 12
  const segs = SEGS.map(([ax, ay, bx, by]) => {
    const a = { x: x0 + ax * sx, y: y0 + ay * sy }, b = { x: x0 + bx * sx, y: y0 + by * sy }
    return { a, b, len: Math.hypot(b.x - a.x, b.y - a.y) }
  })
  const total = segs.reduce((s, g) => s + g.len, 0)
  let acc = 0
  for (const g of segs) { g.start = acc; acc += g.len }
  return { segs, total }
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

export function createField(rand = Math.random) {
  const path = buildPath()
  const kernel = buildKernel(10.5, 5.9)
  const lut = Array.from({ length: 256 }, (_, i) => RAMP[Math.min(RAMP.length - 1, ((i / 255) * RAMP.length) | 0)])
  const buf = new Float32Array(BW * BH)

  // Point on the mark at arc length s, plus the stroke normal there.
  function at(s) {
    s = ((s % path.total) + path.total) % path.total
    let g = path.segs[0]
    for (const c of path.segs) { if (s >= c.start && s < c.start + c.len) { g = c; break } }
    const t = (s - g.start) / g.len
    const dx = (g.b.x - g.a.x) / g.len, dy = (g.b.y - g.a.y) / g.len
    return { x: g.a.x + (g.b.x - g.a.x) * t, y: g.a.y + (g.b.y - g.a.y) * t, nx: -dy, ny: dx }
  }

  const ps = Array.from({ length: N }, (_, i) => {
    const s0 = (i / N) * path.total
    const p0 = at(s0)
    return {
      s0,
      speed: 0.014 * (0.92 + rand() * 0.16),  // buffer px per ms along the stroke
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
    for (let i = 0; i < buf.length; i++) buf[i] *= 0.78

    for (let i = 0; i < ps.length; i++) {
      const p = ps[i]
      const tg = at(p.s0 + now * p.speed)
      // wander a little across the stroke so the line breathes
      const off = (noise(p.seed + now * 0.0006, drift) - 0.5) * 7
      const tx = tg.x + tg.nx * off, ty = tg.y + tg.ny * off

      p.vx += (tx - p.x) * 0.08; p.vy += (ty - p.y) * 0.08
      p.vx += (rand() - 0.5) * 0.06; p.vy += (rand() - 0.5) * 0.06
      p.vx *= 0.72; p.vy *= 0.72
      p.x += p.vx; p.y += p.vy

      // fade while far from the stroke (crossing a gap) and flicker gently
      const dist = Math.hypot(tx - p.x, ty - p.y)
      const near = Math.max(0, 1 - dist / 6)
      const flick = 0.78 + 0.22 * Math.sin(now * 0.004 + i * 0.73)
      stamp(p.x + (rand() - 0.5) * 1.6, p.y + (rand() - 0.5) * 1.6, near * flick)
    }

    // downsample 2x2 and map to glyphs
    let out = ''
    for (let r = 0; r < ROWS; r++) {
      const rb = 2 * r * BW
      for (let c = 0; c < COLS; c++) {
        const cb = 2 * c
        const s = buf[rb + cb] + buf[rb + cb + 1] + buf[rb + BW + cb] + buf[rb + BW + cb + 1]
        out += lut[Math.min(255, ((s / 4) * 255) | 0)]
      }
      if (r < ROWS - 1) out += '\n'
    }
    return out
  }

  return { step }
}
