import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { options, buildPayload } from '../emails/send.mjs'

test('email defaults to dry-run and requires one explicit test recipient', () => {
  assert.equal(options(['--campaign', 'kickoff', '--test-to', 'test@example.com']).send, false)
  for (const address of ['', 'a@example.com,b@example.com', 'a@example.com\nb@example.com']) {
    assert.throws(() => options(['--campaign', 'kickoff', '--test-to', address]))
  }
  assert.throws(() => options(['--campaign', '../kickoff', '--test-to', 'a@example.com']))
  assert.throws(() => options(['--campaign', 'kickoff', '--all', '--send']))
  assert.throws(() => options(['--campaign', 'kickoff', '--test-to', 'a@example.com', '--sned']))
})

test('kickoff embeds the exact PNG while preserving approved content', async () => {
  const directory = new URL('../emails/kickoff/', import.meta.url)
  const payload = await buildPayload(directory, 'TEST@example.com')
  assert.deepEqual(payload.to, ['test@example.com'])
  assert.equal(payload.attachments.length, 1)
  const attachment = payload.attachments[0]
  assert.deepEqual(Buffer.from(attachment.content, 'base64'), await readFile(new URL('../public/email-hands-horizontal.png', import.meta.url)))
  assert.equal(attachment.content_id, 'builders-hands@uva.builders')
  assert.equal(payload.html.replace('cid:builders-hands@uva.builders', 'https://www.uva.builders/email-hands-horizontal.png'),
    await readFile(new URL('index.html', directory), 'utf8'))
  assert(!/<img[^>]+src="https?:/i.test(payload.html))
  assert.equal(payload.text, await readFile(new URL('plain.txt', directory), 'utf8'))
})

test('missing image assets or mismatched references stop payload construction', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'builders-email-'))
  const directory = pathToFileURL(temporary + '/')
  try {
    const config = { from: 'team@example.com', reply_to: 'team@example.com', subject: 'Test',
      inline_images: [{ src: 'https://example.com/logo.png', path: './missing.png', filename: 'logo.png', content_id: 'logo' }] }
    await writeFile(new URL('campaign.json', directory), JSON.stringify(config))
    await writeFile(new URL('plain.txt', directory), 'Test')
    await writeFile(new URL('index.html', directory), '<img src="https://example.com/logo.png">')
    await assert.rejects(buildPayload(directory, 'test@example.com'), { code: 'ENOENT' })
    await writeFile(new URL('index.html', directory), '<p>Changed template</p>')
    await assert.rejects(buildPayload(directory, 'test@example.com'), /source missing/)
  } finally { await rm(temporary, { recursive: true, force: true }) }
})
