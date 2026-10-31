import { readFileSync } from 'node:fs'
import pg from 'pg'
import { validateRegistration } from '../src/lib/register.js'
import { sendInvite } from '../server/invite.js'
import { eventBySlug } from '../src/lib/events.js'

let pool
let ready
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }
  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = null }
  }
  if (body?.hp) return res.status(200).json({ ok: true })
  const result = validateRegistration(body)
  if (!result.ok) return res.status(400).json({ error: result.error })
  const d = result.data
  try {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')
    pool ??= new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1 })
    ready ??= pool.query(readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8')).catch(error => {
      ready = undefined
      throw error
    })
    await ready
    const capacity = eventBySlug(d.eventSlug).capacity
    const { rowCount, full } = capacity ? await insertCapped(d, capacity) : await insert(pool, d)
    if (full) return res.status(409).json({ error: 'This event is full.' })
    if (!rowCount) return res.status(409).json({ error: "You're already registered for this event." })
    // the registration is saved either way; the invite is a courtesy
    await sendInvite(d.eventSlug, d.email).catch(error => console.error('invite failed:', error.message))
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('registration failed:', error.name)
    return res.status(500).json({ error: 'Could not save your registration. Try again in a minute.' })
  }
}

const insert = (db, d) => db.query(
  `insert into event_responses (email, full_name, event_slug, question, answer, speaker_question)
   values ($1, $2, $3, 'Event registration', 'yes', $4)
   on conflict (email, event_slug) do nothing`,
  [d.email, d.fullName, d.eventSlug, d.speakerQuestion],
)

// Serialize registrations per event so concurrent requests cannot overshoot the cap.
// Someone already registered gets the duplicate response, not "full".
async function insertCapped(d, capacity) {
  const client = await pool.connect()
  try {
    await client.query('begin')
    await client.query('select pg_advisory_xact_lock(hashtext($1))', [d.eventSlug])
    const { rows: [{ taken, mine }] } = await client.query(
      `select count(*)::int as taken, bool_or(email = $2) as mine from event_responses where event_slug = $1`,
      [d.eventSlug, d.email],
    )
    const result = mine ? { rowCount: 0 } : taken >= capacity ? { rowCount: 0, full: true } : await insert(client, d)
    await client.query('commit')
    return result
  } catch (error) {
    await client.query('rollback').catch(() => {})
    throw error
  } finally {
    client.release()
  }
}
