<script>
  import { onMount } from 'svelte'
  import { createField, MARK } from './field.js'

  let wrap, pre

  onMount(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const field = createField()

    // Scale the <pre> so the mark covers the pane with room to spare: the
    // hands run corner to corner, the arms leave through the edges, and the
    // mask fades them out before they get there.
    const COVER = 1.12
    const fit = () => {
      if (!wrap || !pre || !pre.scrollWidth) return
      pre.style.transform = 'none'
      const markW = pre.scrollWidth * MARK.w, markH = pre.scrollHeight * MARK.h
      const s = Math.max(wrap.clientWidth / markW, wrap.clientHeight / markH) * COVER
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
    /* solid through the middle; the arms dissolve into the two corners they leave by */
    -webkit-mask-image: linear-gradient(to top right, transparent 4%, #000 30%, #000 70%, transparent 96%);
    mask-image: linear-gradient(to top right, transparent 4%, #000 30%, #000 70%, transparent 96%);
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
</style>
