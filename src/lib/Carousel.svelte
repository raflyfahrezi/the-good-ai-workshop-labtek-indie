<script>
  import { story } from './data.js'
  import { findSource, flagIcon } from './flow.svelte.js'

  let { slides, flags = [] } = $props()
</script>

<div class="carousel">
  {#each slides as slide (slide.id)}
    {@const slideFlags = flags.filter((f) => f.lineId === slide.id)}
    <figure>
      <div class="slide">
        {#if slide.visual}
          <div class="visual">[{slide.visual}] {findSource(slide.visual).item.label}</div>
        {/if}
        <p class="text">{slide.text}</p>
        <div class="foot">
          <span>{story.newsroom}</span>
          <span>{slide.n}/{slides.length}</span>
        </div>
      </div>
      {#each slideFlags as flag, i (i)}
        <figcaption class="flag {flag.level}">{flagIcon[flag.level]} {flag.text}</figcaption>
      {/each}
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
    aspect-ratio: 4 / 5;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
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
