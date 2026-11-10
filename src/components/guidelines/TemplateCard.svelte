<script>
  // One guideline template as an index card: numbered rules, and a button to load it into the active project
  /** @type {{ template: { id: string, label: string, rules: string[] }, active: boolean, onuse: () => void }} */
  let { template, active, onuse } = $props()
</script>

<article class="card" class:active>
  <header>
    <span class="kind">Template · {template.rules.length} aturan</span>
    {#if active}<span class="used">Dipakai di project aktif</span>{/if}
  </header>
  <h3>{template.label}</h3>
  <ol>
    {#each template.rules as rule, i (i)}
      <li><span class="id">A{i + 1}</span>{rule}</li>
    {/each}
  </ol>
  <button class:primary={!active} onclick={onuse}>
    {active ? 'Buka di brief →' : 'Pakai di project aktif →'}
  </button>
</article>

<style>
  .card {
    display: grid;
    grid-template-rows: auto auto 1fr auto;
    gap: 10px;
    background: var(--card);
    border: 1.5px solid var(--border);
    border-top: 6px solid var(--border);
    padding: 14px 16px 16px;
  }

  .card.active {
    border-top-color: var(--hijau);
  }

  header {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
  }

  .kind,
  .used {
    font: 400 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--muted);
  }

  .used {
    font-weight: 600;
    color: var(--hijau);
  }

  h3 {
    font: 500 22px/1.15 var(--font-display);
  }

  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    align-self: start;
  }

  li {
    display: grid;
    grid-template-columns: 28px minmax(0, 1fr);
    padding: 5px 0;
    border-bottom: 1px dashed var(--fl);
    font-size: 13px;
    line-height: 20px;
  }

  .id {
    font: 600 10px/20px var(--font-mono);
    color: var(--muted);
  }

  button {
    justify-self: start;
  }
</style>
