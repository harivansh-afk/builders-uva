<script>
  import { onMount } from 'svelte'
  import { mountInteractionSounds } from './lib/interactionSounds.js'
  import Ascii from './lib/Ascii.svelte'
  import Home from './pages/Home.svelte'
  import Event from './pages/Event.svelte'
  import Register from './pages/Register.svelte'
  import Admin from './pages/Admin.svelte'
  import Footer from './lib/Footer.svelte'
  import Brackets from './lib/Brackets.svelte'
  import Legal from './pages/Legal.svelte'
  import Events from './pages/Events.svelte'
  import Join from './pages/Join.svelte'
  import Team from './pages/Team.svelte'
  import { route } from './lib/router.svelte.js'
  import { eventBySlug } from './lib/events.js'

  onMount(mountInteractionSounds)

  const page = $derived.by(() => {
    const p = route.path
    if (p === '/') return { name: 'home', title: 'builders@uva' }
    if (p === '/legal') return { name: 'legal', title: 'Legal · builders@uva' }
    if (p === '/events') return { name: 'events', title: 'Thursdays' }
    if (p === '/team') return { name: 'team', title: 'Team · builders@uva' }
    const registration = p.match(/^\/events\/([^/]+)\/register\/?$/)
    if (registration) return { name: 'register', slug: registration[1], title: 'Register' }
    if (p.startsWith('/events/')) {
      const slug = p.slice('/events/'.length)
      return { name: 'event', slug, title: eventBySlug(slug)?.name ?? 'Thursdays' }
    }
    if (['/apply', '/apply/', '/join', '/join/'].includes(p)) return { name: 'join', title: 'Apply' }
    if (p === '/admin' || p === '/admin/') return { name: 'admin', title: 'Admin' }
    return { name: 'missing', title: 'Not found' }
  })

  $effect(() => { document.title = page.title })

  const section = $derived(['event', 'register'].includes(page.name) ? 'events' : page.name)
  const home = $derived(page.name === 'home')
</script>

<header class="header">
  <nav class="nav" aria-label="Pages">
    <a class="mark" href="/" aria-label="builders@uva home" aria-current={page.name === 'home' ? 'page' : undefined}><img src="/mark.svg" width="32" height="32" alt="*b" /></a>
    <a class="tab" href="/events" aria-current={section === 'events' ? 'page' : undefined}><Brackets side="left" />Thursdays<Brackets side="right" /></a>
    <a class="tab" href="/team" aria-current={section === 'team' ? 'page' : undefined}><Brackets side="left" />Team<Brackets side="right" /></a>
    <a class="tab" href="/apply" aria-current={section === 'join' ? 'page' : undefined}><Brackets side="left" />Apply<Brackets side="right" /></a>
  </nav>
</header>

{#if home}
  <div class="backdrop" aria-hidden="true"><Ascii split={[0.08, 0.13]} /></div>
  <div class="site">
    <main class="site-main"><Home /></main>
    <div class="site-foot"><Footer inline /></div>
  </div>
{:else}
  <main class="page" class:admin-page={page.name === 'admin'}>
    {#key route.path}
      {#if page.name === 'events'}
        <Events />
      {:else if page.name === 'event'}
        <Event slug={page.slug} />
      {:else if page.name === 'register'}
        <Register slug={page.slug} />
      {:else if page.name === 'join'}
        <Join />
      {:else if page.name === 'team'}
        <Team />
      {:else if page.name === 'legal'}
        <Legal />
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
  .header {
    position: absolute; /* scrolls away with the page rather than riding over the copy */
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    padding: var(--edge);
    pointer-events: none;
  }
  .header > :global(*) { pointer-events: auto; }
  .nav {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
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
  .nav a[aria-current='page'] { color: var(--fg); }
  /* dotted brackets: faint on hover, solid on the current page */
  .tab { position: relative; margin-inline: 10px; padding-inline: 4px !important; }
  .tab:is(:hover, :focus-visible) > :global(.dots) { opacity: 1; color: var(--dim); }
  .tab[aria-current='page'] > :global(.dots) { opacity: 1; color: var(--fg); }
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

  /* ---------- home: one screen, the hands pinned behind it ---------- */
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 0;
    opacity: 0.55;
    pointer-events: none;
  }
  /* home is exactly one screen: the copy in the middle, the footer at the bottom */
  .site {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
  }
  .site-main { min-height: 0; }

  /* the footer keeps its old place and shape: the bottom of the right pane,
     left edge on the copy column, right and bottom edges on the window inset */
  .site-foot {
    --s4: clamp(14px, 2.2vh, 40px);
    width: 45%;
    margin-left: auto;
  }
  .site-foot > :global(footer) {
    padding: 0 var(--edge) var(--edge) max(var(--gutter), calc((100% - var(--col)) / 2));
  }
  @media (max-width: 899px) {
    .site-foot { width: 100%; --s4: 32px; }
    .site-foot > :global(footer) {
      padding: var(--s4) var(--edge) max(var(--edge), env(safe-area-inset-bottom));
    }
  }

  @media (max-width: 899px) {
    .header { padding-top: max(var(--edge), env(safe-area-inset-top)); }
  }
  @media (max-width: 599px) {
    .nav { gap: 2px; font-size: 12px; }
    .nav a { padding-inline: 8px; }
  }
</style>
