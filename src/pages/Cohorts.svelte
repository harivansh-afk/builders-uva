<h1 class="sr-only">Cohorts</h1>
<ul class="rows">
  <li class="row">
    <span class="name">build 001</span>
    <span class="soon">soon</span>
  </li>
</ul>

<style>
  /* laid out like a row on /events */
  .rows { list-style: none; padding: 0; }
  .row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 24px;
  }
  .name {
    padding: 10px 0;
    font-size: 25px;
    letter-spacing: -0.008em;
  }
  .soon { font-size: 20px; color: var(--muted); }

  @media (max-width: 599px) {
    .name { font-size: 22px; }
  }
</style>
