<script>
  import { guidelineTemplates } from '../lib/data.js'
  import { goTo } from '../lib/flow.svelte.js'
  import { loadTemplate } from '../lib/brief.js'

  function useTemplate(t) {
    loadTemplate(t.id)
    goTo(1)
  }
</script>

<div class="screen-head">
  <h2>Guideline Saya</h2>
  <p class="muted">Template dan guideline buatan jurnalis. Bisa dipakai ulang di setiap brief.</p>
</div>

<div class="grid">
  {#each guidelineTemplates as t (t.id)}
    <section class="card">
      <h3>Template: {t.label}</h3>
      <ol class="small">
        {#each t.rules as rule, i (i)}<li>{rule}</li>{/each}
      </ol>
      <button onclick={() => useTemplate(t)}>Pakai di project aktif →</button>
    </section>
  {/each}
</div>

<button class="add" disabled title="Belum ada di demo lo-fi">+ Guideline baru</button>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
  }

  section {
    display: grid;
    gap: 8px;
    align-content: start;
  }

  ol {
    margin: 0;
    padding-left: 18px;
    color: var(--muted);
    display: grid;
    gap: 2px;
  }

  section button {
    justify-self: start;
  }

  .add {
    margin-top: 12px;
  }
</style>
