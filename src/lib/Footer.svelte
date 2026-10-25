<script>
  import Instagram from './Instagram.svelte'
  import LinkedIn from './LinkedIn.svelte'

  const year = new Date().getFullYear()
</script>

<footer class="foot">
  <nav class="links" aria-label="Site">
    <a href="/cohorts">Cohorts</a>
    <a href="/events">Events</a>
    <a href="https://www.instagram.com/builders.uva/" target="_blank" rel="noopener" aria-label="builders@uva on Instagram" title="Instagram"><Instagram size={18} /></a>
    <a href="https://www.linkedin.com/company/uva-builders/" target="_blank" rel="noopener" aria-label="builders@uva on LinkedIn" title="LinkedIn"><LinkedIn size={18} /></a>
    <span class="copy">© {year} builders@uva</span>
  </nav>
</footer>

<style>
  .foot {
    position: relative; /* above the hands on home */
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    gap: 12px 24px;
    /* the same distance from the right edge as from the bottom */
    padding: 20px max(20px, env(safe-area-inset-right)) max(20px, env(safe-area-inset-bottom));
    font-size: 20px; /* the size of the site's other small text: meta, Register */
    line-height: 1;
    color: var(--muted);
  }
  /* on a narrow screen the links wrap whole, right-aligned, never mid-link */
  /* the rule spans only the footer's own content, not the page, with the
     same room above the row as below it */
  .links {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    gap: 10px 20px;
    padding-top: 20px;
    border-top: 1px solid var(--hair);
  }
  .links > * { white-space: nowrap; }
  .links :global(svg) { display: block; }
  /* phones: the links fit one line without the copyright */
  @media (max-width: 599px) { .foot { font-size: 17px; } .links { gap: 10px 16px; } .copy { display: none; } }
  a { transition: color 0.15s ease; }
  a:hover { color: var(--fg); }
</style>
