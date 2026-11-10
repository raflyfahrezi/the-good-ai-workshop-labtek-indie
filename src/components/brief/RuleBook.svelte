<script>
  // The guideline: rules written by the journalist. The AI follows them, and auto QC checks the output against them.
  import { guidelineTemplates } from '../../lib/data.js'
  import { flow } from '../../lib/flow.svelte.js'
  import { addRule, loadTemplate, removeRule } from '../../lib/brief.js'

  let template = $state(guidelineTemplates[0].id)
  let draft = $state('')

  function submit(e) {
    e.preventDefault()
    if (addRule(draft)) draft = ''
  }
</script>

<section class="book">
  <header>
    <h3>Guideline</h3>
    <p>Aturan yang wajib dipatuhi AI. QC otomatis di langkah 4 memeriksa hasilnya terhadap aturan yang sama.</p>
  </header>

  <div class="template">
    <select bind:value={template} aria-label="Template guideline">
      {#each guidelineTemplates as t (t.id)}
        <option value={t.id}>{t.label}</option>
      {/each}
    </select>
    <button onclick={() => loadTemplate(template)}>Muat template</button>
  </div>
  <p class="note">Template mengganti daftar di bawah. Setiap aturan tetap bisa diubah atau dihapus.</p>

  <ol class="rules">
    {#each flow.brief.guardrails as _, i (i)}
      <li class:empty={!flow.brief.guardrails[i].trim()}>
        <span class="id">A{i + 1}</span>
        <textarea rows="1" bind:value={flow.brief.guardrails[i]} aria-label="Aturan {i + 1}"></textarea>
        <button class="remove" aria-label="Hapus aturan {i + 1}" onclick={() => removeRule(i)}>×</button>
      </li>
    {:else}
      <li class="none">Belum ada aturan. AI hanya mengikuti brief.</li>
    {/each}
  </ol>

  <form class="add" onsubmit={submit}>
    <span class="id" aria-hidden="true">+</span>
    <input type="text" bind:value={draft} aria-label="Aturan baru" placeholder="Tulis aturan baru dengan kata-kata Anda sendiri" />
    <button type="submit" disabled={!draft.trim()}>Tambah</button>
  </form>
</section>

<style>
  .book {
    display: grid;
    gap: 10px;
    background: var(--card);
    border: 1.5px solid var(--border);
    padding: 16px 18px 18px;
  }

  header {
    display: grid;
    gap: 4px;
    padding-bottom: 10px;
    border-bottom: 1.5px solid var(--border);
  }

  h3 {
    font: 500 22px/1.1 var(--font-display);
  }

  header p,
  .note {
    font-size: 12px;
    color: var(--muted);
  }

  .template {
    display: flex;
    gap: 8px;
  }

  .template button {
    flex: none;
  }

  .rules {
    list-style: none;
    margin: 4px 0 0;
    padding: 0;
  }

  li,
  .add {
    display: grid;
    grid-template-columns: 32px minmax(0, 1fr) auto;
    align-items: start;
    gap: 8px;
    border-bottom: 1px solid var(--fl);
  }

  .id,
  .remove {
    margin-top: 9px;
  }

  .add .id,
  .add button {
    margin-top: 0;
    align-self: center;
  }

  .id {
    font: 600 11px/1 var(--font-mono);
    color: var(--muted);
  }

  /* Rules read as ruled lines on a sheet, and only look like inputs on focus */
  /* Grows with the text, so long rules are never cut off */
  li textarea {
    field-sizing: content;
    resize: none;
    min-height: 0;
    border-color: transparent;
    background: none;
    padding: 7px 6px;
    line-height: 1.4;
  }

  li textarea:hover {
    border-bottom-color: var(--border);
  }

  li textarea:focus {
    border-color: var(--text);
    background: var(--card);
    outline: none;
  }

  li.empty .id {
    color: var(--kuning);
  }

  .remove {
    margin-top: 4px;
    border-color: transparent;
    background: none;
    color: var(--muted);
    padding: 2px 8px;
    font-size: 16px;
  }

  .remove:hover:not(:disabled) {
    border-color: var(--merah);
    color: var(--merah);
  }

  .none {
    display: block;
    padding: 14px 0;
    font-size: 13px;
    color: var(--muted);
  }

  .add {
    border-bottom: 0;
    padding-top: 6px;
  }

  .add input {
    border-style: dashed;
  }
</style>
