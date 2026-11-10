// View model for step 4, Generate Media, and the slide frames shared with step 5.
import { finalSlides, flow, invalidateApproval, log, markGenerated, pendingChanges, qcFlags } from './flow.svelte.js'

// QC flag levels without emoji: a short code and a word, matching the audit marks in step 3
export const flagMark = {
  merah: { code: '!', label: 'Harus diperbaiki' },
  kuning: { code: 'CEK', label: 'Cek makna' },
  info: { code: 'i', label: 'Catatan' },
}

export const frameId = (n) => `frame-${n}`

// What this visit to step 4 has to render. The first pass builds everything;
// later passes only reprocess what changed since the last generation (PRD 6.1).
export function renderPlan() {
  const slides = finalSlides()
  const { changed, removed } = pendingChanges()
  const first = flow.version === 0
  if (!first && changed.length === 0 && removed.length === 0) return null
  const kept = slides.length - changed.length
  return {
    first,
    kept,
    changed: changed.length,
    fresh: first ? [] : changed.map((s) => s.id),
    stages: first
      ? [
          'Menyusun teks slide dari script yang sudah disetujui',
          'Memasang foto dan video dari bank informasi (hanya bahan publik)',
          'Menjalankan QC otomatis terhadap guideline',
        ]
      : [
          changed.length && `Memproses ulang ${changed.length} slide yang berubah`,
          removed.length && `Menyusun ulang urutan, ${removed.length} slide dihapus`,
          `${kept} slide lain dipertahankan tanpa diproses ulang`,
          'Menjalankan QC otomatis terhadap guideline',
        ].filter(Boolean),
  }
}

export function startRender() {
  invalidateApproval()
  flow.generating = true
}

export function finishRender(plan) {
  markGenerated()
  flow.version += 1
  flow.generating = false
  log(
    plan.first
      ? `Media v1 digenerate: ${finalSlides().length} slide Image Slides`
      : `Media v${flow.version}: ${plan.changed} slide diproses ulang, ${plan.kept} dipertahankan`,
  )
}

// Auto QC flags with the slide number they point at, most severe first
export function qcReport() {
  const no = Object.fromEntries(finalSlides().map((s) => [s.id, s.n]))
  const order = { merah: 0, kuning: 1, info: 2 }
  return qcFlags()
    .map((f) => ({ ...f, n: no[f.lineId] }))
    .sort((a, b) => order[a.level] - order[b.level] || a.n - b.n)
}
