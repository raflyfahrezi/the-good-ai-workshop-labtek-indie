<script>
  import { flow, finalSlides, qcFlags, goTo } from '../lib/flow.svelte.js'
  import Carousel from '../lib/Carousel.svelte'

  let note = $state(flow.revisionNote)
  let slides = $derived(finalSlides())
  let flags = $derived(qcFlags())
  let redCount = $derived(flags.filter((f) => f.level === 'merah').length)

  function approve() {
    flow.approved = true
    flow.revisionNote = ''
    goTo(flow.step + 1)
  }

  function revise() {
    flow.revisionNote = note.trim()
    flow.approved = false
    goTo(2)
  }
</script>

<div class="screen-head">
  <h2>5 · QC oleh Jurnalis</h2>
  <p class="muted">Periksa pratinjau final bersama temuan QC otomatis.</p>
  <p class="human">
    <strong>Keputusan jurnalis:</strong> persetujuan akhir ada di tangan jurnalis. Tanpa persetujuan, konten tidak bisa
    diekspor.
  </p>
</div>

<div class="layout">
  <Carousel {slides} {flags} />

  <aside class="card">
    <h3>Keputusan Anda</h3>
    {#if redCount > 0}
      <p class="small warn">⚠ Masih ada {redCount} temuan merah. Sebaiknya minta revisi.</p>
    {/if}

    <label class="field">
      <span class="small"><strong>Catatan revisi</strong> (wajib jika minta revisi)</span>
      <textarea rows="4" bind:value={note} placeholder="Contoh: slide 4 tolong sebut bahwa hanya satu titik yang melebihi baku mutu."></textarea>
    </label>

    <button class="revise" disabled={!note.trim()} onclick={revise}>↺ Revisi, kembali ke langkah 3</button>
    <button class="primary" onclick={approve}>✓ Setujui & lanjut ke Ekspor</button>
  </aside>
</div>

<style>
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    gap: 20px;
    align-items: start;
  }

  aside {
    display: grid;
    gap: 10px;
    position: sticky;
    top: 12px;
  }

  .field {
    display: grid;
    gap: 4px;
  }

  .warn {
    color: var(--merah);
    font-weight: 600;
  }

  @media (max-width: 860px) {
    .layout {
      grid-template-columns: 1fr;
    }
    aside {
      position: static;
    }
  }
</style>
