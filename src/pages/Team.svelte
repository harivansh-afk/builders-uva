<script>
  import Team from '../lib/Team.svelte'
</script>

<div class="team">
  <Team />
  <p class="lede">
    A few beliefs we share :<br> the company you keep sets the expectations for <em>what you can achieve,</em><br>
    the world around you was built by people no different than yourself, so <em>you can just build things,</em><br>
    weird will always win, because <em>normal choices guarantee normal results,</em><br>
    if you fail fast and fail often, even when you don't win, <em>you can lose better.</em><br>
  </p>
</div>

<style>
  .team {
    display: grid;
    gap: var(--s5);
    width: min(560px, 100%);
  }
  .lede {
    max-width: none;
    font-size: clamp(19px, 1.6vw, 23px);
    line-height: 1.45;
    color: var(--soft);
  }
  .lede em { color: var(--fg); }
</style>
