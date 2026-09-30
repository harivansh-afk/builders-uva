<script>
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
    { name: 'Hari', role: 'President', img: '/hari-linkedin.png', zoom: 1.25, website: 'https://harivan.sh', linkedin: 'https://www.linkedin.com/in/harivansh-rathi', x: 'https://x.com/HarivanshRathi' },
    { name: 'Nathan', role: 'Vice-President', img: '/nathan.png', website: 'https://nathanwang.dev/#about', linkedin: 'https://www.linkedin.com/in/nathan-wang-999930336/', x: 'https://x.com/NathanWang78302' },
  ]
</script>

<h1 class="sr-only">builders@uva</h1>

<section class="block hero">
  <h2 class="eyebrow">Who we are</h2>
  <p class="lede">
    <span class="hl">builders@uva</span> is building a culture of <em>independent creation</em> at UVA.
  </p>
  <p class="lede">
    We bring students together to <em>work</em> on their own ideas, <em>learn</em> from founders, and help each other go beyond their <em>perceived limitations.</em>
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
        {#if f.website}
          <a class="portrait" style:--zoom={f.zoom ?? 1} href={f.website} aria-label={`${f.name}'s website`}>
            <img src={f.img} alt={f.name} width="240" height="240" decoding="async" />
          </a>
        {:else}
          <span class="portrait" style:--zoom={f.zoom ?? 1}>
            <img src={f.img} alt={f.name} width="240" height="240" decoding="async" />
          </span>
        {/if}
        <div class="who">
          <p class="role">{f.role}</p>
          <p class="name">{f.name}</p>
          <div class="socials">
            {#if f.linkedin}
              <a class="social" href={f.linkedin} target="_blank" rel="noopener" aria-label="{f.name} on LinkedIn" title="LinkedIn">
                <LinkedIn size={15} />
              </a>
            {/if}
            {#if f.x}
              <a class="social" href={f.x} target="_blank" rel="noopener" aria-label="{f.name} on X" title="X">
                <X size={15} />
              </a>
            {/if}
          </div>
        </div>
      </li>
    {/each}
  </ul>
</section>

<style>
  .hero .lede + .lede {
    margin-top: var(--s4);
  }

  /* each belief is its own thought; give it its own room */
  .beliefs {
    list-style: none;
    padding: 0;
    display: grid;
    gap: var(--s4);
  }

  .founders {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--s4) var(--s3);
  }
  .portrait {
    display: block;
    overflow: hidden;
    width: 100%;
    aspect-ratio: 1;
    margin-bottom: var(--s2);
  }
  .founders img {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    height: auto;
    object-fit: cover;
    filter: grayscale(1);
    background: #17171a;
    transform: scale(var(--zoom, 1));
  }
  .who { display: grid; gap: 4px; }
  .founders .role { font-size: 13px; color: var(--muted); }
  .founders .name { font-size: 17px; font-weight: 500; }
  .socials { display: flex; margin-left: -8px; }
  .social {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    color: var(--muted);
    transition: color 0.15s ease;
  }
  .social:hover { color: var(--fg); }

  /* desktop: small portraits so the team fits under the beliefs */
  @media (min-width: 900px) {
    .founders { display: flex; gap: var(--s4); }
    .portrait { width: var(--portrait); margin-bottom: 8px; }
    .founders .name { font-size: 15px; }
    .who { gap: 0; }
  }

</style>
