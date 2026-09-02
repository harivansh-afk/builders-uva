<script>
  import { onMount } from 'svelte'
  import { createField } from './field.js'

  let wrap, pre

  onMount(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const field = createField()

    // Scale the <pre> to cover its container.
    const fit = () => {
      if (!wrap || !pre) return
      pre.style.transform = 'none'
      const s = Math.max(wrap.clientWidth / pre.scrollWidth, wrap.clientHeight / pre.scrollHeight)
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
    -webkit-mask-image: radial-gradient(70% 70% at 50% 50%, #000 40%, transparent 100%);
    mask-image: radial-gradient(70% 70% at 50% 50%, #000 40%, transparent 100%);
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
