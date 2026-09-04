<script>
  import { YEARS, EMAIL_RE } from '../lib/join.js'
  import { nextEvent, shortDate } from '../lib/events.js'

  const ev = nextEvent()

  let email = $state('')
  let year = $state('')
  let technical = $state(null)
  let founded = $state(null)
  let website = $state('')
  let eventAnswer = $state('')
  let hp = $state('') // honeypot; bots fill it, people never see it

  let status = $state('idle') // idle | sending | done | error
  let error = $state('')

  const ready = $derived(EMAIL_RE.test(email.trim()) && year && technical !== null && founded !== null)

  async function submit(e) {
    e.preventDefault()
    if (!ready || status === 'sending') return
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
          eventQuestion: ev?.question ?? null,
          eventAnswer: eventAnswer.trim(),
          hp,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || `Request failed (${res.status}).`)
      status = 'done'
    } catch (err) {
      status = 'error'
      error = err.message || 'Something went wrong.'
    }
  }
</script>

<section class="block hero">
  <h2 class="eyebrow">Join us</h2>
  <p class="lede">Membership takes a minute. <em>Tell us who you are.</em></p>
</section>

{#if status === 'done'}
  <section class="block">
    <p class="lede">You're in. <em>See you Thursday.</em></p>
    <p class="note">We'll reach out at {email.trim().toLowerCase()}.</p>
  </section>
{:else}
  <form class="block form" onsubmit={submit} novalidate>
    <label class="field">
      <span class="q">What is your UVA email?</span>
      <input type="email" name="email" bind:value={email} placeholder="abc1de@virginia.edu" autocomplete="email" required inputmode="email" spellcheck="false" />
    </label>

    <fieldset class="field">
      <legend class="q">What year are you?</legend>
      <div class="opts">
        {#each YEARS as y}
          <label class="opt" class:on={year === y.value}>
            <input type="radio" name="year" value={y.value} bind:group={year} />
            <span>{y.label}</span>
          </label>
        {/each}
      </div>
    </fieldset>

    <fieldset class="field">
      <legend class="q">Do you consider yourself to be technical?</legend>
      <div class="opts">
        <label class="opt" class:on={technical === true}><input type="radio" name="technical" value={true} bind:group={technical} /><span>Yes</span></label>
        <label class="opt" class:on={technical === false}><input type="radio" name="technical" value={false} bind:group={technical} /><span>No</span></label>
      </div>
    </fieldset>

    <fieldset class="field">
      <legend class="q">Have you founded a company or built a product before?</legend>
      <div class="opts">
        <label class="opt" class:on={founded === true}><input type="radio" name="founded" value={true} bind:group={founded} /><span>Yes</span></label>
        <label class="opt" class:on={founded === false}><input type="radio" name="founded" value={false} bind:group={founded} /><span>No</span></label>
      </div>
      {#if founded}
        <input class="sub" type="url" name="website" bind:value={website} placeholder="Link to it" autocomplete="url" inputmode="url" spellcheck="false" />
      {/if}
    </fieldset>

    {#if ev}
      <label class="field">
        <span class="q">
          <span class="ctx">{ev.name}, {ev.tag} · {shortDate(ev.date)}</span>
          {ev.question}
        </span>
        <textarea name="eventAnswer" bind:value={eventAnswer} rows="3" maxlength="2000"></textarea>
      </label>
    {/if}

    <input class="hp" type="text" name="company" tabindex="-1" autocomplete="off" bind:value={hp} aria-hidden="true" />

    <div class="actions">
      <button type="submit" disabled={!ready || status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Join'}
      </button>
      {#if status === 'error'}
        <p class="err" role="alert">{error}</p>
      {/if}
    </div>
  </form>
{/if}

<style>
  .lede em {
    font-family: var(--serif);
    font-style: italic;
    font-size: 1.12em;
    line-height: 1;
  }
  .note {
    margin-top: 16px;
    font-family: var(--mono);
    font-size: 12px;
    color: var(--muted);
  }

  .form {
    display: grid;
    gap: 34px;
    max-width: 44ch;
  }
  .field {
    display: grid;
    gap: 12px;
    margin: 0;
    padding: 0;
    border: 0;
    min-width: 0;
  }
  legend { padding: 0; }
  .q {
    display: grid;
    gap: 6px;
    font-size: 17px;
    line-height: 1.35;
    letter-spacing: -0.005em;
  }
  .ctx {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
  }

  input[type='email'], input[type='url'], textarea {
    width: 100%;
    background: transparent;
    color: var(--fg);
    border: 0;
    border-bottom: 1px solid var(--hair);
    border-radius: 0;
    padding: 8px 0;
    font: inherit;
    font-family: var(--mono);
    font-size: 15px;
    outline: none;
    transition: border-color 0.15s ease;
  }
  textarea { resize: vertical; line-height: 1.5; }
  input:focus, textarea:focus { border-bottom-color: var(--fg); }
  input::placeholder, textarea::placeholder { color: var(--dim); }
  .sub { margin-top: 4px; }

  .opts { display: flex; flex-wrap: wrap; gap: 8px; }
  .opt {
    position: relative;
    font-family: var(--mono);
    font-size: 13px;
    padding: 8px 14px;
    border: 1px solid var(--hair);
    color: var(--muted);
    cursor: pointer;
    user-select: none;
    transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
  }
  .opt:hover { color: var(--fg); border-color: var(--dim); }
  .opt.on { color: var(--bg); background: var(--fg); border-color: var(--fg); }
  .opt input {
    position: absolute;
    inset: 0;
    opacity: 0;
    margin: 0;
    cursor: pointer;
  }
  .opt:has(input:focus-visible) { outline: 1px solid var(--fg); outline-offset: 3px; }

  .hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }

  .actions { display: grid; gap: 14px; }
  button {
    justify-self: start;
    font-family: var(--mono);
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 12px 22px;
    background: var(--fg);
    color: var(--bg);
    border: 1px solid var(--fg);
    cursor: pointer;
    transition: opacity 0.15s ease;
  }
  button:hover { opacity: 0.88; }
  button:disabled { opacity: 0.35; cursor: default; }
  button:focus-visible { outline: 1px solid var(--fg); outline-offset: 4px; }
  .err {
    font-family: var(--mono);
    font-size: 12px;
    color: #e0a0a0;
  }

  /* iOS zooms into inputs smaller than 16px */
  @media (max-width: 899px) {
    input[type='email'], input[type='url'], textarea { font-size: 16px; }
  }
</style>
