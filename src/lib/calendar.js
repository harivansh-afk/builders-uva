const compactDate = (date) => date.replaceAll('-', '')
const utcDate = (date) => new Date(date).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
const escapeText = (text) => text.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/[,;]/g, '\\$&')

// RFC 5545 limits content lines to 75 UTF-8 bytes, including continuation spaces.
function foldLine(line) {
  let result = ''
  let bytes = 0
  for (const char of line) {
    const size = new TextEncoder().encode(char).length
    if (bytes + size > 75) { result += '\r\n '; bytes = 1 }
    result += char
    bytes += size
  }
  return result
}

export function calendarLinks(event) {
  const allDay = !event.startsAt
  const nextDay = new Date(`${event.date}T00:00:00Z`)
  nextDay.setUTCDate(nextDay.getUTCDate() + 1)
  const start = allDay ? compactDate(event.date) : utcDate(event.startsAt)
  const end = allDay ? compactDate(nextDay.toISOString().slice(0, 10)) : event.endsAt ? utcDate(event.endsAt) : null
  const title = `builders@uva Q&A with ${event.name}`
  const url = `https://www.uva.builders/events/${event.slug}`
  const note = allDay ? 'Date reminder only. Time is to be announced. Check the event page for updates.' : !end ? 'End time to be announced.' : ''
  const description = [note, event.description, url].filter(Boolean).join('\n\n')
  const location = event.location || 'Location to be announced. Check the event page for updates.'
  const googleUrl = `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: 'TEMPLATE', text: title, dates: `${start}/${end || start}`, details: description, location, ctz: 'America/New_York',
  })}`
  const dateType = allDay ? ';VALUE=DATE' : ''
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//builders@uva//Events//EN', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT', `UID:${event.slug}@uva.builders`, `DTSTAMP:${utcDate(new Date())}`,
    `DTSTART${dateType}:${start}`, ...(end ? [`DTEND${dateType}:${end}`] : []),
    `SUMMARY:${escapeText(title)}`, `DESCRIPTION:${escapeText(description)}`,
    `LOCATION:${escapeText(location)}`, `URL:${url}`, `TRANSP:${allDay ? 'TRANSPARENT' : 'OPAQUE'}`,
    'END:VEVENT', 'END:VCALENDAR', '',
  ].map(foldLine).join('\r\n')
  return { googleUrl, icsHref: `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}` }
}
