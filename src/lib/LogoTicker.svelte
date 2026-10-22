<script>
  import { onMount } from 'svelte'
  import { logos } from './logos.js'
  import { inkAt } from './field.js'

  // Phones have no room around the copy for the marks to float in, so they
  // drift past in a line under it instead, centred in the gap between the
  // copy and the top of Adam's hand. `enter` delays their arrival; `split` is
  // the hands' (see createField); `avoid` returns the copy's element.
  let { enter = 0, split = 0, avoid = () => null } = $props()

  let top = $state(null)

  function place() {
    const copy = avoid()
    if (!copy || !matchMedia('(max-width: 599px)').matches) return
    const W = innerWidth, H = innerHeight
    const ink = inkAt({ aspect: W / H, split })
    // the highest inked point in the lower half is the top of Adam's hand
    let hand = H
    find: for (let ny = 0.5; ny < 1; ny += 0.004)
      for (let nx = 0; nx <= 1; nx += 0.02)
        if (ink(nx, ny) > 0.02) { hand = ny * H; break find }
    top = (copy.getBoundingClientRect().bottom + hand) / 2
  }

  onMount(() => {
    document.fonts.ready.then(place)
    addEventListener('resize', place)
    return () => removeEventListener('resize', place)
  })
</script>

<div class="ticker" aria-hidden="true" style:--enter="{enter}ms" style:top={top === null ? null : `${top}px`}>
  <div class="run">
    {#each [0, 1] as _}
      {#each logos as m}
        <span class="mark {m.face ?? 'glyph'}">
          {#if m.glyph}<svg viewBox="0 0 24 24"><path d={m.glyph} /></svg>{/if}
          <span class="name">{m.name}</span>
        </span>
      {/each}
    {/each}
  </div>
</div>

<style>
  .ticker {
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    translate: 0 -50%;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to right, transparent, #000 18%, #000 82%, transparent);
    mask-image: linear-gradient(to right, transparent, #000 18%, #000 82%, transparent);
    animation: arrive 1.4s ease var(--enter) both;
  }
  @media (max-width: 599px) {
    .ticker { display: block; }
  }
  @keyframes arrive { from { opacity: 0; } }
  .run {
    display: flex;
    width: max-content;
    animation: run 70s linear infinite;
  }
  @keyframes run { to { translate: -50% 0; } }

  .mark {
    display: inline-flex;
    align-items: center;
    gap: 0.45em;
    margin-right: 32px;
    font-size: 14px;
    line-height: 1;
    white-space: nowrap;
    color: var(--fg);
    opacity: 0.45;
  }
  svg { width: 1.15em; height: 1.15em; fill: currentColor; flex-shrink: 0; }

  /* the same wordmark faces as the floating marks (see Logos) */
  .name { letter-spacing: -0.02em; font-weight: 500; }
  .glyph .name { font-weight: 400; }
  .sans .name { font-size: 1.1em; font-weight: 600; letter-spacing: -0.04em; }
  .serif .name { font-family: var(--serif); font-style: italic; font-size: 1.2em; font-weight: 400; }
  .mono .name { font-family: var(--mono); font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.08em; }

  @media (prefers-reduced-motion: reduce) {
    .ticker, .run { animation: none; }
  }
</style>
