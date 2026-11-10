<script>
  // One numbered row of the brief sheet. The label names the group, so screen readers read it with the controls.
  /** @type {{ n: number, label: string, hint?: string, children: import('svelte').Snippet }} */
  let { n, label, hint, children } = $props()
  const id = $props.id()
</script>

<div class="row" role="group" aria-labelledby="{id}-label">
  <span class="n" aria-hidden="true">{String(n).padStart(2, '0')}</span>
  <div class="body">
    <p class="label" id="{id}-label">{label}</p>
    {@render children()}
    {#if hint}<p class="hint">{hint}</p>{/if}
  </div>
</div>

<style>
  .row {
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr);
    gap: 12px;
    padding: 16px 18px;
  }

  .row + :global(.row) {
    border-top: 1px solid var(--fl);
  }

  .n {
    font: 600 12px/1.6 var(--font-mono);
    color: var(--muted);
  }

  .body {
    display: grid;
    gap: 8px;
    min-width: 0;
  }

  .label {
    font: 600 11px/1.6 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .hint {
    font-size: 12px;
    color: var(--muted);
  }
</style>
