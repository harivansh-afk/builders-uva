<script>
  import LinkedIn from './LinkedIn.svelte'
  import X from './X.svelte'

  // Social icons only render when their links are set.
  const founders = [
    { name: 'Hari', role: 'President, co-founder', img: '/hari-linkedin.png', zoom: 1.25, website: 'https://hari.cafe', linkedin: 'https://www.linkedin.com/in/harivansh-rathi', x: 'https://x.com/HarivanshRathi' },
    { name: 'Nathan', role: 'Vice-President, co-founder', img: '/nathan.png', website: 'https://nathanwang.dev/#about', linkedin: 'https://www.linkedin.com/in/nathan-wang-999930336/', x: 'https://x.com/NathanWang78302' },
  ]
</script>

<ul class="founders">
  {#each founders as f}
    <li>
      <a class="portrait" style:--zoom={f.zoom ?? 1} href={f.website} target="_blank" rel="noopener" aria-label={`${f.name}'s website`}>
        <img src={f.img} alt={f.name} width="320" height="320" loading="lazy" decoding="async" />
      </a>
      <div class="who">
        <div>
          <p class="name">{f.name}</p>
          <p class="role">{f.role}</p>
        </div>
        <div class="socials">
          {#if f.linkedin}
            <a class="social" href={f.linkedin} target="_blank" rel="noopener" aria-label="{f.name} on LinkedIn" title="LinkedIn"><LinkedIn size={15} /></a>
          {/if}
          {#if f.x}
            <a class="social" href={f.x} target="_blank" rel="noopener" aria-label="{f.name} on X" title="X"><X size={15} /></a>
          {/if}
        </div>
      </div>
    </li>
  {/each}
</ul>

<style>
  .founders {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--s3);
  }
  .portrait { display: block; overflow: hidden; aspect-ratio: 1; margin-bottom: var(--s2); }
  img {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    height: auto;
    object-fit: cover;
    filter: grayscale(1);
    background: #17171a;
    transform: scale(var(--zoom, 1));
  }
  .who { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
  .name { font-size: 17px; font-weight: 500; }
  .role { font-family: var(--mono); font-size: 12px; letter-spacing: 0.12em; color: var(--muted); text-transform: uppercase; }
  .socials { display: flex; margin-right: -8px; }
  .social { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; color: var(--muted); }
  .social:is(:hover, :focus-visible) { background: var(--fg); color: var(--bg); }
</style>
