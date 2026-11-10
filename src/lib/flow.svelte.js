// Shared demo state. Lives in memory only: a reload keeps the screen (from the URL) but resets the data.
import {
  autoQcFlags,
  bank,
  defaultBrief,
  exportFormats,
  guardrails,
  script,
  slideVisuals,
  uploadSamples,
} from './data.js'
import { hrefFor, hrefForStep, parse, setHash } from './router.js'

// Workflow stages from the PRD (section 6). The brief goes straight to the script: no separate concept step.
export const steps = [
  { id: '1', label: 'Bank Informasi' },
  { id: '2', label: 'Brief & Guideline' },
  { id: '3', label: 'Script & Sumber' },
  { id: '4', label: 'Generate Media' },
  { id: '5', label: 'QC Editorial' },
  { id: '6', label: 'Ekspor & Atribusi' },
]

export const stepIndex = (id) => steps.findIndex((s) => s.id === id)

// PRD 6.1: a revision goes back to the stage that owns the problem, not to the start
export const revisionRoutes = [
  { id: 'script', label: 'Script atau narasi', target: '3' },
  { id: 'visual', label: 'Visual atau layout', target: '4' },
  { id: 'fakta', label: 'Fakta atau sumber', target: '1' },
]

const allItems = [...bank.karyaUtama, ...bank.dataMentah]

export const flow = $state({
  view: 'dashboard', // 'dashboard' | 'history' | 'guidelines' | 'settings' | 'project', mirrored in the URL hash
  step: 0,
  furthest: 0,
  // Sensitivity is the journalist's call, so it is editable state seeded from data.js
  sensitivity: Object.fromEntries(allItems.map((item) => [item.id, item.sensitivity])),
  brief: { ...defaultBrief, guardrails: [...guardrails] },
  uploads: [], // dummy uploads added in step 1, status 'gagal' | 'label' | 'proses' | 'siap'
  videoChecked: {}, // video id -> journalist matched the AI's visual descriptions against the footage
  scriptReady: false, // the AI writes the script the first time step 3 opens
  decisions: {}, // line id -> 'setuju' | 'ubah' | 'buang'
  edits: {}, // line id -> text written by the journalist
  generated: {}, // line id -> signature of the slide at its last generation
  version: 0,
  variant: {}, // line id -> layout variant, bumped by "regenerate slide"
  regenerating: {}, // line id -> true while that one slide is regenerated
  generating: false,
  revision: null, // { type, note } from editorial QC
  approved: false,
  exported: false,
  exports: [], // { at, files }
  history: [], // { at, text }, newest first
})

const now = () => new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

export function log(text) {
  flow.history.unshift({ at: now(), text })
}

// Navigation. The URL hash is the address of each screen (see router.js); these helpers update
// the state and the hash together, and the hashchange listener below handles back/forward and typed URLs.

function showView(view) {
  flow.view = view
  window.scrollTo({ top: 0 })
}

function showStep(index) {
  flow.view = 'project'
  flow.step = index
  flow.furthest = Math.max(flow.furthest, index)
  window.scrollTo({ top: 0 })
}

// Open a sidebar page that is not the project flow ('dashboard' | 'history' | 'guidelines' | 'settings')
export function openView(view) {
  showView(view)
  setHash(hrefFor(view))
}

export function goTo(index) {
  showStep(index)
  setHash(hrefForStep(steps[index].id))
}

// Any step can be opened by URL, so the presenter can jump straight to a screen (#/project/3)
function applyRoute() {
  const route = parse(window.location.hash)
  const index = route?.view === 'project' ? stepIndex(route.stepId) : -1
  if (index >= 0) {
    showStep(index)
    setHash(hrefForStep(route.stepId), { replace: true }) // tidy '#3' into '#/project/3'
  } else if (route && route.view !== 'project') {
    showView(route.view)
  } else {
    showView('dashboard')
    setHash(hrefFor('dashboard'), { replace: true })
  }
}

applyRoute()
window.addEventListener('hashchange', applyRoute)

// "Lanjut" in the shell. The brief and script approvals are journalist decisions, so they go in the history.
export function next() {
  const id = steps[flow.step].id
  if (id === '2') log(`Brief dikirim dengan ${flow.brief.guardrails.filter((r) => r.trim()).length} aturan guideline`)
  if (id === '3') {
    const count = (d) => script.filter((l) => flow.decisions[l.id] === d).length
    log(`Script disetujui: ${count('setuju')} setuju, ${count('ubah')} diubah, ${count('buang')} dibuang`)
  }
  goTo(flow.step + 1)
}

// Any change to the content after approval needs a fresh approval and a fresh export
export function invalidateApproval() {
  flow.approved = false
  flow.exported = false
}

export function contentStatus() {
  if (flow.exported) return 'Diekspor'
  if (flow.approved) return 'Disetujui'
  if (flow.generating || Object.values(flow.regenerating).some(Boolean)) return 'Diproses'
  if (flow.revision) return 'Revisi'
  if (flow.version > 0) return 'Perlu Review'
  return 'Draf'
}

export function nextUpload() {
  return uploadSamples[flow.uploads.length] ?? null
}

export function addUpload() {
  const sample = nextUpload()
  // One sample fails on purpose to show the error + retry state (PRD section 13)
  if (sample.failOnce) {
    flow.uploads.push({ ...sample, status: 'gagal', stages: [], stage: 0 })
    return
  }
  flow.uploads.push({ ...sample, status: 'label', stages: [], stage: 0 })
  flow.sensitivity[sample.id] = null
}

export function retryUpload(id) {
  const upload = flow.uploads.find((u) => u.id === id)
  upload.status = 'label'
  flow.sensitivity[id] = null
}

const processSteps = {
  video: ['Mentranskrip suara', 'Menganalisis kejadian visual, frame demi frame'],
  transkrip: ['Mentranskrip rekaman wawancara'],
  foto: ['Mendeskripsikan isi foto untuk pencarian'],
}

// The label decides where an upload is processed, so fake processing only starts once it is set.
// Timers live here, not in the component, so leaving step 1 mid-process does not leave an upload stuck.
export function setSensitivity(id, level) {
  flow.sensitivity[id] = level
  const upload = flow.uploads.find((u) => u.id === id)
  if (upload?.status !== 'label') return
  upload.status = 'proses'
  upload.stages = [
    level === 'sensitif' ? 'Diproses model lokal, tidak keluar dari komputer redaksi' : 'Dikirim ke model AI cloud',
    ...processSteps[upload.type],
    'Memberi ID per bagian',
  ]
  const timer = setInterval(() => {
    upload.stage += 1
    if (upload.stage >= upload.stages.length) {
      clearInterval(timer)
      upload.status = 'siap'
      log(`${upload.id} diunggah dan dianalisis (${level})`)
    }
  }, 700)
}

// Resolve a source ID ('ART', 'ART-P3', 'FOTO-1') to its bank item and the cited part, if any.
export function findSource(id) {
  for (const item of [...allItems, ...flow.uploads]) {
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
      variant: flow.variant[line.id] ?? 0,
    }))
}

const signature = (slide) => `${slide.text}|${slide.visual}`

// What changed since the last generation, so only those slides are reprocessed (PRD 6.1 UX recommendation)
export function pendingChanges() {
  const slides = finalSlides()
  return {
    changed: slides.filter((s) => flow.generated[s.id] !== signature(s)),
    removed: Object.keys(flow.generated).filter((id) => !slides.some((s) => s.id === id)),
  }
}

export function markGenerated() {
  flow.generated = Object.fromEntries(finalSlides().map((s) => [s.id, signature(s)]))
}

export function regenerateSlide(slide) {
  flow.regenerating[slide.id] = true
  invalidateApproval()
  setTimeout(() => {
    flow.variant[slide.id] = (flow.variant[slide.id] ?? 0) + 1
    flow.regenerating[slide.id] = false
    flow.version += 1
    log(`Slide ${slide.n} digenerate ulang (v${flow.version}), slide lain dipertahankan`)
  }, 1200)
}

export function editSlide(slide, text) {
  flow.edits[slide.id] = text
  flow.decisions[slide.id] = 'ubah'
  // A direct edit needs no AI pass, so record it as generated
  flow.generated[slide.id] = signature({ ...slide, text })
  invalidateApproval()
  log(`Slide ${slide.n}: teks diedit jurnalis`)
}

export function defaultExportFormats() {
  return Object.fromEntries(exportFormats.map((f) => [f.id, f.default]))
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
