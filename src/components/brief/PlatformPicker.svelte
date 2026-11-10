<script>
  // Target platforms as toggle chips
  import { platforms } from '../../lib/data.js'

  /** @type {{ selected: string[], ontoggle: (platform: string) => void }} */
  let { selected, ontoggle } = $props()
</script>

<div class="chips">
  {#each platforms as p (p)}
    <button aria-pressed={selected.includes(p)} onclick={() => ontoggle(p)}>
      <span class="mark" aria-hidden="true">{selected.includes(p) ? '✓' : '+'}</span>{p}
    </button>
  {/each}
</div>

<style>
  .chips {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  button {
    font-size: 13px;
    padding: 4px 10px;
    display: flex;
    gap: 6px;
    align-items: baseline;
    color: var(--muted);
  }

  .mark {
    font: 600 11px/1 var(--font-mono);
  }

  button[aria-pressed='true'] {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--on-solid);
  }
</style>
