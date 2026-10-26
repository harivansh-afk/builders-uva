// Run against a disposable local database only. See README.md in this folder.
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const require = createRequire(`${process.env.QA_DEPENDENCIES}/package.json`)
const { chromium } = require('playwright')
const { Client } = require('pg')
const { default: ICAL } = await import(pathToFileURL(require.resolve('ical.js')))
const base = process.env.CALENDAR_QA_URL || 'http://127.0.0.1:8798'
const database = new URL(process.env.CALENDAR_QA_DATABASE_URL)
assert.equal(new URL(base).hostname, '127.0.0.1')
assert.equal(database.hostname, '127.0.0.1')
assert.equal(database.pathname, '/calendar_qa')
const output = new URL('./reproduced/', import.meta.url)
await mkdir(output, { recursive: true })
const client = new Client({ connectionString: database.href })
await client.connect()
const browser = await chromium.launch()
const results = []
const email = `calendar-qa-${Date.now()}@virginia.edu`
try {
  for (const [slug, speaker, date, width] of [
    ['alex-becker', 'Alex Becker', '2026-11-05', 1440],
    ['andrew-schoka', 'Andrew Schoka', '2026-11-12', 1440],
    ['alex-oliver', 'Alex Oliver', '2026-11-19', 375],
  ]) {
    const context = await browser.newContext({ viewport: { width, height: width === 375 ? 812 : 1000 }, acceptDownloads: true })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`${base}/events/${slug}/register`)
    await page.getByLabel('Full name', { exact: true }).waitFor()
    assert.equal(await page.getByRole('heading', { name: 'Add to calendar', exact: true }).count(), 0)
    await page.getByLabel('Full name', { exact: true }).fill('Calendar QA Student')
    await page.getByLabel('UVA email', { exact: true }).fill(email)
    await page.getByLabel('What would you like to ask the speaker?', { exact: true }).fill('How do you choose what to build?')
    const responsePromise = page.waitForResponse(r => r.url().endsWith('/api/register') && r.request().method() === 'POST')
    await page.getByRole('button', { name: 'Register', exact: true }).click()
    const response = await responsePromise
    assert.equal(response.status(), 200)
    await page.getByRole('heading', { name: 'Add to calendar', exact: true }).waitFor()
    await page.locator('#calendar-title svg').waitFor()
    assert.ok((await page.locator('header').innerText()).includes('6 PM ET · The Foundry'))
    const stored = await client.query('select full_name, answer, speaker_question from event_responses where email=$1 and event_slug=$2', [email, slug])
    assert.equal(stored.rows.length, 1)
    assert.equal(stored.rows[0].answer, 'yes')
    assert.equal(stored.rows[0].speaker_question, 'How do you choose what to build?')
    const google = new URL(await page.getByRole('link', { name: /Google Calendar/ }).getAttribute('href'))
    assert.equal(google.origin, 'https://calendar.google.com')
    assert.equal(google.searchParams.get('text'), `builders@uva Q&A with ${speaker}`)
    const utcStart = `${date.replaceAll('-', '')}T230000Z`
    assert.equal(google.searchParams.get('dates'), `${utcStart}/${utcStart}`)
    assert.equal(google.searchParams.get('location'), 'The Foundry')
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('link', { name: 'Apple / Outlook (.ics)', exact: true }).click()
    const download = await downloadPromise
    const file = new URL(download.suggestedFilename(), output)
    await download.saveAs(file.pathname)
    const text = await readFile(file, 'utf8')
    const event = new ICAL.Event(new ICAL.Component(ICAL.parse(text)).getFirstSubcomponent('vevent'))
    assert.equal(event.uid, `${slug}@uva.builders`)
    assert.equal(event.summary, `builders@uva Q&A with ${speaker}`)
    assert.equal(event.startDate.toString(), `${date}T23:00:00Z`)
    assert.equal(event.startDate.isDate, false)
    assert.equal(event.location, 'The Foundry')
    assert.equal(event.component.hasProperty('dtend'), false)
    assert.ok(!text.includes(email))
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    const viewport = await page.evaluate(() => ({
      width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth,
      calendar: [...document.querySelectorAll('.calendar a')].map(a => {
        const { x, y, right, bottom } = a.getBoundingClientRect()
        return { text: a.textContent.trim(), x, y, right, bottom }
      }),
    }))
    for (const link of viewport.calendar) assert.ok(link.x >= 0 && link.right <= width && link.y >= 0 && link.bottom <= viewport.height)
    assert.equal(errors.length, 0)
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: new URL(`${slug}-${width}.png`, output).pathname, scale: 'css' })
    results.push({ slug, email, status: response.status(), database: stored.rows[0], uid: event.uid, start: event.startDate.toString(), end: null, location: event.location, width, viewport, consoleErrors: errors, parsedDownload: true })
    await context.close()
  }
  await writeFile(new URL('results.json', output), JSON.stringify(results, null, 2))
  console.log(JSON.stringify({ passed: results.length, cases: results }, null, 2))
} finally {
  await browser.close()
  await client.end()
}
