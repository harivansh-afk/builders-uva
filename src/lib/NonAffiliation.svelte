<div class="notice">
  <button popovertarget="non-affiliation-policy">Non-affiliation policy</button>
  <aside id="non-affiliation-policy" popover aria-labelledby="policy-title">
    <h2 id="policy-title">Independent student organization</h2>
    <p>Although this organization has members who are University of Virginia students and may have University employees associated or engaged in its activities and affairs, the organization is not a part of or an agency of the University. It is a separate and independent organization, which is responsible for and manages its own activities and affairs. The University does not direct, supervise or control the organization and is not responsible for the organization’s contracts, acts or omissions.</p>
  </aside>
</div>

<style>
  .notice {
    min-width: 0;
    font-family: var(--sans);
    font-size: 14px;
    color: var(--muted);
  }
  button {
    display: block;
    min-height: 44px;
    padding: 0;
    border: 0;
    background: var(--bg);
    color: inherit;
    font: inherit;
    line-height: 1.3;
    text-align: right;
    cursor: pointer;
  }
  button:hover, .notice:has(:popover-open) button { color: var(--fg); }
  button:focus-visible { outline: 1px solid var(--fg); outline-offset: 4px; }
  aside {
    position: fixed;
    inset: 64px var(--gutter) auto auto;
    width: min(440px, calc(100vw - 2 * var(--gutter)));
    max-height: calc(100dvh - 80px - env(safe-area-inset-bottom));
    overflow-y: auto;
    margin: 0;
    padding: var(--s3);
    border: 1px solid var(--hair);
    background: var(--bg);
    color: var(--soft);
    line-height: 1.6;
  }
  h2 { margin-bottom: var(--s2); font-size: inherit; font-weight: 500; color: var(--fg); }
  @media (max-width: 599px) {
    .notice { max-width: 116px; font-size: 12px; }
    aside { padding: var(--s2); font-size: 14px; }
  }
</style>
