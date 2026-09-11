<script>
  import { onMount } from 'svelte'
  import { mountInteractionSounds } from './lib/interactionSounds.js'
  import Ascii from './lib/Ascii.svelte'
  import Home from './pages/Home.svelte'
  import Events from './pages/Events.svelte'
  import Event from './pages/Event.svelte'
  import Join from './pages/Join.svelte'
  import Admin from './pages/Admin.svelte'
  import Footer from './lib/Footer.svelte'
  import { route } from './lib/router.svelte.js'
  import { eventBySlug } from './lib/events.js'

  onMount(mountInteractionSounds)

  const page = $derived.by(() => {
    const p = route.path
    if (p === '/') return { name: 'home', title: 'builders@uva' }
    if (p === '/events') return { name: 'events', title: 'Events' }
    if (p.startsWith('/events/')) {
      const slug = p.slice('/events/'.length)
      return { name: 'event', slug, title: eventBySlug(slug)?.name ?? 'Events' }
    }
    if (['/apply', '/apply/', '/join', '/join/'].includes(p)) return { name: 'join', title: 'Apply' }
    if (p === '/admin' || p === '/admin/') return { name: 'admin', title: 'Admin' }
    return { name: 'missing', title: 'Not found' }
  })

  $effect(() => { document.title = page.title })

  const section = $derived(page.name === 'event' ? 'events' : page.name)
  const home = $derived(page.name === 'home')
</script>

<nav class="nav" aria-label="Pages">
  <a class="mark" href="/" aria-label="builders@uva home" aria-current={section === 'home' ? 'page' : undefined}>b@</a>
  <a href="/events" aria-current={section === 'events' ? 'page' : undefined}>Events</a>
  <a href="/apply" aria-current={section === 'join' ? 'page' : undefined}>Apply</a>
</nav>

{#if home}
  <div class="site">
    <main class="left">
      <div class="col">
        <Home />
        <Footer inline />
      </div>
    </main>
    <aside class="right">
      <div class="stage"><Ascii /></div>
      <div class="logos">
        <a href="https://www.virginia.edu" target="_blank" rel="noopener" aria-label="University of Virginia">
          <img src="/uva.svg" alt="" height="34" />
        </a>
        <a href="https://uvafoundry.com" target="_blank" rel="noopener" aria-label="The Foundry">
          <img src="/foundry.svg" alt="" height="28" />
        </a>
        <a href="https://engineering.virginia.edu/offices-programs/ventureforward" target="_blank" rel="noopener" aria-label="VentureForward at UVA Engineering">
          <img class="ventureforward" src="/ventureforward.png" alt="" height="44" />
        </a>
      </div>
    </aside>
  </div>
{:else}
  <main class="page" class:admin-page={page.name === 'admin'}>
    {#key route.path}
      {#if page.name === 'events'}
        <Events />
      {:else if page.name === 'event'}
        <Event slug={page.slug} />
      {:else if page.name === 'join'}
        <Join />
      {:else if page.name === 'admin'}
        <Admin />
      {:else}
        <div class="missing">
          <p class="eyebrow">404</p>
          <p class="lede">Nothing here. <a class="home" href="/">Go home.</a></p>
        </div>
      {/if}
    {/key}
    <Footer />
  </main>
{/if}

<style>
  /* ---------- top-left page switcher, on every page ---------- */
  .nav {
    position: absolute; /* scrolls away with the page rather than riding over the copy */
    z-index: 10;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 18px var(--gutter);
    font-family: var(--mono);
    font-size: 14px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .nav a {
    display: inline-flex;
    align-items: center;
    min-height: 32px;
    padding: 0 10px;
    color: var(--muted);
    border: 1px solid transparent;
    transition: color 0.15s ease, border-color 0.15s ease;
  }
  .nav a:hover { color: var(--fg); }
  .nav a[aria-current='page'] { color: var(--fg); border-color: var(--hair); }
  .nav .mark { padding: 0 10px 0 0; margin-right: 8px; border: 0; text-transform: none; letter-spacing: -0.04em; font-size: 15px; font-weight: 600; color: var(--fg); }

  /* ---------- full-width pages: events, join ---------- */
  .page {
    display: grid;
    grid-template-rows: 1fr auto;
    align-items: start; /* content keeps its own height; only the footer is pushed down */
    gap: var(--s7);
    min-height: 100dvh;
    width: min(1120px, 100%);
    margin: 0 auto;
    padding: var(--top) var(--gutter) 0;
  }
  .missing { display: grid; gap: var(--s4); }
  .home { border-bottom: 1px solid var(--dim); }
  .admin-page { width: min(1600px, 100%); }

  /* ---------- home: two panes, graphic pinned left, copy scrolls right ---------- */
  .site {
    /* the copy fills one screen and no more: type, spacing and portraits
       scale with the viewport height, capped by the pane's width */
    --lede: clamp(16px, min(2.2vh, 1.5vw), 30px);
    --measure: 38ch;
    --s4: clamp(14px, 2.2vh, 40px);   /* inside a section */
    --gap: calc(var(--s4) * 2);       /* between sections, and around the footer */
    --portrait: clamp(64px, 10vh, 160px);
    display: grid;
    grid-template-columns: 55fr 45fr;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
  }
  .left {
    order: 2;
    height: 100%;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: none;
    scrollbar-width: none;
  }
  .left::-webkit-scrollbar { display: none; }
  /* Each section spans the pane so its rule runs edge to edge; the copy inside
     sits in a column of --col, centred, never closer to the edge than a gutter. */
  .col {
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 26px; /* first label sits on the nav's line */
  }
  /* sections are separated by one gap, not by padding and rules;
     the footer rule is the only line on the page */
  .col > :global(.block) { padding: 0; border-top: 0; }
  .col > :global(.block) > :global(:last-child) { margin-bottom: 0; }
  .col > :global(.block) + :global(.block) { margin-top: var(--gap); }
  .col > :global(.block:last-of-type) { margin-bottom: auto; }
  /* bottom-right corner, centred on the same line as the logos bottom-left */
  .col > :global(footer) { margin-top: var(--gap); padding: 0 0 32px; }
  .col > :global(.block),
  .col > :global(footer) {
    padding-left: max(var(--gutter), calc((100% - var(--col)) / 2));
    padding-right: max(var(--gutter), calc((100% - var(--col)) / 2));
  }

  .right {
    order: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }
  .stage {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
  }
  .logos {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 28px;
    padding: 0 var(--gutter) 20px;
    mix-blend-mode: screen;
  }
  .logos a {
    display: flex;
    align-items: center;
    min-height: 44px;
    opacity: 0.7;
    filter: grayscale(1);
    transition: opacity 0.25s ease, filter 0.25s ease;
  }
  .logos a:hover, .logos a:focus-visible { opacity: 1; filter: grayscale(0); }

  @media (max-width: 899px) {
    .nav { padding-top: calc(12px + env(safe-area-inset-top)); }


    .site {
      grid-template-columns: minmax(0, 1fr);
      grid-auto-rows: auto;
      height: auto;
      overflow: visible;
    }
    .right {
      height: clamp(340px, 56dvh, 620px);
    }
    .logos { gap: 22px; padding-bottom: 12px; }
    .logos img { height: 24px; }
    .logos .ventureforward { height: 34px; }
    .site { --lede: clamp(20px, 3.2vw + 8px, 28px); --measure: 30ch; --s4: 32px; --s6: 72px; --portrait: 100%; }
    .col { min-height: 0; display: block; padding-top: 0; }
    .left {
      height: auto;
      overflow: visible;
      padding-bottom: env(safe-area-inset-bottom);
    }
    .col > :global(.block),
    .col > :global(footer) { padding-left: var(--gutter); padding-right: var(--gutter); }
  }
  @media (max-width: 599px) {
    .site { --measure: none; }
  }
  @media (max-width: 899px) and (max-height: 500px) {
    .right { height: 320px; }
  }
</style>
