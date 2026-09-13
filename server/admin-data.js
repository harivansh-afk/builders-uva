import pg from 'pg'
let pool
export function adminDb() {
  if (!process.env.ADMIN_DATABASE_URL) throw new Error('ADMIN_DATABASE_URL is not configured')
  return pool ??= new pg.Pool({ connectionString: process.env.ADMIN_DATABASE_URL, max: 1, connectionTimeoutMillis: 10000, statement_timeout: 10000 })
}

export function queryOptions(params) {
  const view = params.get('view') || 'members'
  if (!['members', 'applications', 'responses'].includes(view)) throw new Error('Invalid view.')
  const page = Number(params.get('page') || 1)
  if (!Number.isSafeInteger(page) || page < 1 || page > 100000) throw new Error('Invalid page.')
  const search = (params.get('q') || '').trim()
  const event = params.get('event') || ''
  const answer = params.get('answer') || ''
  if (search.length > 200 || event.length > 200 || !['', 'yes', 'no'].includes(answer)) throw new Error('Invalid filter.')
  const sorts = view !== 'responses'
    ? { created_at: 'm.created_at', full_name: 'm.full_name', email: 'm.email', year: 'm.year' }
    : { created_at: 'r.created_at', full_name: 'r.full_name', email: 'r.email', event_slug: 'r.event_slug' }
  const sort = params.get('sort') || 'created_at'
  const direction = params.get('direction') || 'desc'
  if (!Object.hasOwn(sorts, sort) || !['asc', 'desc'].includes(direction)) throw new Error('Invalid sort.')
  const values = []
  const conditions = []
  if (view === 'members') conditions.push("m.status = 'approved'")
  if (view === 'applications') {
    const status = params.get('status') || 'pending'
    if (!['pending', 'declined'].includes(status)) throw new Error('Invalid application status.')
    values.push(status)
    conditions.push('m.status = $1')
  }
  if (search) {
    values.push(`%${search.replace(/[\\%_]/g, '\\$&')}%`)
    const alias = view === 'responses' ? 'r' : 'm'
    conditions.push(`(${alias}.email ilike $${values.length} or ${alias}.full_name ilike $${values.length})`)
  }
  if (view === 'responses' && event) { values.push(event); conditions.push(`r.event_slug = $${values.length}`) }
  if (view === 'responses' && answer) { values.push(answer); conditions.push(`r.answer = $${values.length}`) }
  const from = view !== 'responses' ? 'members m' : 'event_responses r'
  const where = conditions.length ? ` where ${conditions.join(' and ')}` : ''
  const columns = view !== 'responses'
    ? 'm.status, m.email, m.full_name, m.year, m.technical, m.founded, m.website, m.created_at, m.updated_at'
    : 'r.id, r.email, r.full_name, r.event_slug, r.question, r.answer, r.created_at'
  return { page, values,
    count: `select count(*)::int as total from ${from}${where}`,
    rows: `select ${columns} from ${from}${where} order by ${sorts[sort]} ${direction} nulls last, ${view !== 'responses' ? 'm.email' : 'r.id'} asc limit 50 offset ${(page - 1) * 50}`,
  }
}
