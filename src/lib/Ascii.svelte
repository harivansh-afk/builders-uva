<script>
  import { onMount } from 'svelte'
  import { createField } from './field.js'

  let wrap, pre

  onMount(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let field = null, aspect = 0, raf = 0

    // The buffer shares the pane's aspect, so scaling the <pre> to the pane's
    // width covers it exactly. The hands overshoot the corners by design and
    // the mask fades them out before the edge.
    const fit = () => {
      if (!wrap || !pre || !pre.scrollWidth) return
      pre.style.transform = 'none'
      const s = Math.max(wrap.clientWidth / pre.scrollWidth, wrap.clientHeight / pre.scrollHeight)
      pre.style.transform = `scale(${s})`
    }

    // Run the field to steady state so the hands are whole on the first paint.
    const prime = () => { let t = ''; for (let i = 0; i < 24; i++) t = field.step(i * 16); return t }
    const frame = (now) => { pre.textContent = field.step(now); raf = requestAnimationFrame(frame) }

    // Build for the pane's shape; rebuild when it changes enough to matter.
    const build = () => {
      const a = wrap.clientWidth / Math.max(1, wrap.clientHeight)
      if (!a || Math.abs(a - aspect) < 0.03) return fit()
      aspect = a
      field = createField({ aspect })
      cancelAnimationFrame(raf)
      pre.textContent = prime()
      fit()
      if (!reduce) raf = requestAnimationFrame(frame)
    }

    // Measure only once the mono face is in, otherwise the scale comes from a
    // fallback font and the hands land in the wrong place.
    const ro = new ResizeObserver(build)
    const ready = document.fonts ? document.fonts.ready : Promise.resolve()
    ready.then(() => { ro.observe(wrap); build() })
    document.fonts?.addEventListener('loadingdone', fit)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.fonts?.removeEventListener('loadingdone', fit)
    }
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
    -webkit-mask-image: linear-gradient(to top right, transparent 2%, #000 28%, #000 72%, transparent 98%);
    mask-image: linear-gradient(to top right, transparent 2%, #000 28%, #000 72%, transparent 98%);
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
