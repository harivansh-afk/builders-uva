import { test } from 'node:test'
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { encode } from '@auth/core/jwt'
import { authConfig, adminSession } from '../server/auth.js'
import { queryOptions } from '../server/admin-data.js'
import handler from '../api/admin.js'
import authHandler from '../api/auth/[...path].js'

process.env.AUTH_SECRET = randomBytes(32).toString('base64')
process.env.AUTH_URL = 'https://uva.builders'
process.env.AUTH_GOOGLE_ID = 'test-client'
process.env.AUTH_GOOGLE_SECRET = 'test-secret'

function response() {
  return { headers: {}, code: 200, setHeader(k, v) { this.headers[k.toLowerCase()] = v },
    status(code) { this.code = code; return this }, json(body) { this.body = body; return this }, end(body) { this.body = body; return this } }
}
async function cookie(token, maxAge = 3600) {
  return `__Secure-authjs.session-token=${await encode({ token, secret: process.env.AUTH_SECRET, salt: '__Secure-authjs.session-token', maxAge })}`
}

test('Google login requires exact allowlisted email, Google provider, and verified email', () => {
  const signIn = authConfig().callbacks.signIn
  const valid = { account: { provider: 'google' }, profile: { email: 'rathiharivansh@gmail.com', email_verified: true } }
  assert.equal(signIn(valid), true)
  for (const email of ['someone@gmail.com', 'rathiharivansh@gmail.com.evil.test', '', undefined]) {
    assert.equal(signIn({ ...valid, profile: { ...valid.profile, email } }), false)
  }
  assert.equal(signIn({ ...valid, profile: { ...valid.profile, email_verified: false } }), false)
  assert.equal(signIn({ ...valid, account: { provider: 'github' } }), false)
})

test('admin API rejects anonymous and forged requests before querying the database', async () => {
  for (const value of ['', '__Secure-authjs.session-token=forged']) {
    const res = response()
    await handler({ method: 'GET', url: '/api/admin', headers: { cookie: value } }, res)
    assert.equal(res.code, 401)
    assert.equal(res.headers['cache-control'], 'private, no-store')
    assert.equal(res.body.rows, undefined)
  }
})

test('sessions require allowlist membership, verified Google provenance, and valid expiry', async () => {
  for (const [token, age] of [
    [{ email: 'someone@gmail.com', googleVerified: true }, 3600],
    [{ email: 'rathiharivansh@gmail.com', googleVerified: false }, 3600],
    [{ email: 'rathiharivansh@gmail.com', googleVerified: true }, -60],
  ]) {
    const res = response()
    assert.equal(await adminSession({ headers: { cookie: await cookie(token, age) } }, res), null)
    assert.equal(res.code, 401)
  }
  const res = response()
  const session = await adminSession({ headers: { cookie: await cookie({ email: 'rathiharivansh@gmail.com', googleVerified: true, name: 'Hari' }) } }, res)
  assert.equal(session.user.email, 'rathiharivansh@gmail.com')
  assert.ok(res.headers['set-cookie'].some(c => c.includes('HttpOnly') && c.includes('Secure') && c.includes('SameSite=Lax')))
})

test('admin API forbids mutation methods', async () => {
  const res = response()
  await handler({ method: 'POST', headers: {} }, res)
  assert.equal(res.code, 405)
})

test('Auth.js rejects sign-in and logout without CSRF proof', async () => {
  for (const action of ['signin/google', 'signout']) {
    const res = response()
    await authHandler({ method: 'POST', url: `/api/auth/${action}`, headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'callbackUrl=https%3A%2F%2Fevil.test' }, res)
    assert.equal(res.code, 302)
    assert.ok(res.headers.location.startsWith('https://uva.builders/'))
    assert.ok(!res.headers.location.includes('accounts.google.com'))
  }
})

test('filters stay parameterized and sort/page values are validated', () => {
  const options = queryOptions(new URLSearchParams({ view: 'responses', q: "x' OR true --%_", event: "event'", answer: 'yes', page: '2', sort: 'email', direction: 'asc' }))
  assert.ok(!options.rows.includes("x'"))
  assert.ok(!options.rows.includes("event'"))
  assert.equal(options.values[0], "%x' OR true --\\%\\_%")
  assert.match(options.rows, /r.event_slug = \$2 and r.answer = \$3/)
  assert.match(options.rows, /limit 50 offset 50$/)
  for (const params of [{ view: 'secrets' }, { sort: 'email; drop table members' }, { page: '-1' }, { page: '1.5' }, { direction: 'desc;--' }, { answer: 'maybe' }]) {
    assert.throws(() => queryOptions(new URLSearchParams(params)))
  }
})
