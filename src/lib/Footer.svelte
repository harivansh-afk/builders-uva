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
  <span>© {year} builders@uva</span>
  <span class="clock" aria-label="Current time in Charlottesville">Charlottesville <span class="t">{now}</span></span>
  <a href="#top" onclick={top}>Back to top <span aria-hidden="true">↑</span></a>
</footer>

<style>
  .foot {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px var(--s3);
    padding: var(--s4) 0;
    border-top: 1px solid var(--hair);
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--dim);
  }
  .clock .t { color: var(--muted); font-variant-numeric: tabular-nums; }
  .foot a { color: var(--muted); transition: color 0.15s ease; }
  .foot a:hover { color: var(--fg); }

  @media (max-width: 599px) {
    .foot { flex-direction: column; align-items: flex-start; }
  }
</style>
