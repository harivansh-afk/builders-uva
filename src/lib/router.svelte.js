// A path router small enough to not need a framework. Vercel rewrites every
// non-API path to index.html (vercel.json), and the dev server does the same.

export const route = $state({ path: normalize(location.pathname) })

function normalize(p) {
  return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p
}

export function navigate(to, { replace = false } = {}) {
  const path = normalize(to)
  if (path === route.path) return
  history[replace ? 'replaceState' : 'pushState'](null, '', path)
  route.path = path
  window.scrollTo(0, 0)
}

window.addEventListener('popstate', () => { route.path = normalize(location.pathname) })

// Let plain <a href="/events"> work without a component wrapper.
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const a = e.target.closest?.('a[href]')
  if (!a || a.target || a.hasAttribute('download')) return
  const url = new URL(a.href, location.href)
  if (url.origin !== location.origin) return
  e.preventDefault()
  navigate(url.pathname)
})
