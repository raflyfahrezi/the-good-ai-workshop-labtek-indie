<script>
  import { formats, guardrails } from '../lib/data.js'
  import { flow } from '../lib/flow.svelte.js'
</script>

<div class="screen-head">
  <h2>2 · Brief & Guardrails</h2>
  <p class="muted">Tentukan bentuk konten dan aturan yang wajib dipatuhi AI.</p>
  <p class="human">
    <strong>Keputusan jurnalis:</strong> aturan main ditetapkan jurnalis. AI mengikuti aturan ini, dan QC otomatis di
    langkah 4 memeriksa hasilnya terhadap aturan yang sama.
  </p>
</div>

<div class="cols">
  <section class="card">
    <h3>Brief</h3>

    <p class="label">Format</p>
    <div class="formats">
      {#each formats as f (f.id)}
        <label class="format" class:active={flow.brief.format === f.id}>
          <input type="radio" name="format" value={f.id} bind:group={flow.brief.format} />
          <span>
            <strong>{f.label}</strong>
            <span class="small muted">{f.hint}</span>
          </span>
        </label>
      {/each}
    </div>
    {#if flow.brief.format !== 'carousel'}
      <p class="small warn">Di demo ini contoh naskah yang tersedia hanya untuk Carousel Instagram.</p>
    {/if}

    <label class="field">
      <span class="label">Audiens</span>
      <input type="text" bind:value={flow.brief.audience} />
    </label>
    <label class="field">
      <span class="label">Nada</span>
      <input type="text" bind:value={flow.brief.tone} />
    </label>
    <label class="field short">
      <span class="label">Jumlah slide</span>
      <input type="number" min="3" max="12" bind:value={flow.brief.length} />
    </label>
  </section>

  <section class="card">
    <h3>Guardrails</h3>
    <p class="small muted">Aturan yang tidak boleh dilanggar AI.</p>
    {#each guardrails as g (g.id)}
      <label class="rule">
        <input type="checkbox" bind:checked={flow.brief.guardrails[g.id]} />
        <span>{g.label}</span>
      </label>
    {/each}
  </section>
</div>

<style>
  .cols {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 20px;
    align-items: start;
  }

  section {
    display: grid;
    gap: 10px;
  }

  .label {
    font-size: 14px;
    font-weight: 600;
  }

  .formats {
    display: grid;
    gap: 6px;
  }

  .format {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 8px 10px;
    cursor: pointer;
  }

  .format.active {
    border-color: var(--accent);
    background: var(--accent-bg);
  }

  .format > span {
    display: grid;
  }

  .field {
    display: grid;
    gap: 4px;
  }

  .field.short {
    max-width: 140px;
  }

  .rule {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    cursor: pointer;
  }

  .rule input {
    margin-top: 5px;
  }

  .warn {
    color: var(--kuning);
    font-weight: 600;
  }

  @media (max-width: 760px) {
    .cols {
      grid-template-columns: 1fr;
    }
  }
</style>
