<script>
  import { onMount } from 'svelte'
  import { logos } from './logos.js'
  import { eventBySlug } from './events.js'
  import { inkAt } from './field.js'

  // `enter` delays the marks' arrival; `split` is the hands' (see createField),
  // so the marks can be kept off them; `avoid` returns the copy's element.
  let { enter = 0, split = 0, avoid = () => null } = $props()

  // ms each mark takes to spiral out from the centre to its place
  const SPIN = 2200

  // Where each mark rests, as fractions of the window, and its depth `z`:
  // nearer marks are larger, brighter, and move more with the pointer. Placed
  // by hand, loosely, in the space the hands and the copy leave: above and
  // left of the copy, and below and right of it.
  const SLOTS = [
    [0.08, 0.17, 0.9], [0.25, 0.14, 0.5], [0.41, 0.12, 0.75], [0.58, 0.14, 0.4],
    [0.69, 0.18, 0.6], [0.14, 0.31, 0.55], [0.31, 0.25, 1.0], [0.46, 0.22, 0.45],
    [0.06, 0.45, 0.35], [0.21, 0.46, 0.8], [0.12, 0.58, 0.5], [0.24, 0.37, 0.3],
    [0.92, 0.50, 0.7], [0.80, 0.44, 0.4], [0.87, 0.63, 0.9], [0.75, 0.61, 0.8],
    [0.94, 0.77, 0.4], [0.79, 0.76, 0.75], [0.64, 0.70, 0.35], [0.50, 0.77, 1.0],
    [0.38, 0.72, 0.45], [0.76, 0.87, 0.6], [0.55, 0.89, 0.45], [0.63, 0.31, 0.5],
    [0.89, 0.89, 0.3], [0.84, 0.30, 0.65],
  ]

  const who = (l) => l.who.map((s) => eventBySlug(s)?.name).filter(Boolean)
  const marks = logos.map((l, i) => {
    const [x, y, z] = SLOTS[i % SLOTS.length]
    return {
      ...l, x, y, z,
      people: who(l),
      href: l.who.length === 1 ? `/events/${l.who[0]}` : '/events',
      // each drifts on its own slow loop
      ax: 5 + 9 * z, ay: 4 + 7 * z,
      px: 17000 + ((i * 3779) % 9000), py: 13000 + ((i * 5113) % 8000),
      phase: i * 1.7,
      turn: Math.PI * (0.7 + ((i * 5) % 7) / 12),
    }
  })

  // Each mark's resting place in px; null if, at this window's shape, it
  // would land on a hand, the copy, the nav or the footer.
  let spots = $state(marks.map(() => null))
  let delays = $state(marks.map(() => 0))
  let ready = $state(false)
  let els = []

  const overlaps = (a, b) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b
  const pad = (r, p) => ({ l: r.l - p, t: r.t - p, r: r.r + p, b: r.b + p })
  const box = (el) => {
    const r = el?.getBoundingClientRect()
    return r && r.width ? { l: r.left, t: r.top, r: r.right, b: r.bottom } : null
  }

  function layout() {
    const W = innerWidth, H = innerHeight
    const ink = inkAt({ aspect: W / H, split })
    const blocks = [avoid(), document.querySelector('nav[aria-label="Pages"]'), document.querySelector('footer')]
      .map(box).filter(Boolean).map((r) => pad(r, 24))
    const inked = (r) => {
      for (let j = 0; j <= 4; j++)
        for (let i = 0; i <= 6; i++)
          if (ink((r.l + ((r.r - r.l) * i) / 6) / W, (r.t + ((r.b - r.t) * j) / 4) / H) > 0.02) return true
      return false
    }
    spots = marks.map((m, n) => {
      const el = els[n]
      if (!el) return null
      const s = 0.82 + 0.3 * m.z
      const w = el.offsetWidth * s, h = el.offsetHeight * s
      const x = m.x * W, y = m.y * H
      const r = { l: x - w / 2, t: y - h / 2, r: x + w / 2, b: y + h / 2 }
      if (r.l < 8 || r.r > W - 8 || blocks.some((b) => overlaps(r, b)) || inked(pad(r, 36))) return null
      return { x, y }
    })
    // nearer the centre arrives first, so the marks bloom outward
    const far = Math.hypot(W, H) / 2
    delays = spots.map((p, i) => p ? (Math.hypot(p.x - W / 2, p.y - H / 2) / far) * 700 + (i % 3) * 40 : 0)
  }

  onMount(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0, t0 = 0, timer = 0
    // the pointer, eased, as -1..1 from the window's centre
    let mx = 0, my = 0, tx = 0, ty = 0
    // Each mark spirals out from just around the copy: it swings most of a
    // half turn about the centre as it widens out to its resting place.
    const ease = (t) => 1 - Math.pow(1 - t, 4)
    const move = (e) => {
      tx = (e.clientX / innerWidth) * 2 - 1
      ty = (e.clientY / innerHeight) * 2 - 1
    }
    const frame = (now) => {
      mx += (tx - mx) * 0.05
      my += (ty - my) * 0.05
      for (let i = 0; i < marks.length; i++) {
        const m = marks[i], el = els[i], p = spots[i]
        if (!el || !p) continue
        let dx = m.ax * Math.sin((now / m.px) * 2 * Math.PI + m.phase) - mx * 10 * m.z
        let dy = m.ay * Math.cos((now / m.py) * 2 * Math.PI + m.phase) - my * 8 * m.z
        const t = (now - t0 - delays[i]) / SPIN
        if (enter && t < 1) {
          const k = ease(Math.max(0, t)), r = 0.3 + 0.7 * k
          const vx = p.x - innerWidth / 2, vy = p.y - innerHeight / 2
          const a = -m.turn * (1 - k), c = Math.cos(a), s = Math.sin(a)
          dx = dx * k + (vx * c - vy * s) * r - vx
          dy = dy * k + (vx * s + vy * c) * r - vy
        }
        el.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`
      }
      raf = requestAnimationFrame(frame)
    }
    const relayout = () => {
      clearTimeout(timer)
      timer = setTimeout(layout, 120)
    }

    // measure once the faces are in, or the marks are the wrong widths
    document.fonts.ready.then(() => {
      layout()
      t0 = performance.now() + enter
      ready = true
      if (!reduce) raf = requestAnimationFrame(frame)
    })
    addEventListener('resize', relayout)
    addEventListener('pointermove', move, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
      removeEventListener('resize', relayout)
      removeEventListener('pointermove', move)
    }
  })
</script>

<div class="logos" class:ready style:--enter="{enter}ms">
  {#each marks as m, i}
    <div
      class="slot"
      class:out={ready && !spots[i]}
      style:left="{m.x * 100}%"
      style:top="{m.y * 100}%"
      style:--z={m.z}
      style:--delay="{delays[i]}ms"
    >
      <a
        class="mark {m.face ?? 'glyph'}"
        href={m.href}
        bind:this={els[i]}
        aria-label="{m.name}: {m.people.join(', ')}"
        style:--brand={m.color}
      >
        {#if m.glyph}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d={m.glyph} /></svg>
        {/if}
        <span class="name">{m.name}</span>
      </a>
    </div>
  {/each}
</div>

<style>
  .logos {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  /* the slot holds the resting place and the arrival; the mark inside drifts.
     Until the layout is worked out the marks are measured but not seen. */
  .slot {
    position: absolute;
    translate: -50% -50%;
    scale: calc(0.82 + 0.3 * var(--z));
    visibility: hidden;
  }
  .ready .slot {
    visibility: visible;
    animation: arrive 1s ease calc(var(--enter) + var(--delay)) both;
  }
  .slot.out { display: none; }
  @keyframes arrive {
    from { opacity: 0; filter: blur(6px); scale: 0.4; }
  }
  .mark {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.45em;
    font-size: 17px;
    line-height: 1;
    white-space: nowrap;
    color: var(--fg);
    opacity: calc(0.28 + 0.34 * var(--z));
    /* the farthest go a touch soft */
    filter: blur(calc(max(0px, 0.5 - var(--z)) * 3));
    pointer-events: auto;
    will-change: transform;
    transition: opacity 0.25s ease, filter 0.25s ease, color 0.25s ease;
  }
  /* on hover a mark comes forward in its own colour */
  .mark:is(:hover, :focus-visible) { opacity: 1; filter: none; color: var(--brand, var(--fg)); }
  svg { width: 1.15em; height: 1.15em; fill: currentColor; flex-shrink: 0; }

  /* wordmarks, in whichever of the site's faces is nearest the real thing */
  .name { letter-spacing: -0.02em; font-weight: 500; }
  .glyph .name { font-weight: 400; }
  .sans .name { font-size: 1.1em; font-weight: 600; letter-spacing: -0.04em; }
  .serif .name { font-family: var(--serif); font-style: italic; font-size: 1.2em; font-weight: 400; }
  .mono .name { font-family: var(--mono); font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.08em; }


  @media (max-width: 899px) {
    .mark { font-size: 14px; }
  }

  @media (max-width: 599px) {
    .logos { display: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .slot { animation: none; }
  }
</style>
