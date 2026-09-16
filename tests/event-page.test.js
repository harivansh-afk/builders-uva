import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'

test('event descriptions render paragraphs and emphasis while escaping HTML', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
  try {
    const { render } = await server.ssrLoadModule('svelte/server')
    const { default: Event } = await server.ssrLoadModule('/src/pages/Event.svelte')
    const { eventBySlug } = await server.ssrLoadModule('/src/lib/events.js')
    const event = eventBySlug('dan-hall')
    const html = render(Event, { props: { slug: event.slug } }).body.replace(/<!--.*?-->/g, '')
    assert.match(html, /<strong\b[^>]*>\$2\.1 billion<\/strong>/)
    assert.match(html, /alt="Kyrus Technology logo"/)
    assert.equal((html.match(/<p\b[^>]*>(Dan Hall|Legion Capital|Previously)/g) ?? []).length, 3)
    event.description = 'First paragraph.\n\n<script>alert(1)</script>'
    const escaped = render(Event, { props: { slug: event.slug } }).body
    assert.match(escaped, /&lt;script(?:>|&gt;)alert\(1\)&lt;\/script(?:>|&gt;)/)
    assert.doesNotMatch(escaped, /<script>alert/)
  } finally {
    await server.close()
  }
})
