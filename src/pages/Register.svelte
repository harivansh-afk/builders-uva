<script>
  import { eventBySlug, longDate, registrationOpen } from '../lib/events.js'
  import { validateRegistration } from '../lib/register.js'
  import Field from '../lib/Field.svelte'

  let { slug } = $props()
  const event = $derived(eventBySlug(slug))
  const open = $derived(registrationOpen(event))
  let fullName = $state('')
  let email = $state('')
  let speakerQuestion = $state('')
  let hp = $state('')
  let status = $state('idle')
  let error = $state('')

  async function submit(e) {
    e.preventDefault()
    if (status === 'sending') return
    const body = { fullName, email, speakerQuestion, eventSlug: slug, hp }
    const result = validateRegistration(body)
    if (!result.ok) { error = result.error; return }
    status = 'sending'
    error = ''
    try {
      const response = await fetch('/api/register', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Could not save your registration. Try again.')
      status = 'done'
      window.scrollTo(0, 0)
    } catch (err) { status = 'idle'; error = err.message }
  }
</script>

<div class="registration">
  <header>
    {#if !event}
      <h1 class="lede">Event not found.</h1>
    {:else if status === 'done'}
      <h1 class="lede">You're registered.</h1>
      <p class="details">See you for the Q&amp;A with {event.name}.</p>
    {:else}
      <h1 class="lede">{event.name}{#if event.tag}<span class="tag">, {event.tag}</span>{/if}</h1>
    {/if}
    {#if event}<p class="details">{longDate(event.date)}{event.time ? ` · ${event.time}` : ''}{event.format ? ` · ${event.format}` : ''}</p>{/if}
  </header>
  {#if status === 'done'}
    <a class="back" href="/events/{slug}">Event details</a>
  {:else if open}
    <form onsubmit={submit}>
      <Field q="Full name" id="full-name">
        <input id="full-name" name="fullName" bind:value={fullName} autocomplete="name" placeholder="First and last name" maxlength="200" required />
      </Field>
      <Field q="UVA email" id="email">
        <input id="email" name="email" type="email" bind:value={email} autocomplete="email" placeholder="abc1de@virginia.edu" maxlength="80" required />
      </Field>
      <Field q="What would you like to ask the speaker?" id="speaker-question">
        <textarea id="speaker-question" name="speakerQuestion" bind:value={speakerQuestion} rows="2" maxlength="2000" required placeholder="Bring a question you want to discuss."></textarea>
      </Field>
      <input class="hp" name="company" bind:value={hp} tabindex="-1" autocomplete="off" aria-hidden="true" />
      <div class="actions">
        <button disabled={status === 'sending'}>{status === 'sending' ? 'Registering…' : 'Register'}</button>
        {#if error}<p class="error" role="alert">{error}</p>{/if}
      </div>
    </form>
  {:else}
    {#if event}<p>Registration is closed for this event.</p>{/if}
    <a class="back" href="/events">All events</a>
  {/if}
</div>

<style>
  .registration { display: grid; gap: var(--s5); }
  .lede { max-width: 30ch; }
  .details { margin-top: var(--s3); color: var(--muted); }
  form :global(.field:first-child) { padding-top: 0; }
  input, textarea { width: 100%; max-width: 560px; padding: 10px 0 12px; border: 0; border-bottom: 1px solid var(--hair); border-radius: 0; background: transparent; color: var(--fg); font: inherit; font-size: 21px; }
  textarea { resize: vertical; line-height: 1.6; }
  input:focus, textarea:focus { outline: none; border-color: var(--fg); }
  input::placeholder, textarea::placeholder { color: var(--muted); }
  .hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
  .actions { display: grid; justify-items: start; gap: var(--s3); padding-top: var(--s3); }
  /* plain links and the submit button: underlined, brighter on hover */
  button, .back {
    padding: 0;
    background: none;
    border: 0;
    color: var(--muted);
    font: inherit;
    font-size: 20px;
    text-decoration: underline;
    text-decoration-color: var(--dim);
    text-underline-offset: 0.2em;
    cursor: pointer;
    transition: color 0.15s ease, text-decoration-color 0.15s ease;
  }
  button:hover, .back:hover { color: var(--fg); text-decoration-color: currentColor; }
  button:disabled { opacity: 0.6; cursor: default; }
  .error { color: #c98484; }
  .back { justify-self: start; }
  @media (max-width: 899px) { .registration { gap: var(--s4); } }
</style>
