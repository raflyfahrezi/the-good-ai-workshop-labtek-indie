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
    background: var(--card);
    border: 1.5px solid var(--border);
    border-radius: 0;
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

  /* Layout c: inverted ink card */
  .layout-c {
    background: var(--text);
    color: var(--bg);
  }
  .layout-c .visual {
    background: transparent;
    border-color: var(--muted);
    color: var(--bg);
  }
  .layout-c .foot {
    color: var(--bg);
    opacity: 0.7;
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
    color: var(--on-solid);
    padding: 1px 8px;
    border-radius: 999px;
  }

  .visual {
    flex: 1;
    border: 1.5px solid var(--border);
    background: repeating-linear-gradient(45deg, var(--fl), var(--fl) 8px, transparent 8px, transparent 16px);
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
    border-radius: 0;
    background: var(--fl);
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
