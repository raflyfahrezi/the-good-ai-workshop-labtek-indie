<script>
  import { bank } from '../lib/data.js'
  import { flow, addUpload, nextUpload, retryUpload, setSensitivity } from '../lib/flow.svelte.js'

  const typeLabel = { artikel: 'Artikel', transkrip: 'Transkrip', pdf: 'PDF', foto: 'Foto', video: 'Video' }
  const statusLabel = { gagal: 'Gagal', label: 'Menunggu label', proses: 'Diproses AI', siap: 'Siap' }

  let category = $state('semua')
  const inCategory = (item) => category === 'semua' || item.type === category

  let groups = $derived([
    { title: 'Karya Utama', hint: 'Draf artikel yang jadi dasar konten.', items: bank.karyaUtama.filter(inCategory) },
    {
      title: 'Data Mentah',
      hint: 'Transkrip, PDF riset, foto dan video.',
      items: [...flow.uploads.toReversed(), ...bank.dataMentah].filter(inCategory),
    },
  ])
  let next = $derived(nextUpload())
  const kindLabel = { audio: '🔊 Suara', visual: '👁 Visual' }

  function partsSummary(item) {
    if (item.type !== 'video') return `${item.parts.length} bagian ber-ID`
    const visual = item.parts.filter((p) => p.kind === 'visual').length
    return `Analisis AI: ${item.parts.length - visual} suara, ${visual} kejadian visual`
  }
</script>

{#snippet itemCard(item)}
  {@const level = flow.sensitivity[item.id]}
  {@const status = item.status ?? 'siap'}
  <article class="card item {level ?? 'unset'}">
    <div class="head">
      <span class="chip">{item.id}</span>
      <span class="small muted">{typeLabel[item.type]}</span>
      {#if item.status}<span class="new small">baru diunggah</span>{/if}
      <span class="state small {status}">{statusLabel[status]}</span>
      <div class="toggle" role="group" aria-label="Label sensitivitas" hidden={status === 'gagal'}>
        <button aria-pressed={level === 'publik'} onclick={() => setSensitivity(item.id, 'publik')}>Publik</button>
        <button aria-pressed={level === 'sensitif'} onclick={() => setSensitivity(item.id, 'sensitif')}>Sensitif</button>
      </div>
    </div>

    <p>{item.label}</p>
    <p class="small muted">Sumber: {item.credit}</p>

    {#if status === 'gagal'}
      <div class="failed small">
        <span>Unggahan gagal: koneksi terputus (simulasi). Berkas asli Anda tidak berubah.</span>
        <button onclick={() => retryUpload(item.id)}>Coba lagi</button>
      </div>
    {:else if status === 'label'}
      <p class="small ask">Belum dilabel. Pilih Publik atau Sensitif. AI baru memproses bahan ini setelah Anda memilih.</p>
    {:else if status === 'proses'}
      <div class="stages small">
        {#each item.stages as label, i (i)}
          <p class:done={i < item.stage} class:now={i === item.stage}>
            {i < item.stage ? '✓' : i === item.stage ? '…' : '○'}
            {label}
          </p>
        {/each}
      </div>
    {:else}
      {#if level === 'sensitif'}
        <p class="small local">🔒 Diproses lokal, tidak dikirim ke AI cloud</p>
      {/if}

      {#if item.parts}
        <details open={item.type === 'video'}>
          <summary class="small">{partsSummary(item)}</summary>
          {#each item.parts as part (part.id)}
            <p class="part small">
              <span class="chip">{part.id}</span>
              {#if part.kind}<span class="kind {part.kind}">{kindLabel[part.kind]}</span>{/if}
              {#if part.time}<span class="muted">{part.time}</span>{/if}
              {#if part.page}<span class="muted">hlm. {part.page}</span>{/if}
              {part.text}
            </p>
          {/each}
          {#if item.type === 'video'}
            <label class="check small">
              <input type="checkbox" bind:checked={flow.videoChecked[item.id]} />
              Saya sudah mencocokkan deskripsi visual dengan rekaman
            </label>
          {/if}
        </details>
      {/if}
    {/if}
  </article>
{/snippet}

<div class="screen-head">
  <h2>1 · Bank Informasi</h2>
  <p class="muted">
    Semua bahan liputan dikumpulkan di sini. Setiap bahan dan bagiannya mendapat ID, supaya setiap kalimat hasil AI
    nanti bisa ditelusuri balik ke sumbernya. Video dianalisis dua jalur: yang terdengar dan yang terlihat, karena
    tidak semua informasi ada di suara.
  </p>
  <p class="human">
    <strong>Keputusan jurnalis:</strong> label Publik atau Sensitif ditentukan jurnalis, bukan AI. Bahan publik boleh
    diproses model AI di cloud. Bahan sensitif hanya diproses model lokal. Deskripsi visual dari AI dicocokkan dulu
    dengan rekamannya.
  </p>
</div>

<div class="upload">
  <div>
    <strong>Seret berkas ke sini</strong>
    <p class="small muted">Video, foto, audio wawancara, PDF. Simulasi: berkas contoh fiktif yang ditambahkan.</p>
  </div>
  <button class="primary" disabled={!next} onclick={addUpload}>
    {next ? `Unggah bahan (${next.id})` : 'Semua contoh sudah diunggah'}
  </button>
</div>

<div class="filter" role="group" aria-label="Kategori">
  {#each ['semua', ...Object.keys(typeLabel)] as c (c)}
    <button aria-pressed={category === c} onclick={() => (category = c)}>{c === 'semua' ? 'Semua' : typeLabel[c]}</button>
  {/each}
</div>

<div class="cols">
  {#each groups as group (group.title)}
    <section>
      <h3>{group.title}</h3>
      <p class="small muted">{group.hint}</p>
      {#each group.items as item (item.id)}
        {@render itemCard(item)}
      {:else}
        <p class="small muted">Tidak ada bahan di kategori ini.</p>
      {/each}
    </section>
  {/each}
</div>

<style>
  .upload {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    border: 2px dashed var(--accent);
    background: var(--accent-bg);
    border-radius: 0;
    padding: 14px 16px;
    margin-bottom: 20px;
  }

  .filter {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }

  .filter button {
    font-size: 13px;
    padding: 3px 12px;
    border-radius: 999px;
  }

  .filter button[aria-pressed='true'] {
    background: var(--text);
    border-color: var(--text);
    color: var(--on-solid);
  }

  .state {
    font-size: 12px;
    padding: 1px 8px;
    border-radius: 999px;
    background: var(--hijau-bg);
    color: var(--hijau);
  }

  .state.label,
  .state.proses {
    background: var(--kuning-bg);
    color: var(--kuning);
  }

  .state.gagal {
    background: var(--merah-bg);
    color: var(--merah);
  }

  .failed {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    color: var(--merah);
    font-weight: 600;
  }

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

  .item.unset {
    border-left-color: var(--kuning);
    background: var(--kuning-bg);
  }

  .head {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .new {
    color: var(--accent);
    font-weight: 600;
  }

  .toggle {
    margin-left: auto;
    display: flex;
  }

  .toggle[hidden] {
    display: none;
  }

  .toggle button {
    font-size: 13px;
    padding: 2px 10px;
  }

  .toggle button:first-child {
    border-radius: 0;
  }

  .toggle button:last-child {
    border-radius: 0;
    margin-left: -1.5px;
  }

  .toggle button {
    color: var(--muted);
  }

  .toggle button[aria-pressed='true'] {
    color: var(--text);
    font-weight: 600;
  }

  .toggle button:first-child[aria-pressed='true'] {
    background: var(--hijau-bg);
  }

  .toggle button:last-child[aria-pressed='true'] {
    background: var(--merah-bg);
  }

  .ask {
    color: var(--kuning);
    font-weight: 600;
  }

  .stages {
    display: grid;
    gap: 2px;
  }

  .stages p {
    color: var(--muted);
  }

  .stages .done {
    color: var(--hijau);
  }

  .stages .now {
    color: var(--text);
    font-weight: 600;
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

  .kind {
    font-size: 12px;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 0;
    background: var(--fl);
  }

  .kind.visual {
    background: var(--human-bg);
    color: var(--human);
  }

  .check {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
    color: var(--human);
    font-weight: 600;
    cursor: pointer;
  }

  @media (max-width: 760px) {
    .cols {
      grid-template-columns: 1fr;
    }
  }
</style>
