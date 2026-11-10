<script>
  // The export package as a shipping manifest: pick the files, set the credit, send.
  /**
   * @type {{
   *   items: { id: string, label: string, file: string, on: boolean, real: boolean }[],
   *   chosen: Record<string, boolean>, credit: string, approved: boolean, onexport: () => void
   * }}
   */
  let { items, chosen = $bindable(), credit = $bindable(), approved, onexport } = $props()

  let count = $derived(items.filter((i) => i.on).length)
</script>

<section class="manifest" aria-label="Paket ekspor">
  <header>
    <p class="kicker">Paket ekspor</p>
    <span class="count">{count} berkas</span>
  </header>

  <ul class="files">
    {#each items as item (item.id)}
      <li class:on={item.on}>
        <label>
          <input type="checkbox" bind:checked={chosen[item.id]} />
          <span class="box" aria-hidden="true">{item.on ? '✓' : ''}</span>
          <span class="name">{item.file}</span>
          <span class="label">{item.label}</span>
          <span class="kind" class:real={item.real}>{item.real ? 'Berkas asli' : 'Simulasi'}</span>
        </label>
      </li>
    {/each}
  </ul>

  <label class="credit">
    <span class="lbl">Credit</span>
    <textarea bind:value={credit}></textarea>
    <span class="hint">Disertakan di caption dan metadata.</span>
  </label>

  <button class="send" disabled={!approved || count === 0} onclick={onexport}>Unduh {count} berkas</button>
  {#if !approved}
    <p class="blocked">Konten belum disetujui. Setujui dulu di langkah 5.</p>
  {:else}
    <p class="hint">Simulasi: hanya Jejak Sumber .csv yang benar-benar dibuat. Gambar, PDF dan caption tidak.</p>
  {/if}
</section>

<style>
  .manifest {
    display: grid;
    gap: 12px;
    background: var(--card);
    border: 1.5px solid var(--border);
    padding: 14px 16px 16px;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-bottom: 10px;
    border-bottom: 1.5px solid var(--border);
  }

  .kicker {
    font: 500 22px/1.1 var(--font-display);
  }

  .count,
  .lbl {
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .count {
    color: var(--muted);
    font-weight: 400;
  }

  .files {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
  }

  .files li {
    border-bottom: 1px dashed var(--border);
  }

  .files label {
    position: relative;
    display: grid;
    grid-template-columns: 18px minmax(0, 1fr) auto;
    grid-template-areas: 'box name kind' 'box label kind';
    gap: 2px 10px;
    align-items: center;
    padding: 8px 0;
    cursor: pointer;
  }

  input {
    position: absolute;
    opacity: 0;
    inset: 0;
    margin: 0;
    cursor: pointer;
  }

  li:has(input:focus-visible) {
    outline: 2px solid var(--text);
    outline-offset: 2px;
  }

  .box {
    grid-area: box;
    width: 16px;
    height: 16px;
    border: 1.5px solid var(--border);
    display: grid;
    place-items: center;
    font: 600 11px/1 var(--font-mono);
  }

  .on .box {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--on-solid);
  }

  .name {
    grid-area: name;
    font: 600 12.5px/1.2 var(--font-mono);
    overflow-wrap: anywhere;
  }

  li:not(.on) .name {
    color: var(--muted);
    text-decoration: line-through;
  }

  .label {
    grid-area: label;
    font-size: 12px;
    color: var(--muted);
  }

  .kind {
    grid-area: kind;
    font: 400 9.5px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 3px 5px;
    border: 1px solid var(--border);
    color: var(--muted);
  }

  .kind.real {
    color: var(--hijau);
    border-color: var(--hijau);
    background: var(--hijau-bg);
  }

  .credit {
    display: grid;
    gap: 6px;
  }

  textarea {
    field-sizing: content;
    min-height: 3lh;
    resize: vertical;
    font: 400 15px/1.4 var(--font-display);
  }

  .hint {
    font-size: 12px;
    color: var(--muted);
  }

  .send {
    padding: 12px;
    font: 600 15px/1 var(--font-ui);
    background: var(--accent);
    border-color: var(--accent);
    color: var(--on-solid);
  }

  .blocked {
    font-size: 12px;
    font-weight: 600;
    color: var(--kuning);
  }
</style>
