<script>
  // Where our speakers come from and have been. The marks are the companies'
  // own, set in one colour so none shouts; each gets its own height so they
  // read at one size.
  import hf0 from './logos/hf0.png'
  import a16z from './logos/a16z.png'
  const svg = import.meta.glob('./logos/*.svg', { query: '?raw', import: 'default', eager: true })
  const logos = [
    { name: 'Y Combinator', file: 'ycombinator', h: 20 },
    { name: 'Anthropic', file: 'anthropic', h: 11 },
    { name: 'a16z', mask: a16z, ratio: 235 / 96, h: 17 },
    { name: 'Instagram', file: 'instagram', h: 27, nudge: 2 },
    { name: 'HF0', img: hf0, h: 20 },
    { name: 'Google', file: 'google', h: 20, nudge: 2 },
    { name: 'Microsoft', file: 'microsoft', h: 17 },
  ].map((l) => ({ ...l, svg: l.file && svg[`./logos/${l.file}.svg`] }))
</script>

<!-- two copies side by side: the track slides one copy's width, then repeats -->
<div class="logos">
  <div class="track">
    {#each [0, 1] as copy}
      <ul class="set" aria-label={copy ? undefined : 'Where our speakers have been'} aria-hidden={copy ? 'true' : undefined}>
        {#each logos as l}
          <li style:--h="{l.h}px" style:--nudge="{l.nudge ?? 0}px" role="img" aria-label={l.name}>
            {#if l.mask}
              <!-- a raster mark, painted in the strip's colour through its alpha -->
              <span class="mask" style:--src="url({l.mask})" style:--w="{l.h * l.ratio}px"></span>
            {:else if l.img}
              <!-- HF0's mark is its sphere, which few would know alone -->
              <img src={l.img} alt="" /><span class="word">{l.name}</span>
            {:else}
              {@html l.svg}
            {/if}
          </li>
        {/each}
      </ul>
    {/each}
  </div>
</div>

<style>
  .logos {
    /* as wide as the footer row under it, never wider */
    contain: inline-size;
    overflow: hidden;
    color: var(--muted);
    mask-image: linear-gradient(to right, transparent, #000 18%, #000 82%, transparent);
  }
  .track {
    display: flex;
    width: max-content;
    animation: slide 40s linear infinite;
  }
  .logos:hover .track { animation-play-state: paused; }
  .set {
    display: flex;
    align-items: center;
    gap: 40px;
    padding: 0 20px; /* half the gap at each end, so the seam matches */
    margin: 0;
    list-style: none;
    height: 32px;
  }
  .set li { display: flex; align-items: center; gap: 6px; translate: 0 var(--nudge); }
  .set :global(svg), .set img { display: block; height: var(--h); width: auto; }
  .mask {
    display: block;
    width: var(--w);
    height: var(--h);
    background: currentColor;
    mask: var(--src) center / contain no-repeat;
  }
  .set img { filter: grayscale(1); opacity: 0.8; }
  .word { font-size: 16px; font-weight: 500; letter-spacing: 0.02em; line-height: 1; }
  @keyframes slide { to { transform: translateX(-50%); } }
  @media (prefers-reduced-motion: reduce) { .track { animation: none; } }
</style>
