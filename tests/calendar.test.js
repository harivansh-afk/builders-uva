import test from 'node:test'
import assert from 'node:assert/strict'
import { calendarLinks } from '../src/lib/calendar.js'

const event = { slug: 'test-speaker', name: 'Test Speaker', date: '2026-12-31' }
const contents = (links) => decodeURIComponent(links.icsHref.split(',')[1])

test('unknown times reserve only the event date, with an exclusive end across years', () => {
  const links = calendarLinks(event)
  const google = new URL(links.googleUrl).searchParams
  const ics = contents(links)
  assert.equal(links.allDay, true)
  assert.equal(google.get('dates'), '20261231/20270101')
  assert.equal(google.get('text'), 'builders@uva Q&A with Test Speaker')
  assert.match(google.get('details'), /Time is to be announced/)
  assert.match(google.get('details'), /https:\/\/www.uva.builders\/events\/test-speaker/)
  assert.match(ics, /DTSTART;VALUE=DATE:20261231\r\nDTEND;VALUE=DATE:20270101\r\n/)
  assert.match(ics, /UID:test-speaker@uva.builders\r\n/)
  assert.match(ics, /DTSTAMP:\d{8}T\d{6}Z\r\n/)
  assert.match(ics, /TRANSP:TRANSPARENT\r\n/)
})

test('confirmed times use their UTC offsets rather than the viewer time zone', () => {
  for (const [date, offset, expected] of [
    ['2026-07-02', '-04:00', '20260702T220000Z/20260702T230000Z'],
    ['2026-11-05', '-05:00', '20261105T230000Z/20261106T000000Z'],
  ]) {
    const links = calendarLinks({ ...event, date, startsAt: `${date}T18:00:00${offset}`, endsAt: `${date}T19:00:00${offset}`, location: 'The Foundry' })
    const google = new URL(links.googleUrl).searchParams
    const [start, end] = expected.split('/')
    assert.equal(links.allDay, false)
    assert.equal(google.get('dates'), expected)
    assert.equal(google.get('location'), 'The Foundry')
    assert.match(contents(links), new RegExp(`DTSTART:${start}\\r\\nDTEND:${end}\\r\\n`))
    assert.match(contents(links), /LOCATION:The Foundry\r\n/)
  }
})

test('a confirmed start with no end remains timed and does not invent a duration', () => {
  const links = calendarLinks({ ...event, date: '2026-11-05', startsAt: '2026-11-05T18:00:00-05:00', location: 'The Foundry' })
  const google = new URL(links.googleUrl).searchParams
  assert.equal(links.allDay, false)
  assert.equal(google.get('dates'), '20261105T230000Z/20261105T230000Z')
  assert.equal(google.get('location'), 'The Foundry')
  assert.match(contents(links), /DTSTART:20261105T230000Z\r\n/)
  assert.doesNotMatch(contents(links), /DTEND|DURATION|VALUE=DATE/)
  assert.match(google.get('details'), /End time to be announced/)
  assert.match(contents(links), /TRANSP:OPAQUE\r\n/)
})

test('calendar text cannot inject properties and folded Unicode lines stay within 75 bytes', () => {
  const links = calendarLinks({ ...event, name: 'Zoë, 李; \\ Test', description: '李'.repeat(100) + '\r\nLOCATION:Injected' })
  const ics = contents(links)
  for (const line of ics.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75)
  assert.equal(ics.replaceAll('\r\n ', '').includes('SUMMARY:builders@uva Q&A with Zoë\\, 李\\; \\\\ Test\r\n'), true)
  assert.equal(ics.includes('\r\nLOCATION:Injected'), false)
  assert.ok(ics.endsWith('END:VEVENT\r\nEND:VCALENDAR\r\n'))
})
