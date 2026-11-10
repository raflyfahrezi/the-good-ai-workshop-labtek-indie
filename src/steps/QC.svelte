<script>
  // Step 5, QC Editorial: the final preview with its QC flags and sources, then the journalist approves or routes a revision
  import { finalSlides, flow, qcFlags } from '../lib/flow.svelte.js'
  import { approve, readiness, requestRevision } from '../lib/qc.js'
  import PageHeader from '../components/PageHeader.svelte'
  import HumanNote from '../components/HumanNote.svelte'
  import SlideGrid from '../components/media/SlideGrid.svelte'
  import SourceChips from '../components/qc/SourceChips.svelte'
  import SignOff from '../components/qc/SignOff.svelte'
  import RevisionForm from '../components/qc/RevisionForm.svelte'
  import HistoryLog from '../components/qc/HistoryLog.svelte'

  let openSource = $state(null) // `${slideId}:${sourceId}` of the passage shown under a slide

  let slides = $derived(finalSlides())
  let flags = $derived(qcFlags())
  let checks = $derived(readiness())

  function toggle(slideId, sourceId) {
    const key = `${slideId}:${sourceId}`
    openSource = openSource === key ? null : key
  }
</script>

{#snippet sources(slide)}
  <SourceChips
    sources={slide.sources}
    open={openSource?.startsWith(`${slide.id}:`) ? openSource.slice(slide.id.length + 1) : null}
    ontoggle={(id) => toggle(slide.id, id)}
  />
{/snippet}

<div class="page">
  <PageHeader
    size="sm"
    kicker="Langkah 5 dari 6"
    title="QC Editorial"
    lede="Periksa pratinjau final, temuan QC otomatis dan sumber setiap slide, lalu putuskan: setujui atau minta revisi."
  />

  <HumanNote>
    Persetujuan akhir ada di tangan jurnalis. AI tidak bisa menandai konten sebagai disetujui, dan tanpa persetujuan konten
    tidak bisa diekspor.
  </HumanNote>

  <div class="layout">
    <section class="proof" aria-label="Pratinjau final">
      <header class="bar">
        <span class="title">Pratinjau final</span>
        <span class="meta">{slides.length} slide · v{flow.version}</span>
      </header>
      <SlideGrid {slides} {flags} actions={sources} />
    </section>

    <aside class="desk">
      <SignOff {checks} version={flow.version} onapprove={approve} />
      <RevisionForm onsend={requestRevision} />
      <HistoryLog entries={flow.history} />
    </aside>
  </div>
</div>

<style>
  .page {
    max-width: 1180px;
    display: grid;
    gap: 20px;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 20px;
    align-items: start;
  }

  .proof {
    display: grid;
    gap: 16px;
    border: 1.5px solid var(--border);
    padding: 0 18px 22px;
    background: var(--bg);
  }

  .bar {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin: 0 -18px;
    padding: 8px 18px;
    background: var(--accent);
    color: var(--on-solid);
    font: 400 11px/1 var(--font-mono);
    letter-spacing: 0.4px;
  }

  .title {
    font-weight: 600;
  }

  .desk {
    display: grid;
    gap: 18px;
  }

  @media (max-width: 900px) {
    .layout {
      grid-template-columns: 1fr;
    }

    /* On narrow screens the decision comes first */
    .desk {
      order: -1;
    }
  }
</style>
