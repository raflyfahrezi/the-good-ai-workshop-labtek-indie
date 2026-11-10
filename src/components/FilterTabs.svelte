<script>
  // Segmented filter tabs with a count each. Shared by Project Saya and Bank Informasi.
  /** @type {{ filters: { id: string, label: string, count: number }[], value: string, label?: string, size?: 'md' | 'sm' }} */
  let { filters, value = $bindable(), label = 'Saring', size = 'md' } = $props()
</script>

<div class="filters {size}" role="group" aria-label={label}>
  {#each filters as f (f.id)}
    <button aria-pressed={value === f.id} disabled={f.count === 0 && value !== f.id} onclick={() => (value = f.id)}>
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

  .sm button {
    font-size: 12px;
    padding: 5px 10px;
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
