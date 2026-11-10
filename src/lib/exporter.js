// View model for step 6, Ekspor & Atribusi: the export package, the work's metadata and the source trail
import { exportFormats, formats, script, story } from './data.js'
import { decisionLabel, finalSlides, findSource, flow, log } from './flow.svelte.js'
import { auditMark } from './script.js'

export const defaultCredit = () =>
  `Liputan: ${story.author}, ${story.newsroom}. Disusun dengan bantuan AI (IDEO) dan diverifikasi per kalimat oleh jurnalis.`

const pad = (n) => String(n).padStart(2, '0')

// The files each format produces. Only the CSV is real in the demo.
export function manifest(chosen) {
  const n = finalSlides().length
  const name = {
    png: `image-slide-01-${pad(n)}.png`,
    pdf: 'image-slides.pdf',
    caption: 'caption.txt',
    csv: 'jejak-sumber.csv',
  }
  return exportFormats.map((f) => ({ ...f, file: name[f.id], on: !!chosen[f.id], real: f.id === 'csv' }))
}

// Jejak Sumber covers every line the AI wrote, including discarded ones, so the editor sees what AI touched
export function sourceTrail() {
  const slides = finalSlides()
  return script.map((line) => ({
    id: line.id,
    slide: slides.find((s) => s.id === line.id)?.n ?? null,
    text: flow.edits[line.id] ?? line.text,
    aiText: line.text,
    sources: line.sources,
    audit: line.audit,
    decision: flow.decisions[line.id] ?? null,
  }))
}

// Metadata attached to the export (PRD FR-39, FR-40)
export function workMetadata() {
  const slides = finalSlides()
  const cited = [...new Set(slides.flatMap((s) => s.sources).map((id) => findSource(id)?.item.id))].filter(Boolean)
  const sensitive = cited.filter((id) => flow.sensitivity[id] === 'sensitif')
  return [
    ['Judul liputan', story.title],
    ['Pemilik karya', story.author],
    ['Redaksi', story.newsroom],
    ['Format', `${formats.find((f) => f.id === 'slides').label}, ${slides.length} slide`],
    ['Versi', `v${flow.version}, disetujui jurnalis`],
    ['Bahan yang dirujuk', cited.join(', ')],
    ['Bahan sensitif dirujuk', sensitive.length ? `${sensitive.join(', ')} (identitas disamarkan)` : 'Tidak ada'],
    ['Bantuan AI', 'Ya, IDEO (disimulasikan di demo ini)'],
  ]
}

// The one real file in the demo: the source trail as CSV, built from the dummy data
function downloadTrailCsv() {
  const header = ['Slide', 'Teks akhir', 'Teks AI', 'Sumber', 'Status audit', 'Keputusan', 'Diputuskan oleh']
  const rows = sourceTrail().map((r) => [
    r.slide ?? '-',
    r.text,
    r.aiText,
    r.sources.join(', ') || 'tanpa sumber',
    auditMark[r.audit].label,
    decisionLabel[r.decision] ?? '',
    story.author,
  ])
  const csv = [header, ...rows].map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: 'jejak-sumber-dummy.csv' })
  a.click()
  URL.revokeObjectURL(url)
}

export function exportPackage(files) {
  if (files.some((f) => f.real)) downloadTrailCsv()
  const at = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const names = files.map((f) => f.file)
  flow.exports.unshift({ at, version: flow.version, files: names })
  flow.exported = true
  log(`Diekspor (v${flow.version}): ${names.join(', ')}`)
}
