<script>
  import { eventBySlug, longDate, registrationOpen } from '../lib/events.js'
  let { slug } = $props()
  const e = $derived(eventBySlug(slug))
  const today = new Date()
</script>

<div class="event">
  <a class="back eyebrow" href="/events">← Events</a>

  {#if e}
    <header class="head">
      <div>
        <h1 class="name">{e.name}{#if e.tag}{' '}<span class="tag">[{e.tag}]</span>{/if}</h1>
        <p class="meta">
          <span><time datetime={e.date}>{longDate(e.date)}</time>{#if e.time}, {e.time}{/if}{#if e.format}, {e.format}{/if}</span>
          {#if e.link}<span><a class="ink" href={e.link} target="_blank" rel="noopener">{e.linkLabel ?? 'LinkedIn'}</a></span>{/if}
          {#if e.video?.youtube}<span><a class="ink" href="https://www.youtube.com/watch?v={e.video.youtube}" target="_blank" rel="noopener">Session recording</a></span>{/if}
        </p>
        {#if registrationOpen(e, today)}
          <a class="register" href="/events/{e.slug}/register" aria-label="Register for {e.name}">Register →</a>
        {/if}
      </div>
      <img class="pfp" class:logo={e.imgType === 'logo'} src={e.img} alt={e.imgAlt ?? e.name} width="160" height="160" decoding="async" />
    </header>

    {#if e.description}
      <p class="description">{e.description}</p>
    {/if}

    {#if e.recap}
      <section class="body" aria-labelledby="recap-title">
        <h2 class="eyebrow" id="recap-title">Session recap</h2>
        <div class="recap">
          {#each e.recap as section}
            <section>
              <h3>{section.title}</h3>
              {#each section.paragraphs as paragraph}
                <p>{paragraph}</p>
              {/each}
            </section>
          {/each}
        </div>
      </section>
    {/if}

    {#if e.transcript || !e.recap && !e.description}
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
    {/if}
  {:else}
    <p class="lede">No such event.</p>
  {/if}
</div>

<style>
  /* full page width so the rule under the header matches the footer's */
  .event { display: grid; gap: var(--s5); }
  .back {
    justify-self: start;
    color: var(--muted);
    transition: color 0.15s ease;
  }
  .back:hover { color: var(--fg); }

  .head {
    display: flex;
    align-items: center; /* name and meta sit centred on the portrait */
    justify-content: space-between;
    gap: 32px;
    padding-bottom: var(--s5);
    border-bottom: 1px solid var(--hair);
  }
  .head > div { min-width: 0; } /* the meta wraps instead of pushing the portrait off-screen */
  .name {
    font-size: var(--lede);
    font-weight: 400;
    line-height: 1.15;
    letter-spacing: -0.012em;
  }
  .meta {
    margin-top: 14px;
    font-family: var(--mono);
    font-size: 14px;
    letter-spacing: 0.04em;
    color: var(--muted);
    display: grid;
    justify-items: start;
    gap: 6px;
  }
  .meta a { text-transform: uppercase; }
  .meta a:not(.ink) { border-bottom: 1px solid var(--hair); transition: border-color 0.15s ease, color 0.15s ease; }
  .meta a:not(.ink):hover { color: var(--fg); border-color: var(--muted); }

  .register { display: inline-block; margin-top: 20px; padding: 12px; background: var(--fg); color: var(--bg); border: 1px solid var(--fg); font-family: var(--mono); font-size: 14px; transition: opacity 0.15s ease; }
  .register:hover { opacity: 0.88; }
  .register:focus-visible { outline: 2px solid var(--fg); outline-offset: 4px; }

  @media (prefers-reduced-motion: reduce) {
    .register { transition: none; }
  }

  .pfp {
    flex: 0 0 auto;
    width: 120px;
    height: 120px;
    object-fit: cover;
    filter: grayscale(1);
    background: #17171a;
  }

  .pfp.logo { object-fit: contain; padding: 12px; border-radius: 50%; }

  .body { display: grid; gap: var(--s3); }
  .description { max-width: 62ch; font-size: 19px; line-height: 1.6; }
  .recap { display: grid; gap: var(--s4); }
  .recap section { display: grid; gap: 18px; }
  .recap h3 { font-size: 21px; font-weight: 400; }
  .recap p { font-size: 17px; line-height: 1.6; }
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
