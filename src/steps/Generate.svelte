<script>
  import { onMount } from 'svelte'
  import {
    flow,
    finalSlides,
    qcFlags,
    flagIcon,
    pendingChanges,
    markGenerated,
    invalidateApproval,
    regenerateSlide,
    editSlide,
    log,
  } from '../lib/flow.svelte.js'
  import Carousel from '../lib/Carousel.svelte'

  let stages = $state([])
  let stage = $state(0)
  let fresh = $state([]) // slides reprocessed in this pass
  let unchanged = $state(false)
  let editingId = $state(null)
  let draft = $state('')

  let slides = $derived(finalSlides())
  let flags = $derived(qcFlags())
  let activeRules = $derived(flow.brief.guardrails.filter((r) => r.trim()))
  let slideNo = $derived(Object.fromEntries(slides.map((s) => [s.id, s.n])))

  // Fake the render. The first pass builds everything; later passes only reprocess what changed (PRD 6.1).
  onMount(() => {
    const { changed, removed } = pendingChanges()
    const first = flow.version === 0
    if (!first && changed.length === 0 && removed.length === 0) {
      unchanged = true
      return
    }
    const kept = slides.length - changed.length
    stages = first
      ? [
          'Menyusun teks slide dari script yang sudah disetujui',
          'Memasang foto dan video dari bank informasi (hanya bahan publik)',
          'Menjalankan QC otomatis terhadap guideline',
        ]
      : [
          changed.length && `Memproses ulang ${changed.length} slide yang berubah`,
          removed.length && `Menyusun ulang urutan, ${removed.length} slide dihapus`,
          `${kept} slide lain dipertahankan tanpa diproses ulang`,
          'Menjalankan QC otomatis terhadap guideline',
        ].filter(Boolean)
    fresh = first ? [] : changed.map((s) => s.id)
    invalidateApproval()
    flow.generating = true
    const timer = setInterval(() => {
      stage += 1
      if (stage >= stages.length) {
        clearInterval(timer)
        markGenerated()
        flow.version += 1
        flow.generating = false
        log(
          first
            ? `Media v1 digenerate: ${slides.length} slide Image Slides`
            : `Media v${flow.version}: ${changed.length} slide diproses ulang, ${kept} dipertahankan`,
        )
      }
    }, 700)
    return () => {
      clearInterval(timer)
      flow.generating = false
    }
  })

  function startEdit(slide) {
    editingId = slide.id
    draft = slide.text
  }

  function saveEdit(slide) {
    editSlide(slide, draft.trim())
    editingId = null
  }
</script>

{#snippet slideActions(slide)}
  {#if editingId === slide.id}
    <textarea rows="3" bind:value={draft}></textarea>
    <div class="actions">
      <button class="primary" disabled={!draft.trim()} onclick={() => saveEdit(slide)}>Simpan</button>
      <button onclick={() => (editingId = null)}>Batal</button>
    </div>
  {:else}
    <div class="actions">
      <button disabled={flow.regenerating[slide.id]} onclick={() => startEdit(slide)}>Edit teks</button>
      <button disabled={flow.regenerating[slide.id]} onclick={() => regenerateSlide(slide)}>↻ Generate ulang</button>
    </div>
  {/if}
{/snippet}

<div class="screen-head">
  <h2>4 · Generate Media</h2>
  <p class="muted">AI merender slide dari script yang sudah Anda setujui, lalu memeriksa hasilnya secara otomatis.</p>
  <p class="human">
    <strong>Keputusan jurnalis:</strong> edit teks langsung, atau minta AI membuat ulang satu slide saja. Slide lain tidak
    disentuh. QC otomatis hanya menandai, keputusan akhir ada di langkah 5.
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
  {#if unchanged}
    <p class="small muted note">Tidak ada perubahan script sejak versi sebelumnya. Hasil yang ada dipertahankan.</p>
  {/if}
  <div class="layout">
    <section>
      <h3>Pratinjau Image Slides · {slides.length} slide · v{flow.version}</h3>
      <Carousel {slides} {fresh} busy={flow.regenerating} actions={slideActions} />
    </section>

    <aside class="card">
      <h3>QC otomatis</h3>
      <details class="small">
        <summary>Diperiksa terhadap {activeRules.length} aturan dari jurnalis</summary>
        <ol class="rules">
          {#each activeRules as rule, i (i)}<li>{rule}</li>{/each}
        </ol>
      </details>
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

  .note {
    margin-bottom: 10px;
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

  .actions {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .actions button {
    font-size: 13px;
    padding: 3px 10px;
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

  summary {
    cursor: pointer;
    color: var(--accent);
  }

  .rules {
    margin: 6px 0 0;
    padding-left: 20px;
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
