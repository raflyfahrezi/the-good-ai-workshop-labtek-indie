<script>
  // The journalist's Publik / Sensitif label for one item. Never set by the AI.
  /** @type {{ level: 'publik' | 'sensitif' | null | undefined, onchange: (level: 'publik' | 'sensitif') => void }} */
  let { level, onchange } = $props()
</script>

<div class="toggle" role="group" aria-label="Label sensitivitas">
  <button class="publik" aria-pressed={level === 'publik'} onclick={() => onchange('publik')}>Publik</button>
  <button class="sensitif" aria-pressed={level === 'sensitif'} onclick={() => onchange('sensitif')}>Sensitif</button>
</div>

<style>
  .toggle {
    display: flex;
    flex: none;
  }

  button {
    font-size: 12px;
    padding: 4px 10px;
    color: var(--muted);
  }

  button + button {
    margin-left: -1.5px;
  }

  button[aria-pressed='true'] {
    color: var(--text);
    font-weight: 600;
    position: relative;
  }

  .publik[aria-pressed='true'] {
    background: var(--hijau-bg);
    border-color: var(--hijau);
  }

  .sensitif[aria-pressed='true'] {
    background: var(--merah-bg);
    border-color: var(--merah);
  }
</style>
