// Every event the club has hosted or will host. Newest last; the row number
// on the events page is the array index + 1.
//
// The join form ends with an RSVP for the next upcoming event (see nextEvent
// and rsvpQuestion). The yes/no lands in event_responses keyed by `slug`.

export const events = [
  {
    slug: 'quan-huynh',
    name: 'Quan Huynh',
    tag: 'YC W26',
    date: '2026-09-10',
    img: '/quan.png',
    link: 'https://www.linkedin.com/in/quanmhuynh/',
    transcript: null,
  },
]

export const eventBySlug = (slug) => events.find((e) => e.slug === slug)

// Next event on or after today (local date), else the most recent one.
export function nextEvent(today = new Date()) {
  const iso = today.toISOString().slice(0, 10)
  return events.find((e) => e.date >= iso) ?? events[events.length - 1]
}

const fmt = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })
const fmtLong = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
export const shortDate = (iso) => fmt.format(new Date(iso + 'T00:00:00Z'))
export const longDate = (iso) => fmtLong.format(new Date(iso + 'T00:00:00Z'))

const fmtMid = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })
export const midDate = (iso) => fmtMid.format(new Date(iso + 'T00:00:00Z'))
export const rsvpQuestion = (e) => `Can you make it ${midDate(e.date)}?`
