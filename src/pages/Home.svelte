<script module>
  // The entrance plays the first time home is shown in a page load, not on
  // every return to it.
  let played = false
</script>

<script>
  import Ascii from '../lib/Ascii.svelte'
  import Logos from '../lib/Logos.svelte'
  import LogoTicker from '../lib/LogoTicker.svelte'


  // The entrance, in ms from load: the copy surfaces, the marks bloom out
  // from around it, the hands reach in from their corners and the light runs
  // along them as they land, then the words underline one by one.
  const first = !played
  played = true
  const LOGOS = first ? 250 : 0
  const HANDS = 1500
  const ENTER = first ? 2400 : 0
  // the slide eases out hard, so the hands read as landed well before it ends
  const LINES = HANDS + ENTER * 0.7

  // how far the hands sit from the centre (see createField)
  const SPLIT = [0.15, 0.2]
  let copy

</script>

<h1 class="sr-only">builders@uva</h1>

<!-- each hand on its own layer so it can come in from its own corner -->
<div class="backdrop" aria-hidden="true">
  <Ascii split={SPLIT} only={-1} from={[-1, 1]} enter={ENTER} delay={HANDS} />
  <Ascii split={SPLIT} only={1} from={[1, -1]} enter={ENTER} delay={HANDS} />
</div>

<section class="hero" class:entering={first} style:--lines="{LINES}ms">
  <Logos enter={LOGOS} split={SPLIT} avoid={() => copy} />
  <div class="pool" aria-hidden="true"></div>
  <div class="copy" bind:this={copy}>
    <p class="lede stress">
      <span class="hl">builders<span class="at">@</span>uva</span> is building a culture of <em style:--n={0}>independent creation</em> at <a class="ink" href="https://www.virginia.edu/" target="_blank" rel="noopener noreferrer">UVA</a>.
    </p>
    <p class="lede stress">
      We bring students together to <em style:--n={1}>work</em> on their own ideas, <em style:--n={2}>learn</em> from founders, and help each other go beyond their <em style:--n={3}>perceived limitations</em>.
    </p>
  </div>
  <LogoTicker enter={LOGOS} split={SPLIT} avoid={() => copy} />
</section>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    opacity: 0.55;
    pointer-events: none;
  }
  /* one screen: the paragraph sits dead centre, between the hands */
  .hero {
    position: relative;
    height: 100%;
    display: grid;
    place-items: center;
    padding: 0 var(--gutter);
    pointer-events: none;
  }
  /* a soft pool of dark behind the copy so it reads over the hands */
  .pool {
    position: absolute;
    left: 50%;
    top: 50%;
    width: min(1000px, 130vw);
    height: min(560px, 70%);
    translate: -50% -50%;
    background: radial-gradient(closest-side, rgba(10, 10, 11, 0.8), rgba(10, 10, 11, 0.4) 60%, transparent);
    pointer-events: none;
  }
  .copy {
    position: relative;
    display: grid;
    gap: 0.66em; /* scales with the type, about one line's leading */
    width: min(30ch, 100%);
    font-size: clamp(18px, 1.75vw, 27px);
    text-align: center;
    pointer-events: auto;
  }
  /* the copy surfaces first, a line at a time */
  .entering .lede { animation: surface 1.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .entering .lede + .lede { animation-delay: 180ms; }
  .entering .pool { animation: fade 1.2s ease both; }
  @keyframes fade { from { opacity: 0; } }
  @keyframes surface {
    from { opacity: 0; translate: 0 14px; filter: blur(6px); }
  }

  /* the underlines (see .stress) draw in one after another once the hands are in */
  .entering em { animation: underline 0.7s cubic-bezier(0.65, 0, 0.35, 1) both; animation-delay: calc(var(--lines) + var(--n) * 280ms); }
  @keyframes underline { from { background-size: 0% 1px; } }

  @media (prefers-reduced-motion: reduce) {
    .entering :is(.lede, .pool, em) { animation: none; }
  }
  .lede {
    max-width: none;
    font-size: 1em;
    line-height: 1.28;
    text-wrap: balance;
  }
</style>
