<script>
  import { exportFormats, formats, script, story } from '../lib/data.js'
  import { flow, finalSlides, findSource, auditInfo, decisionLabel, defaultExportFormats, log } from '../lib/flow.svelte.js'

  let slides = $derived(finalSlides())
  let chosen = $state(defaultExportFormats())
  let credit = $state(
    `Liputan: ${story.author}, ${story.newsroom}. Disusun dengan bantuan AI (IDEO) dan diverifikasi per kalimat oleh jurnalis.`,
  )

  // Jejak Sumber covers every line the AI wrote, including discarded ones, so the editor sees what AI touched.
  let trail = $derived(
    script.map((line) => ({
      slide: slides.find((s) => s.id === line.id)?.n ?? '-',
      text: flow.edits[line.id] ?? line.text,
      aiText: line.text,
      sources: line.sources.join(', ') || 'tanpa sumber',
      audit: line.audit,
      decision: flow.decisions[line.id],
    })),
  )

  const pad = (n) => String(n).padStart(2, '0')
  let files = $derived(
    [
      chosen.png && `image-slide-01-${pad(slides.length)}.png`,
      chosen.pdf && 'image-slides.pdf',
      chosen.caption && 'caption.txt',
      chosen.csv && 'jejak-sumber.csv',
    ].filter(Boolean),
  )

  // Metadata attached to the export (PRD FR-39, FR-40)
  let citedItems = $derived([...new Set(slides.flatMap((s) => s.sources).map((id) => findSource(id)?.item.id))])
  let sensitiveCited = $derived(citedItems.filter((id) => flow.sensitivity[id] === 'sensitif'))
  let metadata = $derived([
    ['Judul liputan', story.title],
    ['Pemilik karya', story.author],
    ['Redaksi', story.newsroom],
    ['Format', formats.find((f) => f.id === 'slides').label + `, ${slides.length} slide`],
    ['Versi', `v${flow.version}, disetujui jurnalis`],
    ['Bahan yang dirujuk', citedItems.join(', ')],
    ['Bahan sensitif dirujuk', sensitiveCited.length ? sensitiveCited.join(', ') + ' (identitas disamarkan)' : 'Tidak ada'],
    ['Bantuan AI', 'Ya, IDEO (disimulasikan di demo ini)'],
  ])

  // The one real file in the demo: the source trail as CSV, built from the dummy data.
  function downloadCsv() {
    const header = ['Slide', 'Teks akhir', 'Teks AI', 'Sumber', 'Status audit', 'Keputusan', 'Diputuskan oleh']
    const rows = trail.map((r) => [
      r.slide,
      r.text,
      r.aiText,
      r.sources,
      auditInfo[r.audit].label,
      decisionLabel[r.decision],
      story.author,
    ])
    const csv = [header, ...rows].map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: 'jejak-sumber-dummy.csv' })
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportNow() {
    if (chosen.csv) downloadCsv()
    const at = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    flow.exports.unshift({ at, version: flow.version, files: [...files] })
    flow.exported = true
    log(`Diekspor (v${flow.version}): ${files.join(', ')}`)
  }

  function restart() {
    window.location.hash = ''
    window.location.reload()
  }
</script>

<div class="screen-head">
  <h2>6 · Ekspor & Atribusi</h2>
  <p class="muted">Unduh konten yang sudah disetujui, lengkap dengan credit, metadata karya, dan Jejak Sumber.</p>
  <p class="human">
    <strong>Untuk editor:</strong> Jejak Sumber menunjukkan setiap baris yang ditulis AI, sumbernya, hasil audit, dan
    keputusan jurnalis. Editor tidak perlu mengecek ulang dari nol.
  </p>
</div>

<div class="cols">
  <section class="card">
    <h3>Format berkas</h3>
    {#each exportFormats as f (f.id)}
      <label class="small opt">
        <input type="checkbox" bind:checked={chosen[f.id]} />
        {f.label}
      </label>
    {/each}

    <label class="field">
      <span class="small"><strong>Credit</strong> (disertakan di caption dan metadata)</span>
      <textarea rows="3" bind:value={credit}></textarea>
    </label>

    <button class="primary" disabled={!flow.approved || files.length === 0} onclick={exportNow}>
      Unduh {files.length} berkas
    </button>
    <p class="small muted">Simulasi: hanya Jejak Sumber .csv yang benar-benar dibuat. Gambar, PDF dan caption tidak.</p>
  </section>

  <section class="card">
    <h3>Metadata karya</h3>
    <dl class="small">
      {#each metadata as [key, value] (key)}
        <dt>{key}</dt>
        <dd>{value}</dd>
      {/each}
      <dt>Credit</dt>
      <dd>{credit}</dd>
    </dl>
  </section>
</div>

<section class="card exports">
  <h3>Riwayat ekspor</h3>
  {#each flow.exports as e, i (i)}
    <p class="small"><span class="muted">{e.at}</span> v{e.version}: {e.files.join(', ')}</p>
  {:else}
    <p class="small muted">Belum ada ekspor. Status konten berubah menjadi Diekspor setelah Anda mengunduh.</p>
  {/each}
</section>

<h3 class="trail-title">Jejak Sumber</h3>
<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>Slide</th>
        <th>Teks akhir</th>
        <th>Sumber</th>
        <th>Audit AI</th>
        <th>Keputusan jurnalis</th>
        <th>Oleh</th>
      </tr>
    </thead>
    <tbody>
      {#each trail as row, i (i)}
        <tr class:discarded={row.decision === 'buang'}>
          <td>{row.slide}</td>
          <td>
            <span class="text">{row.text}</span>
            {#if row.decision === 'ubah'}<span class="small muted ai">AI: {row.aiText}</span>{/if}
          </td>
          <td><code>{row.sources}</code></td>
          <td class="audit {row.audit}">{auditInfo[row.audit].icon} {auditInfo[row.audit].label}</td>
          <td class="decision">
            {decisionLabel[row.decision]}
            {#if row.decision === 'setuju' && row.audit === 'merah'}<span class="warn">⚠ tanpa sumber</span>{/if}
          </td>
          <td class="small">{story.author}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<button class="restart" onclick={restart}>↺ Mulai ulang demo</button>

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

  .opt {
    display: flex;
    gap: 8px;
    align-items: center;
    cursor: pointer;
  }

  .field {
    display: grid;
    gap: 4px;
  }

  section > button {
    justify-self: start;
  }

  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px 12px;
    margin: 0;
  }

  dt {
    color: var(--muted);
  }

  dd {
    margin: 0;
  }

  .exports {
    margin-top: 20px;
  }

  code {
    font: 13px ui-monospace, Consolas, monospace;
  }



  .trail-title {
    margin: 24px 0 10px;
  }

  .table-wrap {
    overflow-x: auto;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  th,
  td {
    text-align: left;
    vertical-align: top;
    padding: 8px 10px;
    border-bottom: 1px solid var(--border);
  }

  th {
    background: #f1f1ee;
    font-size: 13px;
  }

  td .ai {
    display: block;
    text-decoration: line-through;
  }

  tr.discarded .text {
    text-decoration: line-through;
    color: var(--muted);
  }

  .audit {
    white-space: nowrap;
    font-weight: 600;
  }
  .audit.hijau {
    color: var(--hijau);
  }
  .audit.kuning {
    color: var(--kuning);
  }
  .audit.merah {
    color: var(--merah);
  }

  .decision {
    color: var(--human);
    font-weight: 600;
  }

  .warn {
    display: block;
    color: var(--merah);
    font-size: 12px;
  }

  .restart {
    margin-top: 20px;
  }

  @media (max-width: 760px) {
    .cols {
      grid-template-columns: 1fr;
    }
  }
</style>
