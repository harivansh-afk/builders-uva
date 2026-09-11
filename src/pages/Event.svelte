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
        <h1 class="name">{e.name}{#if e.tag}{` (${e.tag})`}{/if}</h1>
        <p class="meta">
          <span><time datetime={e.date}>{longDate(e.date)}</time></span>
          {#if e.time}<span>{e.time}</span>{/if}
          {#if e.link}<span><a href={e.link} target="_blank" rel="noopener">{e.linkLabel ?? 'LinkedIn'}</a></span>{/if}
        </p>
      </div>
      <img class="pfp" src={e.img} alt={e.name} width="160" height="160" decoding="async" />
    </header>

    {#if e.photos?.length}
      <div class="photos" aria-label="Photos from the event">
        {#each e.photos as photo, i}
          <a href="/events/{e.slug}/{photo.file}-clean.jpg" aria-label="View full photo: {photo.alt}">
            <img
              src="/events/{e.slug}/{photo.file}-1200.webp"
              srcset="/events/{e.slug}/{photo.file}-600.webp 600w, /events/{e.slug}/{photo.file}-1200.webp 1200w"
              sizes="(max-width: 599px) calc(100vw - 40px), (max-width: 1100px) 45vw, 520px"
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              decoding="async"
              fetchpriority={i === 0 ? 'high' : 'auto'}
            />
          </a>
        {/each}
      </div>
    {/if}

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
    display: flex;
    flex-wrap: wrap;
    gap: 4px 10px;
  }
  .meta > * + *::before { content: '·'; margin-right: 10px; color: var(--dim); }
  .meta a { border-bottom: 1px solid var(--hair); transition: border-color 0.15s ease, color 0.15s ease; }
  .meta a:hover { color: var(--fg); border-color: var(--muted); }

  .pfp {
    flex: 0 0 auto;
    width: 120px;
    height: 120px;
    object-fit: cover;
    filter: grayscale(1);
    background: #17171a;
  }

  .photos { display: grid; grid-template-columns: 8fr 9fr; gap: 12px; }
  .photos a { display: block; min-width: 0; overflow: hidden; }
  .photos a:first-child { grid-row: span 2; }
  .photos a:not(:first-child) { aspect-ratio: 3 / 2; }
  .photos img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .photos a:focus-visible { outline: 2px solid var(--fg); outline-offset: 4px; }

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
    .photos { grid-template-columns: 1fr; }
    .photos a:first-child { grid-row: auto; }
    .photos img { height: auto; }
    .event { gap: 36px; }
    .head { padding-bottom: 36px; }
    .pfp { width: 80px; height: 80px; }
    /* one item per line; a leading separator never opens a line */
    .meta { display: grid; gap: 6px; }
    .meta > * + *::before { content: none; }
  }
</style>
