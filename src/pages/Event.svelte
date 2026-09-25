<script>
  import { eventBySlug, longDate, registrationOpen } from '../lib/events.js'
  let { slug } = $props()
  const e = $derived(eventBySlug(slug))
  const portraitPhoto = $derived(e?.photos?.length === 1 && e.photos[0].height > e.photos[0].width ? e.photos[0] : null)
  const today = new Date()
  let photoDialog
  let closeButton
  let selectedPhoto = $state(null)

  function expandPhoto(photo) {
    selectedPhoto = { ...photo, src: `/events/${e.slug}/${photo.file}-clean.jpg` }
    photoDialog.showModal()
    closeButton.focus()
  }

  $effect(() => {
    if (!selectedPhoto) return
    const previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = previous }
  })

  $effect(() => {
    slug
    photoDialog?.close()
  })
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
        {#if registrationOpen(e, today)}
          <a class="register" href="/events/{e.slug}/register" aria-label="Register for {e.name}">Register →</a>
        {/if}
      </div>
      <img class="pfp" class:logo={e.imgType === 'logo'} src={e.img} alt={e.imgAlt ?? e.name} width="160" height="160" decoding="async" />
    </header>

    {#if e.video?.youtube || e.photos?.length}
      <div class="media" class:split={e.video?.youtube && e.photos?.length} class:portrait={portraitPhoto}
        style:--portrait-column={portraitPhoto ? `${9 * portraitPhoto.width / portraitPhoto.height}fr` : null}
        style:--portrait-ratio={portraitPhoto ? `${portraitPhoto.width} / ${portraitPhoto.height}` : null}>
        {#if e.video?.youtube}
          <div class="video">
            <iframe
              src="https://www.youtube-nocookie.com/embed/{e.video.youtube}?rel=0"
              title={e.video.title ?? `Recording of ${e.name}`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
        {/if}

        {#if e.photos?.length}
          <div class="photos" class:wide={e.photos.length > 2 && e.photos[0].width > e.photos[0].height} class:pair={e.photos.length === 2} aria-label="Photos from the event">
            {#each e.photos as photo, i}
              <button type="button" class:contain={photo.fit === 'contain'} onclick={() => expandPhoto(photo)} aria-haspopup="dialog" aria-label="Expand photo: {photo.alt}">
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
              </button>
            {/each}
          </div>
        {/if}
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

<dialog class="photo-viewer" bind:this={photoDialog} onclose={() => { selectedPhoto = null }} aria-label="Expanded event photo">
  <button class="dismiss" type="button" tabindex="-1" aria-label="Close photo background" onclick={() => photoDialog.close()}></button>
  <button class="close" type="button" bind:this={closeButton} aria-label="Close expanded photo" onclick={() => photoDialog.close()}>×</button>
  {#if selectedPhoto}
    <img src={selectedPhoto.src} alt={selectedPhoto.alt} width={selectedPhoto.width} height={selectedPhoto.height} />
  {/if}
</dialog>

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

  .pfp.logo { object-fit: contain; padding: 12px; }

  .media { display: grid; gap: 12px; }
  .video { aspect-ratio: 16 / 9; background: #17171a; }
  .video iframe { display: block; width: 100%; height: 100%; border: 0; }
  /* recording on the left, photos stacked beside it at the same total height */
  .media.split { grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); align-items: stretch; }
  /* A single portrait keeps its full frame at the same height as the recording. */
  .media.split.portrait { grid-template-columns: minmax(0, 16fr) minmax(0, var(--portrait-column)); }
  /* the video keeps 16:9 at its column width and sets the row height; stretching it would widen it into the gap */
  .media.split .video { align-self: start; }
  .media.split .photos { display: grid; grid-template-columns: 1fr; grid-auto-rows: 1fr; gap: 12px; min-height: 0; }
  .media.split .photos button { position: relative; grid-row: auto; grid-column: auto; aspect-ratio: auto; min-height: 0; }
  /* photos fill the row the video sets instead of sizing it themselves */
  .media.split .photos img { position: absolute; inset: 0; }

  .photos { display: grid; grid-template-columns: 8fr 9fr; gap: 12px; }
  .photos button { display: block; min-width: 0; overflow: hidden; padding: 0; border: 0; background: none; cursor: zoom-in; }
  .photos button:first-child { grid-row: span 2; }
  .photos button:not(:first-child) { aspect-ratio: 3 / 2; }
  /* a landscape lead photo runs full width, the rest sit side by side beneath it */
  .photos.wide { grid-template-columns: 1fr 1fr; }
  .photos.wide button:first-child { grid-row: auto; grid-column: 1 / -1; aspect-ratio: 16 / 9; }
  .photos.wide button:not(:first-child) { aspect-ratio: 16 / 9; }
  /* two photos sit side by side at the same size */
  .photos.pair { grid-template-columns: 1fr 1fr; }
  .photos.pair button { grid-row: auto; aspect-ratio: 16 / 9; }
  .photos img { display: block; width: 100%; height: 100%; object-fit: cover; }
  /* a diagram is shown whole on white rather than cropped */
  .photos button.contain { background: #fff; }
  .photos button.contain img { object-fit: contain; }
  .photos button:focus-visible { outline: 2px solid var(--fg); outline-offset: 4px; }

  .photo-viewer { position: fixed; inset: 0; width: 100%; height: 100dvh; max-width: none; max-height: none; margin: 0; padding: 64px 20px 20px; border: 0; background: transparent; overflow: hidden; }
  .photo-viewer[open] { display: grid; place-items: center; }
  .photo-viewer::backdrop { background: rgba(0, 0, 0, 0.9); }
  .photo-viewer .dismiss { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; padding: 0; background: transparent; cursor: zoom-out; }
  .photo-viewer .close { position: absolute; top: 12px; right: 16px; z-index: 2; width: 44px; height: 44px; border: 1px solid var(--hair); border-radius: 50%; background: var(--bg); color: var(--fg); font-size: 30px; line-height: 1; cursor: pointer; }
  .photo-viewer .close:focus-visible { outline: 2px solid var(--fg); outline-offset: 3px; }
  .photo-viewer > img { position: relative; width: auto; height: auto; max-width: 100%; max-height: calc(100dvh - 84px); object-fit: contain; }

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
    .media.split { display: flex; flex-direction: column; }
    .media.split .photos { display: grid; grid-template-columns: 1fr; grid-auto-rows: auto; }
    .media.split .photos button { aspect-ratio: 16 / 9; height: auto; align-self: auto; }
    .media.split.portrait .photos button { aspect-ratio: var(--portrait-ratio); }
    .media.split .photos img { position: static; height: 100%; }
    .photos, .photos.pair { grid-template-columns: 1fr; }
    .photos button:first-child { grid-row: auto; grid-column: auto; }
    .photos img { height: auto; }
    .event { gap: 36px; }
    .head { padding-bottom: 36px; }
    .pfp { width: 80px; height: 80px; }
    /* one item per line; a leading separator never opens a line */
    .meta { display: grid; gap: 6px; }
    .meta > * + *::before { content: none; }
  }
</style>
