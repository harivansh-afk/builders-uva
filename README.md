# builders@uva

Site for builders@uva, built with Svelte 5 and Vite, deployed on Vercel. The home page is a 55/45 split: the mark rendered as live ASCII on the left with the UVA and Foundry logos beneath it, copy scrolling on the right in a single 600px column centred in its pane, with section rules running the full pane width; below 900px the panes stack, graphic first. Events and Join are full-width pages. A nav in the top-left (mark, Events, Join us) and a one-line footer (`src/lib/Footer.svelte`: copyright and a live Charlottesville clock) are on every page.

Vertical spacing comes from one scale in `src/app.css` (`--s2` to `--s7`); use those rather than ad hoc pixel values so sections keep the same rhythm.

```sh
bun install
bun run dev      # http://127.0.0.1:8797
bun run build    # static output in dist/
```

## Pages

- `/` is the home page: `src/pages/Home.svelte`. Copy lives in the `beliefs` and `founders` arrays at the top. A founder's `linkedin` URL renders an icon next to their name; leave it `null` to hide it.
- `/events` lists every Q&A, one row per event: `src/pages/Events.svelte`. Clicking a row opens `/events/<slug>` (`src/pages/Event.svelte`) with the transcript, or "Coming soon" until there is one. The headshot on the right of a row links to the guest's LinkedIn.
- `/join` is the membership form: `src/pages/Join.svelte`.

Routing is `src/lib/router.svelte.js`, a small history-API router. `vercel.json` rewrites every non-API path to `index.html` so deep links work; the dev server does that on its own.

## Adding an event

Edit `src/lib/events.js`. Each entry has a `slug`, `name`, `tag` (e.g. `YC W26`, shown after the name in parentheses), ISO `date`, `img`, `link`, and an optional `transcript`. Drop the headshot in `public/`. The row number is the array position, so append to the end.

The join form ends with an RSVP, "Can you make it Thu, Sep 10?", built from the next event on or after today. The yes/no is stored against that event's slug in `event_responses`, so adding next week's event is all it takes to change the question.

## Form backend

`api/join.js` is a Vercel serverless function. It validates with the same rules as the page (`src/lib/join.js`), then writes to Postgres:

- `members`, one row per UVA email, upserted on every submission.
- `event_responses`, one row per (email, event), storing the RSVP question alongside the yes/no answer.

The schema is `db/schema.sql`; the function applies it on first use, so a fresh database needs no manual setup. It reads `DATABASE_URL`. On Vercel that comes from the Neon Postgres integration (Storage tab on the project). Locally, put `DATABASE_URL=...` in `.env.local` and `bun run dev` serves `/api/join` through the same handler.

Only `@virginia.edu` addresses are accepted. A hidden honeypot field silently drops bot submissions.

## Assets

- `src/lib/field.js` is the particle field. The mark is the two hands from Michelangelo's Creation of Adam, run corner to corner across the pane with the fingertip gap at the centre. The hands ship level; the field is built for the pane's aspect and rotates them onto its diagonal, sized to overshoot the corners so the arms leave through the edges. Particles ride the outline and the shading inside breathes; both are rendered into a text buffer.
- `src/lib/hands.json` is the hands as data: a shading grid, the outline as polylines and the gap position, normalised to the bounding box. Generated from the Wikimedia Commons "Creation of Adam (Michelangelo) Detail" file, public domain, with the same mask as the TouchTips app icon.
- `src/lib/Ascii.svelte` mounts the field into a `<pre>` and scales it to fill its pane.
- `public/favicon.svg`, `public/favicon-16.png`, `public/favicon-32.png` and `public/apple-touch-icon.png` are the favicon: `b@` set in Berkeley Mono at weight 700, cut to outlines, dark on an off-white tile so it reads on light and dark browser chrome.
- `public/og.png` is the Open Graph image, 1200 by 630: the hands rendered as ASCII on the diagonal with the `b@` mark between the fingertips.
- `public/foundry.svg` is The Foundry nameplate. `public/uva.svg` is the University of Virginia wordmark, public domain via Wikimedia Commons, recoloured to off-white.
- `public/nathan.png` is a placeholder until a photo is dropped in. `public/hari.png` and `public/quan.png` are real.
