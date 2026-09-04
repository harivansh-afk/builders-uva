<script>
  import { events, shortDate } from '../lib/events.js'
  const n = (i) => String(i + 1).padStart(2, '0')
  const today = new Date().toISOString().slice(0, 10)
</script>

<div class="events">
  <header class="intro">
    <p class="eyebrow">Events</p>
    <h1 class="lede">We invite successful founders to give talks and host a short Q&amp;A <em>every Thursday.</em></h1>
  </header>

  <ol class="rows">
    {#each events as e, i}
      <li class="row" class:upcoming={e.date >= today}>
        <a class="page" href="/events/{e.slug}">
          <span class="n">{n(i)}</span>
          <span class="t">{e.name}<span class="tag">{e.tag}</span></span>
          <time class="d" datetime={e.date}>{shortDate(e.date)}</time>
          <span class="state">{e.date >= today ? 'Upcoming' : e.transcript ? 'Transcript' : 'Transcript soon'}</span>
        </a>
        {#if e.link}
          <a class="pfp" href={e.link} target="_blank" rel="noopener" aria-label="{e.name} on LinkedIn" title="LinkedIn">
            <img src={e.img} alt="" width="44" height="44" loading="lazy" />
          </a>
        {:else}
          <span class="pfp"><img src={e.img} alt="" width="44" height="44" loading="lazy" /></span>
        {/if}
      </li>
    {/each}
  </ol>
</div>

<style>
  .events { display: grid; gap: 56px; }
  .intro .eyebrow { margin-bottom: 20px; }
  .lede { max-width: 30ch; }
  .lede em {
    font-family: var(--serif);
    font-style: italic;
    font-size: 1.12em;
    line-height: 1;
  }

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
    grid-template-columns: 4ch minmax(0, 1fr) auto auto;
    align-items: baseline;
    gap: 0 24px;
    padding: 26px 8px;
  }
  .n {
    font-family: var(--mono);
    font-size: 13px;
    color: var(--dim);
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
  .tag {
    margin-left: 12px;
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.04em;
    color: var(--muted);
  }
  .d, .state {
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.04em;
    white-space: nowrap;
    color: var(--muted);
  }
  .state {
    color: var(--dim);
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.12em;
    min-width: 12ch;
    text-align: right;
  }
  .upcoming .state { color: var(--fg); }

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

  @media (max-width: 899px) {
    .events { gap: 40px; }
    .page { grid-template-columns: 4ch minmax(0, 1fr) auto; gap: 6px 18px; padding: 20px 4px; }
    .state { display: none; }
    .t { font-size: 17px; }
  }
  @media (max-width: 599px) {
    .page { grid-template-columns: 3ch minmax(0, 1fr); }
    .t { white-space: normal; }
    .tag { display: block; margin: 4px 0 0; }
    .d { grid-column: 2; }
    .pfp { padding-left: 12px; }
    .pfp img { width: 40px; height: 40px; }
  }
</style>
