import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { parseArgs } from 'node:util'
import { pathToFileURL } from 'node:url'

export function options(args) {
  const { values } = parseArgs({ args, options: {
    campaign: { type: 'string' },
    'test-to': { type: 'string' },
    send: { type: 'boolean', default: false },
  } })
  if (!/^[a-z0-9-]+$/.test(values.campaign ?? '')) throw new Error('Provide --campaign <folder>')
  if (!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(values['test-to'] ?? '')) {
    throw new Error('Provide exactly one address with --test-to')
  }
  return values
}

export async function buildPayload(directory, recipient) {
  const config = JSON.parse(await readFile(new URL('campaign.json', directory), 'utf8'))
  for (const field of ['from', 'reply_to', 'subject']) {
    if (typeof config[field] !== 'string' || !config[field].trim() || /[\r\n]/.test(config[field])) {
      throw new Error(`Invalid campaign ${field}`)
    }
  }
  const payload = {
    from: config.from, reply_to: config.reply_to, subject: config.subject,
    to: [recipient.toLowerCase()],
    html: await readFile(new URL('index.html', directory), 'utf8'),
    text: await readFile(new URL('plain.txt', directory), 'utf8'),
  }
  const attachments = []
  const ids = new Set()
  for (const image of config.inline_images ?? []) {
    if (!/^[a-zA-Z0-9._@-]{1,127}$/.test(image.content_id ?? '') || ids.has(image.content_id)) {
      throw new Error('Inline images need unique valid content IDs')
    }
    ids.add(image.content_id)
    if (!/^https:\/\//.test(image.src ?? '') || !/^[\w.-]+\.png$/.test(image.filename ?? '')) {
      throw new Error('Inline image needs an HTTPS source and PNG filename')
    }
    const reference = `src="${image.src}"`
    if (!payload.html.includes(reference)) throw new Error(`Inline image source missing from HTML: ${image.src}`)
    const bytes = await readFile(new URL(image.path, directory))
    if (bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('Inline image is not a PNG')
    payload.html = payload.html.replaceAll(reference, `src="cid:${image.content_id}"`)
    attachments.push({ filename: image.filename, content: bytes.toString('base64'), content_id: image.content_id })
  }
  for (const [, id] of payload.html.matchAll(/src="cid:([^"]+)"/g)) {
    if (!ids.has(id)) throw new Error(`Missing attachment for CID: ${id}`)
  }
  if (attachments.length) payload.attachments = attachments
  return payload
}

export async function main(args) {
  const values = options(args)
  const directory = new URL(`./${values.campaign}/`, import.meta.url)
  const check = spawnSync(process.execPath, [new URL('check.mjs', directory).pathname, '--ready'], { stdio: 'inherit' })
  if (check.error || check.status !== 0) throw new Error('Campaign validation failed; nothing sent')
  const payload = await buildPayload(directory, values['test-to'])
  const body = JSON.stringify(payload)
  const hash = createHash('sha256').update(body).digest('hex')
  const key = `test/${values.campaign}/${hash}`
  console.log(JSON.stringify({ mode: values.send ? 'send' : 'dry-run', from: payload.from,
    to: payload.to, reply_to: payload.reply_to, subject: payload.subject, sha256: hash,
    inline_images: payload.attachments?.map(image => ({ filename: image.filename,
      content_id: image.content_id, bytes: Buffer.from(image.content, 'base64').length })) ?? [] }, null, 2))
  if (!values.send) return
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is missing')

  // Reserve before contacting Resend. Exclusive creation also prevents concurrent sends.
  const receipts = new URL('./.receipts/', import.meta.url)
  await mkdir(receipts, { recursive: true, mode: 0o700 })
  const receipt = new URL(`${hash}.json`, receipts)
  const record = { key, sha256: hash, to: payload.to, started_at: new Date().toISOString(), status: 'pending' }
  try {
    await writeFile(receipt, JSON.stringify(record, null, 2) + '\n', { flag: 'wx', mode: 0o600 })
  } catch (error) {
    if (error.code !== 'EEXIST') throw error
    throw new Error(`This exact test already has a receipt: ${receipt.pathname}. Inspect it before attempting another send.`)
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST', signal: AbortSignal.timeout(30_000),
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json', 'Idempotency-Key': key },
    body,
  })
  const result = await response.json()
  await writeFile(receipt, JSON.stringify({ ...record, status: response.ok ? 'accepted' : 'rejected',
    http_status: response.status, id: result.id, error: result.message }, null, 2) + '\n')
  if (!response.ok || !result.id) throw new Error(`Resend rejected the send (${response.status}): ${result.message ?? 'Missing email ID'}`)
  console.log(`Resend accepted email ${result.id}. Inbox delivery is not yet verified.`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch(error => { console.error(error.message); process.exitCode = 1 })
}
