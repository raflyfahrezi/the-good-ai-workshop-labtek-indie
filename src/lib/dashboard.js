// View model for the Dashboard. Project data comes from projects.js.
import { otherProjects, story } from './data.js'
import { flow, contentStatus } from './flow.svelte.js'

export { activeProject } from './projects.js'

// The four headline numbers at the top of the Dashboard
export function dashboardStats() {
  const status = contentStatus()
  const waiting = otherProjects.filter((p) => p.status === 'Perlu Review').length + (status === 'Perlu Review' ? 1 : 0)
  return [
    { value: 1 + otherProjects.length, label: 'project liputan' },
    { value: waiting, label: 'konten perlu review', alert: waiting > 0 },
    // North Star metric from the PRD: derivative content approved by the journalist from one story
    { value: flow.approved || flow.exported ? 1 : 0, label: 'konten turunan disetujui dari liputan aktif' },
    { value: story.deadlineRelative, label: 'tenggat terdekat' },
  ]
}

// The latest few other projects for the Dashboard table
export const recentProjects = (limit = 3) => otherProjects.slice(0, limit)
