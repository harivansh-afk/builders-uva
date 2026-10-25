<script>
  import { events, dayDate, registrationOpen } from '../lib/events.js'
  const today = new Date()
</script>

<h1 class="sr-only">Events</h1>
<ul class="rows">
  {#each events as e}
    <li class="row">
      <a class="page" href="/events/{e.slug}">{e.name}{#if e.tag}<span class="tag">, {e.tag}</span>{/if}</a>
      {#if registrationOpen(e, today)}
        <span class="upcoming"><time datetime={e.date}>{dayDate(e.date)}</time>, <a class="action ink" href="/events/{e.slug}/register" aria-label="Register for {e.name}">Register</a></span>
      {:else if e.youtube}
        <a class="action ink" href="https://www.youtube.com/watch?v={e.youtube}" target="_blank" rel="noopener" aria-label="Recording of {e.name}">Recording</a>
      {/if}
    </li>
  {/each}
</ul>

<style>
  .rows {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 4px;
  }
  .row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 24px;
  }
  .page {
    padding: 10px 0;
    font-size: 25px;
    letter-spacing: -0.008em;
    transition: opacity 0.15s ease;
  }
  .page:hover { opacity: 0.7; }
  .upcoming {
    flex-shrink: 0;
    font-size: 20px;
    color: var(--muted);
    white-space: nowrap;
  }
  .action { flex-shrink: 0; font-size: 20px; color: var(--fg); }

  @media (max-width: 599px) {
    .page { font-size: 22px; }
  }
</style>
