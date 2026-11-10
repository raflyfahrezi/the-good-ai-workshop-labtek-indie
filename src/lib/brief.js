// View model for step 2, Brief & Guideline. Plain functions over flow, so they stay reactive inside $derived.
import { formats, guidelineTemplates } from './data.js'
import { flow, log } from './flow.svelte.js'

// Image Slides is the only format the demo generates; the rest are recorded in the brief for a later phase
export const formatInfo = (id) => formats.find((f) => f.id === id)

export function laterFormats() {
  return flow.brief.formats.map(formatInfo).filter((f) => !f.mvp)
}

// Empty lines are ignored, so a half-typed rule never reaches the AI
export function activeRules() {
  return flow.brief.guardrails.filter((r) => r.trim())
}

export function addRule(text) {
  const rule = text.trim()
  if (!rule) return false
  flow.brief.guardrails.push(rule)
  return true
}

export function removeRule(index) {
  flow.brief.guardrails.splice(index, 1)
}

// A template replaces the list. Shared with the Guideline Saya page.
export function loadTemplate(id) {
  const t = guidelineTemplates.find((g) => g.id === id)
  flow.brief.guardrails = [...t.rules]
  log(`Template guideline dimuat: ${t.label}`)
}

// The template whose rules the active project's guideline currently matches exactly, if any
export function activeTemplateId() {
  const rules = activeRules()
  return guidelineTemplates.find((t) => t.rules.length === rules.length && t.rules.every((r, i) => r === rules[i]))?.id ?? null
}

export function togglePlatform(p) {
  const list = flow.brief.platforms
  if (list.includes(p)) list.splice(list.indexOf(p), 1)
  else list.push(p)
}

// What the (fake) AI receives when the journalist presses "Buat script"
export function briefSummary() {
  const b = flow.brief
  return [
    { key: 'Format', value: b.formats.map((id) => formatInfo(id).label).join(', ') || 'Belum dipilih', missing: !b.formats.length },
    { key: 'Platform', value: b.platforms.join(', ') || 'Belum dipilih', missing: !b.platforms.length },
    { key: 'Panjang', value: `${b.length} slide` },
    { key: 'Aturan', value: `${activeRules().length} aturan guideline` },
  ]
}
