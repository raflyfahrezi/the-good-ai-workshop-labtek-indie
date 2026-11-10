<script>
  import { story, script } from './lib/data.js'
  import { flow, steps, goTo, next, contentStatus, revisionRoutes } from './lib/flow.svelte.js'
  import { hrefFor } from './lib/router.js'
  import StatusChip from './lib/StatusChip.svelte'
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

  // The journalist's approvals are named on the button, so it is clear what "Lanjut" means at each step
  const nextLabel = { '2': 'Buat script →', '3': 'Setujui script →', '4': 'Kirim ke QC →' }

  // Per-step gate for the "Lanjut" button. Returns null when the journalist may continue.
  let blocked = $derived.by(() => {
    if (stepId === '1') {
      if (Object.values(flow.sensitivity).some((v) => !v)) return 'Beri label Publik atau Sensitif untuk semua bahan.'
      if (flow.uploads.some((u) => u.status === 'proses')) return 'Tunggu AI selesai memproses bahan.'
    }
    if (stepId === '2' && flow.brief.formats.length === 0) return 'Pilih minimal satu format.'
    if (stepId === '3') {
      if (!flow.scriptReady) return 'Tunggu AI selesai menyusun script.'
      const open = script.filter((l) => !flow.decisions[l.id]).length
      if (open > 0) return `${open} paragraf belum diputuskan.`
    }
    if (stepId === '4' && (flow.generating || Object.values(flow.regenerating).some(Boolean)))
      return 'Tunggu proses generate selesai.'
    if (stepId === '5' && !flow.approved) return 'Setujui atau minta revisi dulu.'
    return null
  })

  let isLast = $derived(flow.step === steps.length - 1)
  let revisionHere = $derived(
    flow.revision && revisionRoutes.find((r) => r.id === flow.revision.type).target === stepId ? flow.revision : null,
  )
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
      <header>
        <div class="title">
          <div>
            <h1>{story.title}</h1>
            <p class="muted small">Project liputan · tenggat {story.deadline}</p>
          </div>
          <StatusChip status={contentStatus()} />
        </div>

        <ol class="stepper">
          {#each steps as s, i (s.id)}
            <li>
              <button
                class:current={i === flow.step}
                class:done={i < flow.furthest && i !== flow.step}
                disabled={i > flow.furthest || (s.id === '6' && !flow.approved)}
                onclick={() => goTo(i)}
              >
                {s.id}. {s.label}
              </button>
            </li>
          {/each}
        </ol>
      </header>

      <main>
        {#if revisionHere}
          <div class="revision">
            <strong>Revisi dari QC Editorial ({revisionRoutes.find((r) => r.id === revisionHere.type).label}):</strong>
            {revisionHere.note}
            <span class="small muted">Bagian lain yang sudah disetujui tetap dipertahankan.</span>
          </div>
        {/if}
        <Screen />
      </main>

      <footer>
        <button onclick={() => goTo(flow.step - 1)} disabled={flow.step === 0}>← Kembali</button>
        <div class="next">
          {#if blocked}<span class="muted small">{blocked}</span>{/if}
          {#if !isLast}
            <button class="primary" disabled={!!blocked} onclick={next}>{nextLabel[stepId] ?? 'Lanjut →'}</button>
          {/if}
        </div>
      </footer>
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

  header,
  main,
  footer {
    padding-left: 22px;
    padding-right: 22px;
  }

  header {
    padding-top: 18px;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }

  h1 {
    font-size: 20px;
    margin-bottom: 2px;
  }

  .stepper {
    list-style: none;
    padding: 0;
    margin: 14px 0;
    display: flex;
    overflow-x: auto;
  }

  .stepper li {
    flex: 1;
    min-width: 110px;
    margin-left: -1.5px;
  }

  .stepper li:first-child {
    margin-left: 0;
  }

  .stepper button {
    width: 100%;
    font-size: 12px;
    padding: 6px 8px;
    white-space: nowrap;
  }

  .stepper button.current {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--on-solid);
    font-weight: 600;
  }

  .stepper button.done::before {
    content: '✓ ';
  }

  main {
    flex: 1;
    padding-bottom: 96px;
  }

  main.page {
    padding-top: 18px;
  }

  .revision {
    border: 1.5px dashed var(--border);
    background: var(--kuning-bg);
    padding: 10px 12px;
    margin-bottom: 14px;
    display: grid;
    gap: 2px;
  }

  footer {
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    padding-bottom: 10px;
    background: var(--bg);
    border-top: 1.5px solid var(--border);
  }

  .next {
    display: flex;
    align-items: center;
    gap: 12px;
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
    header,
    main,
    footer {
      padding-left: 14px;
      padding-right: 14px;
    }
  }
</style>
