# builders@uva

Site for builders@uva, built with Svelte 5 and Vite, deployed on Vercel. 

After a successful event registration, the confirmation offers Google Calendar and an `.ics` download for Apple Calendar or Outlook. Events without confirmed times use a one-day date reminder and say that the time is to be announced.

To export a timed event, set `startsAt` to an ISO timestamp with an explicit UTC offset (for example, `2026-11-05T18:00:00-05:00`) in `src/lib/events.js`. Set `endsAt` when confirmed; otherwise the calendar entry has no duration and notes that the end time is pending. Set `location` when confirmed. The three upcoming November events start at 6 PM Eastern at The Foundry. Calendar entries include the public event URL and no registration details. Saved entries do not update automatically.
