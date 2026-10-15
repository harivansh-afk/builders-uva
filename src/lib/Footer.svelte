<script>
  import { onMount } from 'svelte'
  import Instagram from './Instagram.svelte'

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

<!-- one row in the bottom-right corner on every page, mirroring the nav in the top-left -->
<footer class="foot">
  <span class="clock" aria-label="Current time in Charlottesville">Charlottesville <span class="t">{now}</span></span>
  <span class="sep" aria-hidden="true">|</span>
  <span>© {year} builders@uva</span>
  <a class="legal ink" href="/legal">Legal</a>
  <a class="social ink" href="https://www.instagram.com/builders.uva/" target="_blank" rel="noopener" aria-label="builders@uva on Instagram" title="Instagram"><Instagram size={11} /></a>
</footer>

<style>
  .foot {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    gap: 8px 12px;
    min-height: 32px;
    padding: 0 var(--edge) max(var(--edge), env(safe-area-inset-bottom));
    font-family: var(--mono);
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    text-align: right;
  }
  .clock .t { font-variant-numeric: tabular-nums; }
  .sep { color: var(--dim); }
  .legal { margin-left: 4px; }
  .social { display: inline-flex; padding-block: 0.18em; }

  /* narrow: the clock takes its own line above the rest */
  @media (max-width: 599px) {
    .sep { display: none; }
    .clock { flex-basis: 100%; }
  }
</style>
