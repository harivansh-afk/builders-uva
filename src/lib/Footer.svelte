<script>
  import { onMount } from 'svelte'

  // Charlottesville time, ticking. A small sign the site is a live thing.
  const clock = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    timeZone: 'America/New_York', timeZoneName: 'short',
  })
  let now = $state('')
  onMount(() => {
    const tick = () => (now = clock.format(new Date()).replace(',', ''))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  })

  let el
  // On the home page the copy pane is the scroller, not the window.
  function top(e) {
    e.preventDefault()
    let s = el?.parentElement
    while (s && s !== document.body && s.scrollHeight <= s.clientHeight) s = s.parentElement
    ;(s && s !== document.body ? s : window).scrollTo({ top: 0, behavior: 'smooth' })
  }

  const year = new Date().getFullYear()
</script>

<footer class="foot" bind:this={el}>
  <p class="word" aria-label="builders@uva">builders<em>@uva</em></p>

  <div class="grid">
    <p class="line">
      A small group of students at the University of Virginia who build things.
      We meet <em>every Thursday</em> in Charlottesville.
    </p>

    <nav class="col" aria-label="Footer pages">
      <p class="h">Pages</p>
      <a href="/">Home</a>
      <a href="/events">Events</a>
      <a href="/join">Join us</a>
    </nav>

    <div class="col">
      <p class="h">Reach us</p>
      <a href="mailto:team@uva.builders">team@uva.builders</a>
      <a href="https://uvafoundry.com" target="_blank" rel="noopener">The Foundry</a>
      <a href="https://www.virginia.edu" target="_blank" rel="noopener">UVA</a>
    </div>
  </div>

  <div class="base">
    <span>© {year} builders@uva</span>
    <span class="clock" aria-label="Current time in Charlottesville">Charlottesville <span class="t">{now}</span></span>
    <a href="#top" onclick={top}>Back to top <span aria-hidden="true">↑</span></a>
  </div>
</footer>

<style>
  .foot {
    display: grid;
    gap: var(--s5);
    padding: var(--s5) 0 var(--s4);
    border-top: 1px solid var(--hair);
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.02em;
    color: var(--muted);
  }
  .word {
    font-family: var(--mono);
    font-size: clamp(34px, 3.2vw, 44px);
    font-weight: 500;
    line-height: 1;
    letter-spacing: -0.03em;
    color: var(--fg);
  }
  .word em { font-style: normal; color: var(--dim); }

  .grid {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--s4) var(--s4);
    align-items: start;
  }
  .line {
    font-family: var(--sans);
    font-size: 15px;
    line-height: 1.55;
    letter-spacing: 0;
    max-width: 30ch;
    color: var(--soft);
  }
  .line em {
    font-family: var(--serif);
    font-style: italic;
    font-size: 1.12em;
    line-height: 1;
    color: var(--fg);
  }
  .col { display: grid; gap: 12px; justify-items: start; }
  .h {
    margin-bottom: 4px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--fg);
  }
  .col a {
    color: var(--muted);
    border-bottom: 1px solid transparent;
    transition: color 0.15s ease, border-color 0.15s ease;
  }
  .col a:hover { color: var(--fg); border-color: var(--dim); }

  .base {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px var(--s3);
    padding-top: var(--s3);
    border-top: 1px solid var(--hair);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--dim);
  }
  .clock .t { color: var(--muted); font-variant-numeric: tabular-nums; }
  .base a { color: var(--muted); transition: color 0.15s ease; }
  .base a:hover { color: var(--fg); }

  @media (max-width: 599px) {
    .grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
    .line { grid-column: 1 / -1; }
    .base { flex-direction: column; align-items: flex-start; }
  }
</style>
