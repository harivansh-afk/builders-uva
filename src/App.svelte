<script>
  import Ascii from './lib/Ascii.svelte'
  import Home from './pages/Home.svelte'
  import Events from './pages/Events.svelte'
  import Event from './pages/Event.svelte'
  import Join from './pages/Join.svelte'
  import Footer from './lib/Footer.svelte'
  import { route } from './lib/router.svelte.js'

  const page = $derived.by(() => {
    const p = route.path
    if (p === '/') return { name: 'home', title: 'builders@uva' }
    if (p === '/events') return { name: 'events', title: 'Events · builders@uva' }
    if (p.startsWith('/events/')) return { name: 'event', slug: p.slice('/events/'.length), title: 'Events · builders@uva' }
    if (p === '/join') return { name: 'join', title: 'Join us · builders@uva' }
    return { name: 'missing', title: 'builders@uva' }
  })

  $effect(() => { document.title = page.title })

  const section = $derived(page.name === 'event' ? 'events' : page.name)
  const home = $derived(page.name === 'home')
</script>

<nav class="nav" aria-label="Pages">
  <a class="mark" href="/" aria-label="builders@uva home" aria-current={section === 'home' ? 'page' : undefined}>b@</a>
  <a href="/events" aria-current={section === 'events' ? 'page' : undefined}>Events</a>
  <a href="/join" aria-current={section === 'join' ? 'page' : undefined}>Join us</a>
</nav>

{#if home}
  <div class="site">
    <main class="left">
      <div class="col">
        <Home />
        <Footer />
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
      </div>
    </aside>
  </div>
{:else}
  <main class="page">
    {#key route.path}
      {#if page.name === 'events'}
        <Events />
      {:else if page.name === 'event'}
        <Event slug={page.slug} />
      {:else if page.name === 'join'}
        <Join />
      {:else}
        <p class="eyebrow">404</p>
        <p class="lede" style="margin-top: var(--s4)">Nothing here. <a class="home" href="/">Go home.</a></p>
      {/if}
    {/key}
    <Footer />
  </main>
{/if}

<style>
  /* ---------- top-left page switcher, on every page ---------- */
  .nav {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 18px var(--gutter);
    font-family: var(--mono);
    font-size: 12px;
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
  .home { border-bottom: 1px solid var(--dim); }

  /* ---------- home: two panes, graphic pinned left, copy scrolls right ---------- */
  .site {
    display: grid;
    grid-template-columns: 55fr 45fr;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
  }
  .left {
    order: 2;
    height: 100%;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: none;
  }
  .left::-webkit-scrollbar { display: none; }
  /* Each section spans the pane so its rule runs edge to edge; the copy inside
     sits in a column of --col, centred, never closer to the edge than a gutter. */
  .col { width: 100%; }
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
    border-right: 1px solid var(--hair);
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
    opacity: 0.7;
    transition: opacity 0.25s ease;
  }
  .logos:hover, .logos:focus-within { opacity: 1; }
  .logos a { display: flex; align-items: center; min-height: 44px; }

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
      border-right: 0;
      border-bottom: 1px solid var(--hair);
    }
    .logos { gap: 22px; padding-bottom: 12px; }
    .logos img { height: 24px; }
    .left {
      height: auto;
      overflow: visible;
      padding-bottom: env(safe-area-inset-bottom);
    }
    .col > :global(.block),
    .col > :global(footer) { padding-left: var(--gutter); padding-right: var(--gutter); }
  }
  @media (max-width: 899px) and (max-height: 500px) {
    .right { height: 320px; }
  }
</style>
