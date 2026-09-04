<script>
  import { eventBySlug, longDate } from '../lib/events.js'
  let { slug } = $props()
  const e = $derived(eventBySlug(slug))
</script>

{#if e}
  <section class="block hero">
    <a class="back eyebrow" href="/events">← Events</a>
    <div class="head">
      <div>
        <h2 class="name">{e.name}</h2>
        <p class="meta">
          <span>{e.tag}</span>
          <span class="sep" aria-hidden="true">·</span>
          <time datetime={e.date}>{longDate(e.date)}</time>
          {#if e.link}
            <span class="sep" aria-hidden="true">·</span>
            <a href={e.link} target="_blank" rel="noopener">LinkedIn</a>
          {/if}
        </p>
      </div>
      <img class="pfp" src={e.img} alt={e.name} width="160" height="160" decoding="async" />
    </div>
  </section>

  <section class="block">
    <h2 class="eyebrow">Transcript</h2>
    {#if e.transcript}
      <div class="transcript">
        {#each e.transcript.split('\n\n') as para}
          <p>{para}</p>
        {/each}
      </div>
    {:else}
      <p class="lede soon">Coming soon.</p>
    {/if}
  </section>
{:else}
  <section class="block hero">
    <a class="back eyebrow" href="/events">← Events</a>
    <p class="lede">No such event.</p>
  </section>
{/if}

<style>
  .back {
    display: inline-block;
    margin-bottom: 28px;
    transition: color 0.15s ease;
  }
  .back:hover { color: var(--fg); }

  .head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
  }
  .name {
    font-size: var(--lede);
    font-weight: 400;
    line-height: 1.2;
    letter-spacing: -0.008em;
  }
  .meta {
    margin-top: 10px;
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
    width: 96px;
    height: 96px;
    object-fit: cover;
    filter: grayscale(1);
    background: #17171a;
  }

  .soon { color: var(--muted); }
  .transcript { display: grid; gap: 18px; max-width: 60ch; }
  .transcript p { font-size: 17px; line-height: 1.55; }

  @media (max-width: 599px) {
    .pfp { width: 72px; height: 72px; }
  }
</style>
