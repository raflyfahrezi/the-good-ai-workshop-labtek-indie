<script>
  // The slides as a contact sheet: each frame is numbered, carries its QC flags, and an optional actions snippet.
  // Shared by step 4 (edit, regenerate) and step 5 (sources).
  import { flagMark, frameId } from '../../lib/media.js'
  import SlideArt from './SlideArt.svelte'

  /**
   * fresh: IDs of slides reprocessed in the latest generation; busy: IDs being regenerated right now
   * @type {{ slides: any[], flags?: any[], actions?: import('svelte').Snippet<[any]>, fresh?: string[], busy?: Record<string, boolean> }}
   */
  let { slides, flags = [], actions, fresh = [], busy = {} } = $props()
</script>

<div class="sheet">
  {#each slides as slide, i (slide.id)}
    {@const slideFlags = flags.filter((f) => f.lineId === slide.id)}
    <figure id={frameId(slide.n)} style:--i={i}>
      <p class="fr">
        <span>FR {String(slide.n).padStart(2, '0')}</span>
        {#if fresh.includes(slide.id)}<span class="fresh">Baru diproses</span>{/if}
        <span class="lid">{slide.id}</span>
      </p>
      <SlideArt {slide} total={slides.length} busy={busy[slide.id]} />
      {#each slideFlags as flag, j (j)}
        <figcaption class="flag {flag.level}">
          <span class="code">{flagMark[flag.level].code}</span>
          <span>{flag.text}</span>
        </figcaption>
      {/each}
      {@render actions?.(slide)}
    </figure>
  {/each}
</div>

<style>
  .sheet {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 22px 16px;
  }

  figure {
    margin: 0;
    display: grid;
    gap: 6px;
    align-content: start;
    scroll-margin: 90px;
    animation: develop 0.45s ease-out both;
    animation-delay: calc(var(--i) * 60ms);
  }

  /* Highlight when a QC finding links here */
  figure:global(.flash) :global(.slide) {
    outline: 3px solid var(--kuning);
    outline-offset: 3px;
  }

  @keyframes develop {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
  }

  .fr {
    display: flex;
    align-items: center;
    gap: 8px;
    font: 600 10px/1 var(--font-mono);
    letter-spacing: 0.8px;
  }

  .lid {
    margin-left: auto;
    color: var(--muted);
    font-weight: 400;
  }

  .fresh {
    text-transform: uppercase;
    background: var(--kuning);
    color: var(--on-solid);
    padding: 3px 5px;
  }

  .flag {
    display: flex;
    gap: 6px;
    align-items: baseline;
    font-size: 12px;
    line-height: 1.35;
    padding: 6px 8px;
    border-left: 3px solid currentColor;
    background: var(--fl);
    color: var(--muted);
  }

  .flag.merah {
    background: var(--merah-bg);
    color: var(--merah);
  }

  .flag.kuning {
    background: var(--kuning-bg);
    color: var(--kuning);
  }

  .code {
    flex: none;
    font: 600 9px/1 var(--font-mono);
    padding: 2px 4px;
    border: 1px solid currentColor;
  }

  @media (prefers-reduced-motion: reduce) {
    figure {
      animation: none;
    }
  }
</style>
