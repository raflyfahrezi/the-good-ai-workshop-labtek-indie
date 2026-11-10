<script>
  import { story } from './lib/data.js'
  import { flow, steps, goTo, next, contentStatus, revisionRoutes } from './lib/flow.svelte.js'
  import { hrefFor } from './lib/router.js'
  import { nextLabel, stepGate } from './lib/gates.js'
  import ProjectHeader from './components/project/ProjectHeader.svelte'
  import Stepper from './components/project/Stepper.svelte'
  import StepFooter from './components/project/StepFooter.svelte'
  import RevisionBanner from './components/project/RevisionBanner.svelte'
  import Dashboard from './steps/Dashboard.svelte'
  import ProjectSaya from './steps/ProjectSaya.svelte'
  import BankInformasi from './steps/BankInformasi.svelte'
  import Brief from './steps/Brief.svelte'
  import Verifikasi from './steps/Verifikasi.svelte'
  import Generate from './steps/Generate.svelte'
  import QC from './steps/QC.svelte'
  import Ekspor from './steps/Ekspor.svelte'
  import Riwayat from './steps/Riwayat.svelte'
  import Guideline from './steps/Guideline.svelte'
  import Pengaturan from './steps/Pengaturan.svelte'

  const screens = { '1': BankInformasi, '2': Brief, '3': Verifikasi, '4': Generate, '5': QC, '6': Ekspor }
  let stepId = $derived(steps[flow.step].id)
  let Screen = $derived(screens[stepId])

  // PRD information architecture, laid out as the sidebar in the team's wireframe
  const nav = [
    { view: 'dashboard', label: 'Dashboard', page: Dashboard },
    { view: 'projects', label: 'Project Saya', page: ProjectSaya },
    { view: 'history', label: 'Riwayat Konten', page: Riwayat },
    { view: 'guidelines', label: 'Guideline Saya', page: Guideline },
    { view: 'settings', label: 'Pengaturan', page: Pengaturan },
  ]
  let Page = $derived(nav.find((n) => n.view === flow.view)?.page)
  // A workflow step belongs to the Project Saya section of the sidebar
  let section = $derived(flow.view === 'project' ? 'projects' : flow.view)

  let blocked = $derived(stepGate(stepId))
  let isLast = $derived(flow.step === steps.length - 1)
  // A QC revision is shown on the step that owns the problem
  let revisionHere = $derived.by(() => {
    const route = flow.revision && revisionRoutes.find((r) => r.id === flow.revision.type)
    return route?.target === stepId ? { type: route.label, note: flow.revision.note } : null
  })
</script>

<div class="banner">DATA DUMMY. Semua nama, tempat, angka dan kutipan di demo ini fiktif. AI-nya disimulasikan.</div>

<div class="app">
  <nav class="side">
    <div class="logo">IDEO</div>
    {#each nav as n (n.view)}
      <a
        class="navlink"
        class:on={section === n.view}
        aria-current={section === n.view ? 'page' : undefined}
        href={hrefFor(n.view)}>{n.label}</a
      >
    {/each}
    <p class="small muted hint">Low-fidelity · asisten AI untuk jurnalis</p>
  </nav>

  <div class="content">
    {#if flow.view !== 'project'}
      <main class="page">
        <Page />
      </main>
    {:else}
      <header class="project">
        <ProjectHeader title={story.title} desk={story.desk} deadline={story.deadline} status={contentStatus()} />
        <Stepper />
      </header>

      <main>
        {#if revisionHere}<RevisionBanner {...revisionHere} />{/if}
        <Screen />
      </main>

      <StepFooter
        canBack={flow.step > 0}
        onback={() => goTo(flow.step - 1)}
        onnext={next}
        nextLabel={nextLabel[stepId] ?? 'Lanjut →'}
        {blocked}
        {isLast}
      />
    {/if}
  </div>
</div>

<style>
  .banner {
    background: var(--kuning-bg);
    color: var(--text);
    border-bottom: 1.5px solid var(--border);
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 12px;
  }

  .app {
    display: flex;
    min-height: calc(100vh - 28px);
  }

  .side {
    width: 190px;
    flex: none;
    border-right: 1.5px solid var(--border);
    background: var(--card);
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .logo {
    font-weight: 700;
    letter-spacing: 2px;
    border: 1.5px solid var(--border);
    padding: 6px 10px;
    align-self: flex-start;
    margin-bottom: 10px;
  }

  .navlink {
    border: 1.5px dashed transparent;
    padding: 8px 10px;
    color: inherit;
    text-decoration: none;
  }

  .navlink:hover {
    border-color: var(--border);
  }

  .navlink.on {
    border-color: var(--border);
    background: var(--fl);
    font-weight: 600;
  }

  .hint {
    margin-top: 14px;
  }

  .content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  header.project,
  main {
    padding-left: 22px;
    padding-right: 22px;
  }

  header.project {
    padding-top: 18px;
    padding-bottom: 18px;
    display: grid;
    gap: 14px;
  }

  main {
    flex: 1;
    padding-bottom: 96px;
  }

  main.page {
    padding-top: 18px;
  }

  @media (max-width: 720px) {
    .app {
      flex-direction: column;
    }
    .side {
      width: auto;
      flex-direction: row;
      overflow-x: auto;
      border-right: 0;
      border-bottom: 1.5px solid var(--border);
    }
    .logo {
      margin: 0 6px 0 0;
    }
    .navlink {
      white-space: nowrap;
    }
    .hint {
      display: none;
    }
    header.project,
    main {
      padding-left: 14px;
      padding-right: 14px;
    }
  }
</style>
