// Shared demo state. Lives in memory only: a page reload resets the demo.
import { autoQcFlags, bank, defaultBrief, guardrails, script, slideVisuals } from './data.js'

export const steps = [
  { id: '1', label: 'Bank Informasi' },
  { id: '2', label: 'Brief & Guardrails' },
  { id: '3', label: 'Saran AI' },
  { id: '3b', label: 'Verifikasi Naskah' },
  { id: '4', label: 'Generate Media' },
  { id: '5', label: 'QC Jurnalis' },
  { id: '6', label: 'Ekspor' },
]

const allItems = [...bank.karyaUtama, ...bank.dataMentah]

export const flow = $state({
  step: 0,
  furthest: 0,
  // Sensitivity is the journalist's call, so it is editable state seeded from data.js
  sensitivity: Object.fromEntries(allItems.map((item) => [item.id, item.sensitivity])),
  brief: {
    ...defaultBrief,
    guardrails: Object.fromEntries(guardrails.map((g) => [g.id, g.default])),
  },
  angle: null,
  decisions: {}, // line id -> 'setuju' | 'ubah' | 'buang'
  edits: {}, // line id -> text written by the journalist
  revisionNote: '',
  generating: false,
  approved: false,
})

// Presenter shortcut: open the page with #3b (or any step id) to jump straight to that screen.
const jump = steps.findIndex((s) => '#' + s.id === window.location.hash)
if (jump > 0) {
  flow.step = jump
  flow.furthest = jump
}

export function goTo(index) {
  flow.step = index
  flow.furthest = Math.max(flow.furthest, index)
  window.scrollTo({ top: 0 })
}

// Resolve a source ID ('ART', 'ART-P3', 'FOTO-1') to its bank item and the cited part, if any.
export function findSource(id) {
  for (const item of allItems) {
    if (item.id === id) return { item, part: null }
    const part = item.parts?.find((p) => p.id === id)
    if (part) return { item, part }
  }
  return null
}

export const auditInfo = {
  hijau: { icon: '🟢', label: 'Kutipan ditemukan' },
  kuning: { icon: '🟡', label: 'Parafrase, cek makna' },
  merah: { icon: '🔴', label: 'Tidak ada di sumber' },
}

export const decisionLabel = { setuju: 'Setuju', ubah: 'Diubah', buang: 'Dibuang' }

// The script as it stands after the journalist's decisions: discarded lines removed, edits applied.
export function finalSlides() {
  return script
    .filter((line) => flow.decisions[line.id] !== 'buang')
    .map((line, i) => ({
      ...line,
      n: i + 1,
      text: flow.edits[line.id] ?? line.text,
      // Media the journalist labelled sensitif never goes into the output
      visual: flow.sensitivity[slideVisuals[line.slide]] === 'publik' ? slideVisuals[line.slide] : null,
    }))
}

// Auto QC flags for the current output, keyed to line IDs so they survive renumbering.
export function qcFlags() {
  const lineFor = (slide) => script.find((l) => l.slide === slide)
  const flags = []
  for (const flag of autoQcFlags) {
    const line = lineFor(flag.slide)
    const decision = flow.decisions[line.id]
    if (decision === 'buang') continue
    // The scripted "photo used correctly" note no longer applies once that photo is pulled
    if (flag.level === 'info' && flow.sensitivity[slideVisuals[flag.slide]] === 'sensitif') continue
    flags.push({ ...flag, lineId: line.id, edited: decision === 'ubah' })
  }
  for (const [slide, id] of Object.entries(slideVisuals)) {
    const line = lineFor(Number(slide))
    if (!id || flow.sensitivity[id] !== 'sensitif' || flow.decisions[line.id] === 'buang') continue
    flags.push({ level: 'info', lineId: line.id, text: `${id} dilabel sensitif oleh jurnalis, jadi tidak dipakai di slide.` })
  }
  return flags
}

export const flagIcon = { merah: '🔴', kuning: '🟡', info: 'ℹ️' }
