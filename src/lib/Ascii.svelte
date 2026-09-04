<script>
  import { onMount } from 'svelte'
  import { createField, MARK } from './field.js'

  let wrap, pre

  onMount(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const field = createField()

    // Scale the <pre> so the mark itself fills FILL of the pane's shorter
    // axis. The buffer around the mark spills past the pane edges and is
    // faded out by the mask, so nothing important is ever cropped.
    const FILL = 0.92
    const fit = () => {
      if (!wrap || !pre || !pre.scrollWidth) return
      pre.style.transform = 'none'
      const markW = pre.scrollWidth * MARK.w, markH = pre.scrollHeight * MARK.h
      const s = Math.min(wrap.clientWidth / markW, wrap.clientHeight / markH) * FILL
      pre.style.transform = `scale(${s})`
    }
    const ro = new ResizeObserver(fit)
    ro.observe(wrap)

    let raf = 0
    let first = true
    const draw = (text) => {
      pre.textContent = text
      if (first) { first = false; fit() }
    }

    if (reduce) {
      let text = ''
      for (let i = 0; i < 40; i++) text = field.step(i * 16)
      draw(text)
    } else {
      const frame = (now) => { draw(field.step(now)); raf = requestAnimationFrame(frame) }
      raf = requestAnimationFrame(frame)
    }
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  })
</script>

<div class="wrap" bind:this={wrap} aria-hidden="true">
  <pre bind:this={pre}></pre>
</div>

<style>
  .wrap {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    /* solid across the mark (80% of each axis), then fade the stray particles */
    -webkit-mask-image: radial-gradient(80% 80% at 50% 50%, #000 50%, transparent 100%);
    mask-image: radial-gradient(80% 80% at 50% 50%, #000 50%, transparent 100%);
  }
  pre {
    margin: 0;
    flex-shrink: 0;
    font-family: var(--mono);
    font-size: 8px;
    line-height: 1.08;
    white-space: pre;
    color: var(--fg);
    opacity: 0.72;
    user-select: none;
    transform-origin: 50% 50%;
    will-change: transform;
  }
</style>
