// View model for projects: the active (clickable) project plus the dummy ones from data.js.
// Plain functions that read the shared flow state, so they stay reactive inside $derived.
import { formats, otherProjects, script, story } from './data.js'
import { flow, steps, contentStatus } from './flow.svelte.js'

// The six workflow steps, each marked 'done' | 'current' | 'todo' for a step rail
export function stepRail(current, furthest = current) {
  return steps.map((s, i) => ({ ...s, state: i === current ? 'current' : i <= furthest ? 'done' : 'todo' }))
}

// Status filters on Project Saya, grouped by who has to act next
export const statusFilters = [
  { id: 'semua', label: 'Semua', match: () => true },
  { id: 'dikerjakan', label: 'Sedang dikerjakan', match: (s) => ['Draf', 'Diproses', 'Revisi'].includes(s) },
  { id: 'keputusan', label: 'Perlu keputusan', match: (s) => s === 'Perlu Review' },
  { id: 'selesai', label: 'Selesai', match: (s) => ['Disetujui', 'Diekspor'].includes(s) },
]

// The project the journalist is working on in this demo, with where they left off
export function activeProject() {
  const openLines = flow.furthest >= 2 ? script.filter((line) => !flow.decisions[line.id]).length : 0
  const current = steps[flow.step]
  return {
    id: 'aktif',
    active: true,
    title: story.title,
    desk: story.desk,
    formats: formats.filter((f) => flow.brief.formats.includes(f.id)).map((f) => f.label).join(', '),
    status: contentStatus(),
    updated: flow.history[0] ? `Hari ini, ${flow.history[0].at}` : 'Hari ini',
    deadline: story.deadline,
    rail: stepRail(flow.step, flow.furthest),
    current,
    openLines,
    lastActivity: flow.history[0] ?? null,
    note: openLines > 0 ? `${openLines} paragraf script belum dicek jurnalis.` : `Langkah terakhir: ${current.label}.`,
  }
}

// Every project, the active one first
export function projectList() {
  return [activeProject(), ...otherProjects.map((p) => ({ ...p, active: false, rail: stepRail(p.step) }))]
}
