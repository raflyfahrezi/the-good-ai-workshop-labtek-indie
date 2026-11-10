<script>
  // The work's metadata set like a book colophon: who made it, from what, and with how much AI
  /** @type {{ rows: [string, string][], credit: string }} */
  let { rows, credit } = $props()
</script>

<section class="colophon" aria-label="Metadata karya">
  <p class="kicker">Kolofon · metadata karya</p>
  <span class="rule" aria-hidden="true">✦</span>
  <dl>
    {#each rows as [key, value] (key)}
      <div>
        <dt>{key}</dt>
        <dd>{value}</dd>
      </div>
    {/each}
  </dl>
  <span class="rule" aria-hidden="true">✦</span>
  <p class="credit">{credit}</p>
</section>

<style>
  .colophon {
    display: grid;
    justify-items: center;
    gap: 12px;
    text-align: center;
    background: var(--card);
    border: 1.5px solid var(--border);
    outline: 1px solid var(--border);
    outline-offset: -7px;
    padding: 24px 26px;
  }

  .kicker {
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 1.2px;
  }

  .rule {
    font-size: 12px;
    color: var(--muted);
  }

  dl {
    margin: 0;
    display: grid;
    gap: 10px;
    width: 100%;
  }

  dt {
    font: 400 10px/1.3 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--muted);
  }

  dd {
    margin: 2px 0 0;
    font: 400 16px/1.35 var(--font-display);
  }

  .credit {
    font: italic 400 15px/1.45 var(--font-display);
    max-width: 38ch;
  }
</style>
