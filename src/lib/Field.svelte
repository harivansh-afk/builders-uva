<script>
  // One question on a form: the label, then its control.
  let { q, id = '', err = '', children } = $props()
</script>

<div class="field" data-invalid={err || undefined}>
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
  .field { padding: var(--s3) 0; }
  .body { display: grid; gap: 12px; min-width: 0; }
  .q {
    font-size: 22px;
    line-height: 1.35;
    letter-spacing: -0.008em;
    color: var(--fg);
  }
  .err {
    font-size: 18px;
    color: var(--error);
  }

  @media (max-width: 899px) {
    .field { padding: 20px 0; }
    .q { font-size: 21px; }
  }
</style>
