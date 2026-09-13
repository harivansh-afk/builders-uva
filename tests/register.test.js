import test from 'node:test'
import assert from 'node:assert/strict'
import pg from 'pg'
import { validateRegistration } from '../src/lib/register.js'
import { queryOptions } from '../server/admin-data.js'
import handler from '../api/register.js'

const body = { fullName: 'Test Student', email: 'TEST@virginia.edu', eventSlug: 'vaibhav-gupta' }
const today = new Date('2026-09-13T12:00:00Z')
const response = () => ({ code: 200, setHeader() {}, status(code) { this.code = code; return this }, json(body) { this.body = body; return this } })

test('registration needs only identity and a known upcoming event', () => {
  assert.deepEqual(validateRegistration(body, today).data, { ...body, email: 'test@virginia.edu' })
  for (const change of [{ fullName: '' }, { email: 'test@gmail.com' }, { eventSlug: 'missing' }, { eventSlug: 'quan-huynh' }]) {
    assert.equal(validateRegistration({ ...body, ...change }, today).ok, false)
  }
  assert.equal(validateRegistration(body, new Date('2026-09-17T23:59:00Z')).ok, true)
  assert.equal(validateRegistration(body, new Date('2026-09-18T00:00:00Z')).ok, false)
})

test('registration endpoint rejects malformed requests before database access', async () => {
  for (const [req, code] of [[{ method: 'GET' }, 405], [{ method: 'POST', body: '{' }, 400], [{ method: 'POST', body: { hp: 'bot' } }, 200]]) {
    const res = response()
    await handler(req, res)
    assert.equal(res.code, code)
  }
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
    assert.deepEqual(values, ['test@virginia.edu', 'Test Student', 'vaibhav-gupta'])
  }
})

test('admin registration search and sorting work without a membership row', () => {
  const options = queryOptions(new URLSearchParams({ view: 'responses', q: 'Test', sort: 'email' }))
  assert.doesNotMatch(options.rows, /members/)
  assert.match(options.rows, /r.email ilike/)
  assert.match(options.rows, /r.full_name/)
  assert.match(options.rows, /order by r.email/)
})
