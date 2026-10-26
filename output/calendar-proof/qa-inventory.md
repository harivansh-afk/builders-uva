# Calendar QA inventory

Baseline: origin/main 939d4ec. Test date: October 26, 2026 (America/New_York).

| Claim / state | Check | Evidence |
| --- | --- | --- |
| Calendar choices appear only after saved registration | Use the visible form; check real API response and a separate PostgreSQL query | network.json, database.json, success screenshots |
| Google Calendar has the right title, day, description and location | Click link, inspect outgoing request; attempt provider page | google-calendar.json, provider screenshot if accessible |
| Apple / Outlook downloads a valid event | Click download, parse actual downloaded bytes with independent ical.js parser | .ics files, parsed-calendar.json |
| Confirmed time and location match the user's correction | November events start at 6 PM Eastern at The Foundry; no invented end time | parsed-calendar.json and screenshots |
| Calendar icon matches the site | 20px monochrome outline, aligned with the heading on desktop and phone | success screenshots |
| Multiple events stay separate | Register for all three upcoming events; compare downloaded UID, title, dates and DB rows | parsed-calendar.json, database.json |
| Errors do not show calendar success | Non-UVA email; real API/database error followed by retry | error screenshot and network.json |
| Keyboard and mobile layout work | Keyboard navigation; register and download at 375px; inspect bounds | mobile screenshot and browser-checks.json |
| Protocol edge cases | Time zones in summer/winter, Unicode escaping/folding, year rollover | node --test log |
| Production frontend compiles | vite build | build.log |

Exploratory checks: duplicate registration, browser Back after event details, closed and missing event routes. No production database, email, or personal calendar writes are used.
