<script>
  import { story } from './data.js'
  import { findSource, flagIcon } from './flow.svelte.js'

  // actions: optional snippet rendered under each slide (edit, regenerate, sources)
  // fresh: IDs of slides reprocessed in the latest generation; busy: IDs being regenerated right now
  let { slides, flags = [], actions, fresh = [], busy = {} } = $props()

  // "Regenerate slide" cycles through a few layouts
  const layouts = ['a', 'b', 'c']
</script>

<div class="carousel">
  {#each slides as slide (slide.id)}
    {@const slideFlags = flags.filter((f) => f.lineId === slide.id)}
    <figure>
      <div class="slide layout-{layouts[slide.variant % layouts.length]}" class:busy={busy[slide.id]}>
        {#if fresh.includes(slide.id)}<span class="fresh">baru diproses</span>{/if}
        {#if slide.visual}
          <div class="visual">[{slide.visual}] {findSource(slide.visual).item.label}</div>
        {/if}
        <p class="text">{slide.text}</p>
        <div class="foot">
          <span>{story.newsroom}</span>
          <span>{slide.n}/{slides.length}</span>
        </div>
        {#if busy[slide.id]}<div class="overlay small">… AI membuat ulang slide ini</div>{/if}
      </div>
      {#each slideFlags as flag, i (i)}
        <figcaption class="flag {flag.level}">{flagIcon[flag.level]} {flag.text}</figcaption>
      {/each}
      {@render actions?.(slide)}
    </figure>
  {/each}
</div>

<style>
  .carousel {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 14px;
  }

  figure {
    margin: 0;
    display: grid;
    gap: 6px;
    align-content: start;
  }

  .slide {
    position: relative;
    aspect-ratio: 4 / 5;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* Layout b: text above the visual */
  .layout-b .visual {
    order: 2;
  }
  .layout-b .foot {
    order: 3;
  }

  /* Layout c: dark card */
  .layout-c {
    background: #1d2b3a;
    color: #fff;
  }
  .layout-c .visual {
    background: #2c3e50;
    border-color: #4a5d70;
    color: #c9d4de;
  }
  .layout-c .foot {
    color: #9fb0c0;
  }

  .busy {
    opacity: 0.5;
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-weight: 600;
    color: var(--accent);
  }

  .fresh {
    position: absolute;
    top: -8px;
    right: 8px;
    font-size: 11px;
    font-weight: 600;
    background: var(--accent);
    color: #fff;
    padding: 1px 8px;
    border-radius: 999px;
  }

  .visual {
    flex: 1;
    border: 2px dashed var(--border);
    border-radius: 6px;
    background: #f1f1ee;
    display: grid;
    place-items: center;
    text-align: center;
    padding: 8px;
    font-size: 12px;
    color: var(--muted);
  }

  .text {
    font-weight: 600;
    font-size: 15px;
    line-height: 1.35;
  }

  .slide:not(:has(.visual)) .text {
    flex: 1;
    display: grid;
    align-items: center;
    font-size: 17px;
  }

  .foot {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--muted);
  }

  .flag {
    font-size: 13px;
    padding: 6px 8px;
    border-radius: 6px;
    background: #ececea;
  }

  .flag.merah {
    background: var(--merah-bg);
    color: var(--merah);
  }

  .flag.kuning {
    background: var(--kuning-bg);
    color: var(--kuning);
  }
</style>
