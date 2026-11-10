<script>
  // Under each slide in step 5: its source IDs. Opening one shows the original passage in its document colour.
  import { findSource } from '../../lib/flow.svelte.js'
  import { docColor } from '../../lib/script.js'

  /** @type {{ sources: string[], open: string | null, ontoggle: (id: string) => void }} */
  let { sources, open, ontoggle } = $props()

  let shown = $derived(open && sources.includes(open) ? findSource(open) : null)
</script>

<div class="chips">
  <span class="lbl">Sumber</span>
  {#each sources as id (id)}
    <button aria-pressed={open === id} aria-expanded={open === id} onclick={() => ontoggle(id)}>{id}</button>
  {:else}
    <span class="none">tanpa sumber</span>
  {/each}
</div>

{#if shown}
  <blockquote style:--doc={docColor(shown.item.id)}>
    <span class="from">{shown.item.id} · {shown.item.label}</span>
    {shown.part?.text ?? shown.item.credit}
  </blockquote>
{/if}

<style>
  .chips {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
  }

  .lbl {
    font: 400 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--muted);
    margin-right: 2px;
  }

  button,
  .none {
    font: 600 10px/1 var(--font-mono);
    padding: 4px 6px;
  }

  button[aria-pressed='true'] {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--on-solid);
  }

  .none {
    border: 1px solid var(--merah);
    color: var(--merah);
    background: var(--merah-bg);
  }

  blockquote {
    margin: 0;
    display: grid;
    gap: 4px;
    background: var(--doc);
    border-left: 3px solid var(--text);
    padding: 8px 10px;
    font: 400 14px/1.45 var(--font-display);
  }

  .from {
    font: 600 10px/1.3 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
</style>
