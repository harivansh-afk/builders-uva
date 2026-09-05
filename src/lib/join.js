// The join form's shape, shared by the page and the API so both validate the
// same way. Keep option values stable: they are what gets stored.

export const YEARS = [
  { value: 'first', label: 'First year' },
  { value: 'second', label: 'Second year' },
  { value: 'third', label: 'Third year' },
  { value: 'fourth', label: 'Fourth year' },
  { value: 'grad', label: 'Graduate' },
]

export const EMAIL_RE = /^[a-z0-9][a-z0-9._-]{0,63}@virginia\.edu$/i
const YEAR_VALUES = new Set(YEARS.map((y) => y.value))

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const bool = (v) => v === true || v === 'true' || v === 'yes'

// Returns { ok: true, data } or { ok: false, error }.
export function validate(body) {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Bad request.' }

  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''
  if (!fullName) return { ok: false, error: 'Enter your full name.' }
  if (fullName.length > 200) return { ok: false, error: 'Keep your full name under 201 characters.' }

  const email = str(body.email, 80).toLowerCase()
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Use your @virginia.edu email.' }

  const year = str(body.year, 16)
  if (!YEAR_VALUES.has(year)) return { ok: false, error: 'Pick your year.' }

  if (body.technical !== true && body.technical !== false) return { ok: false, error: 'Answer the technical question.' }
  if (body.founded !== true && body.founded !== false) return { ok: false, error: 'Answer the founder question.' }

  let website = null
  if (body.founded) {
    website = str(body.website, 200)
    if (website) {
      if (!/^https?:\/\//i.test(website)) website = 'https://' + website
      try { new URL(website) } catch { return { ok: false, error: 'That website link does not look right.' } }
    } else {
      website = null
    }
  }

  const eventSlug = str(body.eventSlug, 64) || null
  const eventQuestion = str(body.eventQuestion, 300) || null
  const eventAnswer = str(body.eventAnswer, 2000) || null
  if (eventSlug && !/^[a-z0-9-]+$/.test(eventSlug)) return { ok: false, error: 'Bad request.' }

  return {
    ok: true,
    data: { fullName, email, year, technical: body.technical, founded: body.founded, website, eventSlug, eventQuestion, eventAnswer },
  }
}
