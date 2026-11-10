<script>
  /** @type {{ actions: { label: string, onclick?: () => void, disabled?: boolean, hint?: string }[] }} */
  let { actions } = $props()
</script>

<section class="panel">
  <h3>Aksi cepat</h3>
  <div class="list">
    {#each actions as action (action.label)}
      <button onclick={action.onclick} disabled={action.disabled} title={action.hint}>
        <span>{action.label}</span>
        <span class="arrow" aria-hidden="true">→</span>
      </button>
    {/each}
  </div>
</section>

<style>
  .panel {
    border: 1.5px dashed var(--border);
    padding: 14px 16px;
    display: grid;
    gap: 10px;
  }

  h3 {
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .list {
    display: grid;
    gap: 6px;
  }

  button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    padding: 8px 12px;
  }

  .arrow {
    color: var(--muted);
    transition: transform 0.15s ease;
  }

  button:hover:not(:disabled) .arrow {
    transform: translateX(3px);
    color: var(--text);
  }
</style>
