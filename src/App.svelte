<script>
  import Home from './pages/Home.svelte'
  import Event from './pages/Event.svelte'
  import Register from './pages/Register.svelte'
  import Admin from './pages/Admin.svelte'
  import Footer from './lib/Footer.svelte'
  import Events from './pages/Events.svelte'
  import Cohorts from './pages/Cohorts.svelte'
  import { route } from './lib/router.svelte.js'
  import { eventBySlug } from './lib/events.js'

  const page = $derived.by(() => {
    const p = route.path
    if (p === '/') return { name: 'home', title: 'builders@uva' }
    if (p === '/events') return { name: 'events', title: 'Events' }
    if (p === '/cohorts') return { name: 'cohorts', title: 'Cohorts' }
    const registration = p.match(/^\/events\/([^/]+)\/register\/?$/)
    if (registration) return { name: 'register', slug: registration[1], title: 'Register' }
    if (p.startsWith('/events/')) {
      const slug = p.slice('/events/'.length)
      return { name: 'event', slug, title: eventBySlug(slug)?.name ?? 'Events' }
    }
    if (p === '/admin' || p === '/admin/') return { name: 'admin', title: 'Admin' }
    return { name: 'missing', title: 'Not found' }
  })

  $effect(() => { document.title = page.title })
</script>

<a class="mark" href="/" aria-label="builders@uva home">*<span class="b">b</span></a>

<!-- the footer sits at the bottom of the window, or below the content when it runs longer -->
<div class="shell">
  {#if page.name === 'home'}
    <main class="home"><Home /></main>
  {:else}
    <main class="page" class:list={['events', 'cohorts'].includes(page.name)} class:admin-page={page.name === 'admin'}>
      {#key route.path}
        {#if page.name === 'events'}
          <Events />
        {:else if page.name === 'cohorts'}
          <Cohorts />
        {:else if page.name === 'event'}
          <Event slug={page.slug} />
        {:else if page.name === 'register'}
          <Register slug={page.slug} />
        {:else if page.name === 'admin'}
          <Admin />
        {:else}
          <div class="missing">
            <p class="eyebrow">404</p>
            <p class="lede">Nothing here. <a class="back" href="/">Go home.</a></p>
          </div>
        {/if}
      {/key}
    </main>
  {/if}
  <Footer />
</div>

<style>
  /* top-left, scrolling away with the page. Set as text rather than
     public/mark.svg so it gets Berkeley Mono at a light weight: the b slanted
     12°, the pair set 28 of 60 units apart rather than the face's 36. */
  .mark {
    position: absolute;
    z-index: 2;
    top: max(16px, env(safe-area-inset-top));
    left: max(20px, env(safe-area-inset-left));
    font-family: var(--mono);
    font-size: 24px;
    font-weight: 300;
    line-height: 1;
    letter-spacing: -0.13em;
    transition: opacity 0.15s ease;
  }
  .mark .b { display: inline-block; transform: skewX(-12deg); }
  .mark:hover { opacity: 0.7; }
  .shell {
    display: grid;
    grid-template-rows: 1fr auto;
    min-height: 100dvh;
  }
  .home { display: grid; place-items: center; padding: 0 var(--gutter); }
  .page {
    width: min(1120px, 100%);
    margin: 0 auto;
    padding: var(--top) var(--gutter) var(--s7);
  }
  /* list pages sit in the middle of the window rather than at the top */
  .list { display: grid; align-content: center; padding-bottom: var(--top); }
  .missing { display: grid; gap: var(--s4); }
  .back { border-bottom: 1px solid var(--dim); }
  .admin-page { width: min(1600px, 100%); }
</style>
