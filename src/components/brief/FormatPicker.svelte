<script>
  // Media formats as selectable tiles. Only Image Slides is generated in the demo (PRD MVP scope).
  import { formats } from '../../lib/data.js'

  /** @type {{ value: string[] }} */
  let { value = $bindable() } = $props()
</script>

<div class="formats">
  {#each formats as f (f.id)}
    <label class="format" class:active={value.includes(f.id)}>
      <input type="checkbox" value={f.id} bind:group={value} />
      <span class="top">
        <span class="box" aria-hidden="true">{value.includes(f.id) ? '✓' : ''}</span>
        <strong>{f.label}</strong>
      </span>
      <span class="hint">{f.hint}</span>
      <span class="scope" class:mvp={f.mvp}>{f.mvp ? 'Dibuat di demo' : 'Fase berikutnya'}</span>
    </label>
  {/each}
</div>

<style>
  .formats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 8px;
  }

  .format {
    position: relative;
    display: grid;
    align-content: start;
    gap: 6px;
    border: 1.5px solid var(--border);
    background: var(--card);
    padding: 10px 12px 12px;
    cursor: pointer;
  }

  .format:hover {
    border-color: var(--text);
  }

  .format.active {
    border-color: var(--accent);
    box-shadow: inset 0 4px 0 var(--accent);
  }

  /* The native checkbox stays for keyboard and screen readers, the box is the visual */
  input {
    position: absolute;
    opacity: 0;
    inset: 0;
    margin: 0;
    cursor: pointer;
  }

  .format:has(input:focus-visible) {
    outline: 2px solid var(--text);
    outline-offset: 2px;
  }

  .top {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .box {
    flex: none;
    width: 16px;
    height: 16px;
    border: 1.5px solid var(--border);
    display: grid;
    place-items: center;
    font: 600 11px/1 var(--font-mono);
  }

  .active .box {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--on-solid);
  }

  .scope {
    justify-self: start;
    margin-top: 2px;
    font: 400 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--muted);
    border: 1px solid var(--border);
    padding: 3px 5px;
  }

  .scope.mvp {
    color: var(--hijau);
    border-color: var(--hijau);
    background: var(--hijau-bg);
  }

  strong {
    font: 500 18px/1.15 var(--font-display);
  }

  .hint {
    font-size: 12px;
    color: var(--muted);
  }

  @media (max-width: 560px) {
    .formats {
      grid-template-columns: 1fr;
    }
  }
</style>
