<script>
  import { briefFeedback, formats, outline } from '../lib/data.js'
  import { flow, goTo, allAngles, regenerateConcept } from '../lib/flow.svelte.js'

  // The scripted feedback says the bank holds enough material for 7 slides
  const suggestedLength = 7

  let formatLabels = $derived(flow.brief.formats.map((id) => formats.find((f) => f.id === id).label).join(', '))
  let activeRules = $derived(flow.brief.guardrails.filter((r) => r.trim()))
</script>

<div class="screen-head">
  <h2>3 · Perencanaan Konten AI: Konsep</h2>
  <p class="muted">
    AI menganalisis seluruh bahan di bank informasi dan brief, lalu memberi masukan, beberapa konsep, dan outline.
  </p>
  <p class="human">
    <strong>Keputusan jurnalis:</strong> AI hanya mengusulkan. Jurnalis memilih dan menyetujui konsep sebelum script
    dan media dibuat, atau memberi masukan agar AI membuat ulang konsepnya.
  </p>
</div>

<div class="cols">
  <section class="card brief">
    <h3>Brief saat ini</h3>
    <dl class="small">
      <dt>Tujuan</dt>
      <dd>{flow.brief.objective}</dd>
      <dt>Format</dt>
      <dd>{formatLabels}</dd>
      <dt>Platform</dt>
      <dd>{flow.brief.platforms.join(', ') || '-'}</dd>
      <dt>Audiens</dt>
      <dd>{flow.brief.audience}</dd>
      <dt>Tone</dt>
      <dd>{flow.brief.tone}</dd>
      <dt>Jumlah slide</dt>
      <dd>{flow.brief.length}</dd>
      <dt>Guideline</dt>
      <dd>{activeRules.length} aturan dari jurnalis</dd>
    </dl>
    <button onclick={() => goTo(1)}>← Revisi brief</button>
  </section>

  <section class="card">
    <h3>Masukan AI untuk brief</h3>
    <ul class="feedback">
      {#each briefFeedback as text, i (i)}
        <li>{text}</li>
      {/each}
    </ul>
    {#if flow.brief.length !== suggestedLength}
      <button onclick={() => (flow.brief.length = suggestedLength)}>Terapkan saran: {suggestedLength} slide</button>
    {:else}
      <p class="small ok">✓ Jumlah slide sudah {suggestedLength}.</p>
    {/if}
  </section>
</div>

<h3 class="section-title">Pilih konsep</h3>
<div class="angles">
  {#each allAngles() as a (a.id)}
    <button class="angle card" class:fresh={a.id === 'berimbang'} aria-pressed={flow.angle === a.id} onclick={() => (flow.angle = a.id)}>
      <span class="small muted">{a.title}</span>
      <strong>"{a.hook}"</strong>
      {#if flow.angle === a.id}<span class="small picked">✓ Dipilih jurnalis</span>{/if}
    </button>
  {/each}
</div>

<div class="card regen">
  <label class="field">
    <span class="small"><strong>Belum cocok? Beri masukan ke AI</strong></span>
    <textarea
      rows="2"
      bind:value={flow.conceptFeedback}
      placeholder="Contoh: buat versi yang lebih berimbang, tampilkan semua pihak"
      disabled={flow.conceptRegenerated}
    ></textarea>
  </label>
  {#if flow.regeneratingConcept}
    <p class="small muted">… AI membuat ulang konsep dari masukan Anda. Konsep yang sudah ada dipertahankan.</p>
  {:else if flow.conceptRegenerated}
    <p class="small ok">✓ Konsep baru ditambahkan dari masukan Anda.</p>
  {:else}
    <button disabled={!flow.conceptFeedback.trim()} onclick={regenerateConcept}>↻ Generate ulang konsep</button>
  {/if}
</div>

{#if flow.angle}
  <h3 class="section-title">Outline</h3>
  <div class="card">
    <ol class="outline">
      {#each outline as o (o.slides)}
        <li><span class="chip">Slide {o.slides}</span> <strong>{o.part}:</strong> {o.text}</li>
      {/each}
    </ol>
    <p class="small muted">Script lengkap per baris, beserta sumbernya, diperiksa di langkah 3b.</p>
  </div>
{/if}

<style>
  .cols {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 20px;
    align-items: start;
  }

  section {
    display: grid;
    gap: 10px;
  }

  .brief button,
  section > button {
    justify-self: start;
  }

  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px 12px;
    margin: 0;
  }

  dt {
    color: var(--muted);
  }

  dd {
    margin: 0;
  }

  .feedback {
    margin: 0;
    padding-left: 20px;
    display: grid;
    gap: 6px;
  }

  .ok {
    color: var(--hijau);
    font-weight: 600;
  }

  .section-title {
    margin: 24px 0 10px;
  }

  .angles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
  }

  .angle {
    display: grid;
    gap: 6px;
    text-align: left;
    align-content: start;
  }

  .angle.fresh {
    border-style: dashed;
    border-color: var(--accent);
  }

  .angle[aria-pressed='true'] {
    border: 2px solid var(--human);
    background: var(--human-bg);
  }

  .picked {
    color: var(--human);
    font-weight: 600;
  }

  .regen {
    margin-top: 12px;
    display: grid;
    gap: 8px;
    justify-items: start;
  }

  .field {
    display: grid;
    gap: 4px;
    width: 100%;
  }

  .outline {
    margin: 0 0 8px;
    padding-left: 20px;
    display: grid;
    gap: 6px;
  }

  @media (max-width: 760px) {
    .cols {
      grid-template-columns: 1fr;
    }
  }
</style>
