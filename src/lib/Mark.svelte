<script>
  let { size = 22 } = $props()
</script>

<!-- A square frame with its top-right corner brick still on the way in. -->
<svg viewBox="0 0 12 12" width={size} height={size} fill="currentColor" aria-hidden="true">
  <rect x="0" y="2" width="7" height="1" />
  <rect x="0" y="2" width="1" height="10" />
  <rect x="0" y="11" width="10" height="1" />
  <rect x="9" y="5" width="1" height="7" />
  <rect x="9" y="0" width="3" height="1" />
  <rect x="11" y="0" width="1" height="3" />
</svg>
