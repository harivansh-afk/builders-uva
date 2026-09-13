import { readFileSync } from 'node:fs'
import pg from 'pg'
import { validateRegistration } from '../src/lib/register.js'

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
    await pool.query(
      `insert into event_responses (email, full_name, event_slug, question, answer)
       values ($1, $2, $3, 'Event registration', 'yes')
       on conflict (email, event_slug) do update set
         full_name = excluded.full_name, question = excluded.question,
         answer = excluded.answer, created_at = now()`,
      [d.email, d.fullName, d.eventSlug],
    )
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('registration failed:', error.name)
    return res.status(500).json({ error: 'Could not save your registration. Try again in a minute.' })
  }
}
