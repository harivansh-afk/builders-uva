import { EMAIL_RE, fullNameError } from './join.js'
import { eventBySlug } from './events.js'

export function validateRegistration(body, today = new Date()) {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Bad request.' }
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''
  const error = fullNameError(fullName)
  if (error) return { ok: false, error }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Use your @virginia.edu email.' }
  const speakerQuestion = typeof body.speakerQuestion === 'string' ? body.speakerQuestion.trim() : ''
  if (!speakerQuestion) return { ok: false, error: 'Add a question for the speaker.' }
  if (speakerQuestion.length > 2000) return { ok: false, error: 'Keep your question under 2,001 characters.' }
  const event = eventBySlug(body.eventSlug)
  if (!event?.date || event.date < today.toISOString().slice(0, 10)) {
    return { ok: false, error: 'Registration is closed for this event.' }
  }
  return { ok: true, data: { fullName, email, speakerQuestion, eventSlug: event.slug } }
}
