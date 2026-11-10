<script>
  // Reject and route the revision to the step that owns the problem. Approved parts are kept.
  import { routes } from '../../lib/qc.js'

  /** @type {{ onsend: (type: string, note: string) => void }} */
  let { onsend } = $props()

  let type = $state(routes[0].id)
  let note = $state('')
  let target = $derived(routes.find((r) => r.id === type).step)
</script>

<section class="revise" aria-label="Minta revisi">
  <p class="kicker">Atau minta revisi</p>

  <fieldset>
    <legend>Masalahnya ada di</legend>
    {#each routes as r (r.id)}
      <label class:on={type === r.id}>
        <input type="radio" name="revision" value={r.id} bind:group={type} />
        <span class="what">{r.label}</span>
        <span class="to">→ Langkah {r.step.id}</span>
      </label>
    {/each}
  </fieldset>

  <textarea
    bind:value={note}
    aria-label="Catatan revisi"
    placeholder="Contoh: slide 4 tolong sebut bahwa hanya satu titik yang melebihi baku mutu."
  ></textarea>

  <button disabled={!note.trim()} onclick={() => onsend(type, note)}>
    Kirim ke langkah {target.id}, {target.label}
  </button>
  <p class="hint">Bagian yang sudah disetujui tetap dipertahankan. Hanya bagian yang direvisi diproses ulang.</p>
</section>

<style>
  .revise {
    display: grid;
    gap: 10px;
    border: 1.5px dashed var(--border);
    padding: 14px 16px;
  }

  .kicker,
  legend {
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  fieldset {
    border: 0;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 4px;
  }

  legend {
    font-weight: 400;
    color: var(--muted);
    margin-bottom: 6px;
  }

  label {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 8px;
    align-items: center;
    padding: 7px 9px;
    border: 1.5px solid var(--fl);
    background: var(--card);
    font-size: 13px;
    cursor: pointer;
  }

  label.on {
    border-color: var(--text);
  }

  input {
    margin: 0;
    accent-color: var(--text);
  }

  .to {
    font: 600 10px/1 var(--font-mono);
    text-transform: uppercase;
    color: var(--muted);
  }

  .on .to {
    color: var(--text);
  }

  textarea {
    field-sizing: content;
    min-height: 3lh;
    resize: vertical;
  }

  .hint {
    font-size: 12px;
    color: var(--muted);
  }
</style>
