# builders@uva

Site for builders@uva, built with Svelte 5 and Vite, deployed on Vercel. Three pages share one shell: the mark rendered as live ASCII on the left with the UVA and Foundry logos beneath it, and the page content scrolling on the right. Below 900px the panes stack, graphic first, and the whole page scrolls.

```sh
bun install
bun run dev      # http://127.0.0.1:8797
bun run build    # static output in dist/
```

## Pages

- `/` is the home page: `src/pages/Home.svelte`. Copy lives in the `beliefs` and `founders` arrays at the top.
- `/events` lists every Q&A, one row per event: `src/pages/Events.svelte`. Clicking a row opens `/events/<slug>` (`src/pages/Event.svelte`) with the transcript, or "Coming soon" until there is one. The headshot on the right of a row links to the guest's LinkedIn.
- `/join` is the membership form: `src/pages/Join.svelte`.

Routing is `src/lib/router.svelte.js`, a small history-API router. `vercel.json` rewrites every non-API path to `index.html` so deep links work; the dev server does that on its own.

## Adding an event

Edit `src/lib/events.js`. Each entry has a `slug`, `name`, `tag` (e.g. `YC W26`), ISO `date`, `img`, `link`, a `question`, and an optional `transcript`. Drop the headshot in `public/`. The row number is the array position, so append to the end.

`question` is the per-event prompt on the join form. The form shows the question of the next event on or after today, and the answer is stored against that event's slug, so changing the question each week is one line in this file and a deploy.

## Form backend

`api/join.js` is a Vercel serverless function. It validates with the same rules as the page (`src/lib/join.js`), then writes to Postgres:

- `members`, one row per UVA email, upserted on every submission.
- `event_responses`, one row per (email, event), storing the question alongside the answer.

The schema is `db/schema.sql`; the function applies it on first use, so a fresh database needs no manual setup. It reads `DATABASE_URL`. On Vercel that comes from the Neon Postgres integration (Storage tab on the project). Locally, put `DATABASE_URL=...` in `.env.local` and `bun run dev` serves `/api/join` through the same handler.

Only `@virginia.edu` addresses are accepted. A hidden honeypot field silently drops bot submissions.

## Assets

- `src/lib/field.js` is the particle field. Particles ride the strokes of the mark and are rendered into a text buffer.
- `src/lib/Ascii.svelte` mounts the field into a `<pre>` and scales it to fill its pane.
- `src/lib/Mark.svelte` is the logo mark, also the home button in the top-left nav. `public/mark.svg` is the same mark for the favicon.
- `public/foundry.svg` is The Foundry nameplate. `public/uva.svg` is the University of Virginia wordmark, public domain via Wikimedia Commons, recoloured to off-white.
- `public/nathan.png` is a placeholder until a photo is dropped in. `public/hari.png` and `public/quan.png` are real.
