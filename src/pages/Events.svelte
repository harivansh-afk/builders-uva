<script>
  import { events, shortDate, registrationOpen } from '../lib/events.js'
  const n = (i) => String(i + 1).padStart(2, '0')
  const today = new Date()
</script>

<div class="events">
  <header class="intro">
    <p class="eyebrow">Events</p>
    <h1 class="lede">We invite successful founders to give talks and host a short Q&amp;A <em>every Thursday.</em></h1>
  </header>

  <ol class="rows">
    {#each events as e, i}
      <li class="row">
        <a class="page" href="/events/{e.slug}">
          <span class="n">{n(i)}</span>
          <span class="t">{e.name}{#if e.tag}{` (${e.tag})`}{/if}</span>
        </a>
        <div class="actions">
          {#if registrationOpen(e, today)}
            <a class="register" href="/events/{e.slug}/register" aria-label="Register for {e.name}">Register →</a>
          {/if}
          <time class="d" datetime={e.date}>{shortDate(e.date)}</time>
        </div>
        {#if e.link}
          <a class="pfp" href={e.link} target="_blank" rel="noopener" aria-label="{e.name} — {e.linkLabel ?? 'LinkedIn'}" title={e.linkLabel ?? 'LinkedIn'}>
            <img class:logo={e.imgType === 'logo'} src={e.img} alt="" width="44" height="44" loading="lazy" />
          </a>
        {:else}
          <span class="pfp"><img class:logo={e.imgType === 'logo'} src={e.img} alt="" width="44" height="44" loading="lazy" /></span>
        {/if}
      </li>
    {/each}
  </ol>
</div>

<style>
  .events { display: grid; gap: var(--s5); }
  .intro .eyebrow { margin-bottom: var(--s4); }
  .lede { max-width: 30ch; }

  .rows {
    list-style: none;
    padding: 0;
    border-top: 1px solid var(--hair);
  }
  .row {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--hair);
    transition: background 0.15s ease;
  }
  .row:hover, .row:focus-within { background: rgba(242, 240, 234, 0.035); }

  .page {
    flex: 1;
    min-width: 0;
    display: grid;
    grid-template-columns: 4ch minmax(0, 1fr);
    align-items: baseline;
    gap: 0 24px;
    padding: 26px 8px;
  }
  .n {
    font-family: var(--mono);
    font-size: 14px;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }
  .t {
    font-size: 19px;
    letter-spacing: -0.008em;
    color: var(--fg);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .d {
    min-width: 12ch;
    text-align: right;
    font-family: var(--mono);
    font-size: 14px;
    letter-spacing: 0.04em;
    white-space: nowrap;
    color: var(--muted);
  }
  .actions { display: flex; align-items: center; gap: 24px; }

  .register { flex-shrink: 0; padding: 12px; background: var(--fg); color: var(--bg); border: 1px solid var(--fg); font-family: var(--mono); font-size: 14px; transition: opacity 0.15s ease; }
  .register:hover { opacity: 0.88; }

  @media (prefers-reduced-motion: reduce) {
    .register { transition: none; }
  }

  .pfp {
    display: inline-flex;
    align-items: center;
    padding: 0 8px 0 24px;
    opacity: 0.8;
    transition: opacity 0.15s ease;
  }
  .pfp:hover, .pfp:focus-visible { opacity: 1; }
  .pfp img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    filter: grayscale(1);
    background: #17171a;
  }

  .pfp img.logo { border-radius: 0; object-fit: contain; padding: 4px; }

  @media (max-width: 899px) {
    .events { gap: var(--s4); }
    .page { gap: 6px 18px; padding: 20px 4px; }
    .t { font-size: 17px; }
    .actions { gap: 16px; }
  }
  @media (max-width: 599px) {
    .row { display: grid; grid-template-columns: minmax(0, 1fr) 40px; padding: 20px 4px; gap: 16px 12px; }
    .page { grid-column: 1; grid-row: 1; grid-template-columns: 3ch minmax(0, 1fr); padding: 0; }
    .t { white-space: normal; }
    .actions { grid-column: 1 / -1; grid-row: 2; padding-left: calc(3ch + 18px); }
    .pfp { grid-column: 2; grid-row: 1; padding: 0; }
    .pfp img { width: 40px; height: 40px; }
  }
</style>
