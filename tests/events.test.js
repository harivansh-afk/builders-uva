import test from 'node:test'
import assert from 'node:assert/strict'
import { events, nextEvent } from '../src/lib/events.js'
import { validate } from '../src/lib/join.js'

test('RSVP event remains available on its date and disappears after the final event', () => {
  const last = events[events.length - 1]
  const date = new Date(`${last.date}T12:00:00Z`)
  assert.equal(nextEvent(date)?.date, last.date)
  date.setUTCDate(date.getUTCDate() + 1)
  assert.equal(nextEvent(date), undefined)
})

test('applications are valid without an event RSVP', () => {
  const result = validate({
    fullName: 'Test Student',
    email: 'test@virginia.edu',
    year: 'fourth',
    technical: true,
    founded: false,
    website: '',
    eventSlug: null,
    eventQuestion: null,
    eventAnswer: '',
  })
  assert.equal(result.ok, true)
  assert.equal(result.data.eventSlug, undefined)
  assert.equal(result.data.eventQuestion, undefined)
  assert.equal(result.data.eventAnswer, undefined)
})
