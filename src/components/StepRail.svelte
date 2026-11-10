<script>
  // The six workflow steps as one segmented rail. compact hides the labels (for small cards).
  /** @type {{ rail: { id: string, label: string, state: 'done' | 'current' | 'todo' }[], compact?: boolean }} */
  let { rail, compact = false } = $props()
</script>

<ol class="rail" class:compact aria-label="Progres alur kerja">
  {#each rail as step (step.id)}
    <li class={step.state} aria-current={step.state === 'current' ? 'step' : undefined} title="{step.id}. {step.label}">
      {#if !compact}
        <span class="num">{step.id}</span>
        <span class="label">{step.label}</span>
      {/if}
    </li>
  {/each}
</ol>

<style>
  .rail {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 4px;
  }

  li {
    border-top: 4px solid var(--fl);
    padding-top: 6px;
    display: grid;
    gap: 2px;
    color: var(--muted);
  }

  .compact li {
    padding-top: 0;
  }

  li.done {
    border-top-color: var(--muted);
  }

  li.current {
    border-top-color: var(--accent);
    color: var(--text);
  }

  .num {
    font: 600 11px/1 var(--font-mono);
  }

  .label {
    font-size: 11px;
    line-height: 1.25;
  }

  @media (max-width: 560px) {
    .rail:not(.compact) {
      grid-template-columns: repeat(3, 1fr);
      row-gap: 10px;
    }
  }
</style>
