import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8')
const plain = readFileSync(new URL('./plain.txt', import.meta.url), 'utf8')
assert(Buffer.byteLength(html) < 50_000, 'Keep the HTML under the project’s 50 KB budget')
assert(!/<(?:script|iframe|form|link|svg)\b/i.test(html), 'Template must not depend on scripts or forms')
assert(!/\b(?:display\s*:\s*(?:flex|grid)|position\s*:\s*(?:absolute|fixed))\b/i.test(html), 'Use email-compatible layout')
for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
  assert(['https:', 'mailto:'].includes(new URL(href).protocol), 'Links must be HTTPS or email addresses')
}
for (const source of [html, plain]) {
  for (const detail of ['Quan', 'September 10', 'Olsson Hall', 'Room 103', '~$5 million in seed funding', 'team@uva.builders', '5:30 p.m.', '6:00 p.m.', '6:30']) {
    assert(source.toLowerCase().includes(detail.toLowerCase()), `Missing event detail: ${detail}`)
  }
}
const placeholders = [...new Set((html + plain).match(/\{\{[^}]+\}\}/g) ?? [])]
if (process.argv.includes('--ready')) {
  assert.equal(placeholders.length, 0, `Unresolved placeholders: ${placeholders.join(', ')}`)
}
console.log(`Template checks passed (${Buffer.byteLength(html)} HTML bytes).`)
if (placeholders.length) console.log(`Draft only; still needs: ${placeholders.join(', ')}`)

for (const [tag, src] of html.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/g)) {
  assert.equal(new URL(src).protocol, 'https:', 'Images must use hosted HTTPS URLs')
  assert(/alt="[^"]+"/.test(tag), 'Images need descriptive fallback text')
  assert(/width="\d+"/.test(tag), 'Images need explicit dimensions')
}
