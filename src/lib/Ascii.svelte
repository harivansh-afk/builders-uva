<script module>
  // Shared by both hands so their light lines up.
  let origin = null
</script>

<script>
  import { onMount } from 'svelte'
  import { createField } from './field.js'

  // `split` opens the gap between the fingertips (see createField). `only`
  // draws one hand (-1 Adam, +1 God); `from` is the corner it slides in from,
  // as [x, y] in half-pane units, `enter` how long that takes in ms, and
  // `delay` how long it waits before starting.
  let { split = 0, only = 0, from = [0, 0], enter = 0, delay = 0 } = $props()

  let wrap, pre
  let entering = $state(false)

  onMount(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let field = null, aspect = 0, raf = 0
    // the glyphs resolve over the first part of the slide, the light starts as it lands
    const resolve = enter * 0.75

    // The buffer shares the pane's aspect, so scaling the <pre> to the pane's
    // width covers it exactly. The hands overshoot the corners by design and
    // the mask fades them out before the edge.
    const fit = () => {
      if (!wrap || !pre || !pre.scrollWidth) return
      pre.style.transform = 'none'
      const s = Math.max(wrap.clientWidth / pre.scrollWidth, wrap.clientHeight / pre.scrollHeight)
      pre.style.transform = `scale(${s})`
    }

    // The light moves slowly, so ~15fps is plenty and keeps the layout work
    // down. The entrance flickers, so it gets ~30.
    let last = -Infinity
    const frame = (now) => {
      const t = now - origin
      const reveal = entering ? Math.min(1, Math.max(0, t / resolve)) : 1
      if (now - last >= (reveal < 1 ? 33 : 66)) {
        pre.textContent = field.step(t - (entering ? enter : 0), reveal)
        last = now
      }
      raf = requestAnimationFrame(frame)
    }

    // Build for the pane's shape; rebuild when it changes enough to matter.
    const build = () => {
      const a = wrap.clientWidth / Math.max(1, wrap.clientHeight)
      if (!a || Math.abs(a - aspect) < 0.03) return fit()
      aspect = a
      field = createField({ aspect, split, only })
      cancelAnimationFrame(raf)
      pre.textContent = field.step(0, entering ? 0 : 1)
      last = -Infinity
      fit()
      if (!reduce) raf = requestAnimationFrame(frame)
    }

    // Measure only once the mono face is in, otherwise the scale comes from a
    // fallback font and the hands land in the wrong place.
    const ro = new ResizeObserver(build)
    const ready = document.fonts ? document.fonts.ready : Promise.resolve()
    ready.then(() => {
      if (enter || origin === null) origin = performance.now() + (enter ? delay : 0)
      entering = Boolean(enter) && !reduce
      ro.observe(wrap)
      build()
    })
    document.fonts?.addEventListener('loadingdone', fit)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.fonts?.removeEventListener('loadingdone', fit)
    }
  })
</script>

<div class="wrap" bind:this={wrap} aria-hidden="true">
  <pre
    bind:this={pre}
    class:entering
    style:--fx={from[0]}
    style:--fy={from[1]}
    style:--enter="{enter}ms"
    style:--delay="{delay}ms"
  ></pre>
</div>

<style>
  .wrap {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    /* solid through the middle; the arms dissolve into the two corners they leave by */
    -webkit-mask-image: linear-gradient(to top right, transparent 0%, #000 14%, #000 86%, transparent 100%);
    mask-image: linear-gradient(to top right, transparent 0%, #000 14%, #000 86%, transparent 100%);
  }
  pre {
    margin: 0;
    flex-shrink: 0;
    font-family: var(--mono);
    font-size: 8px;
    line-height: 1.08;
    white-space: pre;
    color: var(--fg);
    opacity: 0.86;
    user-select: none;
    transform-origin: 50% 50%;
    will-change: transform;
  }
  /* each hand slides in along the diagonal from its own corner and eases to
     a stop just short of the other's fingertip */
  pre.entering { animation: reach var(--enter) cubic-bezier(0.16, 1, 0.3, 1) var(--delay) both; }
  @keyframes reach {
    from { translate: calc(var(--fx) * 42vw) calc(var(--fy) * 42vh); opacity: 0; }
    30% { opacity: 0.86; }
    to { translate: 0 0; }
  }
</style>
