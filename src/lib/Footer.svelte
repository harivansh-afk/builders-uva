<script>
  import Instagram from './Instagram.svelte'

  const year = new Date().getFullYear()
</script>

<!-- one row in the bottom-right corner on every page, mirroring the nav in the top-left -->
<footer class="foot">
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
  .legal { margin-left: 4px; }
  .social :global(svg) { vertical-align: -0.1em; }
</style>
