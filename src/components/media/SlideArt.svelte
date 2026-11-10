<script>
  // One rendered Image Slide (4:5), drawn as a lo-fi newsroom carousel slide.
  // "Generate ulang" cycles the layout: a = visual on top, b = text on top, c = inverted ink card.
  import { story } from '../../lib/data.js'
  import { findSource } from '../../lib/flow.svelte.js'

  /** @type {{ slide: any, total: number, busy?: boolean }} */
  let { slide, total, busy = false } = $props()

  const layouts = ['a', 'b', 'c']
  let layout = $derived(layouts[slide.variant % layouts.length])
  let visual = $derived(slide.visual ? findSource(slide.visual)?.item : null)
</script>

<div class="art">
  <div class="slide layout-{layout}" class:busy class:textonly={!visual}>
    <div class="mast">
      <span>{story.newsroom}</span>
      <span>{story.desk}</span>
    </div>
  
    {#if visual}
      <div class="visual">
        <span class="crop" aria-hidden="true"></span>
        <span class="vlabel"><b>{visual.id}</b>{visual.label}</span>
      </div>
    {/if}
  
    <p class="text">{slide.text}</p>
  
    <div class="foot">
      <span class="dots" aria-hidden="true">
        {#each { length: total }, i (i)}<i class:on={i + 1 === slide.n}></i>{/each}
      </span>
      <span>{slide.n}/{total}</span>
    </div>
  
    {#if busy}
      <div class="overlay" role="status"><span>AI membuat ulang slide ini</span></div>
    {/if}
  </div>
</div>

<style>
  /* The wrapper is the size container, so every measure inside the slide scales with its width */
  .art {
    container-type: inline-size;
  }

  .slide {
    position: relative;
    aspect-ratio: 4 / 5;
    background: var(--card);
    color: var(--text);
    border: 1.5px solid var(--border);
    padding: 7cqi;
    display: flex;
    flex-direction: column;
    gap: 5cqi;
    overflow: hidden;
  }

  .mast {
    display: flex;
    justify-content: space-between;
    padding-bottom: 3cqi;
    border-bottom: 1px solid currentColor;
    font: 600 4.2cqi/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.4cqi;
  }

  .visual {
    position: relative;
    flex: 1;
    min-height: 0;
    display: grid;
    place-items: end start;
    padding: 4cqi;
    border: 1px solid var(--border);
    background: repeating-linear-gradient(135deg, var(--fl) 0 2.5cqi, transparent 2.5cqi 5cqi);
  }

  /* Crop marks in the corners, like a photo placed on a layout sheet */
  .crop {
    position: absolute;
    inset: 3cqi;
    background:
      linear-gradient(currentColor, currentColor) top left / 5cqi 1px,
      linear-gradient(currentColor, currentColor) top left / 1px 5cqi,
      linear-gradient(currentColor, currentColor) bottom right / 5cqi 1px,
      linear-gradient(currentColor, currentColor) bottom right / 1px 5cqi;
    background-repeat: no-repeat;
    opacity: 0.5;
  }

  .vlabel {
    position: relative;
    display: grid;
    gap: 1cqi;
    max-width: 90%;
    background: var(--card);
    padding: 2cqi 3cqi;
    font: 400 4cqi/1.25 var(--font-ui);
  }

  .vlabel b {
    font: 600 3.6cqi/1 var(--font-mono);
  }

  .text {
    font: 600 7.4cqi/1.2 var(--font-display);
    letter-spacing: -0.1cqi;
  }

  .textonly .text {
    flex: 1;
    display: grid;
    align-content: center;
    font-size: 9.2cqi;
    font-weight: 500;
  }

  .foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font: 400 4cqi/1 var(--font-mono);
    color: var(--muted);
  }

  .dots {
    display: flex;
    gap: 1.5cqi;
  }

  .dots i {
    width: 2cqi;
    height: 2cqi;
    border: 1px solid currentColor;
  }

  .dots i.on {
    background: currentColor;
  }

  .layout-b .visual {
    order: 2;
  }
  .layout-b .foot {
    order: 3;
  }

  .layout-c {
    background: var(--accent);
    color: var(--on-solid);
    border-color: var(--accent);
  }
  .layout-c .foot {
    color: inherit;
    opacity: 0.7;
  }
  .layout-c .visual {
    border-color: currentColor;
    background: repeating-linear-gradient(135deg, transparent 0 2.5cqi, rgb(128 128 128 / 0.25) 2.5cqi 5cqi);
  }
  .layout-c .vlabel {
    background: var(--accent);
  }

  /* Regenerating: the slide dims and a scan line sweeps over it */
  .busy > :not(.overlay) {
    opacity: 0.25;
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: linear-gradient(to bottom, transparent 0 45%, var(--text) 45% calc(45% + 2px), transparent 0) 0 0 / 100% 200%;
    animation: scan 1.2s linear infinite;
  }

  .overlay span {
    font: 600 4.2cqi/1.2 var(--font-mono);
    text-transform: uppercase;
    background: var(--card);
    color: var(--text);
    padding: 2cqi 3cqi;
    border: 1px solid var(--text);
  }

  @keyframes scan {
    from {
      background-position: 0 100%;
    }
    to {
      background-position: 0 -100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .overlay {
      animation: none;
    }
  }
</style>
