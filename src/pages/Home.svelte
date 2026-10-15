<h1 class="sr-only">builders@uva</h1>

<section class="hero">
  <div class="pool" aria-hidden="true"></div>
  <div class="copy">
    <p class="lede">
      <span class="hl">builders<span class="at">@</span>uva</span> is building a culture of <em>independent creation</em> at <a class="uva" href="https://www.virginia.edu/" target="_blank" rel="noopener noreferrer">UVA</a>.
    </p>
    <p class="lede">
      We bring students together to <em>work</em> on their own ideas, <em>learn</em> from founders, and help each other go beyond their <em>perceived limitations.</em>
    </p>
  </div>
</section>

<style>
  /* one screen: the paragraph sits dead centre, between the hands */
  .hero {
    position: relative;
    height: 100%;
    display: grid;
    place-items: center;
    padding: 0 var(--gutter);
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
    font-size: clamp(22px, 2.4vw, 36px);
    text-align: center;
  }
  .lede {
    max-width: none;
    font-size: 1em;
    line-height: 1.28;
    text-wrap: balance;
  }
  .uva {
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.15em;
  }
</style>
