// The one live setting in the demo: light or dark, useful on a projector. Not saved, like the rest of the demo.
export const themes = [
  { id: 'sistem', label: 'Ikuti sistem' },
  { id: 'light', label: 'Terang' },
  { id: 'dark', label: 'Gelap' },
]

export const currentTheme = () => document.documentElement.dataset.theme ?? 'sistem'

export function applyTheme(id) {
  if (id === 'sistem') delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = id
}
