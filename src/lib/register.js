import { EMAIL_RE, fullNameError } from './join.js'
import { eventBySlug } from './events.js'

export function validateRegistration(body, today = new Date()) {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Bad request.' }
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''
  const error = fullNameError(fullName)
  if (error) return { ok: false, error }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Use your @virginia.edu email.' }
  const event = eventBySlug(body.eventSlug)
  if (!event || event.date < today.toISOString().slice(0, 10)) {
    return { ok: false, error: 'Registration is closed for this event.' }
  }
  return { ok: true, data: { fullName, email, eventSlug: event.slug } }
}
