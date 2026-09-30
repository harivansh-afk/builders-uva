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
  <details class="notice"
    onpointerenter={(event) => { if (event.pointerType === 'mouse') event.currentTarget.open = true }}
    onpointerleave={(event) => { if (event.pointerType === 'mouse' && !event.currentTarget.contains(document.activeElement)) event.currentTarget.open = false }}>
    <summary>Non-affiliation policy</summary>
    <p>
    <strong>Independent student organization</strong>
    Although this organization has members who are University of Virginia students and may have University employees associated or engaged in its activities and affairs, the organization is not a part of or an agency of the University. It is a separate and independent organization, which is responsible for and manages its own activities and affairs. The University does not direct, supervise or control the organization and is not responsible for the organization’s contracts, acts or omissions.
    </p>
  </details>
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
    position: fixed;
    z-index: 30;
    left: 24px;
    bottom: max(16px, env(safe-area-inset-bottom));
    padding: 0 4px;
    font-family: var(--sans);
    font-size: 14px;
    letter-spacing: normal;
    text-transform: none;
    color: #b6b6b6;
  }
  .notice::before {
    content: '';
    position: absolute;
    inset: -8px 0 100%;
  }
  summary {
    display: flex;
    align-items: center;
    min-height: 44px;
    padding: 0 8px;
    cursor: pointer;
    list-style: none;
    border-radius: 4px;
    background: #0b0b0b;
  }
  summary::-webkit-details-marker { display: none; }
  summary:hover, details[open] summary { color: var(--fg); }
  summary:focus-visible { outline: 2px solid var(--fg); outline-offset: 2px; }
  .notice p {
    position: absolute;
    left: 0;
    bottom: calc(100% + 8px);
    box-sizing: border-box;
    width: min(440px, calc(100vw - 48px));
    max-height: calc(100dvh - 96px);
    overflow-y: auto;
    margin: 0;
    padding: 16px;
    border: 1px solid #383838;
    border-radius: 8px;
    background: #151515;
    line-height: 1.6;
    color: #c9c9c9;
  }
  .notice strong { display: block; margin-bottom: 8px; font-weight: 500; color: var(--fg); }

  @media (min-width: 900px) {
    .inline {
      justify-content: flex-end;
      gap: 12px;
      align-items: center;
      font-size: 12px;
      letter-spacing: 0.04em;
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
    .notice { position: static; width: 100%; padding: 0; }
    .notice::before { display: none; }
    summary { width: fit-content; padding: 0; }
    .notice p {
      position: static;
      width: 100%;
      max-height: none;
      overflow: visible;
      margin-top: 8px;
    }
  }

  @media (max-width: 599px) {
    .foot { flex-direction: column; align-items: flex-start; }
  }
</style>
