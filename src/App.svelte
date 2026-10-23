<script>
  import { onMount } from 'svelte'
  import { mountInteractionSounds } from './lib/interactionSounds.js'
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
    if (p === '/events') return { name: 'events', title: 'Events' }
    if (p === '/team') return { name: 'team', title: 'Team · builders@uva' }
    const registration = p.match(/^\/events\/([^/]+)\/register\/?$/)
    if (registration) return { name: 'register', slug: registration[1], title: 'Register' }
    if (p.startsWith('/events/')) {
      const slug = p.slice('/events/'.length)
      return { name: 'event', slug, title: eventBySlug(slug)?.name ?? 'Events' }
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
    <a class="tab" href="/events" aria-current={section === 'events' ? 'page' : undefined}><Brackets side="left" />Events<Brackets side="right" /></a>
    <a class="tab" href="/team" aria-current={section === 'team' ? 'page' : undefined}><Brackets side="left" />Team<Brackets side="right" /></a>
    <a class="tab" href="/apply" aria-current={section === 'join' ? 'page' : undefined}><Brackets side="left" />Apply<Brackets side="right" /></a>
  </nav>
</header>

{#if home}
  <div class="site">
    <main class="site-main"><Home /></main>
    <div class="site-foot"><Footer /></div>
  </div>
{:else}
  <div class="shell">
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
    </main>
    <Footer />
  </div>
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
  /* the footer sits at the bottom of the window, or below the content when it runs longer */
  .shell {
    display: grid;
    grid-template-rows: 1fr auto;
    min-height: 100dvh;
  }
  .page {
    width: min(1120px, 100%);
    margin: 0 auto;
    padding: var(--top) var(--gutter) var(--s7);
  }
  .missing { display: grid; gap: var(--s4); }
  .home { border-bottom: 1px solid var(--dim); }
  .admin-page { width: min(1600px, 100%); }

  /* ---------- home: one screen, the hands pinned behind it (see Home) ---------- */
  /* home is exactly one screen. The copy centres on the window, which is where
     the hands' gap sits, so the footer stays out of the flow. */
  .site {
    position: relative;
    z-index: 1;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
  }
  .site-main { height: 100%; }

  /* the colophon mirrors the nav: nav top-left, footer bottom-right, the two
     corners the hands leave empty */
  .site-foot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
  }

  @media (max-width: 899px) {
    .header { padding-top: max(var(--edge), env(safe-area-inset-top)); }
  }
  @media (max-width: 599px) {
    .nav { gap: 2px; font-size: 12px; }
    .nav a { padding-inline: 8px; }
  }
</style>
