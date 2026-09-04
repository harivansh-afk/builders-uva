// POST /api/join — Vercel serverless function.
// Upserts the member and records this event's answer. Needs DATABASE_URL
// (set by the Neon integration on Vercel; put it in .env.local for `bun run dev`).

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { validate } from '../src/lib/join.js'

const { Pool } = pg
let pool
let ready

function db() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 1 })
  // Apply db/schema.sql once per warm instance; every statement is IF NOT EXISTS.
  ready ??= pool.query(readFileSync(fileURLToPath(new URL('../db/schema.sql', import.meta.url)), 'utf8'))
  return ready.then(() => pool)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const body = typeof req.body === 'string' ? safeJson(req.body) : req.body
  if (body?.hp) return res.status(200).json({ ok: true }) // honeypot: pretend it worked

  const v = validate(body)
  if (!v.ok) return res.status(400).json({ error: v.error })
  const d = v.data

  try {
    const client = await (await db()).connect()
    try {
      await client.query('begin')
      await client.query(
        `insert into members (email, year, technical, founded, website)
         values ($1, $2, $3, $4, $5)
         on conflict (email) do update set
           year = excluded.year, technical = excluded.technical, founded = excluded.founded,
           website = coalesce(excluded.website, members.website), updated_at = now()`,
        [d.email, d.year, d.technical, d.founded, d.website],
      )
      if (d.eventSlug && d.eventAnswer) {
        await client.query(
          `insert into event_responses (email, event_slug, question, answer)
           values ($1, $2, $3, $4)
           on conflict (email, event_slug) do update set
             question = excluded.question, answer = excluded.answer, created_at = now()`,
          [d.email, d.eventSlug, d.eventQuestion, d.eventAnswer],
        )
      }
      await client.query('commit')
    } catch (err) {
      await client.query('rollback').catch(() => {})
      throw err
    } finally {
      client.release()
    }
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('join failed:', err)
    return res.status(500).json({ error: 'Could not save that right now. Try again in a minute.' })
  }
}

function safeJson(s) {
  try { return JSON.parse(s) } catch { return null }
}
