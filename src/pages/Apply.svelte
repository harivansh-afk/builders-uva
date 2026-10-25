<script>
  import { YEARS, validate } from '../lib/join.js'
  import Field from '../lib/Field.svelte'

  let fullName = $state('')
  let email = $state('')
  let year = $state('')
  let linkedin = $state('')
  let hp = $state('')
  let status = $state('idle')
  let error = $state('')

  async function submit(e) {
    e.preventDefault()
    if (status === 'sending') return
    const body = { fullName, email, year, linkedin, hp }
    const result = validate(body)
    if (!result.ok) { error = result.error; return }
    status = 'sending'
    error = ''
    try {
      const response = await fetch('/api/join', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Could not send your application. Try again.')
      status = 'done'
      window.scrollTo(0, 0)
    } catch (err) { status = 'idle'; error = err.message }
  }
</script>

<div class="apply">
  <header>
    {#if status === 'done'}
      <h1 class="lede">Thanks, {fullName.trim().split(/\s+/)[0]}.</h1>
      <p class="details">We'll reach out at {email.trim().toLowerCase()}.</p>
    {/if}
  </header>
  {#if status === 'done'}
    <a class="back" href="/events">Events</a>
  {:else}
    <form onsubmit={submit} novalidate>
      <Field q="Full name" id="full-name">
        <input id="full-name" name="fullName" bind:value={fullName} autocomplete="name" placeholder="First and last name" maxlength="200" required />
      </Field>
      <Field q="UVA email" id="email">
        <input id="email" name="email" type="email" bind:value={email} autocomplete="email" placeholder="abc1de@virginia.edu" maxlength="80" spellcheck="false" required />
      </Field>
      <Field q="Year">
        <div class="years" role="radiogroup" aria-label="Year">
          {#each YEARS as y}
            <button type="button" class="year" class:on={year === y.value} role="radio" aria-checked={year === y.value} onclick={() => (year = y.value)}>{y.label}</button>
          {/each}
        </div>
      </Field>
      <Field q="LinkedIn" id="linkedin">
        <input id="linkedin" name="linkedin" type="url" bind:value={linkedin} autocomplete="url" inputmode="url" placeholder="linkedin.com/in/you" maxlength="200" spellcheck="false" required />
      </Field>
      <input class="hp" name="company" bind:value={hp} tabindex="-1" autocomplete="off" aria-hidden="true" />
      <div class="actions">
        <button class="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Apply'}</button>
        {#if error}<p class="error" role="alert">{error}</p>{/if}
      </div>
    </form>
  {/if}
</div>

<style>
  /* the same form as /events/…/register */
  .apply { display: grid; gap: var(--s5); }
  .lede { max-width: 30ch; }
  .details { margin-top: var(--s3); color: var(--muted); }
  form :global(.field:first-child) { padding-top: 0; }
  input { width: 100%; max-width: 560px; padding: 10px 0 12px; border: 0; border-bottom: 1px solid var(--hair); border-radius: 0; background: transparent; color: var(--fg); font: inherit; font-size: 21px; }
  input:focus { outline: none; border-color: var(--fg); }
  input::placeholder { color: var(--muted); }
  .hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
  /* the years read as plain words; the chosen one is lit */
  .years { display: flex; flex-wrap: wrap; gap: 8px 24px; }
  .year {
    padding: 4px 0;
    background: none;
    border: 0;
    color: var(--muted);
    font: inherit;
    font-size: 21px;
    cursor: pointer;
    transition: color 0.15s ease;
  }
  .year:hover, .year.on { color: var(--fg); }
  .year.on { text-decoration: underline; text-decoration-color: var(--dim); text-underline-offset: 0.2em; }
  .actions { display: grid; justify-items: start; gap: var(--s3); padding-top: var(--s3); }
  /* plain links and the submit button: underlined, brighter on hover */
  .submit, .back {
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
  .submit:hover, .back:hover { color: var(--fg); text-decoration-color: currentColor; }
  .submit:disabled { opacity: 0.6; cursor: default; }
  .error { color: #c98484; }
  .back { justify-self: start; }
  @media (max-width: 899px) { .apply { gap: var(--s4); } }
</style>
