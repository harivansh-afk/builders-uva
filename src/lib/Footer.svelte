<script>
  import Instagram from './Instagram.svelte'
  import LinkedIn from './LinkedIn.svelte'

  const year = new Date().getFullYear()
</script>

<!-- one row in the bottom-right corner on every page, mirroring the nav in the top-left -->
<footer class="foot">
  <div class="row">
    <span>© {year} builders@uva</span>
    <a class="legal ink" href="/legal">Legal</a>
    <a class="social ink" href="https://www.instagram.com/builders.uva/" target="_blank" rel="noopener" aria-label="builders@uva on Instagram" title="Instagram"><Instagram size={11} /></a>
    <a class="social ink" href="https://www.linkedin.com/company/uva-builders/" target="_blank" rel="noopener" aria-label="builders@uva on LinkedIn" title="LinkedIn"><LinkedIn size={11} /></a>
  </div>
</footer>

<style>
  .foot {
    display: flex;
    justify-content: flex-end;
    padding: 0 var(--edge) max(12px, env(safe-area-inset-bottom));
    font-family: var(--mono);
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    text-align: right;
  }
  /* the rule spans only the footer's own content, not the page */
  .row {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    gap: 8px 12px;
    /* the same room above the row as below it, to the window's edge */
    padding-top: 12px;
    border-top: 1px solid var(--hair);
  }
  .legal { margin-left: 4px; }
  .social :global(svg) { vertical-align: -0.1em; }
</style>
