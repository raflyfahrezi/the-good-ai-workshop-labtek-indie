<script>
  import { story, script } from './lib/data.js'
  import { flow, steps, goTo, next, contentStatus, revisionRoutes } from './lib/flow.svelte.js'
  import StatusChip from './lib/StatusChip.svelte'
  import Dashboard from './steps/Dashboard.svelte'
  import BankInformasi from './steps/BankInformasi.svelte'
  import Brief from './steps/Brief.svelte'
  import Saran from './steps/Saran.svelte'
  import Verifikasi from './steps/Verifikasi.svelte'
  import Generate from './steps/Generate.svelte'
  import QC from './steps/QC.svelte'
  import Ekspor from './steps/Ekspor.svelte'

  const screens = { '1': BankInformasi, '2': Brief, '3': Saran, '3b': Verifikasi, '4': Generate, '5': QC, '6': Ekspor }
  let stepId = $derived(steps[flow.step].id)
  let Screen = $derived(screens[stepId])

  // PRD information architecture. Only Dashboard and the project exist in this demo.
  const laterNav = ['Riwayat Konten', 'Guideline Saya', 'Pengaturan']

  // The journalist's approvals are named on the button, so it is clear what "Lanjut" means at each step
  const nextLabel = { '3': 'Setujui konsep →', '3b': 'Setujui script →', '4': 'Kirim ke QC →' }

  // Per-step gate for the "Lanjut" button. Returns null when the journalist may continue.
  let blocked = $derived.by(() => {
    if (stepId === '1') {
      if (Object.values(flow.sensitivity).some((v) => !v)) return 'Beri label Publik atau Sensitif untuk semua bahan.'
      if (flow.uploads.some((u) => u.status === 'proses')) return 'Tunggu AI selesai memproses bahan.'
    }
    if (stepId === '2' && flow.brief.formats.length === 0) return 'Pilih minimal satu format.'
    if (stepId === '3' && !flow.angle) return 'Pilih satu konsep dulu.'
    if (stepId === '3b') {
      const open = script.filter((l) => !flow.decisions[l.id]).length
      if (open > 0) return `${open} baris belum diputuskan.`
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

<nav class="appbar">
  <div class="brand">
    <strong>IDEO</strong>
    <span class="small muted">Asisten AI untuk jurnalis</span>
  </div>
  <div class="links">
    <button class:active={flow.view === 'dashboard'} onclick={() => (flow.view = 'dashboard')}>Dashboard</button>
    <button class:active={flow.view === 'project'} onclick={() => goTo(flow.step)}>Project Saya</button>
    {#each laterNav as label (label)}
      <button disabled title="Belum ada di demo lo-fi">{label}</button>
    {/each}
  </div>
</nav>

{#if flow.view === 'dashboard'}
  <main class="dash">
    <Dashboard />
  </main>
{:else}
  <header>
    <div class="title">
      <p class="muted small">Project liputan · tenggat {story.deadline}</p>
      <h1>{story.title} <StatusChip status={contentStatus()} /></h1>
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
            <span class="num">{s.id}</span>
            {s.label}
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

<style>
  .banner {
    background: #222;
    color: #ffd84d;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
    padding: 6px 12px;
  }

  .appbar {
    background: var(--card);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px 20px;
    padding: 8px max(20px, calc((100vw - 1180px) / 2 + 20px));
  }

  .brand {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  .brand strong {
    font-size: 20px;
    letter-spacing: 0.08em;
    color: var(--accent);
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .links button {
    border: 0;
    background: none;
    font-size: 14px;
    padding: 6px 10px;
  }

  .links button.active {
    background: var(--accent-bg);
    color: var(--accent);
    font-weight: 600;
  }

  header,
  main,
  footer {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 20px;
  }

  header {
    padding-top: 16px;
  }

  h1 {
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .stepper {
    list-style: none;
    padding: 0;
    margin: 14px 0 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .stepper button {
    font-size: 14px;
    padding: 6px 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .stepper .num {
    font: 600 12px/1 ui-monospace, Consolas, monospace;
    background: #ececea;
    border-radius: 4px;
    padding: 3px 5px;
  }

  .stepper button.current {
    border-color: var(--accent);
    background: var(--accent-bg);
    color: var(--accent);
    font-weight: 600;
  }

  .stepper button.current .num {
    background: var(--accent);
    color: #fff;
  }

  .stepper button.done .num {
    background: var(--hijau-bg);
    color: var(--hijau);
  }

  main {
    min-height: 60vh;
    padding-bottom: 96px;
  }

  main.dash {
    padding-top: 24px;
  }

  .revision {
    border: 1px solid var(--human);
    background: var(--human-bg);
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 16px;
    display: grid;
    gap: 2px;
  }

  footer {
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    padding-bottom: 12px;
    background: var(--bg);
    border-top: 1px solid var(--border);
  }

  .next {
    display: flex;
    align-items: center;
    gap: 12px;
  }
</style>
