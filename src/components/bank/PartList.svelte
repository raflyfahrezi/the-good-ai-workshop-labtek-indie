<script>
  // The ID'd parts of one item (paragraphs, quotes, pages, video events). Output cites these IDs.
  import { flow } from '../../lib/flow.svelte.js'
  import { kindLabel, partsSummary } from '../../lib/bank.js'

  /** @type {{ item: { id: string, type: string, parts: { id: string, text: string, time?: string, page?: number, kind?: string }[] } }} */
  let { item } = $props()
</script>

<details open={item.type === 'video'}>
  <summary>{partsSummary(item)}</summary>
  <ol class="parts">
    {#each item.parts as part (part.id)}
      <li>
        <span class="id">{part.id}</span>
        <span class="where">
          {#if part.kind}<span class="kind {part.kind}">{kindLabel[part.kind]}</span>{/if}
          {#if part.time}{part.time}{/if}
          {#if part.page}hlm. {part.page}{/if}
        </span>
        <span class="text">{part.text}</span>
      </li>
    {/each}
  </ol>

  {#if item.type === 'video'}
    <label class="check">
      <input type="checkbox" bind:checked={flow.videoChecked[item.id]} />
      <span><strong>Cek jurnalis:</strong> saya sudah mencocokkan deskripsi visual AI dengan rekamannya</span>
    </label>
  {/if}
</details>

<style>
  summary {
    cursor: pointer;
    font: 400 12px/1.4 var(--font-mono);
    color: var(--text);
    text-decoration: underline dotted;
    text-underline-offset: 3px;
  }

  .parts {
    list-style: none;
    margin: 8px 0 0;
    padding: 0;
    border-top: 1px solid var(--fl);
  }

  li {
    display: grid;
    grid-template-columns: 74px 92px 1fr;
    gap: 8px;
    padding: 6px 0;
    border-bottom: 1px solid var(--fl);
    font-size: 12px;
  }

  .id {
    font: 600 11px/1.5 var(--font-mono);
  }

  .where {
    font: 400 11px/1.5 var(--font-mono);
    color: var(--muted);
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .kind {
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text);
  }

  .kind.visual {
    background: var(--fl);
    padding: 0 4px;
  }

  .check {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    margin-top: 10px;
    padding: 8px 10px;
    border: 1.5px dashed var(--border);
    font-size: 12px;
    cursor: pointer;
  }

  .check input {
    margin: 2px 0 0;
  }

  @media (max-width: 560px) {
    li {
      grid-template-columns: 74px 1fr;
    }
    .text {
      grid-column: 1 / -1;
    }
  }
</style>
