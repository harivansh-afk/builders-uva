import pg from 'pg'
let pool
export function adminDb() {
  if (!process.env.ADMIN_DATABASE_URL) throw new Error('ADMIN_DATABASE_URL is not configured')
  return pool ??= new pg.Pool({ connectionString: process.env.ADMIN_DATABASE_URL, max: 1, connectionTimeoutMillis: 10000, statement_timeout: 10000 })
}

export function queryOptions(params) {
  const view = params.get('view') || 'members'
  if (!['members', 'responses'].includes(view)) throw new Error('Invalid view.')
  const page = Number(params.get('page') || 1)
  if (!Number.isSafeInteger(page) || page < 1 || page > 100000) throw new Error('Invalid page.')
  const search = (params.get('q') || '').trim()
  const event = params.get('event') || ''
  const answer = params.get('answer') || ''
  if (search.length > 200 || event.length > 200 || !['', 'yes', 'no'].includes(answer)) throw new Error('Invalid filter.')
  const sorts = view === 'members'
    ? { created_at: 'm.created_at', full_name: 'm.full_name', email: 'm.email', year: 'm.year' }
    : { created_at: 'r.created_at', full_name: 'm.full_name', email: 'm.email', event_slug: 'r.event_slug' }
  const sort = params.get('sort') || 'created_at'
  const direction = params.get('direction') || 'desc'
  if (!Object.hasOwn(sorts, sort) || !['asc', 'desc'].includes(direction)) throw new Error('Invalid sort.')
  const values = []
  const conditions = []
  if (search) {
    values.push(`%${search.replace(/[\\%_]/g, '\\$&')}%`)
    conditions.push(`(m.email ilike $${values.length} or m.full_name ilike $${values.length})`)
  }
  if (view === 'responses' && event) { values.push(event); conditions.push(`r.event_slug = $${values.length}`) }
  if (view === 'responses' && answer) { values.push(answer); conditions.push(`r.answer = $${values.length}`) }
  const from = view === 'members' ? 'members m' : 'event_responses r join members m on m.email = r.email'
  const where = conditions.length ? ` where ${conditions.join(' and ')}` : ''
  const columns = view === 'members'
    ? 'm.email, m.full_name, m.year, m.technical, m.founded, m.website, m.created_at, m.updated_at'
    : 'r.id, m.email, m.full_name, r.event_slug, r.question, r.answer, r.created_at'
  return { page, values,
    count: `select count(*)::int as total from ${from}${where}`,
    rows: `select ${columns} from ${from}${where} order by ${sorts[sort]} ${direction} nulls last, ${view === 'members' ? 'm.email' : 'r.id'} asc limit 50 offset ${(page - 1) * 50}`,
  }
}
