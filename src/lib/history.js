// View model for Riwayat Konten: this session's exports first, then the dummy history of other projects
import { contentHistory, story } from './data.js'
import { flow } from './flow.svelte.js'

export function historyRows() {
  const session = flow.exports.map((e, i) => ({
    key: `sesi-${i}`,
    title: story.title,
    desk: story.desk,
    format: 'Image Slides',
    version: e.version,
    files: e.files,
    status: 'Diekspor',
    date: 'Hari ini',
    at: e.at,
    session: true,
  }))
  return [...session, ...contentHistory.map((h, i) => ({ ...h, key: `arsip-${i}` }))]
}

const groups = [
  { id: 'semua', label: 'Semua', match: () => true },
  { id: 'diekspor', label: 'Diekspor', match: (r) => r.status === 'Diekspor' },
  { id: 'gagal', label: 'Gagal', match: (r) => r.status === 'Gagal' },
]

export function historyFilters(rows) {
  return groups.map((g) => ({ id: g.id, label: g.label, count: rows.filter(g.match).length }))
}

export const matchesFilter = (id) => groups.find((g) => g.id === id).match
