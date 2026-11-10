<script>
  // One bank document cited by the selected paragraph, with the cited passages highlighted in its colour
  import { flow } from '../../lib/flow.svelte.js'
  import { kindLabel } from '../../lib/bank.js'

  /** @type {{ item: any, cited: string[], color: string }} */
  let { item, cited, color } = $props()

  let level = $derived(flow.sensitivity[item.id])
</script>

<div class="doc" data-src={item.id} style:--doc={color}>
  <header>
    <span class="swatch" aria-hidden="true"></span>
    <span class="id">{item.id}</span>
    <span class="level {level}">{level}</span>
    {#if level === 'sensitif'}<span class="where">diproses lokal</span>{/if}
  </header>
  <p class="label">{item.label}</p>

  {#if item.parts}
    {#if cited.includes(item.id)}<p class="whole">Merujuk ke seluruh dokumen.</p>{/if}
    <ol class="parts">
      {#each item.parts as part (part.id)}
        {@const hit = cited.includes(part.id)}
        <li class:hit data-src={part.id}>
          <span class="pid">{part.id}</span>
          <span class="where">
            {#if part.kind}{kindLabel[part.kind]}{/if}
            {#if part.time}{part.time}{/if}
            {#if part.page}hlm. {part.page}{/if}
          </span>
          <span class="text">{part.text}</span>
        </li>
      {/each}
    </ol>
    {#if item.type === 'video'}
      <p class="vcheck" class:ok={flow.videoChecked[item.id]}>
        {flow.videoChecked[item.id]
          ? 'Deskripsi visual sudah dicocokkan jurnalis dengan rekaman.'
          : 'Deskripsi visual dibuat AI dan belum dicocokkan dengan rekaman.'}
      </p>
    {/if}
  {:else}
    <div class="media">[{item.type}] {item.label}</div>
  {/if}
</div>

<style>
  .doc {
    display: grid;
    gap: 6px;
    padding: 12px 0;
    border-top: 1px dashed var(--border);
    scroll-margin: 40px 0 90px;
  }

  header {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .swatch {
    width: 12px;
    height: 12px;
    background: var(--doc);
    border: 1px solid var(--border);
  }

  .id,
  .pid {
    font: 600 10px/1 var(--font-mono);
    background: var(--accent);
    color: var(--on-solid);
    padding: 3px 5px;
  }

  .level {
    font: 600 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    padding: 2px 5px;
    border: 1px solid currentColor;
  }

  .level.publik {
    color: var(--hijau);
  }

  .level.sensitif {
    color: var(--merah);
  }

  .where {
    font: 400 10px/1.4 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: var(--muted);
  }

  .label {
    font: 500 15px/1.3 var(--font-display);
  }

  .whole {
    font-size: 12px;
    color: var(--muted);
  }

  .parts {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 2px;
  }

  .parts li {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 2px 8px;
    padding: 6px 8px;
    font-size: 12.5px;
    color: var(--muted);
    border-left: 3px solid transparent;
    scroll-margin: 40px 0 90px;
  }

  .parts .where {
    align-self: center;
  }

  .text {
    grid-column: 1 / -1;
  }

  .parts li.hit {
    background: var(--doc);
    color: var(--text);
    border-left-color: var(--text);
  }

  .hit .text {
    font: 400 14px/1.45 var(--font-display);
  }

  .vcheck {
    font-size: 12px;
    font-weight: 600;
    color: var(--kuning);
  }

  .vcheck.ok {
    color: var(--hijau);
  }

  .media {
    background: var(--doc);
    border-left: 3px solid var(--text);
    padding: 22px 12px;
    font: 400 12px/1.3 var(--font-mono);
  }
</style>
