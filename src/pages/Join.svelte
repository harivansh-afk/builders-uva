<script>
  import { YEARS, EMAIL_RE, fullNameError } from '../lib/join.js'
  import { nextEvent, rsvpQuestion, midDate } from '../lib/events.js'
  import Field from '../lib/Field.svelte'

  const ev = nextEvent()
  const YES_NO = [{ value: true, label: 'Yes' }, { value: false, label: 'No' }]

  let fullName = $state('')
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
    fullName: fullNameError(fullName),
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
          fullName: fullName.trim(), email: email.trim(), year, technical, founded,
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

{#snippet choice(options, get, set, err)}
  <div class="opts" class:cols={options.length > 2} role="radiogroup" data-invalid={err || undefined}>
    {#each options as o}
      {@const on = get() === o.value}
      <button type="button" class="opt" class:on role="radio" aria-checked={on} onclick={() => set(o.value)}>
        <span class="box" aria-hidden="true"></span>{o.label}
      </button>
    {/each}
  </div>
{/snippet}

<div class="join">
  <header class="intro">
    <p class="eyebrow">Apply</p>
    <h1 class="lede">Tell us a bit about yourself. We review every application and reply <em>by email.</em></h1>
  </header>

  {#if status === 'done'}
    <div class="done">
      <p class="eyebrow">Done</p>
      <p class="lede">Application received.</p>
      <p class="sub">We'll review your application and reach out at {email.trim().toLowerCase()}.</p>
    </div>
  {:else}
    <form onsubmit={submit} novalidate>
      <Field n="01" q="Full name" id="full-name" err={show('fullName')}>
        <input id="full-name" name="fullName" type="text" bind:value={fullName} placeholder="First and last name" autocomplete="name" maxlength="200" required aria-invalid={!!show('fullName')} />
      </Field>

      <Field n="02" q="What is your UVA email?" id="email" err={show('email')}>
        <input id="email" type="email" bind:value={email} placeholder="abc1de@virginia.edu" autocomplete="email" inputmode="email" spellcheck="false" aria-invalid={!!show('email')} />
      </Field>

      <Field n="03" q="What year are you?" err={show('year')}>
        {@render choice(YEARS, () => year, (v) => (year = v), show('year'))}
      </Field>

      <Field n="04" q="Do you consider yourself to be technical?" err={show('technical')}>
        {@render choice(YES_NO, () => technical, (v) => (technical = v), show('technical'))}
      </Field>

      <Field n="05" q="Have you founded a company or built a product before?" err={show('founded')}>
        {@render choice(YES_NO, () => founded, (v) => (founded = v), show('founded'))}
        {#if founded}
          <input type="url" bind:value={website} placeholder="Link to it (optional)" autocomplete="url" inputmode="url" spellcheck="false" aria-label="Link to your company or product" />
        {/if}
      </Field>

      {#if ev}
        <Field n="06" q={rsvpQuestion(ev)} err={show('rsvp')}>
          <a class="card" href="/events/{ev.slug}">
            <img src={ev.img} alt="" width="56" height="56" />
            <span class="card-text">
              <span class="who">{ev.name}{#if ev.tag}{` (${ev.tag})`}{/if}</span>
              <span class="when">Founder Q&amp;A · {midDate(ev.date)}{ev.time ? ` · ${ev.time}` : ''}</span>
            </span>
            <span class="more" aria-hidden="true">→</span>
          </a>
          <div class="seg" role="radiogroup" data-invalid={show('rsvp') || undefined}>
            <button type="button" class:on={rsvp === true} role="radio" aria-checked={rsvp === true} onclick={() => (rsvp = true)}>Yes, I'm interested</button>
            <button type="button" class:on={rsvp === false} role="radio" aria-checked={rsvp === false} onclick={() => (rsvp = false)}>Can't make it</button>
          </div>
        </Field>
      {/if}

      <input class="hp" type="text" name="company" tabindex="-1" autocomplete="off" bind:value={hp} aria-hidden="true" />

      <div class="actions">
        <button type="submit" class="go" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Apply →'}
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
  /* same skeleton as /events: label, lede, then full-width rows under one rule */
  .join { display: grid; gap: var(--s5); }
  .intro .eyebrow { margin-bottom: var(--s4); }
  .lede { max-width: 30ch; }

  form { border-top: 1px solid var(--hair); }

  /* the RSVP card */
  .card {
    display: grid;
    grid-template-columns: 56px 1fr auto;
    align-items: center;
    gap: 18px;
    max-width: 560px;
    padding: 16px 18px 16px 16px;
    border: 1px solid var(--hair);
    transition: border-color 0.15s ease, background 0.15s ease;
  }
  .card:hover { border-color: var(--dim); background: rgba(242, 240, 234, 0.03); }
  .card img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
    filter: grayscale(1);
    background: #17171a;
  }
  .card-text { display: grid; gap: 4px; min-width: 0; }
  .who { font-size: 17px; color: var(--fg); }
  .when {
    font-family: var(--mono);
    font-size: 14px;
    letter-spacing: 0.02em;
    color: var(--muted);
  }
  .more { color: var(--dim); font-size: 18px; transition: color 0.15s ease, transform 0.15s ease; }
  .card:hover .more { color: var(--fg); transform: translateX(3px); }

  .seg {
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: 560px;
    border: 1px solid var(--hair);
  }
  .seg button {
    padding: 14px 16px;
    background: transparent;
    border: 0;
    color: var(--muted);
    font: inherit;
    font-size: 16px;
    cursor: pointer;
    transition: color 0.15s ease, background 0.15s ease;
  }
  .seg button + button { border-left: 1px solid var(--hair); }
  .seg button:hover { color: var(--fg); background: rgba(242, 240, 234, 0.04); }
  .seg button.on { color: var(--bg); background: var(--fg); }
  .seg button:focus-visible { outline: 1px solid var(--fg); outline-offset: -3px; }
  .seg[data-invalid] { border-color: #c98484; }

  input {
    width: 100%;
    max-width: 560px;
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
  input::placeholder { color: var(--muted); opacity: 1; }

  .opts { display: flex; flex-wrap: wrap; gap: 0 var(--s3); }
  .opts.cols {
    display: grid;
    grid-template-columns: repeat(3, max-content);
  }
  .opt {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    padding: 8px 0;
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

  .hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }

  /* indented to the question column: row padding + number column + gap, as in Field */
  .actions {
    display: grid;
    gap: var(--s2);
    padding: var(--s4) 8px 0 calc(8px + 4ch + 24px);
  }
  .err {
    font-family: var(--mono);
    font-size: 14px;
    color: #c98484;
  }
  .go {
    justify-self: start;
    font-family: var(--mono);
    font-size: 14px;
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

  .done { display: grid; gap: var(--s3); }
  .done .eyebrow { margin-bottom: var(--s2); }
  .sub {
    margin-top: var(--s3);
    max-width: 34ch;
    color: var(--soft);
    font-size: 16px;
    line-height: 1.55;
  }

  @media (max-width: 899px) {
    .join { gap: var(--s4); }
    .actions { padding: var(--s3) 4px 0 calc(4px + 4ch + 18px); }
  }
  @media (max-width: 599px) {
    .actions { padding-left: calc(4px + 3ch + 18px); }
    .card { grid-template-columns: 48px 1fr auto; gap: 14px; padding: 14px; }
    .card img { width: 48px; height: 48px; }
    .opts.cols { grid-template-columns: repeat(2, max-content); }
    .go { justify-self: stretch; text-align: center; }
  }
</style>
