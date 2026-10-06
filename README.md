# builders@uva

Site for builders@uva, built with Svelte 5 and Vite, deployed on Vercel. The home page is a 55/45 split: the mark rendered as live ASCII on the left with the UVA and Foundry logos beneath it, copy scrolling on the right in a single 600px column centred in its pane, with section rules running the full pane width; below 900px the panes stack, graphic first. Events and Apply are full-width pages. A nav in the top-left (mark, Events, Apply) and a one-line footer (`src/lib/Footer.svelte`: copyright and a live Charlottesville clock) are on every page.

Vertical spacing comes from one scale in `src/app.css` (`--s2` to `--s7`); use those rather than ad hoc pixel values so sections keep the same rhythm.

The header’s top-right “Non-affiliation policy” button opens the full statement. Click outside it or press Escape to close. Logo assets remain in `public/`, but are not displayed on the site.

```sh
bun install
bun run dev      # http://127.0.0.1:8797
bun run build    # static output in dist/
```

## Pages

- `/` is the home page: `src/pages/Home.svelte`. Copy lives in the `beliefs` and `founders` arrays at the top. A founder's `linkedin` URL renders an icon next to their name; leave it `null` to hide it.
- `/events` lists every Q&A, one row per event: `src/pages/Events.svelte`. Clicking a row opens `/events/<slug>` (`src/pages/Event.svelte`) with the transcript, or "Coming soon" until there is one. The headshot on the right of a row links to the guest's LinkedIn.
- `/apply` is the application form (`/join` remains an alias): `src/pages/Join.svelte`.

Routing is `src/lib/router.svelte.js`, a small history-API router. `vercel.json` rewrites every non-API path to `index.html` so deep links work; the dev server does that on its own.

## Adding an event

Edit `src/lib/events.js`. Each entry has a `slug`, `name`, `tag` (e.g. `YC W26`, shown after the name in parentheses), ISO `date`, `img`, `link`, and an optional `transcript`. Use `linkLabel` for links other than LinkedIn, and `description` for upcoming event details. Set `imgType: 'logo'` and `imgAlt` for a company logo that must fit without cropping. Meeting notes go in `recap` as sections with a `title` and `paragraphs`; these display as a recap rather than a verbatim transcript. A recording goes in `video` as `{ youtube: '<id>', title }`; with photos it sits on the left with the photos stacked beside it, and on its own it runs full width. Photos go in `photos` (`file`, `alt`, `width`, `height`, and `fit: 'contain'` for a diagram that must not be cropped) with `<file>-600.webp`, `<file>-1200.webp` and `<file>-clean.jpg` in `public/events/<slug>/`; without a video, a landscape lead photo runs full width with the rest beneath it, a portrait one sits beside them, and two photos sit side by side. Drop the headshot in `public/`. The row number is the array position, so append to the end.

Upcoming rows have a Register button linking to `/events/<slug>/register`. Registration closes on its own the day after the event; set `registration: 'closed'` to close it early or to mark a past event explicitly. The register page and `/api/register` both refuse closed events. Registration asks for full name, UVA email, and a required question for the speaker (up to 2,000 characters). Questions appear in the admin Event registrations view; older registrations show no question. The application form is separate and does not collect RSVPs.

## Form backend

`api/join.js` is a Vercel serverless function. It validates with the same rules as the page (`src/lib/join.js`), then writes to Postgres:

- `members`, one row per UVA email, including the required full name and membership status, upserted on every submission. New applications are pending; submissions cannot change an existing decision. Existing members have a null `full_name` until they resubmit.
- `event_responses`, one row per (email, event), storing the registrant name and RSVP independently of membership. `/api/register` upserts these rows without creating or changing an application. Existing yes/no responses are preserved.

The schema is `db/schema.sql`; the function applies it on first use, so a fresh database needs no manual setup. It reads `DATABASE_URL`. On Vercel that comes from the Neon Postgres integration (Storage tab on the project). Locally, put `DATABASE_URL=...` in `.env.local` and `bun run dev` serves `/api/join` through the same handler.

Only `@virginia.edu` addresses are accepted. A hidden honeypot field silently drops bot submissions.

## Assets

- `src/lib/field.js` is the particle field. The mark is the two hands from Michelangelo's Creation of Adam, run corner to corner across the pane with the fingertip gap at the centre. The hands ship level; the field is built for the pane's aspect and rotates them onto its diagonal, sized to overshoot the corners so the arms leave through the edges. Particles ride the outline and the shading inside breathes; both are rendered into a text buffer.
- `src/lib/hands.json` is the hands as data: a shading grid, the outline as polylines and the gap position, normalised to the bounding box. Generated from the Wikimedia Commons "Creation of Adam (Michelangelo) Detail" file, public domain, with the same mask as the TouchTips app icon.
- `src/lib/Ascii.svelte` mounts the field into a `<pre>` and scales it to fill its pane.
- `public/favicon.svg`, `public/favicon-16.png`, `public/favicon-32.png` and `public/apple-touch-icon.png` are the favicon: `harivan.sh/icon.svg` with only `h` replaced by `b`, preserving its live text and font fallback stack: a 100×100 canvas, 60px type, fixed character centers, a −12° slant on the letter, and 8px corners. The SVG switches colors with the browser’s light/dark preference; PNG fallbacks are browser-rendered at their target sizes with the light palette.
- `public/mark.svg` is the same live-text `*b` without a background, used in the navigation and social preview.
- `public/og.png` is the Open Graph image, 1200 by 630: the hands rendered as ASCII on the diagonal with the `*b` mark between the fingertips.
- `public/foundry.svg` is The Foundry nameplate. `public/uva.svg` is the University of Virginia wordmark, public domain via Wikimedia Commons, recoloured to off-white.
- `public/nathan.png` is a placeholder until a photo is dropped in. `public/hari.png` and `public/quan.png` are real.

## Admin dashboard

`/admin` shows searchable and sortable Applications, Members, and Event registrations
views. Applications defaults to pending, with a declined filter and Approve/Decline controls. Members lists only approved people. Reviews do not send email; follow up manually. Views have 50 rows per page and event/RSVP filters. Times display in Eastern
Time. Google sign-in uses Auth.js; only verified Google emails in
`server/auth.js`'s `adminEmails` set can enter. This allowlist is checked again on
every session read, so removing an email takes effect after deployment even for
an existing session. Sessions expire after eight hours of inactivity. Sign-out
clears the browser session. Membership in `members` does not grant admin access.

The `/api/admin` endpoint checks the session before querying Postgres and sends
`private, no-store` responses. Its connection uses a separate Postgres role with
SELECT access to `members` and `event_responses` and UPDATE access only to `members.status` and `members.updated_at`; it never runs schema setup. PATCH decisions also require the exact configured Origin and JSON. Concurrent decisions return a conflict instead of overwriting each other.
`db/admin-role.sql` records the one-time role grants. Set a randomly generated
password separately, and use the correct database name if it is not `neondb`.

Production environment variables (Vercel):

- `AUTH_URL=https://www.uva.builders`
- `AUTH_SECRET`: a cryptographically random session secret of at least 32 bytes.
- `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`: the Google Web OAuth client.
- `ADMIN_DATABASE_URL`: the connection URL for `builders_admin_reader`.

Google's authorized redirect URI is
`https://www.uva.builders/api/auth/callback/google`. The current client lives in the
existing `hari` Google Cloud project, whose consent branding is shared with its
other clients. Only basic identity scopes are requested.

For local development, put these variables in `.env.local`, set `AUTH_URL` to
`http://localhost:8797`, and register
`http://localhost:8797/api/auth/callback/google` on a development OAuth client.
Production secrets are deliberately scoped to production, not preview builds.
The Vite development server handles the same API functions as Vercel.

Run `bun run test` for authorization, session, CSRF and query-validation tests;
`bun run build` checks the production frontend build. Live acceptance also needs
a Google sign-in, successful table loads, and sign-out followed by an API 401.

## Application migration

Before deploying, run `db/schema.sql` and then `db/application-review-role.sql` as the database owner in one transaction. Existing signups become approved once; the default for new rows is pending. Re-running the schema does not change decisions. The second script grants the existing dashboard role only the review-column updates and disables its transaction read-only default. Event pages remain public.

## Event registration migration

Before deploying this change, run `db/schema.sql` as the database owner. It adds names to event responses, copies names from existing membership records, and removes the membership foreign key. The existing dashboard SELECT grant covers the new column. The migration is repeatable; existing registrations and application decisions are preserved.
