<script>
  import { eventBySlug, longDate } from '../lib/events.js'
  let { slug } = $props()
  const e = $derived(eventBySlug(slug))
</script>

<div class="event">
  <a class="back eyebrow" href="/events">← Events</a>

  {#if e}
    <header class="head">
      <div>
        <p class="eyebrow">{e.tag}</p>
        <h1 class="name">{e.name}</h1>
        <p class="meta">
          <time datetime={e.date}>{longDate(e.date)}</time>
          {#if e.link}
            <span class="sep" aria-hidden="true">·</span>
            <a href={e.link} target="_blank" rel="noopener">LinkedIn</a>
          {/if}
        </p>
      </div>
      <img class="pfp" src={e.img} alt={e.name} width="160" height="160" decoding="async" />
    </header>

    <section class="body">
      <p class="eyebrow">Transcript</p>
      {#if e.transcript}
        <div class="transcript">
          {#each e.transcript.split('\n\n') as para}
            <p>{para}</p>
          {/each}
        </div>
      {:else}
        <p class="soon">Coming soon.</p>
      {/if}
    </section>
  {:else}
    <p class="lede">No such event.</p>
  {/if}
</div>

<style>
  .event { display: grid; gap: 48px; max-width: 760px; }
  .back {
    justify-self: start;
    transition: color 0.15s ease;
  }
  .back:hover { color: var(--fg); }

  .head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 32px;
    padding-bottom: 48px;
    border-bottom: 1px solid var(--hair);
  }
  .head .eyebrow { margin-bottom: 16px; }
  .name {
    font-size: var(--lede);
    font-weight: 400;
    line-height: 1.15;
    letter-spacing: -0.012em;
  }
  .meta {
    margin-top: 14px;
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.04em;
    color: var(--muted);
    display: flex;
    flex-wrap: wrap;
    gap: 0 10px;
  }
  .meta a { border-bottom: 1px solid var(--hair); transition: border-color 0.15s ease, color 0.15s ease; }
  .meta a:hover { color: var(--fg); border-color: var(--muted); }
  .sep { color: var(--dim); }

  .pfp {
    flex: 0 0 auto;
    width: 120px;
    height: 120px;
    object-fit: cover;
    filter: grayscale(1);
    background: #17171a;
  }

  .body { display: grid; gap: 20px; }
  .soon {
    font-size: var(--lede);
    line-height: 1.32;
    color: var(--muted);
  }
  .transcript { display: grid; gap: 18px; max-width: 62ch; }
  .transcript p { font-size: 17px; line-height: 1.6; }

  @media (max-width: 599px) {
    .event { gap: 36px; }
    .head { padding-bottom: 36px; }
    .pfp { width: 80px; height: 80px; }
  }
</style>
