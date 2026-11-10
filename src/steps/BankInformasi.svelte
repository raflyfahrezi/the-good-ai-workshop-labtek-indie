<script>
  // Step 1, Bank Informasi: collect the material, label its sensitivity, let the (fake) AI give every part an ID
  import { bank } from '../lib/data.js'
  import { addUpload, nextUpload } from '../lib/flow.svelte.js'
  import { categoryFilters, rawItems, routing } from '../lib/bank.js'
  import PageHeader from '../components/PageHeader.svelte'
  import HumanNote from '../components/HumanNote.svelte'
  import FilterTabs from '../components/FilterTabs.svelte'
  import SourceCard from '../components/bank/SourceCard.svelte'
  import UploadZone from '../components/bank/UploadZone.svelte'
  import RoutingBoard from '../components/bank/RoutingBoard.svelte'

  let category = $state('semua')

  let raw = $derived(rawItems())
  let filters = $derived(categoryFilters(raw))
  let shown = $derived(raw.filter((item) => category === 'semua' || item.type === category))
  let lanes = $derived(routing())
  let next = $derived(nextUpload())
</script>

<div class="page">
  <PageHeader
    size="sm"
    kicker="Langkah 1 dari 6"
    title="Bank Informasi"
    lede="Semua bahan liputan dikumpulkan di sini. Setiap bahan dan bagiannya mendapat ID, supaya setiap kalimat hasil AI nanti bisa ditelusuri balik ke sumbernya."
  />

  <HumanNote>
    Label <strong>Publik</strong> atau <strong>Sensitif</strong> ditentukan jurnalis, bukan AI. Bahan publik boleh diproses
    AI di cloud, bahan sensitif hanya model lokal. Deskripsi visual dari AI dicocokkan dulu dengan rekamannya.
  </HumanNote>

  <div class="layout">
    <div class="main">
      <section>
        <header class="section-head">
          <h3>Karya Utama <span class="count">{bank.karyaUtama.length}</span></h3>
          <p>Draf artikel yang jadi dasar semua konten turunan.</p>
        </header>
        {#each bank.karyaUtama as item (item.id)}
          <SourceCard {item} />
        {/each}
      </section>

      <section>
        <header class="section-head">
          <h3>Data Mentah <span class="count">{raw.length}</span></h3>
          <p>Transkrip, PDF riset, foto dan video. Video dianalisis dua jalur: yang terdengar dan yang terlihat.</p>
        </header>
        <FilterTabs label="Kategori bahan" size="sm" {filters} bind:value={category} />
        {#each shown as item (item.id)}
          <SourceCard {item} />
        {:else}
          <p class="empty">Tidak ada bahan di kategori ini.</p>
        {/each}
      </section>
    </div>

    <aside class="side">
      <UploadZone {next} onupload={addUpload} />
      <RoutingBoard routing={lanes} />
    </aside>
  </div>
</div>

<style>
  .page {
    max-width: 1080px;
    display: grid;
    gap: 20px;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 300px;
    gap: 24px;
    align-items: start;
  }

  .main {
    display: grid;
    gap: 28px;
  }

  section {
    display: grid;
    gap: 10px;
  }

  .section-head {
    display: grid;
    gap: 4px;
    padding-bottom: 8px;
    border-bottom: 1.5px solid var(--border);
  }

  h3 {
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .count {
    color: var(--muted);
    margin-left: 4px;
  }

  .section-head p {
    font-size: 13px;
    color: var(--muted);
  }

  .side {
    position: sticky;
    top: 16px;
    display: grid;
    gap: 16px;
  }

  .empty {
    border: 1.5px dashed var(--border);
    padding: 20px;
    text-align: center;
    color: var(--muted);
    font-size: 13px;
  }

  @media (max-width: 900px) {
    .layout {
      grid-template-columns: 1fr;
    }
    /* On narrow screens the upload and routing come first */
    .side {
      position: static;
      order: -1;
    }
  }
</style>
