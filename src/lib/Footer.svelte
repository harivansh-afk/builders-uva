<script>
  import { onMount } from 'svelte'

  // `inline`: one line, no rule, for the home page's bottom-right corner.
  let { inline = false } = $props()

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

<footer class="foot" class:inline>
  <span>© {year} builders@uva</span>
  {#if inline}<span class="sep" aria-hidden="true">|</span>{/if}
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
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .clock .t { color: var(--muted); font-variant-numeric: tabular-nums; }

  @media (min-width: 900px) {
    .inline {
      justify-content: flex-end;
      gap: 12px;
      border-top: 0;
    }
    .sep { color: var(--dim); }
  }
  @media (max-width: 899px) {
    .sep { display: none; }
  }

  @media (max-width: 599px) {
    .foot { flex-direction: column; align-items: flex-start; }
  }
</style>
