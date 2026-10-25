import test from 'node:test'
import assert from 'node:assert/strict'
import { validate } from '../src/lib/join.js'

const base = { fullName: 'Test Student', email: 'test@virginia.edu', year: 'first' }

test('applications need a name, a UVA email, a year, and a linkedin.com link', () => {
  assert.equal(validate(base).ok, false)
  assert.equal(validate({ ...base, linkedin: 'linkedin.com/in/test' }).data.linkedin, 'https://linkedin.com/in/test')
  assert.equal(validate({ ...base, linkedin: 'https://www.linkedin.com/in/test/' }).ok, true)
  assert.equal(validate({ ...base, linkedin: 'https://evil.com/linkedin.com' }).ok, false)
  assert.equal(validate({ ...base, linkedin: 'notlinkedin.com/in/test' }).ok, false)
  for (const change of [{ fullName: 'Test' }, { email: 'test@gmail.com' }, { year: 'fifth' }]) {
    assert.equal(validate({ ...base, linkedin: 'linkedin.com/in/test', ...change }).ok, false)
  }
})
