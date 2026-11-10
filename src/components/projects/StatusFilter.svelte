<script>
  /** @type {{ filters: { id: string, label: string, count: number }[], value: string }} */
  let { filters, value = $bindable() } = $props()
</script>

<div class="filters" role="group" aria-label="Saring berdasarkan status">
  {#each filters as f (f.id)}
    <button aria-pressed={value === f.id} onclick={() => (value = f.id)}>
      {f.label} <span class="count">{f.count}</span>
    </button>
  {/each}
</div>

<style>
  .filters {
    display: flex;
    flex-wrap: wrap;
  }

  button {
    margin-left: -1.5px;
    font-size: 13px;
    padding: 7px 12px;
  }

  button:first-child {
    margin-left: 0;
  }

  button[aria-pressed='true'] {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--on-solid);
    position: relative;
  }

  .count {
    font: 600 11px/1 var(--font-mono);
    margin-left: 4px;
    opacity: 0.7;
  }
</style>
