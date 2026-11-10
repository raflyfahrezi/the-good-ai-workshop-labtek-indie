<script>
  // Dashboard page: composes the dashboard components. Numbers come from lib/dashboard.js.
  import { journalist, story } from '../lib/data.js'
  import { flow, goTo, openView } from '../lib/flow.svelte.js'
  import { hrefFor } from '../lib/router.js'
  import { activeProject, dashboardStats, recentProjects } from '../lib/dashboard.js'
  import PageHeader from '../components/PageHeader.svelte'
  import HumanNote from '../components/HumanNote.svelte'
  import StatStrip from '../components/dashboard/StatStrip.svelte'
  import ActiveProjectCard from '../components/dashboard/ActiveProjectCard.svelte'
  import ActivityFeed from '../components/dashboard/ActivityFeed.svelte'
  import QuickActions from '../components/dashboard/QuickActions.svelte'
  import ProjectTable from '../components/dashboard/ProjectTable.svelte'

  let stats = $derived(dashboardStats())
  let project = $derived(activeProject())

  const actions = [
    { label: 'Unggah bahan liputan', onclick: () => goTo(0) },
    { label: 'Buka guideline', onclick: () => openView('guidelines') },
    { label: '+ Project liputan baru', disabled: true, hint: 'Di demo hanya ada satu project' },
  ]
</script>

<div class="dashboard">
  <PageHeader
    kicker="Meja kerja · {story.newsroom}"
    title="Halo, {journalist.name}."
    lede="Semua liputan dan konten turunannya ada di satu tempat. Lanjutkan dari langkah terakhir."
  />

  <HumanNote>
    Status konten hanya berubah menjadi <strong>Disetujui</strong> setelah jurnalis menyetujuinya di QC Editorial. AI tidak
    pernah menyetujui sendiri.
  </HumanNote>

  <StatStrip {stats} />

  <div class="cols">
    <ActiveProjectCard {project} onContinue={() => goTo(flow.step)} />
    <div class="side">
      <ActivityFeed entries={flow.history} />
      <QuickActions {actions} />
    </div>
  </div>

  <ProjectTable projects={recentProjects()} moreHref={hrefFor('projects')} />
</div>

<style>
  .dashboard {
    max-width: 1080px;
    display: grid;
    gap: 20px;
  }

  /* One staggered reveal on load, top to bottom */
  .dashboard > :global(*) {
    animation: rise 0.45s ease-out both;
  }
  .dashboard > :global(:nth-child(2)) {
    animation-delay: 0.05s;
  }
  .dashboard > :global(:nth-child(3)) {
    animation-delay: 0.1s;
  }
  .dashboard > :global(:nth-child(4)) {
    animation-delay: 0.15s;
  }
  .dashboard > :global(:nth-child(5)) {
    animation-delay: 0.2s;
  }

  @keyframes rise {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dashboard > :global(*) {
      animation: none;
    }
  }

  .cols {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: 16px;
    align-items: start;
  }

  .side {
    display: grid;
    gap: 16px;
  }

  @media (max-width: 900px) {
    .cols {
      grid-template-columns: 1fr;
    }
  }
</style>
