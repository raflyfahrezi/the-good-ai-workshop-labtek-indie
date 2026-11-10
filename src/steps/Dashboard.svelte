<script>
  // Dashboard page: composes the dashboard components. Numbers come from lib/dashboard.js.
  import { journalist, recentProjects, story } from '../lib/data.js'
  import { flow, goTo, openView } from '../lib/flow.svelte.js'
  import { activeProject, dashboardStats } from '../lib/dashboard.js'
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
  <header class="masthead">
    <p class="kicker">Meja kerja · {story.newsroom}</p>
    <h2>Halo, {journalist.name}.</h2>
    <p class="lede">Semua liputan dan konten turunannya ada di satu tempat. Lanjutkan dari langkah terakhir.</p>
  </header>

  <aside class="human-note">
    <span class="tag">Keputusan jurnalis</span>
    <p>
      Status konten hanya berubah menjadi <strong>Disetujui</strong> setelah jurnalis menyetujuinya di QC Editorial. AI
      tidak pernah menyetujui sendiri.
    </p>
  </aside>

  <StatStrip {stats} />

  <div class="cols">
    <ActiveProjectCard {project} onContinue={() => goTo(flow.step)} />
    <div class="side">
      <ActivityFeed entries={flow.history} />
      <QuickActions {actions} />
    </div>
  </div>

  <ProjectTable projects={recentProjects} />
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

  .masthead {
    display: grid;
    gap: 6px;
    padding-bottom: 16px;
    border-bottom: 1.5px solid var(--border);
  }

  .kicker {
    font: 400 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--muted);
  }

  h2 {
    font: 500 40px/1.05 var(--font-display);
    letter-spacing: -0.8px;
  }

  .lede {
    color: var(--muted);
    font-size: 15px;
    max-width: 60ch;
  }

  /* Human-in-the-loop callout, kept visible on every screen */
  .human-note {
    display: flex;
    align-items: baseline;
    gap: 12px;
    border: 1.5px dashed var(--border);
    padding: 10px 14px;
    font-size: 13px;
  }

  .tag {
    flex: none;
    font: 600 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    background: var(--accent);
    color: var(--on-solid);
    padding: 4px 6px;
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

  @media (max-width: 560px) {
    h2 {
      font-size: 32px;
    }
    .human-note {
      flex-direction: column;
      gap: 6px;
    }
  }
</style>
