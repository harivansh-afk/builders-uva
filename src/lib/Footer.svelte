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

  const year = new Date().getFullYear()
</script>

<footer class="foot">
  <span>© {year} builders@uva</span>
  <span class="clock" aria-label="Current time in Charlottesville">Charlottesville <span class="t">{now}</span></span>
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

  @media (max-width: 599px) {
    .foot { flex-direction: column; align-items: flex-start; }
  }
</style>
