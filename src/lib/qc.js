// View model for step 5, QC Editorial: the journalist's final approval or a routed revision
import { script, slideVisuals } from './data.js'
import { flow, goTo, invalidateApproval, log, qcFlags, revisionRoutes, stepIndex, steps } from './flow.svelte.js'

// Each revision type goes back to the stage that owns the problem (PRD 6.1)
export const routes = revisionRoutes.map((r) => ({ ...r, step: steps[stepIndex(r.target)] }))

// What the journalist should know before signing off. ok: true is fine, false is a warning, not a block:
// approval stays the journalist's call.
export function readiness() {
  const red = qcFlags().filter((f) => f.level === 'merah').length
  const open = script.filter((l) => !flow.decisions[l.id]).length
  const unsourced = script.filter((l) => l.audit === 'merah' && flow.decisions[l.id] === 'setuju').length
  const pulled = Object.values(slideVisuals).filter((id) => id && flow.sensitivity[id] === 'sensitif').length
  return [
    { label: 'Temuan merah QC otomatis', value: red ? `${red} belum beres` : 'Tidak ada', ok: red === 0 },
    { label: 'Paragraf script diputuskan', value: open ? `${open} belum` : 'Semua', ok: open === 0 },
    { label: 'Paragraf tanpa sumber disetujui', value: unsourced ? `${unsourced} paragraf` : 'Tidak ada', ok: unsourced === 0 },
    { label: 'Media sensitif di slide', value: pulled ? `${pulled} ditarik otomatis` : 'Tidak ada', ok: true },
  ]
}

export function approve() {
  flow.approved = true
  flow.revision = null
  log(`Disetujui jurnalis untuk ekspor (v${flow.version})`)
  goTo(flow.step + 1)
}

export function requestRevision(type, note) {
  const route = routes.find((r) => r.id === type)
  flow.revision = { type, note: note.trim() }
  invalidateApproval()
  log(`Revisi diminta (${route.label.toLowerCase()}): ${note.trim()}`)
  goTo(stepIndex(route.target))
}
