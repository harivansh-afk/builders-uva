import { adminSession, privateResponse } from '../server/auth.js'
import { adminDb, queryOptions } from '../server/admin-data.js'

export default async function handler(req, res) {
  privateResponse(res)
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed.' })
  }
  try {
    const session = await adminSession(req, res)
    if (!session) return
    let options
    try { options = queryOptions(new URL(req.url, 'http://localhost').searchParams) }
    catch (error) { return res.status(400).json({ error: error.message }) }
    const db = adminDb()
    const [rows, count, events] = await Promise.all([
      db.query(options.rows, options.values),
      db.query(options.count, options.values),
      db.query('select distinct event_slug from event_responses order by event_slug'),
    ])
    return res.status(200).json({ user: session.user, rows: rows.rows, total: count.rows[0].total,
      page: options.page, pageSize: 50, events: events.rows.map(row => row.event_slug) })
  } catch (error) {
    console.error('admin failed:', error.name)
    return res.status(500).json({ error: 'Could not load the dashboard. Try again shortly.' })
  }
}
