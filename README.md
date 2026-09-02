# builders@uva

Single-page site for builders@uva, built with Svelte 5 and Vite. No backend.

Layout is a fixed 1:1 split. The left pane scrolls on its own and holds the copy and founders. The right pane holds the mark rendered as live ASCII, with the UVA and Foundry logos in its corner.

```sh
bun install
bun run dev      # http://127.0.0.1:8797
bun run build    # static output in dist/
```

- `src/App.svelte` is the page. Copy lives in the `beliefs` and `founders` arrays at the top.
- `src/lib/field.js` is the particle field. Particles ride the strokes of the mark and are rendered into a text buffer.
- `src/lib/Ascii.svelte` mounts the field into a `<pre>` and scales it to fill its pane.
- `src/lib/Mark.svelte` is the logo mark: a square frame with its corner brick still on the way in. `public/mark.svg` is the same mark for the favicon.
- `public/foundry.svg` is The Foundry nameplate. `public/uva.svg` is the University of Virginia wordmark, public domain via Wikimedia Commons, recoloured to off-white.
- `public/nathan.png` is a placeholder until a photo is dropped in. `public/hari.png` is real.
