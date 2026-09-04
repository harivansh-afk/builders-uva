<script>
  import { events, shortDate } from '../lib/events.js'
  const n = (i) => String(i + 1).padStart(2, '0')
</script>

<section class="block hero">
  <h2 class="eyebrow">Events</h2>
  <p class="lede">We invite successful YC founders and host a short Q&amp;A <em>every Thursday.</em></p>
</section>

<ol class="rows">
  {#each events as e, i}
    <li class="row">
      <a class="page" href="/events/{e.slug}">
        <span class="n">{n(i)}</span>
        <span class="t">{e.name}, <span class="tag">{e.tag}</span></span>
        <time class="d" datetime={e.date}>{shortDate(e.date)}</time>
      </a>
      {#if e.link}
        <a class="pfp" href={e.link} target="_blank" rel="noopener" aria-label="{e.name} on LinkedIn" title="LinkedIn">
          <img src={e.img} alt="" width="36" height="36" loading="lazy" />
        </a>
      {:else}
        <span class="pfp"><img src={e.img} alt="" width="36" height="36" loading="lazy" /></span>
      {/if}
    </li>
  {/each}
</ol>

<style>
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
    margin-bottom: 40px;
  }
  .row {
    display: flex;
    align-items: stretch;
    border-bottom: 1px solid var(--hair);
    transition: background 0.15s ease;
  }
  .row:hover, .row:focus-within { background: rgba(242, 240, 234, 0.04); }

  .page {
    flex: 1;
    min-width: 0;
    display: grid;
    grid-template-columns: 3ch max-content 1fr;
    align-items: baseline;
    gap: 0 18px;
    padding: 18px 6px;
    font-family: var(--mono);
    font-size: 15px;
  }
  .n {
    color: var(--dim);
    font-variant-numeric: tabular-nums;
  }
  .t { color: var(--fg); white-space: nowrap; }
  .tag { color: var(--muted); }
  .d {
    color: var(--muted);
    font-size: 12px;
    letter-spacing: 0.04em;
    text-align: right;
    white-space: nowrap;
  }

  .pfp {
    display: inline-flex;
    align-items: center;
    padding: 0 10px 0 16px;
    opacity: 0.75;
    transition: opacity 0.15s ease;
  }
  .pfp:hover, .pfp:focus-visible { opacity: 1; }
  .pfp img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    filter: grayscale(1);
    background: #17171a;
  }

  @media (max-width: 599px) {
    .page { grid-template-columns: 3ch 1fr; gap: 4px 14px; }
    .t { white-space: normal; }
    .d { grid-column: 2; text-align: left; }
  }
</style>
