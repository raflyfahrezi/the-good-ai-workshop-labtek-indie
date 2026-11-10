<script>
  /** @type {{ stats: { value: string | number, label: string, alert?: boolean }[] }} */
  let { stats } = $props()
</script>

<dl class="strip">
  {#each stats as stat (stat.label)}
    <div class="cell" class:alert={stat.alert}>
      <dt>{stat.label}</dt>
      <dd>{stat.value}</dd>
    </div>
  {/each}
</dl>

<style>
  .strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    margin: 0;
    border: 1.5px solid var(--border);
    background: var(--card);
  }

  .cell {
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-end;
    gap: 6px;
    padding: 14px 16px 16px;
    border-left: 1.5px solid var(--border);
  }

  .cell:first-child {
    border-left: 0;
  }

  dd {
    margin: 0;
    font: 500 34px/1 var(--font-display);
    letter-spacing: -0.5px;
  }

  dt {
    font: 400 11px/1.35 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--muted);
  }

  .alert {
    background: var(--kuning-bg);
  }

  @media (max-width: 760px) {
    .strip {
      grid-template-columns: 1fr 1fr;
    }
    .cell:nth-child(3) {
      border-left: 0;
    }
    .cell:nth-child(n + 3) {
      border-top: 1.5px solid var(--border);
    }
  }
</style>
