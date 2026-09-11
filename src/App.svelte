<script>
  import { onMount } from 'svelte'
  import { mountInteractionSounds } from './lib/interactionSounds.js'
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
  <Home />
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

  @media (max-width: 899px) {
    .nav { padding-top: calc(12px + env(safe-area-inset-top)); }
  }
</style>
