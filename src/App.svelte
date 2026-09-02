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
  <main class="left">
    <h1 class="sr-only">builders@uva</h1>

    <section class="block hero">
      <h2 class="eyebrow">Who we are</h2>
      <p class="lede">
        <span class="hl">builders@uva</span> is a small group of students who believe in making the non-traditional path into tech more accessible.
        We meet weekly, host world-class founders, and hold each other to a higher bar.
      </p>
    </section>

    <section class="block">
      <h2 class="eyebrow">What we believe</h2>
      <ol class="beliefs">
        {#each beliefs as b}
          <li class="lede">{b.lead} <em>{b.em}</em></li>
        {/each}
      </ol>
    </section>

    <section class="block">
      <h2 class="eyebrow">Team</h2>
      <ul class="founders">
        {#each founders as f}
          <li>
            <img src={f.img} alt={f.name} width="160" height="160" decoding="async" />
            <p class="name">{f.name}</p>
            <p class="role">{f.role}</p>
          </li>
        {/each}
      </ul>
    </section>
  </main>

  <aside class="right">
    <div class="stage"><Ascii /></div>
    <div class="logos">
      <a href="https://www.virginia.edu" target="_blank" rel="noopener" aria-label="University of Virginia">
        <img src="/uva.svg" alt="" height="34" />
      </a>
      <a href="https://uvafoundry.com" target="_blank" rel="noopener" aria-label="The Foundry">
        <img src="/foundry.svg" alt="" height="28" />
      </a>
    </div>
  </aside>
</div>

<style>
  /* ---------- two panes: graphic pinned left, copy scrolls right ---------- */
  .site {
    display: grid;
    grid-template-columns: 55fr 45fr;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
  }

  .left {
    order: 2;
    height: 100%;
    overflow-y: auto;
    overscroll-behavior: contain;
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

  .lede {
    font-size: var(--lede);
    line-height: 1.32;
    letter-spacing: -0.008em;
    max-width: var(--measure);
    text-wrap: pretty;
  }

  .hl {
    font-family: var(--mono);
    font-size: 0.9em;
    background: rgba(242, 240, 234, 0.1);
    border-radius: 6px;
    padding: 0.06em 0.34em;
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
    grid-template-columns: repeat(2, minmax(0, 128px));
    gap: 28px;
  }
  .founders img {
    width: 100%;
    aspect-ratio: 1;
    height: auto;
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

  .right {
    order: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    border-right: 1px solid var(--hair);
  }
  .stage {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
  }
  .logos {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 28px;
    padding: 0 var(--gutter) 20px;
    opacity: 0.7;
    transition: opacity 0.25s ease;
  }
  .logos:hover, .logos:focus-within { opacity: 1; }
  /* 44px tall hit area around each logo */
  .logos a { display: flex; align-items: center; min-height: 44px; }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }

  /* ---------- one column: graphic on top, copy below, page scrolls ---------- */
  @media (max-width: 899px) {
    .site {
      grid-template-columns: minmax(0, 1fr);
      grid-auto-rows: auto;
      height: auto;
      overflow: visible;
    }
    .right {
      /* square-ish stage on phones, capped on tall or wide tablets */
      height: clamp(340px, 56dvh, 620px);
      border-right: 0;
      border-bottom: 1px solid var(--hair);
    }
    .logos { gap: 22px; padding-bottom: 12px; }
    .logos img { height: 24px; }
    .left {
      height: auto;
      overflow: visible;
      padding-bottom: calc(40px + env(safe-area-inset-bottom));
    }
    .block { padding: 28px 0 32px; }
    .block .eyebrow { margin-bottom: 16px; }
    .hero { padding-top: 32px; }
    .beliefs { gap: 20px; }
    .founders { gap: 20px; }
  }

  /* short landscape phones: don't let the graphic eat the whole screen */
  @media (max-width: 899px) and (max-height: 500px) {
    .right { height: 320px; }
  }
</style>
