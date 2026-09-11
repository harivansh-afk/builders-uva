<script>
  import Ascii from '../lib/Ascii.svelte'
  import Footer from '../lib/Footer.svelte'
  import LinkedIn from '../lib/LinkedIn.svelte'
  import X from '../lib/X.svelte'

  const beliefs = [
    { lead: 'The company you keep sets the expectations for', em: 'what you can achieve.' },
    { lead: 'The world around you was built by people no different than yourself.', em: 'You can just build things.' },
    { lead: 'Weird will always win.', em: 'Normal choices guarantee normal results.' },
    { lead: "Fail fast, fail often. Even if you don't win,", em: 'you can lose better.' },
  ]

  // Social icons only render when their links are set.
  const founders = [
    { name: 'Harivansh Rathi', img: '/hari.png', website: 'https://harivan.sh', linkedin: 'https://www.linkedin.com/in/harivansh-rathi', x: 'https://x.com/HarivanshRathi' },
    { name: 'Nathan Wang', img: '/nathan.png', linkedin: 'https://www.linkedin.com/in/nathan-wang-999930336/', x: 'https://x.com/NathanWang78302' },
  ]
</script>

<h1 class="sr-only">builders@uva</h1>

<!-- One viewport on desktop: hands top-left, copy top-right, the four beliefs
     as a strip across the bottom, logos and clock in one bar. Stacks on small
     screens. -->
<div class="poster">
  <aside class="stage"><Ascii /></aside>

  <main class="copy">
    <section class="hero">
      <h2 class="eyebrow">Who we are</h2>
      <p class="lede">
        <span class="hl">builders@uva</span> is building a culture of <em>independent creation</em> at UVA.
      </p>
      <p class="lede">
        We bring students together to <em>work</em> on their own ideas, <em>learn</em> from founders, and help each other go beyond their <em>perceived limitations.</em>
      </p>
    </section>

    <section class="team">
      <h2 class="eyebrow">Team</h2>
      <ul class="founders">
        {#each founders as f}
          <li>
            {#if f.website}
              <a class="face" href={f.website} aria-label={`${f.name}'s website`}>
                <img src={f.img} alt={f.name} width="240" height="240" decoding="async" />
              </a>
            {:else}
              <span class="face"><img src={f.img} alt={f.name} width="240" height="240" decoding="async" /></span>
            {/if}
            <div class="who">
              <p class="name">{f.name}</p>
              <div class="socials">
                {#if f.linkedin}
                  <a class="social" href={f.linkedin} target="_blank" rel="noopener" aria-label="{f.name} on LinkedIn" title="LinkedIn">
                    <LinkedIn size={14} />
                  </a>
                {/if}
                {#if f.x}
                  <a class="social" href={f.x} target="_blank" rel="noopener" aria-label="{f.name} on X" title="X">
                    <X size={14} />
                  </a>
                {/if}
              </div>
            </div>
          </li>
        {/each}
      </ul>
    </section>
  </main>

  <section class="beliefs">
    <h2 class="eyebrow">What we believe</h2>
    <ol>
      {#each beliefs as b, i}
        <li>
          <span class="n" aria-hidden="true">0{i + 1}</span>
          <p class="lede">{b.lead} <em>{b.em}</em></p>
        </li>
      {/each}
    </ol>
  </section>

  <Footer compact>
    <div class="logos">
      <a href="https://www.virginia.edu" target="_blank" rel="noopener" aria-label="University of Virginia">
        <img src="/uva.svg" alt="" height="30" />
      </a>
      <a href="https://uvafoundry.com" target="_blank" rel="noopener" aria-label="The Foundry">
        <img src="/foundry.svg" alt="" height="24" />
      </a>
      <a href="https://engineering.virginia.edu/offices-programs/ventureforward" target="_blank" rel="noopener" aria-label="VentureForward at UVA Engineering">
        <img class="ventureforward" src="/ventureforward.png" alt="" height="38" />
      </a>
    </div>
  </Footer>
</div>

<style>
  .poster .eyebrow { margin-bottom: var(--s3); }

  /* ---------- hands ---------- */
  .stage {
    position: relative;
    min-height: 0;
    overflow: hidden;
  }

  /* ---------- who we are + team ---------- */
  .copy {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--s5);
    min-width: 0;
  }
  .hero .lede + .lede { margin-top: var(--s3); }

  .founders {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--s3) var(--s4);
  }
  .founders li {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .face { display: block; flex-shrink: 0; }
  .founders img {
    width: 64px;
    height: 64px;
    object-fit: cover;
    filter: grayscale(1);
    background: #17171a;
  }
  .who { display: grid; gap: 2px; }
  .name { font-size: 16px; font-weight: 500; line-height: 1.2; }
  .socials { display: flex; margin-left: -7px; }
  .social {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    color: var(--muted);
    transition: color 0.15s ease;
  }
  .social:hover { color: var(--fg); }

  /* ---------- what we believe ---------- */
  .beliefs {
    border-top: 1px solid var(--hair);
    padding: var(--s4) var(--gutter);
  }
  .beliefs ol {
    list-style: none;
    padding: 0;
    display: grid;
    gap: var(--s4);
  }
  .beliefs li { display: grid; gap: 10px; align-content: start; }
  .n {
    font-family: var(--mono);
    font-size: 13px;
    letter-spacing: 0.12em;
    color: var(--dim);
    line-height: 1;
  }

  /* ---------- partner logos, inside the footer bar ---------- */
  .logos {
    display: flex;
    align-items: center;
    gap: 24px;
    mix-blend-mode: screen;
  }
  .logos a {
    display: flex;
    align-items: center;
    min-height: 44px;
    opacity: 0.7;
    filter: grayscale(1);
    transition: opacity 0.25s ease, filter 0.25s ease;
  }
  .logos a:hover, .logos a:focus-visible { opacity: 1; filter: grayscale(0); }

  /* ---------- desktop: one viewport, no scroll ---------- */
  @media (min-width: 900px) {
    .poster {
      /* the copy has less room than before; the type steps down to match */
      --lede: clamp(20px, 1.55vw, 26px);
      display: grid;
      grid-template-columns: 55fr 45fr;
      grid-template-rows: minmax(0, 1fr) auto auto;
      min-height: 100vh;
      min-height: 100dvh;
    }
    .stage {
      grid-column: 1;
      grid-row: 1;
      border-right: 1px solid var(--hair);
    }
    .copy {
      grid-column: 2;
      grid-row: 1;
      /* top clears the nav; sides never closer than a gutter */
      padding: 96px var(--gutter) var(--s5);
    }
    .beliefs { grid-column: 1 / -1; grid-row: 2; }
    .beliefs ol {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      --lede: 18px;
    }
    .poster > :global(footer) { grid-column: 1 / -1; grid-row: 3; }
  }
  /* short laptops: tighten rather than clip; the page may scroll a little below ~700px */
  @media (min-width: 900px) and (max-height: 780px) {
    .poster { --lede: clamp(18px, 1.4vw, 22px); --s5: 40px; }
    .copy { padding-top: 84px; }
    .beliefs { padding-top: var(--s3); padding-bottom: var(--s3); }
    .beliefs ol { --lede: 16px; gap: var(--s3); }
    .founders img { width: 52px; height: 52px; }
  }

  /* ---------- small screens: stack ---------- */
  @media (max-width: 899px) {
    .stage {
      height: clamp(340px, 56dvh, 620px);
      border-bottom: 1px solid var(--hair);
    }
    .copy { padding: var(--s5) var(--gutter); }
    .beliefs ol { grid-template-columns: minmax(0, 1fr); }
    .logos img { height: 24px; }
    .logos .ventureforward { height: 34px; }
  }
  @media (max-width: 899px) and (max-height: 500px) {
    .stage { height: 320px; }
  }
</style>
