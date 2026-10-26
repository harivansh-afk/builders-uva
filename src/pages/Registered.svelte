<script>
  import { eventBySlug, longDate } from '../lib/events.js'
  import { calendarLinks } from '../lib/calendar.js'
  import { navigate } from '../lib/router.svelte.js'

  let { slug } = $props()
  const event = $derived(eventBySlug(slug))
  const calendar = $derived(event ? calendarLinks(event) : null)
  const registered = localStorage.getItem(`registered:${slug}`)

  // only reachable after registering in this browser
  $effect(() => { if (!registered) navigate(`/events/${slug}/register`, { replace: true }) })
</script>

{#if event && registered}
  <div class="registered">
    <a class="back" href="/events/{slug}" aria-label="Back to {event.name}">←</a>
    <header>
      <h1 class="lede">You're registered.</h1>
      <p class="details">Q&amp;A with {event.name}, {longDate(event.date)}{#if event.time}, {event.time}{/if}{#if event.location}, {event.location}{/if}</p>
    </header>
    <p class="links">
      <a href={calendar.googleUrl} target="_blank" rel="noopener noreferrer">Google Calendar</a>
      <a href={calendar.icsHref} download={`builders-uva-${event.slug}.ics`}>Apple or Outlook</a>
    </p>
  </div>
{/if}

<style>
  .registered { display: grid; gap: var(--s5); }
  .lede { max-width: 30ch; }
  .details { margin-top: var(--s3); color: var(--muted); }
  .back { justify-self: start; font-size: 20px; color: var(--muted); transition: color 0.15s ease; }
  .back:hover { color: var(--fg); }
  .links { display: flex; flex-wrap: wrap; gap: var(--s3); }
  .links a {
    color: var(--muted);
    font-size: 20px;
    text-decoration: underline;
    text-decoration-color: var(--dim);
    text-underline-offset: 0.2em;
    transition: color 0.15s ease, text-decoration-color 0.15s ease;
  }
  .links a:hover { color: var(--fg); text-decoration-color: currentColor; }
  @media (max-width: 899px) { .registered { gap: var(--s4); } }
</style>
