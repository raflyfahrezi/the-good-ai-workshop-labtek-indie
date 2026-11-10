<script>
  // One section of the settings sheet: the label and explanation on the left, the controls on the right
  /** @type {{ title: string, desc?: string, live?: boolean, children: import('svelte').Snippet }} */
  let { title, desc, live = false, children } = $props()
</script>

<section class="row">
  <div class="head">
    <h3>{title}</h3>
    {#if desc}<p>{desc}</p>{/if}
    <span class="state" class:live>{live ? 'Aktif di demo' : 'Contoh tampilan'}</span>
  </div>
  <div class="body">
    {@render children()}
  </div>
</section>

<style>
  .row {
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr);
    gap: 24px;
    padding: 20px 0;
    border-bottom: 1px dashed var(--border);
  }

  .head {
    display: grid;
    align-content: start;
    gap: 6px;
  }

  h3 {
    font: 500 20px/1.15 var(--font-display);
  }

  p {
    font-size: 12.5px;
    color: var(--muted);
  }

  .state {
    justify-self: start;
    font: 400 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--muted);
    border: 1px solid var(--border);
    padding: 3px 5px;
  }

  .state.live {
    color: var(--hijau);
    border-color: var(--hijau);
    background: var(--hijau-bg);
  }

  .body {
    display: grid;
    align-content: start;
    gap: 10px;
  }

  @media (max-width: 720px) {
    .row {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }
</style>
