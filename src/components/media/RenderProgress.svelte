<script>
  // While the (fake) AI renders: the stage list, and empty frames that fill in as the render advances
  import ProcessStages from '../ProcessStages.svelte'

  /** @type {{ stages: string[], current: number, frames: number }} */
  let { stages, current, frames } = $props()

  // Frames "develop" in proportion to how far the stages are
  let filled = $derived(Math.round((current / stages.length) * frames))
</script>

<div class="render">
  <div class="head">
    <p class="kicker">AI sedang merender slide</p>
    <ProcessStages {stages} {current} />
  </div>
  <div class="frames" aria-hidden="true">
    {#each { length: frames }, i (i)}
      <div class="frame" class:filled={i < filled}>
        <span>FR {String(i + 1).padStart(2, '0')}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .render {
    display: grid;
    gap: 16px;
  }

  .head {
    max-width: 560px;
    display: grid;
    gap: 8px;
  }

  .kicker {
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .frames {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }

  .frame {
    aspect-ratio: 4 / 5;
    border: 1.5px dashed var(--border);
    display: grid;
    place-items: start;
    padding: 8px;
    font: 600 10px/1 var(--font-mono);
    color: var(--muted);
    transition:
      background 0.4s,
      border-color 0.4s;
  }

  .frame.filled {
    border-style: solid;
    background: repeating-linear-gradient(135deg, var(--fl) 0 6px, var(--card) 6px 12px);
    color: var(--text);
  }
</style>
