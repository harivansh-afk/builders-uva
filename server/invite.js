import { calendarLinks } from '../src/lib/calendar.js'
import { eventBySlug, longDate } from '../src/lib/events.js'

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function invitePayload(event, email) {
  const when = [longDate(event.date), event.time, event.location].filter(Boolean).join(', ')
  const url = `https://www.uva.builders/events/${event.slug}`
  const lines = [`You're registered for the Q&A with ${event.name}.`, when, 'The calendar invite is attached.']
  return {
    from: 'builders@uva <team@uva.builders>', reply_to: 'team@uva.builders', to: [email],
    subject: `You're registered: Q&A with ${event.name}`,
    text: [...lines, url, 'builders@uva'].join('\n\n'),
    html: [...lines.map(escapeHtml), `<a href="${url}">${url}</a>`, 'builders@uva'].map(line => `<p>${line}</p>`).join(''),
    attachments: [{ filename: 'invite.ics', content: Buffer.from(calendarLinks(event, email).ics).toString('base64'), content_type: 'text/calendar; method=REQUEST' }],
  }
}

// Sends the registration email with a calendar invite. Skipped without a key.
export async function sendInvite(eventSlug, email) {
  if (!process.env.RESEND_API_KEY) return
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST', signal: AbortSignal.timeout(10_000),
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json',
      'Idempotency-Key': `register/${eventSlug}/${email}` },
    body: JSON.stringify(invitePayload(eventBySlug(eventSlug), email)),
  })
  if (!response.ok) throw new Error(`Resend rejected the invite (${response.status})`)
}
