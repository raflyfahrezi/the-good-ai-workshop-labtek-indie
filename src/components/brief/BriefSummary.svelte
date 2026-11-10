<script>
  // A slip of what the AI will receive on "Buat script", so the journalist checks the handoff before it happens
  /** @type {{ rows: { key: string, value: string, missing?: boolean }[] }} */
  let { rows } = $props()
</script>

<section class="slip" aria-label="Yang diterima AI">
  <p class="head">Yang diterima AI</p>
  <dl>
    {#each rows as r (r.key)}
      <div class:missing={r.missing}>
        <dt>{r.key}</dt>
        <dd>{r.value}</dd>
      </div>
    {/each}
  </dl>
  <p class="foot">Hanya bahan di Bank Informasi. AI tidak mencari di internet.</p>
</section>

<style>
  .slip {
    border: 1.5px solid var(--border);
    background: var(--fl);
    padding: 12px 14px;
    display: grid;
    gap: 8px;
  }

  .head {
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  dl {
    margin: 0;
    display: grid;
  }

  dl div {
    display: grid;
    grid-template-columns: 78px minmax(0, 1fr);
    gap: 10px;
    padding: 5px 0;
    border-top: 1px dashed var(--border);
    font-size: 13px;
  }

  dt {
    font: 400 11px/1.6 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--muted);
  }

  dd {
    margin: 0;
  }

  .missing dd {
    color: var(--kuning);
    font-weight: 600;
  }

  .foot {
    font-size: 12px;
    color: var(--muted);
  }
</style>
