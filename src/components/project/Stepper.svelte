<script>
  // The six workflow steps as clickable tabs. Steps ahead of the journalist stay locked.
  import { flow, goTo, steps } from '../../lib/flow.svelte.js'

  const locked = (i) => i > flow.furthest || (steps[i].id === '6' && !flow.approved)
</script>

<ol class="stepper">
  {#each steps as s, i (s.id)}
    {@const state = i === flow.step ? 'current' : i <= flow.furthest && !locked(i) ? 'done' : 'todo'}
    <li>
      <button class={state} disabled={locked(i)} aria-current={state === 'current' ? 'step' : undefined} onclick={() => goTo(i)}>
        <span class="num">{state === 'done' ? '✓' : s.id}</span>
        <span class="label">{s.label}</span>
      </button>
    </li>
  {/each}
</ol>

<style>
  .stepper {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(6, minmax(110px, 1fr));
    gap: 4px;
    overflow-x: auto;
  }

  button {
    width: 100%;
    display: flex;
    align-items: baseline;
    gap: 8px;
    text-align: left;
    border: 0;
    border-top: 4px solid var(--fl);
    background: none;
    padding: 8px 2px 4px;
    white-space: nowrap;
    color: var(--muted);
  }

  button:hover:not(:disabled) {
    border-top-color: var(--border);
    color: var(--text);
  }

  button.done {
    border-top-color: var(--muted);
    color: var(--text);
  }

  button.current {
    border-top-color: var(--accent);
    color: var(--text);
    font-weight: 600;
  }

  button:disabled {
    opacity: 0.45;
  }

  .num {
    font: 600 11px/1 var(--font-mono);
  }

  .label {
    font-size: 12px;
  }
</style>
