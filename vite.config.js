import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  server: {
    host: '127.0.0.1',
    port: 8797,
    strictPort: true,
    allowedHosts: ['spark-ix.tail368802.ts.net'],
  },
})
