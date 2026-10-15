<script>
  import { onMount } from 'svelte'

  // `inline`: compact spacing for the home page footer.
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
  <a class="legal ink" href="/legal">Legal</a>
  <div class="details">
    <span>© {year} builders@uva</span>
    <span class="sep" aria-hidden="true">|</span>
    <span class="clock" aria-label="Current time in Charlottesville">Charlottesville <span class="t">{now}</span></span>
  </div>
</footer>

<style>
  .foot {
    display: flex;
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
  .legal { flex-shrink: 0; }

  .details {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: baseline;
    gap: 12px;
    min-width: 0;
    margin-left: auto;
    text-align: right;
  }
  .clock .t { color: var(--muted); font-variant-numeric: tabular-nums; }

  /* home: one row in the bottom-right corner, on the nav's 32px line */
  .inline {
    justify-content: flex-end;
    align-items: center;
    min-height: 32px;
    border-top: 0;
  }
  .inline .details { margin-left: 0; }
  @media (min-width: 900px) {
    .inline { gap: 12px; }
    .inline .legal { order: 1; }
    .inline::before {
      content: '|';
      order: 1;
      color: var(--dim);
    }
    .inline .details { order: 0; }
    .sep { color: var(--dim); }
  }
  /* narrow: Legal at the left edge, sitting on the clock's line */
  @media (max-width: 899px) {
    .inline { justify-content: space-between; align-items: flex-end; }
  }
  @media (max-width: 899px) {
    .sep { display: none; }
  }

  @media (max-width: 599px) {
    .details { flex-direction: column; align-items: flex-end; }
  }
</style>
