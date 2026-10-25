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

// A linkedin.com link, with or without the scheme.
export function linkedinError(value) {
  const v = typeof value === 'string' ? value.trim() : ''
  if (!v) return 'Add your LinkedIn.'
  try {
    const host = new URL(/^https?:\/\//i.test(v) ? v : 'https://' + v).hostname.toLowerCase()
    if (host === 'linkedin.com' || host.endsWith('.linkedin.com')) return ''
  } catch {}
  return 'Use a linkedin.com link.'
}

export function fullNameError(value) {
  const name = typeof value === 'string' ? value.trim() : ''
  if (name.split(/\s+/u).length < 2) return 'Enter your first and last name.'
  if (name.length > 200) return 'Keep your full name under 201 characters.'
  return ''
}

// Returns { ok: true, data } or { ok: false, error }.
export function validate(body) {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Bad request.' }

  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''
  const nameError = fullNameError(fullName)
  if (nameError) return { ok: false, error: nameError }

  const email = str(body.email, 80).toLowerCase()
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Use your @virginia.edu email.' }

  const year = str(body.year, 16)
  if (!YEAR_VALUES.has(year)) return { ok: false, error: 'Pick your year.' }

  let linkedin = str(body.linkedin, 200)
  const linkedinProblem = linkedinError(linkedin)
  if (linkedinProblem) return { ok: false, error: linkedinProblem }
  if (!/^https?:\/\//i.test(linkedin)) linkedin = 'https://' + linkedin

  return { ok: true, data: { fullName, email, year, linkedin } }
}
