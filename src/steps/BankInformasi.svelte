<script>
  import { bank } from '../lib/data.js'
  import { flow } from '../lib/flow.svelte.js'

  const groups = [
    { title: 'Karya Utama', hint: 'Draf artikel yang jadi dasar konten.', items: bank.karyaUtama },
    { title: 'Data Mentah', hint: 'Transkrip, PDF riset, foto dan video.', items: bank.dataMentah },
  ]

  const typeLabel = { artikel: 'Artikel', transkrip: 'Transkrip', pdf: 'PDF', foto: 'Foto', video: 'Video' }
</script>

<div class="screen-head">
  <h2>1 · Bank Informasi</h2>
  <p class="muted">
    Semua bahan liputan dikumpulkan di sini. Setiap bahan dan bagiannya mendapat ID, supaya setiap kalimat hasil AI
    nanti bisa ditelusuri balik ke sumbernya.
  </p>
  <p class="human">
    <strong>Keputusan jurnalis:</strong> label Publik atau Sensitif ditentukan jurnalis, bukan AI. Bahan publik boleh
    diproses model AI di cloud. Bahan sensitif hanya diproses model lokal dan tidak keluar dari komputer redaksi.
  </p>
</div>

<div class="cols">
  {#each groups as group (group.title)}
    <section>
      <h3>{group.title}</h3>
      <p class="small muted">{group.hint}</p>

      {#each group.items as item (item.id)}
        {@const level = flow.sensitivity[item.id]}
        <article class="card item {level}">
          <div class="head">
            <span class="chip">{item.id}</span>
            <span class="small muted">{typeLabel[item.type]}</span>
            <div class="toggle" role="group" aria-label="Label sensitivitas">
              <button aria-pressed={level === 'publik'} onclick={() => (flow.sensitivity[item.id] = 'publik')}>
                Publik
              </button>
              <button aria-pressed={level === 'sensitif'} onclick={() => (flow.sensitivity[item.id] = 'sensitif')}>
                Sensitif
              </button>
            </div>
          </div>

          <p>{item.label}</p>

          {#if level === 'sensitif'}
            <p class="small local">🔒 Diproses lokal, tidak dikirim ke AI cloud</p>
          {/if}

          {#if item.parts}
            <details>
              <summary class="small">{item.parts.length} bagian ber-ID</summary>
              {#each item.parts as part (part.id)}
                <p class="part small">
                  <span class="chip">{part.id}</span>
                  {#if part.time}<span class="muted">{part.time}</span>{/if}
                  {#if part.page}<span class="muted">hlm. {part.page}</span>{/if}
                  {part.text}
                </p>
              {/each}
            </details>
          {/if}
        </article>
      {/each}

      <button class="add" disabled>+ Tambah bahan</button>
    </section>
  {/each}
</div>

<style>
  .cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: start;
  }

  section {
    display: grid;
    gap: 10px;
  }

  .item {
    display: grid;
    gap: 6px;
    padding: 12px 14px;
    border-left: 6px solid var(--hijau);
  }

  .item.sensitif {
    border-left-color: var(--merah);
  }

  .head {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .toggle {
    margin-left: auto;
    display: flex;
  }

  .toggle button {
    font-size: 13px;
    padding: 2px 10px;
  }

  .toggle button:first-child {
    border-radius: 6px 0 0 6px;
  }

  .toggle button:last-child {
    border-radius: 0 6px 6px 0;
    margin-left: -1px;
  }

  .toggle button:first-child[aria-pressed='true'] {
    background: var(--hijau);
    border-color: var(--hijau);
    color: #fff;
  }

  .toggle button:last-child[aria-pressed='true'] {
    background: var(--merah);
    border-color: var(--merah);
    color: #fff;
  }

  .local {
    color: var(--merah);
    font-weight: 600;
  }

  summary {
    cursor: pointer;
    color: var(--accent);
  }

  .part {
    margin-top: 6px;
  }

  .add {
    border-style: dashed;
    justify-self: start;
  }

  @media (max-width: 760px) {
    .cols {
      grid-template-columns: 1fr;
    }
  }
</style>
