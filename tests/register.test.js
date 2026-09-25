import test from 'node:test'
import assert from 'node:assert/strict'
import pg from 'pg'
import { validateRegistration } from '../src/lib/register.js'
import { eventBySlug, registrationOpen } from '../src/lib/events.js'
import { queryOptions } from '../server/admin-data.js'
import handler from '../api/register.js'

const body = { fullName: 'Test Student', email: 'TEST@virginia.edu', eventSlug: 'dan-hall', speakerQuestion: 'How did you find your first customer?' }
const today = new Date('2026-09-13T12:00:00Z')
const response = () => ({ code: 200, setHeader() {}, status(code) { this.code = code; return this }, json(body) { this.body = body; return this } })

test('registration requires identity, a speaker question, and a known upcoming event', () => {
  assert.deepEqual(validateRegistration(body, today).data, { ...body, email: 'test@virginia.edu' })
  for (const change of [{ fullName: '' }, { email: 'test@gmail.com' }, { eventSlug: 'missing' }, { eventSlug: 'quan-huynh' }]) {
    assert.equal(validateRegistration({ ...body, ...change }, today).ok, false)
  }
  assert.equal(validateRegistration(body, new Date('2026-10-01T23:59:00Z')).ok, true)
  assert.equal(validateRegistration(body, new Date('2026-10-02T00:00:00Z')).ok, false)
})

test('an explicitly closed event refuses registration even before its date', () => {
  for (const slug of ['vaibhav-gupta', 'harsha-gaddipati']) {
    const event = eventBySlug(slug)
    assert.equal(event.registration, 'closed')
    assert.equal(validateRegistration({ ...body, eventSlug: event.slug }, today).ok, false)
    assert.equal(registrationOpen(event, today), false)
  }
  assert.equal(registrationOpen(eventBySlug('dan-hall'), today), true)
})

test('registration endpoint rejects malformed requests before database access', async () => {
  for (const [req, code] of [[{ method: 'GET' }, 405], [{ method: 'POST', body: '{' }, 400], [{ method: 'POST', body: { hp: 'bot' } }, 200]]) {
    const res = response()
    await handler(req, res)
    assert.equal(res.code, code)
  }
})

test('Dan registration stays open through October 1 and closes afterward', () => {
  const event = eventBySlug('dan-hall')
  assert.equal(event.date, '2026-10-01')
  const registration = { ...body, eventSlug: event.slug }
  assert.equal(validateRegistration(registration, today).data.eventSlug, 'dan-hall')
  assert.equal(validateRegistration(registration, new Date('2026-10-01T23:59:00Z')).ok, true)
  assert.equal(validateRegistration(registration, new Date('2026-10-02T12:00:00Z')).ok, false)
})

test('registration writes one event response and never a membership application', async t => {
  t.mock.timers.enable({ apis: ['Date'], now: today.getTime() })
  process.env.DATABASE_URL = 'postgres://unused'
  const writes = []
  t.mock.method(pg.Pool.prototype, 'query', async (sql, values) => {
    if (values) writes.push({ sql, values })
    return { rows: [] }
  })
  for (let i = 0; i < 2; i++) {
    const res = response()
    await handler({ method: 'POST', body }, res)
    assert.equal(res.code, 200)
  }
  assert.equal(writes.length, 2)
  for (const { sql, values } of writes) {
    assert.match(sql, /insert into event_responses/)
    assert.match(sql, /on conflict \(email, event_slug\) do update/)
    assert.doesNotMatch(sql, /members/)
    assert.deepEqual(values, ['test@virginia.edu', 'Test Student', body.eventSlug, body.speakerQuestion])
  }
})

test('admin registration search and sorting work without a membership row', () => {
  const options = queryOptions(new URLSearchParams({ view: 'responses', q: 'Test', sort: 'email' }))
  assert.doesNotMatch(options.rows, /members/)
  assert.match(options.rows, /r.email ilike/)
  assert.match(options.rows, /r.full_name/)
  assert.match(options.rows, /order by r.email/)
})

test('speaker question is required, bounded, and trimmed on page and API', async t => {
  t.mock.timers.enable({ apis: ['Date'], now: today.getTime() })
  for (const speakerQuestion of [undefined, null, '', ' \n\t ', 123, 'x'.repeat(2001)]) {
    const invalid = { ...body, speakerQuestion }
    assert.equal(validateRegistration(invalid, today).ok, false)
    const res = response()
    await handler({ method: 'POST', body: invalid }, res)
    assert.equal(res.code, 400)
  }
  assert.equal(validateRegistration({ ...body, speakerQuestion: '  A question?\n' }, today).data.speakerQuestion, 'A question?')
  assert.equal(validateRegistration({ ...body, speakerQuestion: 'x'.repeat(2000) }, today).ok, true)
  assert.match(queryOptions(new URLSearchParams({ view: 'responses' })).rows, /r.speaker_question/)
})
