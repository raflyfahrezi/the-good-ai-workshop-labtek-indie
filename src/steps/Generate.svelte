<script>
  // Step 4, Generate Media: the (fake) AI renders the approved script as Image Slides and runs auto QC
  import { onMount } from 'svelte'
  import { editSlide, finalSlides, flow, regenerateSlide } from '../lib/flow.svelte.js'
  import { activeRules } from '../lib/brief.js'
  import { finishRender, qcReport, renderPlan, startRender } from '../lib/media.js'
  import PageHeader from '../components/PageHeader.svelte'
  import HumanNote from '../components/HumanNote.svelte'
  import RenderProgress from '../components/media/RenderProgress.svelte'
  import SlideGrid from '../components/media/SlideGrid.svelte'
  import SlideTools from '../components/media/SlideTools.svelte'
  import QcReport from '../components/media/QcReport.svelte'

  // Decided once per visit, before the first paint, so the old slides never flash before the render starts
  const plan = renderPlan()
  let rendering = $state(!!plan)
  let stage = $state(0)
  let editingId = $state(null)

  let slides = $derived(finalSlides())
  let flags = $derived(qcReport())
  let rules = $derived(activeRules())

  onMount(() => {
    if (!plan) return
    startRender()
    const timer = setInterval(() => {
      stage += 1
      if (stage >= plan.stages.length) {
        clearInterval(timer)
        finishRender(plan)
        rendering = false
      }
    }, 700)
    return () => {
      clearInterval(timer)
      flow.generating = false
    }
  })

  function save(slide, text) {
    editSlide(slide, text)
    editingId = null
  }
</script>

{#snippet tools(slide)}
  <SlideTools
    busy={!!flow.regenerating[slide.id]}
    editing={editingId === slide.id}
    text={slide.text}
    onedit={() => (editingId = slide.id)}
    onsave={(text) => save(slide, text)}
    oncancel={() => (editingId = null)}
    onregenerate={() => regenerateSlide(slide)}
  />
{/snippet}

<div class="page">
  <PageHeader
    size="sm"
    kicker="Langkah 4 dari 6"
    title="Generate Media"
    lede="AI merender slide dari script yang sudah Anda setujui, lalu memeriksa hasilnya secara otomatis terhadap guideline."
  />

  <HumanNote>
    Edit teks langsung, atau minta AI membuat ulang <strong>satu slide saja</strong>. Slide lain tidak disentuh. QC otomatis
    hanya menandai, keputusan akhir ada di langkah 5.
  </HumanNote>

  {#if rendering}
    <RenderProgress stages={plan.stages} current={stage} frames={slides.length} />
  {:else}
    <div class="layout">
      <section class="table" aria-label="Pratinjau Image Slides">
        <header class="bar">
          <span class="title">Image Slides · {flow.brief.platforms.join(', ') || 'Tanpa platform'}</span>
          <span class="meta">{slides.length} slide · v{flow.version}</span>
        </header>
        {#if !plan && flow.version > 0}
          <p class="kept">Tidak ada perubahan script sejak versi sebelumnya. Hasil yang ada dipertahankan.</p>
        {:else if plan && !plan.first}
          <p class="kept">
            {plan.changed} slide diproses ulang, {plan.kept} slide lain dipertahankan. Slide yang baru diproses diberi tanda kuning.
          </p>
        {/if}
        <SlideGrid {slides} fresh={plan?.fresh ?? []} busy={flow.regenerating} actions={tools} />
      </section>

      <QcReport {flags} {rules} version={flow.version} />
    </div>
  {/if}
</div>

<style>
  .page {
    max-width: 1180px;
    display: grid;
    gap: 20px;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 300px;
    gap: 20px;
    align-items: start;
  }

  /* The light table the contact sheet sits on */
  .table {
    display: grid;
    gap: 16px;
    border: 1.5px solid var(--border);
    padding: 0 18px 22px;
    background:
      radial-gradient(circle, var(--fl) 1px, transparent 1.5px) 0 0 / 14px 14px,
      var(--bg);
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

  .kept {
    font-size: 12px;
    color: var(--muted);
  }

  @media (max-width: 900px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }
</style>
