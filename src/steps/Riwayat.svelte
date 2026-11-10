<script>
  // Riwayat Konten: every derivative content ever exported, as an archive register
  import { historyFilters, historyRows, matchesFilter } from '../lib/history.js'
  import PageHeader from '../components/PageHeader.svelte'
  import HumanNote from '../components/HumanNote.svelte'
  import FilterTabs from '../components/FilterTabs.svelte'
  import StatusChip from '../lib/StatusChip.svelte'

  let filter = $state('semua')

  let rows = $derived(historyRows())
  let filters = $derived(historyFilters(rows))
  let shown = $derived(rows.filter(matchesFilter(filter)))
</script>

<div class="page">
  <PageHeader
    kicker="Arsip"
    title="Riwayat Konten"
    lede="Semua konten turunan yang pernah diekspor, lengkap dengan berkas dan Jejak Sumbernya."
  />

  <HumanNote label="Untuk editor">
    Setiap ekspor membawa Jejak Sumber. Kalau ada pertanyaan tentang satu kalimat, cari berkas
    <code>jejak-sumber.csv</code> dari versi yang sama.
  </HumanNote>

  <FilterTabs label="Saring status" {filters} bind:value={filter} />

  <ol class="register">
    {#each shown as r (r.key)}
      <li class:session={r.session} class:failed={r.status === 'Gagal'}>
        <div class="when">
          <span class="date">{r.date}</span>
          <span class="at">{r.at}</span>
        </div>
        <div class="what">
          <p class="meta">
            {r.desk} · {r.format} · v{r.version}
            {#if r.session}<span class="tag">Sesi ini</span>{/if}
          </p>
          <h3>{r.title}</h3>
          <p class="files">
            {#each r.files as f (f)}<span class="file">{f}</span>{/each}
          </p>
          {#if r.error}<p class="error">{r.error}</p>{/if}
        </div>
        <div class="status">
          <StatusChip status={r.status} />
          {#if r.status === 'Gagal'}<button disabled title="Simulasi">Coba lagi</button>{/if}
        </div>
      </li>
    {:else}
      <li class="empty">Tidak ada konten di kategori ini.</li>
    {/each}
  </ol>
</div>

<style>
  .page {
    max-width: 1080px;
    display: grid;
    gap: 20px;
  }

  code {
    font: 600 12px/1 var(--font-mono);
  }

  .register {
    list-style: none;
    margin: 0;
    padding: 0;
    border-top: 1.5px solid var(--border);
  }

  li {
    display: grid;
    grid-template-columns: 110px minmax(0, 1fr) auto;
    gap: 18px;
    align-items: start;
    padding: 16px 4px;
    border-bottom: 1px dashed var(--border);
  }

  li.session {
    background: var(--card);
    border-left: 4px solid var(--hijau);
    padding-left: 12px;
  }

  li.failed {
    border-left: 4px solid var(--merah);
    padding-left: 12px;
  }

  .when {
    display: grid;
    gap: 4px;
  }

  .date {
    font: 600 11px/1.2 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .at {
    font: 400 11px/1 var(--font-mono);
    color: var(--muted);
  }

  .what {
    display: grid;
    gap: 6px;
    min-width: 0;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font: 400 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--muted);
  }

  .tag {
    background: var(--hijau);
    color: var(--on-solid);
    padding: 3px 5px;
    font-weight: 600;
  }

  h3 {
    font: 500 20px/1.2 var(--font-display);
  }

  .files {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .file {
    font: 400 11px/1 var(--font-mono);
    border: 1px solid var(--border);
    padding: 4px 6px;
  }

  .failed .file {
    text-decoration: line-through;
    color: var(--muted);
  }

  .error {
    font-size: 12px;
    font-weight: 600;
    color: var(--merah);
  }

  .status {
    display: grid;
    justify-items: end;
    gap: 6px;
  }

  .status button {
    font-size: 12px;
    padding: 3px 8px;
  }

  .empty {
    display: block;
    text-align: center;
    color: var(--muted);
    font-size: 13px;
  }

  @media (max-width: 640px) {
    li {
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 8px 12px;
    }

    .when {
      grid-column: 1 / -1;
      display: flex;
      gap: 8px;
    }
  }
</style>
