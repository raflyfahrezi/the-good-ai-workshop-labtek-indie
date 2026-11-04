<script>
  import { angles, briefFeedback, formats, guardrails } from '../lib/data.js'
  import { flow, goTo } from '../lib/flow.svelte.js'

  // The scripted feedback says the bank holds enough material for 7 slides
  const suggestedLength = 7

  let format = $derived(formats.find((f) => f.id === flow.brief.format))
  let activeRules = $derived(guardrails.filter((g) => flow.brief.guardrails[g.id]))
</script>

<div class="screen-head">
  <h2>3 · Saran & Masukan AI</h2>
  <p class="muted">AI membaca brief dan bank informasi, lalu memberi masukan dan beberapa pilihan sudut cerita.</p>
  <p class="human">
    <strong>Keputusan jurnalis:</strong> AI hanya mengusulkan. Jurnalis memilih sudut cerita, atau kembali merevisi
    brief.
  </p>
</div>

{#if flow.revisionNote}
  <div class="revision card">
    <strong>Catatan revisi dari QC jurnalis:</strong>
    <p>{flow.revisionNote}</p>
  </div>
{/if}

<div class="cols">
  <section class="card brief">
    <h3>Brief saat ini</h3>
    <dl class="small">
      <dt>Format</dt>
      <dd>{format.label}</dd>
      <dt>Audiens</dt>
      <dd>{flow.brief.audience}</dd>
      <dt>Nada</dt>
      <dd>{flow.brief.tone}</dd>
      <dt>Jumlah slide</dt>
      <dd>{flow.brief.length}</dd>
      <dt>Guardrails</dt>
      <dd>{activeRules.length} dari {guardrails.length} aktif</dd>
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

<h3 class="angles-title">Pilih sudut cerita</h3>
<div class="angles">
  {#each angles as a (a.id)}
    <button class="angle card" aria-pressed={flow.angle === a.id} onclick={() => (flow.angle = a.id)}>
      <span class="small muted">{a.title}</span>
      <strong>"{a.hook}"</strong>
      {#if flow.angle === a.id}<span class="small picked">✓ Dipilih jurnalis</span>{/if}
    </button>
  {/each}
</div>

<style>
  .revision {
    border-color: var(--human);
    background: var(--human-bg);
    margin-bottom: 16px;
  }

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

  .angles-title {
    margin: 24px 0 10px;
  }

  .angles {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .angle {
    display: grid;
    gap: 6px;
    text-align: left;
    align-content: start;
  }

  .angle[aria-pressed='true'] {
    border: 2px solid var(--human);
    background: var(--human-bg);
  }

  .picked {
    color: var(--human);
    font-weight: 600;
  }

  @media (max-width: 760px) {
    .cols,
    .angles {
      grid-template-columns: 1fr;
    }
  }
</style>
