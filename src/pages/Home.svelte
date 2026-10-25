<script module>
  // The entrance plays the first time home is shown in a page load, not on
  // every return to it.
  let played = false
</script>

<script>
  import Ascii from '../lib/Ascii.svelte'

  // The line surfaces first, then the hands reach in from their corners.
  const first = !played
  played = true
  const HANDS = 600
  const ENTER = first ? 2400 : 0
  // the slide eases out hard, so the hands read as landed well before it ends
  const LINE = HANDS + ENTER * 0.7

  // how far the hands sit from the centre (see createField), by the pane's
  // shape. A tall pane runs the hands near vertical, where a wide gap pushes
  // them out into the faded corners, so the gap closes as the pane narrows.
  const SPLIT = (aspect) => {
    const t = Math.min(1, Math.max(0, (aspect - 0.6) / 0.3))
    return [0.08 * t, 0.02 + 0.1 * t]
  }
</script>

<h1 class="sr-only">builders@uva</h1>

<!-- each hand on its own layer so it can come in from its own corner -->
<div class="backdrop" aria-hidden="true">
  <Ascii split={SPLIT} only={-1} from={[-1, 1]} enter={ENTER} delay={HANDS} />
  <Ascii split={SPLIT} only={1} from={[1, -1]} enter={ENTER} delay={HANDS} />
</div>

<div class="pool" aria-hidden="true"></div>
<p class="line" class:entering={first} style:--line="{LINE}ms">a culture of <em>independent</em> creation</p>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    opacity: 0.55;
    pointer-events: none;
  }
  /* a soft pool of dark behind the line so it reads over the hands */
  .pool {
    position: fixed;
    left: 50%;
    top: 50%;
    width: min(760px, 120vw);
    height: min(320px, 50%);
    translate: -50% -50%;
    background: radial-gradient(closest-side, rgba(10, 10, 11, 0.85), rgba(10, 10, 11, 0.4) 60%, transparent);
    pointer-events: none;
  }
  /* centred on the window, where the gap between the fingertips is, rather
     than on the space above the footer */
  .line {
    position: fixed;
    left: 50%;
    top: 50%;
    translate: -50% -50%;
    width: min(100% - 2 * var(--gutter), 40ch);
    font-size: clamp(22px, 1.82vw, 27px);
    letter-spacing: -0.005em;
    color: var(--soft);
    text-align: center;
    text-wrap: balance;
  }
  .entering { animation: surface 1.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
  @keyframes surface { from { opacity: 0; filter: blur(4px); } }
  /* the rule sits just under the baseline, and draws in once the hands land */
  em {
    font-style: normal;
    background: linear-gradient(currentColor, currentColor) 0 calc(100% - 0.08em) / 100% 1px no-repeat;
  }
  .entering em { animation: underline 0.7s cubic-bezier(0.65, 0, 0.35, 1) var(--line) both; }
  @keyframes underline { from { background-size: 0% 1px; } }
  @media (prefers-reduced-motion: reduce) { .entering, .entering em { animation: none; } }
</style>
