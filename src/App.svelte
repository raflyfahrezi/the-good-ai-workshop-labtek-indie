<script>
  import { story, script } from './lib/data.js'
  import { flow, steps, goTo } from './lib/flow.svelte.js'
  import BankInformasi from './steps/BankInformasi.svelte'
  import Brief from './steps/Brief.svelte'
  import Saran from './steps/Saran.svelte'
  import Verifikasi from './steps/Verifikasi.svelte'
  import Generate from './steps/Generate.svelte'
  import QC from './steps/QC.svelte'
  import Ekspor from './steps/Ekspor.svelte'

  const screens = { '1': BankInformasi, '2': Brief, '3': Saran, '3b': Verifikasi, '4': Generate, '5': QC, '6': Ekspor }
  let Screen = $derived(screens[steps[flow.step].id])

  // Per-step gate for the "Lanjut" button. Returns null when the journalist may continue.
  let blocked = $derived.by(() => {
    if (steps[flow.step].id === '3' && !flow.angle) return 'Pilih satu sudut cerita dulu.'
    if (steps[flow.step].id === '3b') {
      const open = script.filter((l) => !flow.decisions[l.id]).length
      if (open > 0) return `${open} baris belum diputuskan.`
    }
    if (steps[flow.step].id === '4' && flow.generating) return 'Tunggu proses generate selesai.'
    if (steps[flow.step].id === '5' && !flow.approved) return 'Setujui atau minta revisi dulu.'
    return null
  })

  let isLast = $derived(flow.step === steps.length - 1)
</script>

<div class="banner">DATA DUMMY. Semua nama, tempat, angka dan kutipan di demo ini fiktif. AI-nya disimulasikan.</div>

<header>
  <div class="title">
    <p class="muted small">Demo lo-fi · Repurposer berjejak sumber</p>
    <h1>{story.title}</h1>
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
  <Screen />
</main>

<footer>
  <button onclick={() => goTo(flow.step - 1)} disabled={flow.step === 0}>← Kembali</button>
  <div class="next">
    {#if blocked}<span class="muted small">{blocked}</span>{/if}
    {#if !isLast}
      <button class="primary" disabled={!!blocked} onclick={() => goTo(flow.step + 1)}>Lanjut →</button>
    {/if}
  </div>
</footer>

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
