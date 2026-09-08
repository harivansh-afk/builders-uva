import { Auth } from '@auth/core'
import { authConfig, origin, privateResponse } from '../server/auth.js'

export default async function handler(req, res) {
  privateResponse(res)
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(', ') : value)
  }
  let body
  if (req.method === 'POST') {
    body = typeof req.body === 'string' ? req.body
      : headers.get('content-type')?.includes('application/json') ? JSON.stringify(req.body)
      : new URLSearchParams(req.body).toString()
  }
  const url = new URL(req.url, origin())
  // Vercel may pass the rewritten destination; Vite passes the original URL.
  if (url.pathname === '/api/auth') {
    const path = url.searchParams.get('authPath') || req.query?.authPath || ''
    url.pathname = `/api/auth/${path}`
  }
  url.searchParams.delete('authPath')
  const response = await Auth(new Request(url, {
    method: req.method, headers, body,
  }), authConfig())
  response.headers.forEach((value, key) => {
    if (!['set-cookie', 'cache-control'].includes(key)) res.setHeader(key, value)
  })
  const cookies = response.headers.getSetCookie()
  if (cookies.length) res.setHeader('Set-Cookie', cookies)
  res.status(response.status).end(await response.text())
}
