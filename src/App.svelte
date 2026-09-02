<script>
  import Ascii from './lib/Ascii.svelte'

  const beliefs = [
    { lead: 'The company you keep sets the expectations for', em: 'what you can achieve.' },
    { lead: 'The world around you was built by people no different than yourself.', em: 'You can just build things.' },
    { lead: 'Weird will always win.', em: 'Normal choices guarantee normal results.' },
    { lead: "Fail fast, fail often. Even if you don't win,", em: 'you can lose better.' },
  ]

  const founders = [
    { name: 'Nathan Wang', role: 'Co-founder', img: '/nathan.png' },
    { name: 'Harivansh Rathi', role: 'Co-founder', img: '/hari.png' },
  ]
</script>

<div class="site">
  <section class="left">
    <div class="block hero">
      <p class="eyebrow">Who we are</p>
      <p class="sub">
        <span class="hl">builders@uva</span> is a small group of students who make things: software, hardware, companies.
        We meet weekly at the Foundry and hold each other to a higher bar.
      </p>
    </div>

    <div class="block">
      <p class="eyebrow">What we believe</p>
      <ol class="beliefs">
        {#each beliefs as b}
          <li>{b.lead} <em>{b.em}</em></li>
        {/each}
      </ol>
    </div>

    <div class="block">
      <p class="eyebrow">Team</p>
      <ul class="founders">
        {#each founders as f}
          <li>
            <img src={f.img} alt={f.name} width="160" height="160" />
            <p class="name">{f.name}</p>
            <p class="role">{f.role}</p>
          </li>
        {/each}
      </ul>
    </div>

  </section>

  <aside class="right">
    <Ascii />
    <div class="logos">
      <a href="https://www.virginia.edu" target="_blank" rel="noopener" aria-label="University of Virginia">
        <img src="/uva.svg" alt="University of Virginia" height="34" />
      </a>
      <a href="https://uvafoundry.com" target="_blank" rel="noopener" aria-label="The Foundry">
        <img src="/foundry.svg" alt="The Foundry" height="28" />
      </a>
    </div>
  </aside>
</div>

<style>
  .site {
    display: grid;
    grid-template-columns: 55fr 45fr;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
  }

  /* ---------- left, scrolls with the page ---------- */
  .left {
    order: 2;
    height: 100%;
    overflow-y: auto;
    scrollbar-width: none;
    padding: 0 var(--gutter);
  }
  .left::-webkit-scrollbar { display: none; }
  .block {
    padding: 36px 0 40px;
    border-top: 1px solid var(--hair);
  }
  .block .eyebrow { margin-bottom: 20px; }

  .hero { padding-top: 40px; border-top: 0; }
  .sub {
    font-size: clamp(22px, 1.9vw, 28px);
    line-height: 1.32;
    letter-spacing: -0.008em;
    max-width: 26ch;
    text-wrap: pretty;
  }

  .hl {
    background: rgba(242, 240, 234, 0.1);
    border-radius: 6px;
    padding: 0.04em 0.32em;
    margin: 0 -0.04em;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }

  .beliefs {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 24px;
  }
  .beliefs li {
    font-size: clamp(22px, 1.9vw, 28px);
    line-height: 1.32;
    letter-spacing: -0.008em;
    max-width: 26ch;
    text-wrap: pretty;
  }
  .beliefs em {
    font-family: var(--serif);
    font-style: italic;
    font-size: 1.12em;
    line-height: 1;
  }

  .founders {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, 128px);
    gap: 28px;
  }
  .founders img {
    width: 128px;
    height: 128px;
    object-fit: cover;
    filter: grayscale(1);
    background: #17171a;
    margin-bottom: 12px;
  }
  .founders .name { font-size: 15px; font-weight: 500; }
  .founders .role {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 6px;
  }


  /* ---------- right, pinned ---------- */
  .right {
    order: 1;
    position: relative;
    height: 100%;
    overflow: hidden;
    border-right: 1px solid var(--hair);
  }
  .logos {
    position: absolute;
    left: var(--gutter);
    bottom: 28px;
    display: flex;
    align-items: center;
    gap: 28px;
    opacity: 0.7;
    transition: opacity 0.25s ease;
  }
  .logos:hover { opacity: 1; }

  /* ---------- small screens: graphic on top, then the content ---------- */
  @media (max-width: 900px) {
    .site { grid-template-columns: 1fr; height: auto; min-height: 100dvh; overflow: visible; }
    .right { height: 46vh; height: 46dvh; border-right: 0; border-bottom: 1px solid var(--hair); }
    .left { height: auto; overflow: visible; padding-bottom: 48px; }
    .right :global(.wrap) { inset: 0 0 60px 0; }
    .logos { bottom: 16px; gap: 20px; }
    .logos img { height: 22px; }
    .hero { padding-top: 32px; }
    .founders { grid-template-columns: repeat(2, minmax(0, 128px)); gap: 20px; }
    .founders img { width: 100%; height: auto; aspect-ratio: 1; }
  }
</style>
