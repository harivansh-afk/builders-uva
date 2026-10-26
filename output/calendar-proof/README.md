# Calendar verification

Tested October 26, 2026. Fresh clone of `main` at `939d4ec5bdbf4c45b37f2f4e2b7acd87cc55a5d2`. Work branch: `feat/add-to-calendar`.

## Results

- Real browser registration passed for Alex Becker (November 5), Andrew Schoka (November 12), and Alex Oliver (November 19).
- The real `/api/register` handler returned HTTP 200 and wrote each registration to an isolated PostgreSQL 18.4 database. No success response or database write was mocked. No production database was used.
- The browser downloaded each `.ics` file by clicking the visible link. Independent parser `ical.js` 2.2.1 confirmed each speaker, unique event UID, timed start at 23:00 UTC (6 PM Eastern), and location `The Foundry`. No end time was supplied, so the export has no duration. Registration data is absent from the downloaded files.
- Calendar controls were absent before submission, after an invalid email, after a real database error, and on closed/missing event routes. A retry succeeded after the local database table was restored.
- Keyboard Tab/Enter downloaded the file. A duplicate registration updated the existing row. Event details and browser Back worked.
- Desktop (1440 × 1000) and phone (375 × 812) screenshots were inspected. No horizontal overflow, clipped calendar controls, or browser script errors were found.
- All 25 automated tests passed. The production frontend build passed.

The calendar export uses UTF-8 content-line folding, escaped text, and exclusive all-day end dates from [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545).

## Evidence

- `02-registration-success-desktop.png` and `04-registration-success-mobile.png`: visible confirmation and calendar links.
- `01-before-registration.png` and `03-server-error.png`: calendar options remain hidden before a saved registration.
- `network.json`: real HTTP responses, including the controlled failure and retry.
- `database.json`: separate database query and engine version.
- `parsed-calendar.json` and the three `.ics` files: actual browser downloads and independent parsing results.
- `google-calendar.json`: outgoing Google link and decoded event fields.
- `browser-checks.json`: keyboard, error, navigation, and viewport checks.
- `tests.log`, `build.log`: complete automated check output.
- `reproduction.log` and `reproduced/`: results from a second executable browser run. Each run uses a new test email, so old database rows cannot satisfy its save checks.

## Repeat the main browser checks

Use the project root as the working directory. If the local test server and database are already running:

```sh
QA_DEPENDENCIES=/tmp/builders-calendar-qa \
CALENDAR_QA_DATABASE_URL=postgres://calendar_qa:local-calendar-test@127.0.0.1:55439/calendar_qa \
node output/calendar-proof/reproduce.mjs
```

For a new local session, install the separate QA dependencies first:

```sh
npm install --prefix /tmp/builders-calendar-qa playwright ical.js embedded-postgres
# On this Apple Silicon Mac, if npm skips the package's postinstall script:
node /tmp/builders-calendar-qa/node_modules/@embedded-postgres/darwin-arm64/scripts/hydrate-symlinks.js
/tmp/builders-calendar-qa/node_modules/.bin/playwright install chromium
QA_DEPENDENCIES=/tmp/builders-calendar-qa node output/calendar-proof/start-db.mjs
```

In a second terminal, start the app with the same local test database:

```sh
DATABASE_URL=postgres://calendar_qa:local-calendar-test@127.0.0.1:55439/calendar_qa bun run dev -- --port 8798
```

Then run the browser script in a third terminal. The script checks that both URLs use `127.0.0.1` and the database is named `calendar_qa`.

## Limits

This verifies the local registration and calendar export flow. Google Calendar was signed out and redirected to its public product page. Its link fields were verified; saving in a signed-in Google account was not tested. Apple Calendar and Outlook application imports were not tested; the actual downloaded files passed an independent parser. No production deployment was tested.

The user confirmed that all three upcoming events start at 6 PM at The Foundry. The start times use Eastern Time, the site's local time zone. The end time is pending. Saved entries do not update automatically when event details change.
