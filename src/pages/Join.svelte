<script>
  import { YEARS, EMAIL_RE } from '../lib/join.js'
  import { nextEvent, rsvpQuestion } from '../lib/events.js'

  const ev = nextEvent()

  let email = $state('')
  let year = $state('')
  let technical = $state(null)
  let founded = $state(null)
  let website = $state('')
  let rsvp = $state(null)
  let hp = $state('') // honeypot; bots fill it, people never see it

  let attempted = $state(false)
  let status = $state('idle') // idle | sending | done | error
  let error = $state('')

  const problems = $derived({
    email: EMAIL_RE.test(email.trim()) ? '' : 'Use your @virginia.edu address.',
    year: year ? '' : 'Pick one.',
    technical: technical === null ? 'Pick one.' : '',
    founded: founded === null ? 'Pick one.' : '',
    rsvp: ev && rsvp === null ? 'Pick one.' : '',
  })
  const valid = $derived(Object.values(problems).every((p) => !p))
  const show = (k) => (attempted ? problems[k] : '')

  async function submit(e) {
    e.preventDefault()
    attempted = true
    if (!valid || status === 'sending') {
      document.querySelector('[data-invalid]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    status = 'sending'
    error = ''
    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(), year, technical, founded,
          website: founded ? website.trim() : '',
          eventSlug: ev?.slug ?? null,
          eventQuestion: ev ? rsvpQuestion(ev) : null,
          eventAnswer: rsvp === null ? '' : rsvp ? 'yes' : 'no',
          hp,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || `Request failed (${res.status}).`)
      status = 'done'
      window.scrollTo(0, 0)
    } catch (err) {
      status = 'error'
      error = err.message || 'Something went wrong.'
    }
  }
</script>

{#snippet choice(name, options, get, set, err)}
  <div class="opts" role="radiogroup" data-invalid={err || undefined}>
    {#each options as o}
      {@const on = get() === o.value}
      <button type="button" class="opt" class:on role="radio" aria-checked={on} onclick={() => set(o.value)}>
        <span class="box" aria-hidden="true"></span>{o.label}
      </button>
    {/each}
  </div>
  {#if err}<p class="err">{err}</p>{/if}
{/snippet}

<div class="join">
  <header class="intro">
    <p class="eyebrow">Join us</p>
    <h1 class="lede">Membership takes a minute. <em>Tell us who you are.</em></h1>
    <p class="sub">We meet Thursdays. Members get the invite, the room, and the people in it.</p>
  </header>

  {#if status === 'done'}
    <div class="done">
      <p class="eyebrow">Done</p>
      <p class="lede">You're in. <em>See you Thursday.</em></p>
      <p class="sub">We'll reach out at {email.trim().toLowerCase()}.</p>
    </div>
  {:else}
    <form onsubmit={submit} novalidate>
      <div class="field" data-invalid={show('email') || undefined}>
        <label class="q" for="email"><span class="n">01</span>What is your UVA email?</label>
        <input id="email" type="email" bind:value={email} placeholder="abc1de@virginia.edu" autocomplete="email" inputmode="email" spellcheck="false" aria-invalid={!!show('email')} />
        {#if show('email')}<p class="err">{show('email')}</p>{/if}
      </div>

      <div class="field">
        <p class="q" id="q-year"><span class="n">02</span>What year are you?</p>
        {@render choice('year', YEARS, () => year, (v) => (year = v), show('year'))}
      </div>

      <div class="field">
        <p class="q"><span class="n">03</span>Do you consider yourself to be technical?</p>
        {@render choice('technical', [{ value: true, label: 'Yes' }, { value: false, label: 'No' }], () => technical, (v) => (technical = v), show('technical'))}
      </div>

      <div class="field">
        <p class="q"><span class="n">04</span>Have you founded a company or built a product before?</p>
        {@render choice('founded', [{ value: true, label: 'Yes' }, { value: false, label: 'No' }], () => founded, (v) => (founded = v), show('founded'))}
        {#if founded}
          <input class="sub-input" type="url" bind:value={website} placeholder="Link to it (optional)" autocomplete="url" inputmode="url" spellcheck="false" aria-label="Link to your company or product" />
        {/if}
      </div>

      {#if ev}
        <div class="field event">
          <p class="q">
            <span class="n">05</span>
            <span>
              {rsvpQuestion(ev)}
              <span class="ctx">{ev.name}, {ev.tag}</span>
            </span>
          </p>
          {@render choice('rsvp', [{ value: true, label: 'Yes' }, { value: false, label: 'No' }], () => rsvp, (v) => (rsvp = v), show('rsvp'))}
        </div>
      {/if}

      <input class="hp" type="text" name="company" tabindex="-1" autocomplete="off" bind:value={hp} aria-hidden="true" />

      <div class="actions">
        <button type="submit" class="go" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Join builders@uva →'}
        </button>
        {#if status === 'error'}
          <p class="err" role="alert">{error}</p>
        {:else if attempted && !valid}
          <p class="err" role="alert">A few answers are missing above.</p>
        {/if}
      </div>
    </form>
  {/if}
</div>

<style>
  .join {
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: 64px clamp(48px, 8vw, 128px);
    align-items: start;
  }
  .intro { position: sticky; top: 96px; }
  .intro .eyebrow { margin-bottom: 20px; }
  .lede em {
    font-family: var(--serif);
    font-style: italic;
    font-size: 1.12em;
    line-height: 1;
  }
  .sub {
    margin-top: 22px;
    max-width: 34ch;
    color: var(--muted);
    font-size: 15px;
    line-height: 1.55;
  }

  form { display: grid; gap: 52px; max-width: 560px; }
  .field { display: grid; gap: 16px; }

  .q {
    display: grid;
    grid-template-columns: 3ch 1fr;
    align-items: baseline;
    gap: 14px;
    font-size: 19px;
    line-height: 1.35;
    letter-spacing: -0.008em;
    color: var(--fg);
  }
  .n {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--dim);
  }
  .ctx {
    display: block;
    margin-top: 6px;
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.04em;
    color: var(--muted);
  }

  input {
    width: 100%;
    margin-left: calc(3ch + 14px);
    width: calc(100% - 3ch - 14px);
    background: transparent;
    color: var(--fg);
    border: 0;
    border-bottom: 1px solid var(--hair);
    border-radius: 0;
    padding: 10px 0 12px;
    font: inherit;
    font-family: var(--mono);
    font-size: 16px;
    outline: none;
    transition: border-color 0.15s ease;
  }
  input:focus { border-bottom-color: var(--fg); }
  input[aria-invalid='true'] { border-bottom-color: #c98484; }
  input::placeholder { color: var(--dim); }
  .sub-input { margin-top: 4px; }

  .opts {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, max-content));
    gap: 12px 32px;
    margin-left: calc(3ch + 14px);
  }
  .opt {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 6px 0;
    background: none;
    border: 0;
    color: var(--muted);
    font: inherit;
    font-size: 16px;
    cursor: pointer;
    transition: color 0.15s ease;
  }
  .opt:hover { color: var(--fg); }
  .opt.on { color: var(--fg); }
  .opt:focus-visible { outline: 1px solid var(--fg); outline-offset: 4px; }
  .box {
    width: 14px;
    height: 14px;
    border: 1px solid var(--dim);
    transition: background 0.15s ease, border-color 0.15s ease;
  }
  .opt:hover .box { border-color: var(--muted); }
  .opt.on .box { background: var(--fg); border-color: var(--fg); }

  .err {
    margin-left: calc(3ch + 14px);
    font-family: var(--mono);
    font-size: 12px;
    color: #c98484;
  }

  .hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }

  .actions {
    display: grid;
    gap: 16px;
    margin-left: calc(3ch + 14px);
    padding-top: 8px;
  }
  .actions .err { margin-left: 0; }
  .go {
    justify-self: start;
    font-family: var(--mono);
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 16px 28px;
    background: var(--fg);
    color: var(--bg);
    border: 1px solid var(--fg);
    cursor: pointer;
    transition: opacity 0.15s ease;
  }
  .go:hover { opacity: 0.88; }
  .go:disabled { opacity: 0.6; cursor: default; }
  .go:focus-visible { outline: 1px solid var(--fg); outline-offset: 4px; }

  .done { display: grid; gap: 20px; }

  @media (max-width: 899px) {
    .join { grid-template-columns: minmax(0, 1fr); gap: 48px; }
    .intro { position: static; }
    form { gap: 44px; }
    .q { font-size: 18px; }
  }
  @media (max-width: 599px) {
    .q { grid-template-columns: 1fr; gap: 6px; }
    input, .opts, .err, .actions { margin-left: 0; width: 100%; }
    .go { justify-self: stretch; text-align: center; }
  }
</style>
