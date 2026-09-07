<script>
  import LinkedIn from '../lib/LinkedIn.svelte'

  const beliefs = [
    { lead: 'The company you keep sets the expectations for', em: 'what you can achieve.' },
    { lead: 'The world around you was built by people no different than yourself.', em: 'You can just build things.' },
    { lead: 'Weird will always win.', em: 'Normal choices guarantee normal results.' },
    { lead: "Fail fast, fail often. Even if you don't win,", em: 'you can lose better.' },
  ]

  // `linkedin` is optional; the icon only renders when it is set.
  const founders = [
    { name: 'Nathan Wang', role: 'Co-founder', img: '/nathan.png', linkedin: 'https://www.linkedin.com/in/nathan-wang-999930336/' },
    { name: 'Harivansh Rathi', role: 'Co-founder', img: '/hari.png', linkedin: 'https://www.linkedin.com/in/harivansh-rathi' },
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
        <img src={f.img} alt={f.name} width="240" height="240" decoding="async" />
        <div class="who">
          <div>
            <p class="name">{f.name}</p>
            <p class="role">{f.role}</p>
          </div>
          {#if f.linkedin}
            <a class="li" href={f.linkedin} target="_blank" rel="noopener" aria-label="{f.name} on LinkedIn" title="LinkedIn">
              <LinkedIn size={15} />
            </a>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
</section>

<style>

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
  .founders img {
    width: 100%;
    aspect-ratio: 1;
    height: auto;
    object-fit: cover;
    filter: grayscale(1);
    background: #17171a;
    margin-bottom: var(--s2);
  }
  .who {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  .founders .name { font-size: 15px; font-weight: 500; }
  .founders .role {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 6px;
  }
  .li {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin: -8px -8px 0 0;
    color: var(--muted);
    transition: color 0.15s ease;
  }
  .li:hover { color: var(--fg); }

</style>
