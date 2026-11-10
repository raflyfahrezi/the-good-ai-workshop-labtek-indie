// View model for step 1, Bank Informasi. Plain functions over the shared flow state.
import { bank } from './data.js'
import { flow } from './flow.svelte.js'

export const typeLabel = { artikel: 'Artikel', transkrip: 'Transkrip', pdf: 'PDF', foto: 'Foto', video: 'Video' }
export const statusLabel = { gagal: 'Gagal', label: 'Menunggu label', proses: 'Diproses AI', siap: 'Siap' }
export const kindLabel = { audio: 'Suara', visual: 'Visual' }

// Upload status, with 'siap' for the items that were in the bank from the start
export const itemStatus = (item) => item.status ?? 'siap'

// Raw material: fresh uploads first, then the seeded items
export const rawItems = () => [...flow.uploads.toReversed(), ...bank.dataMentah]

// Category tabs for the raw material, with a count each
export function categoryFilters(items) {
  const types = ['transkrip', 'pdf', 'foto', 'video']
  return [
    { id: 'semua', label: 'Semua', count: items.length },
    ...types.map((t) => ({ id: t, label: typeLabel[t], count: items.filter((i) => i.type === t).length })),
  ]
}

// Where each item is processed, decided by the journalist's label. Failed uploads are not in the bank yet.
export function routing() {
  const items = [...bank.karyaUtama, ...rawItems()].filter((i) => itemStatus(i) !== 'gagal')
  const by = (level) => items.filter((i) => (flow.sensitivity[i.id] ?? null) === level).map((i) => i.id)
  return { cloud: by('publik'), local: by('sensitif'), unlabelled: by(null) }
}

export function partsSummary(item) {
  if (item.type !== 'video') return `${item.parts.length} bagian ber-ID`
  const visual = item.parts.filter((p) => p.kind === 'visual').length
  return `Analisis AI: ${item.parts.length - visual} suara, ${visual} kejadian visual`
}

// DOM id of a source card, so the routing board can scroll to it
export const cardId = (id) => `bahan-${id}`
