<script>
  import { onMount } from 'svelte'
  import { events as siteEvents } from '../lib/events.js'

  let status = $state('loading')
  let error = $state('')
  let user = $state(null)
  let view = $state('applications')
  let applicationStatus = $state('pending')
  let reviewing = $state(false)
  let search = $state('')
  let query = $state('')
  let event = $state('')
  let answer = $state('')
  let sort = $state('created_at')
  let direction = $state('desc')
  let page = $state(1)
  let data = $state({ rows: [], total: 0, events: [], pageSize: 50 })
  let busy = $state(false)
  let controller
  let timer
  const pages = $derived(Math.max(1, Math.ceil(data.total / data.pageSize)))
  const date = (value) => value ? new Date(value).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' }) : '—'
  const eventName = (slug) => siteEvents.find(e => e.slug === slug)?.name || slug
  const safeWebsite = (value) => {
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null } catch { return null }
  }

  async function load() {
    controller?.abort()
    const current = new AbortController()
    controller = current
    busy = true
    error = ''
    try {
      const params = new URLSearchParams({ view, status: applicationStatus, q: query, event, answer, sort, direction, page: String(page) })
      const response = await fetch(`/api/admin?${params}`, { signal: current.signal, cache: 'no-store' })
      const result = await response.json()
      if (response.status === 401) { status = 'signed-out'; user = null; data.rows = []; return }
      if (!response.ok) throw new Error(result.error || 'Could not load the dashboard.')
      user = result.user
      data = result
      status = 'ready'
    } catch (e) {
      if (e.name !== 'AbortError') { error = e.message; if (!user) status = 'error' }
    } finally { if (controller === current) busy = false }
  }

  async function review(row, nextStatus) {
    reviewing = true
    error = ''
    try {
      const response = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: row.email, status: nextStatus, expectedStatus: row.status }),
      })
      const result = await response.json()
      if (response.status === 401) { status = 'signed-out'; user = null; data.rows = []; return }
      if (!response.ok) throw new Error(result.error || 'Could not save the decision.')
      page = 1
      await load()
    } catch (e) { error = e.message }
    finally { reviewing = false }
  }

  async function authAction(action) {
    busy = true
    error = ''
    try {
      const response = await fetch('/api/auth/csrf', { cache: 'no-store' })
      const { csrfToken } = await response.json()
      if (!response.ok || !csrfToken) throw new Error('Could not start sign-in. Please try again.')
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = `/api/auth/${action}`
      for (const [name, value] of Object.entries({ csrfToken, callbackUrl: `${location.origin}/admin` })) {
        const input = document.createElement('input')
        input.type = 'hidden'; input.name = name; input.value = value; form.append(input)
      }
      document.body.append(form)
      form.submit()
    } catch (e) { error = e.message; busy = false }
  }

  function switchView(next) {
    view = next; page = 1; sort = 'created_at'; direction = 'desc'; event = ''; answer = ''; load()
  }
  function filter() { page = 1; load() }
  function searchChanged() {
    clearTimeout(timer)
    timer = setTimeout(() => { query = search; filter() }, 250)
  }
  function order(column) {
    direction = sort === column && direction === 'asc' ? 'desc' : 'asc'
    sort = column; page = 1; load()
  }
  function arrow(column) { return sort === column ? (direction === 'asc' ? ' ↑' : ' ↓') : '' }
  function ariaSort(column) { return sort === column ? (direction === 'asc' ? 'ascending' : 'descending') : 'none' }

  onMount(() => {
    load().then(() => {
      const reason = new URLSearchParams(location.search).get('error')
      if (reason) error = reason === 'AccessDenied' ? 'This Google account does not have admin access.' : 'Google sign-in could not be completed. Please try again.'
    })
    const onHistory = () => { if (document.visibilityState === 'visible') load() }
    document.addEventListener('visibilitychange', onHistory)
    return () => { controller?.abort(); clearTimeout(timer); document.removeEventListener('visibilitychange', onHistory) }
  })
</script>

<svelte:head><meta name="robots" content="noindex, nofollow" /></svelte:head>

<section class="admin">
  <header>
    <div><p class="eyebrow">builders@uva</p><h1>Admin</h1></div>
    {#if user}<div class="account"><span>{user.email}</span><button onclick={() => authAction('signout')} disabled={busy}>Sign out</button></div>{/if}
  </header>
  {#if error}<p class="error" role="alert">{error}</p>{/if}
  {#if status === 'loading'}
    <p role="status">Loading dashboard…</p>
  {:else if status === 'signed-out'}
    <div class="login"><h2>A little behind the scenes.</h2><p>Sign in with your authorized Google account to review applications, members, and event responses.</p><button class="primary" onclick={() => authAction('signin/google')} disabled={busy}>Continue with Google</button></div>
  {:else if status === 'error'}
    <button onclick={load} disabled={busy}>Try again</button>
  {:else}
    <div class="tabs" aria-label="Database views">
      <button class:active={view === 'applications'} aria-pressed={view === 'applications'} onclick={() => switchView('applications')}>Applications</button>
      <button class:active={view === 'members'} aria-pressed={view === 'members'} onclick={() => switchView('members')}>Members</button>
      <button class:active={view === 'responses'} aria-pressed={view === 'responses'} onclick={() => switchView('responses')}>Event registrations</button>
    </div>
    <div class="filters">
      <label class="search">Search<input type="search" placeholder="Name or email" bind:value={search} oninput={searchChanged} maxlength="200" /></label>
      {#if view === 'applications'}
        <label>Status<select bind:value={applicationStatus} onchange={filter}><option value="pending">Pending</option><option value="declined">Declined</option></select></label>
      {/if}
      {#if view === 'responses'}
        <label>Event<select aria-label="Event" bind:value={event} onchange={filter}><option value="">All events</option>{#each data.events as slug}<option value={slug}>{eventName(slug)}</option>{/each}</select></label>
        <label>RSVP<select aria-label="RSVP" bind:value={answer} onchange={filter}><option value="">All answers</option><option value="yes">Yes</option><option value="no">No</option></select></label>
      {/if}
      <button onclick={load} disabled={busy}>Refresh</button>
    </div>
    <div class="result-meta" role="status"><span>{data.total} {view === 'applications' ? 'applications' : view === 'members' ? 'members' : 'responses'}{query || event || answer ? ' matching filters' : ''}</span><span>{busy ? 'Updating…' : 'Times in Eastern Time'}</span></div>
    <div class="table-wrap" aria-busy={busy}>
      <table>
        <thead><tr>
          <th aria-sort={ariaSort('full_name')}><button onclick={() => order('full_name')}>Name{arrow('full_name')}</button></th>
          <th aria-sort={ariaSort('email')}><button onclick={() => order('email')}>Email{arrow('email')}</button></th>
          {#if view !== 'responses'}
            <th aria-sort={ariaSort('year')}><button onclick={() => order('year')}>Year{arrow('year')}</button></th><th>LinkedIn</th><th>Technical</th><th>Founded</th><th>Website</th>
          {:else}
            <th aria-sort={ariaSort('event_slug')}><button onclick={() => order('event_slug')}>Event{arrow('event_slug')}</button></th><th>RSVP prompt</th><th>RSVP</th><th>Question for speaker</th>
          {/if}
          <th aria-sort={ariaSort('created_at')}><button onclick={() => order('created_at')}>{view !== 'responses' ? 'Submitted' : 'Responded'}{arrow('created_at')}</button></th>
          {#if view !== 'responses'}<th>Updated</th>{/if}
          {#if view === 'applications'}<th>Review</th>{/if}
        </tr></thead>
        <tbody>
          {#each data.rows as row (view !== 'responses' ? row.email : row.id)}
            <tr><td>{row.full_name || '—'}</td><td>{row.email}</td>
              {#if view !== 'responses'}
                <td>{row.year}</td>
                <td>{#if safeWebsite(row.linkedin)}<a href={safeWebsite(row.linkedin)} target="_blank" rel="noopener noreferrer">{row.linkedin}</a>{:else}{row.linkedin || '—'}{/if}</td>
                <td>{row.technical == null ? '—' : row.technical ? 'Yes' : 'No'}</td><td>{row.founded == null ? '—' : row.founded ? 'Yes' : 'No'}</td>
                <td>{#if safeWebsite(row.website)}<a href={safeWebsite(row.website)} target="_blank" rel="noopener noreferrer">{row.website}</a>{:else}{row.website || '—'}{/if}</td>
              {:else}
                <td>{eventName(row.event_slug)}<small>{row.event_slug}</small></td><td>{row.question || '—'}</td><td><span class:yes={row.answer === 'yes'} class="answer">{row.answer || '—'}</span></td><td class="speaker-question">{row.speaker_question || '—'}</td>
              {/if}
              <td class="date">{date(row.created_at)}</td>{#if view !== 'responses'}<td class="date">{date(row.updated_at)}</td>{/if}
              {#if view === 'applications'}
                <td><div class="review"><button disabled={busy || reviewing} onclick={() => review(row, 'approved')}>Approve</button>{#if row.status === 'pending'}<button disabled={busy || reviewing} onclick={() => review(row, 'declined')}>Decline</button>{/if}</div></td>
              {/if}
            </tr>
          {:else}<tr><td colspan={view === 'applications' ? 9 : view === 'members' ? 8 : 7} class="empty">{query || event || answer ? 'No matches. Try changing the filters.' : 'Nothing here yet.'}</td></tr>{/each}
        </tbody>
      </table>
    </div>
    <div class="pagination"><button disabled={page <= 1 || busy} onclick={() => { page--; load() }}>Previous</button><span>Page {page} of {pages}</span><button disabled={page >= pages || busy} onclick={() => { page++; load() }}>Next</button></div>
  {/if}
</section>

<style>
  .admin { width: 100%; min-width: 0; }
  header, .account, .filters, .result-meta, .pagination { display: flex; align-items: center; gap: 16px; }
  header { justify-content: space-between; margin-bottom: 36px; flex-wrap: wrap; }
  h1 { font-size: clamp(36px, 5vw, 56px); font-weight: 500; letter-spacing: -0.04em; margin-top: 12px; }
  h2 { font-size: 24px; font-weight: 500; margin-bottom: 14px; }
  .account, .result-meta, .pagination, label { font-family: var(--mono); font-size: 12px; color: var(--muted); }
  .account { flex-wrap: wrap; }
  button, input, select { font: inherit; color: var(--fg); border: 1px solid var(--hair); background: transparent; border-radius: 3px; padding: 10px 14px; }
  button { cursor: pointer; font-family: var(--mono); font-size: 12px; }
  button:hover:not(:disabled), button.active { background: var(--fg); color: var(--bg); }
  button:disabled { opacity: 0.4; cursor: default; }
  button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid var(--fg); outline-offset: 3px; }
  .login { border-top: 1px solid var(--hair); padding: 36px 0; max-width: 520px; }
  .login p { color: var(--muted); line-height: 1.7; margin-bottom: 24px; }
  .primary { background: var(--fg); color: var(--bg); }
  .error { border: 1px solid var(--error); color: var(--error); padding: 14px; margin-bottom: 20px; }
  .review { display: flex; gap: 8px; }
  .tabs { display: flex; gap: 8px; margin-bottom: 24px; }
  .filters { align-items: end; flex-wrap: wrap; margin-bottom: 24px; }
  label { display: grid; gap: 8px; }
  .search { flex: 1; min-width: 200px; }
  input, select { width: 100%; min-height: 40px; }
  option { background: var(--bg); }
  .result-meta { justify-content: space-between; flex-wrap: wrap; margin-bottom: 12px; }
  .speaker-question { min-width: 240px; max-width: 480px; white-space: pre-wrap; overflow-wrap: anywhere; }
  .table-wrap { overflow-x: auto; border: 1px solid var(--hair); border-radius: 3px; }
  table { width: 100%; min-width: 1050px; border-collapse: collapse; font-size: 13px; text-align: left; }
  th { color: var(--muted); font-family: var(--mono); font-size: 11px; font-weight: 400; white-space: nowrap; }
  th, td { padding: 14px 16px; border-bottom: 1px solid var(--hair); }
  th button { border: 0; padding: 0; color: inherit; font-size: inherit; }
  th button:hover:not(:disabled) { background: transparent; color: var(--fg); }
  td { vertical-align: top; max-width: 340px; overflow-wrap: anywhere; }
  td a { text-decoration: underline; text-underline-offset: 3px; }
  tr:last-child td { border-bottom: 0; }
  small { display: block; color: var(--muted); font-size: 11px; margin-top: 6px; }
  .date { white-space: nowrap; color: var(--muted); font-size: 12px; }
  .answer { text-transform: capitalize; }
  .yes { color: #3d7a3f; }
  .empty { padding: 40px; text-align: center; color: var(--muted); }
  .pagination { justify-content: end; margin-top: 20px; }
  @media (max-width: 600px) { .result-meta { font-size: 10px; } .account { font-size: 11px; } th, td { padding: 12px; } }
</style>
