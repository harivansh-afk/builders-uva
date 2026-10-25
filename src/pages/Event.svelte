<script>
  import { eventBySlug, longDate, registrationOpen } from '../lib/events.js'
  let { slug } = $props()
  const e = $derived(eventBySlug(slug))
  const today = new Date()
</script>

<div class="event">
  <a class="back" href="/events" aria-label="Back to events">←</a>

  {#if e}
    <header>
      <h1 class="name">{e.name}{#if e.tag}<span class="tag">, {e.tag}</span>{/if}</h1>
      <p class="meta">
        <span><time datetime={e.date}>{longDate(e.date)}</time>{#if e.time}, {e.time}{/if}{#if e.format}, {e.format}{/if}</span>
        {#if e.link}<span><a href={e.link} target="_blank" rel="noopener">{e.linkLabel ?? 'LinkedIn'}</a></span>{/if}
        {#if e.video?.youtube}<span><a href="https://www.youtube.com/watch?v={e.video.youtube}" target="_blank" rel="noopener">Session recording</a></span>{/if}
      </p>
      {#if registrationOpen(e, today)}
        <a class="register" href="/events/{e.slug}/register" aria-label="Register for {e.name}">Register</a>
      {/if}
    </header>

    {#if e.description}
      <p class="description">{e.description}</p>
    {/if}

    {#if e.recap}
      <section class="body">
        <div class="recap">
          {#each e.recap as section}
            <section>
              {#if section.title}<h3>{section.title}</h3>{/if}
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
      <h2>Transcript</h2>
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
  .event { display: grid; gap: var(--s5); }
  .back {
    justify-self: start;
    font-size: 15px;
    color: var(--muted);
    transition: color 0.15s ease;
  }
  .back:hover { color: var(--fg); }

  .name {
    font-size: var(--lede);
    font-weight: 400;
    line-height: 1.15;
    letter-spacing: -0.012em;
  }
  .meta {
    margin-top: 14px;
    font-size: 15px;
    color: var(--muted);
    display: grid;
    justify-items: start;
    gap: 6px;
  }
  /* plain links: underlined, brighter on hover */
  .meta a, .register {
    text-decoration: underline;
    text-decoration-color: var(--dim);
    text-underline-offset: 0.2em;
    transition: color 0.15s ease, text-decoration-color 0.15s ease;
  }
  .meta a:hover, .register:hover { color: var(--fg); text-decoration-color: currentColor; }

  .register { display: inline-block; margin-top: 16px; font-size: 15px; }

  .body { display: grid; gap: var(--s3); }
  .description { max-width: 62ch; font-size: 19px; line-height: 1.6; }
  .recap { display: grid; gap: var(--s4); max-width: 62ch; }
  .recap section { display: grid; gap: 18px; }
  .recap h3, .body h2 { font-size: 21px; font-weight: 400; }
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
  }
</style>
