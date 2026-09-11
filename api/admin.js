import { adminSession, privateResponse, origin } from '../server/auth.js'
import { adminDb, queryOptions } from '../server/admin-data.js'

export default async function handler(req, res) {
  privateResponse(res)
  if (!['GET', 'PATCH'].includes(req.method)) {
    res.setHeader('Allow', 'GET, PATCH')
    return res.status(405).json({ error: 'Method not allowed.' })
  }
  try {
    const session = await adminSession(req, res)
    if (!session) return
    if (req.method === 'PATCH') {
      // Browser mutations require an exact trusted Origin and JSON, preventing CSRF.
      if (req.headers.origin !== new URL(origin()).origin ||
          req.headers['content-type']?.split(';')[0].trim() !== 'application/json') {
        return res.status(403).json({ error: 'Invalid request origin or content type.' })
      }
      let body = req.body
      if (typeof body === 'string') {
        try { body = JSON.parse(body) }
        catch { return res.status(400).json({ error: 'Invalid JSON.' }) }
      }
      if (!body || typeof body.email !== 'string' || body.email.length > 80 ||
          !['approved', 'declined'].includes(body.status) ||
          !['pending', 'declined'].includes(body.expectedStatus)) {
        return res.status(400).json({ error: 'Invalid application decision.' })
      }
      const client = await adminDb().connect()
      let result
      try {
        // Pooled connections may retain the role's previous read-only default.
        await client.query('begin read write')
        result = await client.query(
          'update members set status = $1, updated_at = now() where email = $2 and status = $3 returning email, status',
          [body.status, body.email, body.expectedStatus],
        )
        await client.query('commit')
      } catch (error) {
        await client.query('rollback').catch(() => {})
        throw error
      } finally { client.release() }
      if (!result.rowCount) return res.status(409).json({ error: 'This application has changed. Refresh and try again.' })
      return res.status(200).json({ ok: true })
    }
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
