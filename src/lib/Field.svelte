<script>
  // One numbered row of the application, laid out like a row on /events:
  // number in a 4ch column, question and control in the rest.
  let { n, q, id = '', err = '', children } = $props()
</script>

<div class="field" data-invalid={err || undefined}>
  <span class="n">{n}</span>
  <div class="body">
    {#if id}
      <label class="q" for={id}>{q}</label>
    {:else}
      <p class="q">{q}</p>
    {/if}
    {@render children()}
    {#if err}<p class="err">{err}</p>{/if}
  </div>
</div>

<style>
  .field {
    display: grid;
    grid-template-columns: 4ch minmax(0, 1fr);
    align-items: baseline;
    column-gap: 24px;
    padding: var(--s4) 8px;
    border-bottom: 1px solid var(--hair);
  }
  .n {
    font-family: var(--mono);
    font-size: 14px;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }
  .body { display: grid; gap: var(--s3); min-width: 0; }
  .q {
    font-size: 19px;
    line-height: 1.35;
    letter-spacing: -0.008em;
    color: var(--fg);
  }
  .err {
    font-family: var(--mono);
    font-size: 14px;
    color: #c98484;
  }

  @media (max-width: 899px) {
    .field { padding: var(--s3) 4px; column-gap: 18px; }
    .q { font-size: 17px; }
  }
  @media (max-width: 599px) {
    .field { grid-template-columns: 3ch minmax(0, 1fr); }
  }
</style>
