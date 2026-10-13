<script>
  // A square bracket drawn in dots, after hari.cafe's nav.
  let { side = 'left' } = $props()
  const col = side === 'left' ? 0.5 : 2.5
  const arm = side === 'left' ? [1.5, 2.5] : [1.5, 0.5]
  const pts = [
    ...Array.from({ length: 8 }, (_, i) => [col, i + 0.5]),
    ...arm.flatMap((x) => [[x, 0.5], [x, 7.5]]),
  ]
</script>

<svg class="dots {side}" viewBox="0 0 3 8" aria-hidden="true">
  {#each pts as [cx, cy]}<circle {cx} {cy} r="0.36" />{/each}
</svg>

<style>
  .dots {
    position: absolute;
    top: 50%;
    translate: 0 -50%;
    width: 0.34em;
    height: 0.92em;
    fill: currentColor;
    opacity: 0;
    pointer-events: none;
  }
  .left { right: calc(100% + 0.3em); }
  .right { left: calc(100% + 0.3em); }
</style>
