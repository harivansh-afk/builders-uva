import { Auth } from '@auth/core'
import Google from '@auth/core/providers/google'

// Admin access is independent of membership and checked on every request.
export const adminEmails = new Set(['rathiharivansh@gmail.com'])
export const isAdmin = (email) => typeof email === 'string' && adminEmails.has(email.toLowerCase())

export function authConfig() {
  return {
    basePath: '/api/auth',
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    logger: { error(error) { console.error('auth failed:', error.type || error.name) } },
    providers: [Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: { params: { scope: 'openid email profile', prompt: 'select_account' } },
      checks: ['pkce', 'state', 'nonce'],
    })],
    session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
    pages: { signIn: '/admin', error: '/admin' },
    callbacks: {
      signIn({ account, profile }) {
        return account?.provider === 'google' && profile?.email_verified === true && isAdmin(profile.email)
      },
      jwt({ token, account, profile }) {
        if (account) token.googleVerified = account.provider === 'google' && profile?.email_verified === true
        return token.googleVerified && isAdmin(token.email) ? token : null
      },
      session({ session, token }) {
        session.user = { email: token.email, name: token.name }
        return session
      },
      redirect({ baseUrl }) { return `${baseUrl}/admin` },
    },
  }
}

export function origin() {
  return process.env.AUTH_URL || 'https://www.uva.builders'
}

export function privateResponse(res) {
  res.setHeader('Cache-Control', 'private, no-store')
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
}

export async function adminSession(req, res) {
  privateResponse(res)
  const response = await Auth(new Request(`${origin()}/api/auth/session`, {
    headers: { cookie: req.headers.cookie || '' },
  }), authConfig())
  const cookies = response.headers.getSetCookie()
  if (cookies.length) res.setHeader('Set-Cookie', cookies)
  const session = await response.json()
  if (!response.ok || !isAdmin(session?.user?.email)) {
    res.status(401).json({ error: 'Sign in with an authorized Google account.' })
    return null
  }
  return session
}
