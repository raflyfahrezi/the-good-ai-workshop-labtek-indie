<script>
  import {
    flow,
    finalSlides,
    qcFlags,
    goTo,
    findSource,
    log,
    invalidateApproval,
    revisionRoutes,
    stepIndex,
  } from '../lib/flow.svelte.js'
  import Carousel from '../lib/Carousel.svelte'

  let note = $state('')
  let type = $state(revisionRoutes[0].id)
  let openSource = $state(null) // `${slideId}:${sourceId}` of the passage shown under a slide

  let slides = $derived(finalSlides())
  let flags = $derived(qcFlags())
  let redCount = $derived(flags.filter((f) => f.level === 'merah').length)

  function approve() {
    flow.approved = true
    flow.revision = null
    log(`Disetujui jurnalis untuk ekspor (v${flow.version})`)
    goTo(flow.step + 1)
  }

  // PRD 6.1: send the revision to the stage that owns the problem
  function revise() {
    const route = revisionRoutes.find((r) => r.id === type)
    flow.revision = { type, note: note.trim() }
    invalidateApproval()
    log(`Revisi diminta (${route.label.toLowerCase()}): ${note.trim()}`)
    goTo(stepIndex(route.target))
  }
</script>

{#snippet sources(slide)}
  <div class="sources small">
    {#each slide.sources as id (id)}
      {@const key = `${slide.id}:${id}`}
      <button class="chip" aria-pressed={openSource === key} onclick={() => (openSource = openSource === key ? null : key)}>
        {id}
      </button>
    {:else}
      <span class="chip none">tanpa sumber</span>
    {/each}
  </div>
  {#each slide.sources as id (id)}
    {#if openSource === `${slide.id}:${id}`}
      {@const src = findSource(id)}
      <p class="passage small">
        <strong>{src.item.label}</strong><br />
        {src.part?.text ?? src.item.credit}
      </p>
    {/if}
  {/each}
{/snippet}

<div class="screen-head">
  <h2>5 · QC Editorial</h2>
  <p class="muted">Periksa pratinjau final, temuan QC otomatis, dan sumber setiap slide.</p>
  <p class="human">
    <strong>Keputusan jurnalis:</strong> persetujuan akhir ada di tangan jurnalis. AI tidak bisa menandai konten sebagai
    disetujui, dan tanpa persetujuan konten tidak bisa diekspor.
  </p>
</div>

<div class="layout">
  <Carousel {slides} {flags} actions={sources} />

  <aside>
    <div class="card decision">
      <h3>Keputusan Anda · v{flow.version}</h3>
      {#if redCount > 0}
        <p class="small warn">⚠ Masih ada {redCount} temuan merah. Sebaiknya minta revisi.</p>
      {/if}

      <button class="primary" onclick={approve}>✓ Setujui untuk ekspor</button>

      <fieldset>
        <legend class="small"><strong>Atau tolak dan minta revisi</strong></legend>
        {#each revisionRoutes as r (r.id)}
          <label class="small route">
            <input type="radio" name="revision" value={r.id} bind:group={type} />
            {r.label}
          </label>
        {/each}
        <textarea
          rows="3"
          bind:value={note}
          placeholder="Contoh: slide 4 tolong sebut bahwa hanya satu titik yang melebihi baku mutu."
        ></textarea>
        <button disabled={!note.trim()} onclick={revise}>↺ Kirim revisi</button>
        <p class="small muted">Bagian yang sudah disetujui tetap dipertahankan. Hanya bagian yang direvisi diproses ulang.</p>
      </fieldset>
    </div>

    <div class="card history">
      <h3>Riwayat versi & revisi</h3>
      {#each flow.history as entry, i (i)}
        <p class="small entry"><span class="muted">{entry.at}</span> {entry.text}</p>
      {:else}
        <p class="small muted">Belum ada riwayat.</p>
      {/each}
    </div>
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
    gap: 12px;
  }

  .decision,
  fieldset {
    display: grid;
    gap: 8px;
  }

  fieldset {
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px;
    margin: 0;
  }

  .route {
    display: flex;
    gap: 8px;
    align-items: center;
    cursor: pointer;
  }

  .warn {
    color: var(--merah);
    font-weight: 600;
  }

  .history {
    display: grid;
    gap: 6px;
    max-height: 320px;
    overflow: auto;
  }

  .entry {
    border-bottom: 1px solid var(--border);
    padding-bottom: 6px;
  }

  .sources {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }

  button.chip {
    cursor: pointer;
  }

  button.chip[aria-pressed='true'] {
    border-color: var(--accent);
    background: var(--accent-bg);
    color: var(--accent);
  }

  .chip.none {
    background: var(--merah-bg);
    color: var(--merah);
  }

  .passage {
    background: #fff1a8;
    border-radius: 6px;
    padding: 6px 8px;
  }

  @media (max-width: 860px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }
</style>
