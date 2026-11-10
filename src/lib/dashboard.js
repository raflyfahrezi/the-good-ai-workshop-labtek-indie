// View model for the Dashboard. Plain functions that read the shared flow state,
// so they stay reactive when called from a component's $derived.
import { recentProjects, script, story } from './data.js'
import { flow, steps, contentStatus } from './flow.svelte.js'

// The four headline numbers at the top of the Dashboard
export function dashboardStats() {
  const status = contentStatus()
  return [
    { value: 1 + recentProjects.length, label: 'project liputan' },
    { value: status === 'Perlu Review' ? 1 : 0, label: 'konten perlu review', alert: status === 'Perlu Review' },
    // North Star metric from the PRD: derivative content approved by the journalist from one story
    { value: flow.approved || flow.exported ? 1 : 0, label: 'konten turunan disetujui dari liputan aktif' },
    { value: story.deadlineRelative, label: 'tenggat terdekat' },
  ]
}

// The project the journalist is working on, with where they left off
export function activeProject() {
  const openLines = script.filter((line) => !flow.decisions[line.id]).length
  return {
    title: story.title,
    deadline: story.deadline,
    status: contentStatus(),
    steps: steps.map((s, i) => ({ ...s, state: i === flow.step ? 'current' : i <= flow.furthest ? 'done' : 'todo' })),
    current: steps[flow.step],
    // Only meaningful once the journalist has reached the script step
    openLines: flow.furthest >= 2 ? openLines : 0,
    lastActivity: flow.history[0] ?? null,
  }
}
