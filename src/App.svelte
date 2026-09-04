<script>
  import Ascii from './lib/Ascii.svelte'
  import Mark from './lib/Mark.svelte'
  import Home from './pages/Home.svelte'
  import Events from './pages/Events.svelte'
  import Event from './pages/Event.svelte'
  import Join from './pages/Join.svelte'
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
</script>

<div class="site">
  <main class="left">
    {#key route.path}
      {#if page.name === 'home'}
        <Home />
      {:else if page.name === 'events'}
        <Events />
      {:else if page.name === 'event'}
        <Event slug={page.slug} />
      {:else if page.name === 'join'}
        <Join />
      {:else}
        <section class="block hero">
          <h2 class="eyebrow">404</h2>
          <p class="lede">Nothing here. <a class="home" href="/">Go home.</a></p>
        </section>
      {/if}
    {/key}
  </main>

  <aside class="right">
    <nav class="nav" aria-label="Pages">
      <a class="mark" href="/" aria-label="builders@uva home" aria-current={section === 'home' ? 'page' : undefined}><Mark size={18} /></a>
      <a href="/events" aria-current={section === 'events' ? 'page' : undefined}>Events</a>
      <a href="/join" aria-current={section === 'join' ? 'page' : undefined}>Join us</a>
    </nav>
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

<style>
  /* ---------- two panes: graphic pinned left, copy scrolls right ---------- */
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
    padding: 0 var(--gutter);
  }
  .left::-webkit-scrollbar { display: none; }

  .home { border-bottom: 1px solid var(--dim); }

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

  /* top-left page switcher, floating over the stage */
  .nav {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 18px var(--gutter);
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.12em;
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
  .nav .mark { padding: 0 8px 0 0; margin-right: 4px; border: 0; }
  .nav .mark[aria-current='page'] { color: var(--fg); }

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
  /* 44px tall hit area around each logo */
  .logos a { display: flex; align-items: center; min-height: 44px; }

  /* ---------- one column: graphic on top, copy below, page scrolls ---------- */
  @media (max-width: 899px) {
    .site {
      grid-template-columns: minmax(0, 1fr);
      grid-auto-rows: auto;
      height: auto;
      overflow: visible;
    }
    .right {
      /* square-ish stage on phones, capped on tall or wide tablets */
      height: clamp(340px, 56dvh, 620px);
      border-right: 0;
      border-bottom: 1px solid var(--hair);
    }
    .nav { padding-top: calc(12px + env(safe-area-inset-top)); }
    .logos { gap: 22px; padding-bottom: 12px; }
    .logos img { height: 24px; }
    .left {
      height: auto;
      overflow: visible;
      padding-bottom: calc(40px + env(safe-area-inset-bottom));
    }
  }

  /* short landscape phones: don't let the graphic eat the whole screen */
  @media (max-width: 899px) and (max-height: 500px) {
    .right { height: 320px; }
  }
</style>
