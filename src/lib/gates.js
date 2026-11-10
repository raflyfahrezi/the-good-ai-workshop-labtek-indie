// Per-step gate for the "Lanjut" button in the project footer.
import { script } from './data.js'
import { flow } from './flow.svelte.js'

// The journalist's approvals are named on the button, so it is clear what "Lanjut" means at each step
export const nextLabel = { '2': 'Buat script →', '3': 'Setujui script →', '4': 'Kirim ke QC →' }

// Returns why the journalist cannot continue yet, or null when they may
export function stepGate(stepId) {
  if (stepId === '1') {
    if (Object.values(flow.sensitivity).some((v) => !v)) return 'Beri label Publik atau Sensitif untuk semua bahan.'
    if (flow.uploads.some((u) => u.status === 'proses')) return 'Tunggu AI selesai memproses bahan.'
  }
  if (stepId === '2' && flow.brief.formats.length === 0) return 'Pilih minimal satu format.'
  if (stepId === '3') {
    if (!flow.scriptReady) return 'Tunggu AI selesai menyusun script.'
    const open = script.filter((l) => !flow.decisions[l.id]).length
    if (open > 0) return `${open} paragraf belum diputuskan.`
  }
  if (stepId === '4' && (flow.generating || Object.values(flow.regenerating).some(Boolean)))
    return 'Tunggu proses generate selesai.'
  if (stepId === '5' && !flow.approved) return 'Setujui atau minta revisi dulu.'
  return null
}
