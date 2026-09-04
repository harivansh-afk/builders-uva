<script>
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

<style>
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

  @media (max-width: 899px) {
    .beliefs { gap: 20px; }
    .founders { gap: 20px; }
  }
</style>
