// The builders@uva mark drawn as ASCII density.
// The mark is the two hands from Michelangelo's Creation of Adam. They run
// corner to corner across the pane, Adam bottom-left and God top-right, with
// the gap between the fingertips at the centre. The outline holds still and
// sharp; the only motion is a soft band of light that runs along the arms from
// God's hand to Adam's every few seconds, like light passing over a statue.
//
// The hands ship level (src/lib/hands.json). The field is built for the pane's
// aspect: the buffer takes that aspect, the hands are rotated onto its
// diagonal and scaled to overshoot the corners, so the arms leave through the
// edges whatever shape the pane is.

import hands from './hands.json'

export const RAMP = " .:-=+*#%@"
const CHAR_ASPECT = 1.8       // char cells are ~0.6 wide vs 1.08 tall
const OVERSHOOT = 1.16        // hands' axis length as a multiple of the pane diagonal

// Shading inside the hands, 0..255, zero outside. Sampled by nearest cell.
const GW = hands.w, GH = hands.h
const SHADE = Uint8Array.from(atob(hands.shade), (c) => c.charCodeAt(0))

// Which hand each inked pixel belongs to (-1 Adam, +1 God), by the connected
// shape it is part of rather than by which side of the gap it falls. God's
// fingertip reaches a column past the gap, and splitting by the gap line alone
// would carry that sliver off with Adam's hand.
const SIDE = new Int8Array(GW * GH)
for (let i = 0; i < GW * GH; i++) {
  if (!SHADE[i] || SIDE[i]) continue
  const shape = [i]
  let sx = 0
  SIDE[i] = 2
  for (let n = 0; n < shape.length; n++) {
    const k = shape[n], x = k % GW, y = (k / GW) | 0
    sx += x
    for (const j of [x > 0 && k - 1, x < GW - 1 && k + 1, y > 0 && k - GW, y < GH - 1 && k + GW])
      if (j !== false && SHADE[j] && !SIDE[j]) { SIDE[j] = 2; shape.push(j) }
  }
  const side = sx / shape.length < hands.gap[0] * GW ? -1 : 1
  for (const k of shape) SIDE[k] = side
}

// The hands' placement in a buffer of the pane's aspect: the buffer size, the
// axis, and shadeAt(x, y) for any buffer px. Shared by createField and inkAt.
//
// `split` pushes each hand outward along the axis by that fraction of the
// hands' width, opening the gap between the fingertips. A number moves both
// hands equally; [adam, god] moves each its own way. `only` (-1 Adam, +1 God)
// draws just that hand, so each can sit on its own layer and move by itself.
function place({ aspect = 0.8, horizontal = false, split = 0, only = 0 } = {}) {
  // Buffer with the pane's aspect, 2x oversampled. Height fixed, width follows.
  const BH = 280
  const BW = Math.max(120, Math.round((BH * CHAR_ASPECT * aspect) / 2) * 2)

  // Geometry in visual units: x in buffer px, y in buffer px * CHAR_ASPECT,
  // origin at the buffer centre. The hands' axis lies on the diagonal.
  const diag = Math.hypot(BW, BH * CHAR_ASPECT)
  const theta = horizontal ? 0 : Math.atan2(BH * CHAR_ASPECT, BW)
  const cos = Math.cos(theta), sin = Math.sin(theta)
  const S = (horizontal ? BW : diag) * OVERSHOOT     // hands' width in visual units
  const SH = S / hands.aspect                         // hands' height
  const [gapX, gapY] = hands.gap                      // gap position, normalised in the hands' box

  const [SPLIT_A, SPLIT_G] = (Array.isArray(split) ? split : [split, split]).map((v) => v * S)

  // buffer px -> shading, 0..1. Each hand is pushed out by its own split, so
  // look for Adam where he would be and God where he would be.
  function shadeAt(x, y) {
    const vx = x - BW / 2, vy = (y - BH / 2) * CHAR_ASPECT
    const hx = vx * cos - vy * sin
    const hy = vx * sin + vy * cos
    const gy = ((hy / SH + gapY) * GH) | 0
    if (gy < 0 || gy >= GH) return 0
    let v = 0
    for (const side of only ? [only] : [-1, 1]) {
      const gx = (((hx + (side < 0 ? SPLIT_A : -SPLIT_G)) / S + gapX) * GW) | 0
      if (gx < 0 || gx >= GW) continue
      const k = gy * GW + gx
      if (SIDE[k] === side) v = Math.max(v, SHADE[k] / 255)
    }
    return v
  }

  return { BW, BH, S, cos, sin, shadeAt }
}

/**
 * Where the hands are in a pane of the given aspect, without building the
 * whole field: returns (nx, ny) => shading 0..1 for a point given as
 * fractions of the pane's width and height.
 */
export function inkAt(opts) {
  const { BW, BH, shadeAt } = place(opts)
  return (nx, ny) => shadeAt(nx * BW, ny * BH)
}

/**
 * Build a field for a pane of the given aspect (width / height).
 * Returns { step(now), cols, rows }. Options as for place(), plus `light`:
 * dark glyphs on a light page, where ink reads as shadow, so the ramp runs
 * the other way and the highlights fall back to the paper.
 */
export function createField(opts = {}) {
  const { light = false } = opts
  const { BW, BH, S, cos, sin, shadeAt } = place(opts)
  const COLS = BW / 2, ROWS = BH / 2

  // Static shading at buffer resolution.
  const base = new Float32Array(BW * BH)
  for (let y = 0; y < BH; y++)
    for (let x = 0; x < BW; x++) base[y * BW + x] = Math.pow(shadeAt(x + 0.5, y + 0.5), 0.75)

  // Per character cell: coverage, and for cells on the outline the contour
  // glyph that follows the edge direction there.
  const cover = new Float32Array(COLS * ROWS)
  const SUB = 4
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      let n = 0
      for (let j = 0; j < SUB; j++)
        for (let i = 0; i < SUB; i++)
          if (shadeAt(2 * c + ((i + 0.5) / SUB) * 2, 2 * r + ((j + 0.5) / SUB) * 2) > 0) n++
      cover[r * COLS + c] = n / (SUB * SUB)
    }
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
      const gx = (sm[k + 1] - sm[k - 1]) / 2
      const gy = (sm[k + COLS] - sm[k - COLS]) / 2 / CHAR_ASPECT
      if (gx === 0 && gy === 0) continue
      const ang = ((Math.atan2(-gy, gx) * 180) / Math.PI + 180) % 180
      glyph[k] = ang >= 22.5 && ang < 67.5 ? '\\'
        : ang >= 67.5 && ang < 112.5 ? (gy < 0 ? '_' : '-')
        : ang >= 112.5 && ang < 157.5 ? '/'
        : '|'
    }

  // Per character cell: the shading, averaged 2x2, and the position along the
  // hands' axis (-0.5 at Adam's end, +0.5 at God's) that the light runs along.
  const shade = new Float32Array(COLS * ROWS)
  const axis = new Float32Array(COLS * ROWS)
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const y = 2 * r, x = 2 * c
      shade[r * COLS + c] = (base[y * BW + x] + base[y * BW + x + 1] + base[(y + 1) * BW + x] + base[(y + 1) * BW + x + 1]) / 4
      const vx = x + 1 - BW / 2, vy = (y + 1 - BH / 2) * CHAR_ASPECT
      axis[r * COLS + c] = (vx * cos - vy * sin) / S
    }

  const lut = Array.from({ length: 256 }, (_, i) => RAMP[Math.min(RAMP.length - 1, ((i / 255) * RAMP.length) | 0)])

  const PERIOD = 11000   // ms between passes
  const TRAVEL = 6500    // ms the light takes from God's hand to Adam's
  const WIDTH = 0.1      // band width, in hand widths
  const ease = (t) => t * t * (3 - 2 * t)

  // For the entrance: each inked cell resolves at its own moment, wrist first
  // and fingertip last, and shows a flickering glyph until it does.
  const settle = new Float32Array(COLS * ROWS)
  for (let k = 0; k < COLS * ROWS; k++)
    settle[k] = 0.55 * (1 - Math.min(1, Math.abs(axis[k]) * 2)) + 0.45 * Math.random()
  const NOISE = '.:-=+*#%'

  /**
   * Return the ASCII frame at time `now` (ms). `reveal` runs 0..1 through the
   * entrance; at 1 every cell shows its settled glyph.
   */
  function step(now, reveal = 1) {
    // the band runs God -> Adam, then rests off-screen until the next pass;
    // before time zero it waits off-screen
    const t = now < 0 ? 9 : (now % PERIOD) / TRAVEL
    const centre = t < 1 ? 0.65 - 1.3 * ease(t) : -9

    let out = ''
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const k = r * COLS + c
        const g = glyph[k]
        if (reveal < 1 && settle[k] > reveal) {
          out += g || shade[k] > 0.02 ? (reveal > settle[k] - 0.18 ? NOISE[(Math.random() * NOISE.length) | 0] : ' ') : ' '
          continue
        }
        if (g) { out += g; continue }
        const d = (axis[k] - centre) / WIDTH
        const v = Math.min(1, shade[k] * (0.85 + 0.4 * Math.exp(-d * d)))
        if (!light) { out += lut[(v * 255) | 0]; continue }
        // shade is averaged over the whole cell, so divide out the coverage to
        // get the marble's own tone, then ink its shadow; every inked cell
        // keeps at least a dot so the hands hold their shape
        const cv = cover[k]
        out += cv ? lut[Math.max(26, ((1 - Math.min(1, v / cv)) * cv * 255) | 0)] : ' '
      }
      if (r < ROWS - 1) out += '\n'
    }
    return out
  }

  return { step, cols: COLS, rows: ROWS }
}
