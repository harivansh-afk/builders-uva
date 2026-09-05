<script>
  import { YEARS, EMAIL_RE } from '../lib/join.js'
  import { nextEvent, rsvpQuestion, midDate } from '../lib/events.js'

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
  <div class="opts" class:cols={options.length > 2} role="radiogroup" data-invalid={err || undefined}>
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
        <div class="field rsvp">
          <p class="q"><span class="n">05</span>{rsvpQuestion(ev)}</p>
          <div class="indent">
            <a class="card" href="/events/{ev.slug}">
              <img src={ev.img} alt="" width="56" height="56" />
              <span class="card-text">
                <span class="who">{ev.name} ({ev.tag})</span>
                <span class="when">Founder Q&amp;A · {midDate(ev.date)}</span>
              </span>
              <span class="more" aria-hidden="true">→</span>
            </a>
            <div class="seg" role="radiogroup" data-invalid={show('rsvp') || undefined}>
              <button type="button" class:on={rsvp === true} role="radio" aria-checked={rsvp === true} onclick={() => (rsvp = true)}>Yes, I'll be there</button>
              <button type="button" class:on={rsvp === false} role="radio" aria-checked={rsvp === false} onclick={() => (rsvp = false)}>Can't make it</button>
            </div>
            {#if show('rsvp')}<p class="err">{show('rsvp')}</p>{/if}
          </div>
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
  .intro { position: sticky; top: var(--top); }
  .intro .eyebrow { margin-bottom: var(--s4); }
  .sub {
    margin-top: var(--s3);
    max-width: 34ch;
    color: var(--soft);
    font-size: 15px;
    line-height: 1.55;
  }

  form { display: grid; max-width: 580px; }
  .field {
    display: grid;
    gap: 12px;
    padding: 34px 0 38px;
    border-top: 1px solid var(--hair);
  }
  .field:first-child { padding-top: 0; border-top: 0; }
  .indent { display: grid; gap: 18px; margin-left: calc(3ch + 14px); }
  .indent .err { margin-left: 0; }

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

  /* the RSVP card */
  .card {
    display: grid;
    grid-template-columns: 56px 1fr auto;
    align-items: center;
    gap: 18px;
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
    font-size: 12px;
    letter-spacing: 0.02em;
    color: var(--muted);
  }
  .more { color: var(--dim); font-size: 18px; transition: color 0.15s ease, transform 0.15s ease; }
  .card:hover .more { color: var(--fg); transform: translateX(3px); }

  .seg {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: 1px solid var(--hair);
  }
  .seg button {
    padding: 14px 16px;
    background: transparent;
    border: 0;
    color: var(--muted);
    font: inherit;
    font-size: 15px;
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
    display: flex;
    flex-wrap: wrap;
    gap: 12px 36px;
    margin-left: calc(3ch + 14px);
  }
  .opts.cols {
    display: grid;
    grid-template-columns: repeat(3, max-content);
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
    padding-top: 6px;
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

  .done { display: grid; gap: var(--s3); }
  .done .eyebrow { margin-bottom: var(--s2); }

  @media (max-width: 899px) {
    .join { grid-template-columns: minmax(0, 1fr); gap: 48px; }
    .intro { position: static; }
    .field { padding: 28px 0 32px; }
    .q { font-size: 18px; }
  }
  @media (max-width: 599px) {
    .q { grid-template-columns: 1fr; gap: 6px; }
    input, .opts, .err, .actions, .indent { margin-left: 0; width: 100%; }
    .card { grid-template-columns: 48px 1fr auto; gap: 14px; padding: 14px; }
    .card img { width: 48px; height: 48px; }
    .opts.cols { grid-template-columns: repeat(2, max-content); }
    .go { justify-self: stretch; text-align: center; }
  }
</style>
