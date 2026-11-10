<script>
  // Step 6, Ekspor & Atribusi: download the approved content with its credit, metadata and Jejak Sumber
  import { restartDemo } from '../lib/router.js'
  import { defaultExportFormats, flow } from '../lib/flow.svelte.js'
  import { defaultCredit, exportPackage, manifest, sourceTrail, workMetadata } from '../lib/exporter.js'
  import PageHeader from '../components/PageHeader.svelte'
  import HumanNote from '../components/HumanNote.svelte'
  import PackageManifest from '../components/export/PackageManifest.svelte'
  import Colophon from '../components/export/Colophon.svelte'
  import ExportLog from '../components/export/ExportLog.svelte'
  import SourceTrail from '../components/export/SourceTrail.svelte'

  let chosen = $state(defaultExportFormats())
  let credit = $state(defaultCredit())

  let items = $derived(manifest(chosen))
  let metadata = $derived(workMetadata())
  let trail = $derived(sourceTrail())
</script>

<div class="page">
  <PageHeader
    size="sm"
    kicker="Langkah 6 dari 6"
    title="Ekspor & Atribusi"
    lede="Unduh konten yang sudah disetujui, lengkap dengan credit, metadata karya dan Jejak Sumber."
  />

  <HumanNote label="Untuk editor">
    Jejak Sumber menunjukkan setiap baris yang ditulis AI, sumbernya, hasil audit dan keputusan jurnalis. Editor tidak perlu
    mengecek ulang dari nol.
  </HumanNote>

  <div class="layout">
    <div class="left">
      <PackageManifest
        {items}
        bind:chosen
        bind:credit
        approved={flow.approved}
        onexport={() => exportPackage(items.filter((i) => i.on))}
      />
      <ExportLog entries={flow.exports} />
    </div>
    <Colophon rows={metadata} {credit} />
  </div>

  <SourceTrail rows={trail} />

  <div class="end">
    <span class="fin" aria-hidden="true">· selesai ·</span>
    <button onclick={restartDemo}>↺ Mulai ulang demo</button>
  </div>
</div>

<style>
  .page {
    max-width: 1180px;
    display: grid;
    gap: 22px;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 20px;
    align-items: start;
  }

  .left {
    display: grid;
    gap: 18px;
  }

  .end {
    display: grid;
    justify-items: center;
    gap: 10px;
    padding: 12px 0 8px;
  }

  .fin {
    font: 400 11px/1 var(--font-mono);
    letter-spacing: 2px;
    color: var(--muted);
  }

  @media (max-width: 860px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }
</style>
