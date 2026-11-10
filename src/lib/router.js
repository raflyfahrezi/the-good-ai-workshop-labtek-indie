// Hash router. Hash URLs (#/riwayat, #/project/3) work from a static folder on Netlify Drop
// with base './', need no server rewrite rules, and survive a reload on any page.
// Pure helpers only: flow.svelte.js applies a parsed route to the demo state.

// Sidebar pages that are not part of the project flow
export const pages = {
  dashboard: '/',
  history: '/riwayat',
  guidelines: '/guideline',
  settings: '/pengaturan',
}

export const hrefFor = (view) => '#' + pages[view]
export const hrefForStep = (stepId) => `#/project/${stepId}`

// '#/project/3' -> { view: 'project', stepId: '3' }, '#/riwayat' -> { view: 'history' }, unknown -> null
export function parse(hash) {
  const path = hash.replace(/^#/, '') || '/'
  const step = path.match(/^\/project\/(\d+)$/)
  if (step) return { view: 'project', stepId: step[1] }
  // Older presenter shortcut: '#3' jumps to step 3
  const legacy = path.match(/^(\d+)$/)
  if (legacy) return { view: 'project', stepId: legacy[1] }
  const view = Object.keys(pages).find((key) => pages[key] === path)
  return view ? { view } : null
}

// Write the URL without adding a history entry when the page is already there
export function setHash(href, { replace = false } = {}) {
  if (window.location.hash === href) return
  if (replace) history.replaceState(null, '', href)
  else window.location.hash = href
}

// "Mulai ulang demo": back to the dashboard with fresh in-memory state
export function restartDemo() {
  history.replaceState(null, '', hrefFor('dashboard'))
  window.location.reload()
}
