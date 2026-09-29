<script>
  import { onMount } from 'svelte'

  // `inline`: right-aligned metadata for the home page.
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
  <p class="notice">
    <strong>Non-affiliation notice</strong>
    Although this organization has members who are University of Virginia students and may have University employees associated or engaged in its activities and affairs, the organization is not a part of or an agency of the University. It is a separate and independent organization, which is responsible for and manages its own activities and affairs. The University does not direct, supervise or control the organization and is not responsible for the organization’s contracts, acts or omissions.
  </p>
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
  .notice {
    flex: 0 0 100%;
    font-family: var(--sans);
    font-size: 14px;
    letter-spacing: normal;
    text-transform: none;
    color: var(--soft);
  }
  .notice strong { display: block; margin-bottom: 8px; color: var(--fg); }

  @media (min-width: 900px) {
    .inline {
      justify-content: flex-end;
      gap: var(--s4) 12px;
      border-top: 0;
    }
    /* the rule spans the content box only, from the copy's left edge to the text's right edge */
    .inline::before {
      content: '';
      flex: 0 0 100%;
      height: 1px;
      background: var(--hair);
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
