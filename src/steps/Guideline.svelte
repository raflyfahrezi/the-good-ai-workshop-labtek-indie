<script>
  // Guideline Saya: reusable rule templates written by journalists, loaded into a brief and then edited there
  import { guidelineTemplates } from '../lib/data.js'
  import { goTo } from '../lib/flow.svelte.js'
  import { activeRules, activeTemplateId, loadTemplate } from '../lib/brief.js'
  import PageHeader from '../components/PageHeader.svelte'
  import HumanNote from '../components/HumanNote.svelte'
  import TemplateCard from '../components/guidelines/TemplateCard.svelte'

  let activeId = $derived(activeTemplateId())
  let current = $derived(activeRules())

  function use(t) {
    if (t.id !== activeId) loadTemplate(t.id)
    goTo(1)
  }
</script>

<div class="page">
  <PageHeader
    kicker="Aturan main"
    title="Guideline Saya"
    lede="Template aturan yang bisa dipakai ulang di setiap brief. AI mengikutinya, dan QC otomatis memeriksa hasil terhadap aturan yang sama."
  />

  <HumanNote>
    Guideline ditulis jurnalis dengan kata-kata sendiri. Template hanya titik awal: setelah dimuat ke brief, setiap aturan
    tetap bisa diubah, dihapus atau ditambah.
  </HumanNote>

  {#if !activeId}
    <section class="custom">
      <p class="kicker">Guideline project aktif · disesuaikan jurnalis</p>
      <p class="note">
        Project aktif memakai {current.length} aturan yang sudah diubah dari template. Perubahan ini hanya berlaku di project
        tersebut.
      </p>
      <button onclick={() => goTo(1)}>Buka di brief →</button>
    </section>
  {/if}

  <div class="grid">
    {#each guidelineTemplates as t (t.id)}
      <TemplateCard template={t} active={t.id === activeId} onuse={() => use(t)} />
    {/each}
    <button class="new" disabled title="Belum ada di demo lo-fi">
      <span class="plus" aria-hidden="true">+</span>
      Guideline baru
      <span class="soon">Belum ada di demo</span>
    </button>
  </div>
</div>

<style>
  .page {
    max-width: 1080px;
    display: grid;
    gap: 20px;
  }

  .custom {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 16px;
    border: 1.5px solid var(--border);
    border-left: 4px solid var(--kuning);
    background: var(--card);
    padding: 12px 16px;
  }

  .kicker {
    flex-basis: 100%;
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .note {
    flex: 1;
    font-size: 13px;
    color: var(--muted);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  .new {
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 6px;
    min-height: 220px;
    border: 1.5px dashed var(--border);
    background: none;
    font-size: 14px;
  }

  .plus {
    font: 300 36px/1 var(--font-display);
  }

  .soon {
    font: 400 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--muted);
  }
</style>
