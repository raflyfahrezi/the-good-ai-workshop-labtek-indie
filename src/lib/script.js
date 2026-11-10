// View model for step 3, Script & Sumber. Plain functions over flow, so they stay reactive inside $derived.
import { script } from './data.js'
import { findSource, flow, log } from './flow.svelte.js'
import { activeRules } from './brief.js'

export const docOf = (sourceId) => findSource(sourceId)?.item

// Each cited document gets its own highlight colour, in order of first appearance in the script
export const docOrder = [...new Set(script.flatMap((l) => l.sources).map((id) => docOf(id)?.id))].filter(Boolean)
export const docColor = (itemId) => `var(--src-${(docOrder.indexOf(itemId) % 6) + 1})`

// Audit marks without emoji: a short code and a word for each machine verdict
export const auditMark = {
  hijau: { code: 'OK', label: 'Kutipan ditemukan' },
  kuning: { code: 'CEK', label: 'Parafrase, cek makna' },
  merah: { code: '!', label: 'Tidak ada di sumber' },
}

export const decisions = [
  { id: 'setuju', label: 'Setuju' },
  { id: 'ubah', label: 'Ubah' },
  { id: 'buang', label: 'Buang' },
]

// Fake AI writing stages, shown the first time step 3 opens
export function writeStages() {
  return [
    'Membaca bank informasi (publik di model cloud, sensitif di model lokal)',
    `Menerapkan ${activeRules().length} aturan guideline dari brief`,
    'Menulis paragraf, setiap kalimat diberi sumber',
    'Audit otomatis: mencocokkan kutipan dengan sumber',
  ]
}

export function markScriptReady() {
  flow.scriptReady = true
  log('Script digenerate dari brief dan bank informasi')
}

export const textOf = (line) => flow.edits[line.id] ?? line.text

// One cell per paragraph for the review ledger at the top
export function ledger() {
  return script.map((l) => ({ id: l.id, slide: l.slide, audit: l.audit, decision: flow.decisions[l.id] ?? null }))
}

export function auditTally() {
  return Object.keys(auditMark).map((key) => ({ key, count: script.filter((l) => l.audit === key).length }))
}

// Group a paragraph's sources by bank item, so each cited passage shows inside its document
export function citedDocs(line) {
  const groups = []
  for (const id of line.sources) {
    const src = findSource(id)
    if (!src) continue
    let group = groups.find((g) => g.item.id === src.item.id)
    if (!group) groups.push((group = { item: src.item, cited: [] }))
    group.cited.push(id)
  }
  return groups
}

// Approving keeps the AI wording, so it drops any earlier edit
export function decide(line, decision) {
  if (decision === 'setuju') delete flow.edits[line.id]
  flow.decisions[line.id] = decision
}

export function saveEdit(line, text) {
  flow.edits[line.id] = text.trim()
  flow.decisions[line.id] = 'ubah'
}

// The next paragraph nobody has decided yet, wrapping around
export function nextOpen(line) {
  const i = script.indexOf(line)
  return [...script.slice(i + 1), ...script.slice(0, i)].find((l) => !flow.decisions[l.id]) ?? null
}
