import assert from 'node:assert/strict'
import { test } from 'node:test'
import { options } from '../emails/send.mjs'

test('email defaults to dry-run and requires one explicit test recipient', () => {
  assert.equal(options(['--campaign', 'kickoff', '--test-to', 'test@example.com']).send, false)
  for (const address of ['', 'a@example.com,b@example.com', 'a@example.com\nb@example.com']) {
    assert.throws(() => options(['--campaign', 'kickoff', '--test-to', address]))
  }
  assert.throws(() => options(['--campaign', '../kickoff', '--test-to', 'a@example.com']))
  assert.throws(() => options(['--campaign', 'kickoff', '--all', '--send']))
  assert.throws(() => options(['--campaign', 'kickoff', '--test-to', 'a@example.com', '--sned']))
})
