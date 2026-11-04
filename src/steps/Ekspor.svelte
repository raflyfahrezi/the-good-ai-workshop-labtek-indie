<script>
  import { script, story } from '../lib/data.js'
  import { flow, finalSlides, auditInfo, decisionLabel } from '../lib/flow.svelte.js'

  let slides = $derived(finalSlides())
  let downloaded = $state(false)

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

  let files = $derived([
    { name: `carousel-slide-01-${String(slides.length).padStart(2, '0')}.png`, note: 'gambar per slide' },
    { name: 'caption-instagram.txt', note: 'caption + tautan artikel' },
    { name: 'jejak-sumber.csv', note: 'untuk editor' },
  ])

  // The one real download in the demo: the source trail as CSV, built from the dummy data.
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

  function restart() {
    window.location.hash = ''
    window.location.reload()
  }
</script>

<div class="screen-head">
  <h2>6 · Ekspor</h2>
  <p class="muted">Konten siap diunggah, lengkap dengan Jejak Sumber untuk editor.</p>
  <p class="human">
    <strong>Untuk editor:</strong> Jejak Sumber menunjukkan setiap baris yang ditulis AI, sumbernya, hasil audit, dan
    keputusan jurnalis. Editor tidak perlu mengecek ulang dari nol.
  </p>
</div>

<div class="cols">
  <section class="card">
    <h3>Berkas</h3>
    <ul class="files">
      {#each files as f (f.name)}
        <li><code>{f.name}</code> <span class="small muted">{f.note}</span></li>
      {/each}
    </ul>
    <div class="actions">
      <button class="primary" onclick={() => (downloaded = true)}>Unduh semua</button>
      <button onclick={downloadCsv}>Unduh Jejak Sumber (.csv)</button>
    </div>
    {#if downloaded}
      <p class="small muted">Simulasi: di demo ini berkas gambar dan caption tidak benar-benar dibuat.</p>
    {/if}
  </section>

  <section class="card">
    <h3>Keterangan penggunaan AI</h3>
    <p class="disclosure">
      Konten ini disusun dengan bantuan AI dari liputan "{story.title}". Setiap kalimat sudah diverifikasi terhadap
      sumbernya oleh {story.author}.
    </p>
  </section>
</div>

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

  .files {
    margin: 0;
    padding-left: 20px;
    display: grid;
    gap: 4px;
  }

  code {
    font: 13px ui-monospace, Consolas, monospace;
  }

  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .disclosure {
    font-style: italic;
    border-left: 3px solid var(--border);
    padding-left: 12px;
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
