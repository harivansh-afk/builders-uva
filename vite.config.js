import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// Serve api/*.js in dev the way Vercel does in production, so `bun run dev`
// exercises the real form handler against DATABASE_URL from .env.local.
function vercelApi() {
  return {
    name: 'vercel-api-dev',
    configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ''))
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next()
        const name = req.url.slice(5).split('?')[0].replace(/[^a-z0-9_-]/gi, '')
        let mod
        try { mod = await server.ssrLoadModule(`/api/${name}.js`) } catch { return next() }
        let raw = ''
        for await (const chunk of req) raw += chunk
        req.body = raw && req.headers['content-type']?.includes('json') ? JSON.parse(raw) : raw
        res.status = (c) => { res.statusCode = c; return res }
        res.json = (o) => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(o)) }
        try { await mod.default(req, res) } catch (e) { console.error(e); res.status(500).json({ error: 'dev handler crashed' }) }
      })
    },
  }
}

export default defineConfig({
  plugins: [svelte(), vercelApi()],
  server: {
    host: '127.0.0.1',
    port: 8797,
    strictPort: true,
    allowedHosts: ['spark-ix.tail368802.ts.net'],
  },
})
