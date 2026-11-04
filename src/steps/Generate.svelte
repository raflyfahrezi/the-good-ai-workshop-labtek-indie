<script>
  import { guardrails } from '../lib/data.js'
  import { flow, finalSlides, qcFlags, flagIcon } from '../lib/flow.svelte.js'
  import Carousel from '../lib/Carousel.svelte'

  const stages = [
    'Menyusun teks slide dari naskah yang sudah diverifikasi',
    'Memasang foto dari bank informasi (hanya bahan publik)',
    'Menjalankan QC otomatis terhadap guardrails',
  ]

  let stage = $state(0)
  let slides = $derived(finalSlides())
  let flags = $derived(qcFlags())
  let activeRules = $derived(guardrails.filter((g) => flow.brief.guardrails[g.id]))
  let slideNo = $derived(Object.fromEntries(slides.map((s) => [s.id, s.n])))

  // Fake the render: step through the stages, then show the preview. Any change upstream needs a fresh approval.
  $effect(() => {
    flow.approved = false
    flow.generating = true
    const timer = setInterval(() => {
      stage += 1
      if (stage >= stages.length) {
        clearInterval(timer)
        flow.generating = false
      }
    }, 700)
    return () => {
      clearInterval(timer)
      flow.generating = false
    }
  })
</script>

<div class="screen-head">
  <h2>4 · Generate Media</h2>
  <p class="muted">AI merender slide dari naskah yang sudah Anda putuskan, lalu memeriksa hasilnya secara otomatis.</p>
  <p class="human">
    <strong>Keputusan jurnalis:</strong> QC otomatis hanya menandai. Temuannya dibawa ke langkah 5, tempat jurnalis
    memutuskan setujui atau revisi.
  </p>
</div>

{#if flow.generating}
  <div class="card progress">
    {#each stages as label, i (i)}
      <p class:done={i < stage} class:now={i === stage}>
        {i < stage ? '✓' : i === stage ? '…' : '○'}
        {label}
      </p>
    {/each}
  </div>
{:else}
  <div class="layout">
    <section>
      <h3>Pratinjau carousel · {slides.length} slide</h3>
      <Carousel {slides} />
    </section>

    <aside class="card">
      <h3>QC otomatis</h3>
      <p class="small muted">Diperiksa terhadap {activeRules.length} guardrails aktif.</p>
      {#each flags as flag, i (i)}
        <p class="flag {flag.level} small">
          <strong>{flagIcon[flag.level]} Slide {slideNo[flag.lineId]}:</strong>
          {flag.text}
          {#if flag.edited}<em>Baris ini sudah diubah jurnalis. Cek apakah temuan masih berlaku.</em>{/if}
        </p>
      {/each}
      {#if !flags.some((f) => f.level === 'merah')}
        <p class="small clean">✓ Tidak ada temuan merah.</p>
      {/if}
    </aside>
  </div>
{/if}

<style>
  .progress {
    display: grid;
    gap: 8px;
    max-width: 560px;
  }

  .progress p {
    color: var(--muted);
  }

  .progress .done {
    color: var(--hijau);
  }

  .progress .now {
    color: var(--text);
    font-weight: 600;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    gap: 20px;
    align-items: start;
  }

  section {
    display: grid;
    gap: 10px;
  }

  aside {
    display: grid;
    gap: 8px;
  }

  .flag {
    padding: 8px 10px;
    border-radius: 6px;
    background: #ececea;
    display: grid;
    gap: 2px;
  }

  .flag.merah {
    background: var(--merah-bg);
  }

  .flag.kuning {
    background: var(--kuning-bg);
  }

  .clean {
    color: var(--hijau);
    font-weight: 600;
  }

  @media (max-width: 860px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }
</style>
