<script>
  // Step 3, Script & Sumber: the AI writes the script, the journalist decides every paragraph against its sources
  import { onMount, tick } from 'svelte'
  import { script } from '../lib/data.js'
  import { flow } from '../lib/flow.svelte.js'
  import { decide, markScriptReady, nextOpen, saveEdit, writeStages } from '../lib/script.js'
  import PageHeader from '../components/PageHeader.svelte'
  import HumanNote from '../components/HumanNote.svelte'
  import ProcessStages from '../components/ProcessStages.svelte'
  import ReviewLedger from '../components/script/ReviewLedger.svelte'
  import ScriptDoc from '../components/script/ScriptDoc.svelte'
  import SourcePanel from '../components/script/SourcePanel.svelte'

  let selectedId = $state(script[0].id)
  let focusId = $state(null) // source tag the journalist clicked, if any
  let editingId = $state(null)

  let selected = $derived(script.find((l) => l.id === selectedId))

  // Fake the AI writing the script from the brief, the first time this step opens
  const stages = writeStages()
  let stage = $state(0)

  onMount(() => {
    if (flow.scriptReady) return
    const timer = setInterval(() => {
      stage += 1
      if (stage >= stages.length) {
        clearInterval(timer)
        markScriptReady()
      }
    }, 600)
    return () => clearInterval(timer)
  })

  function select(id, source = null) {
    selectedId = id
    focusId = source
  }

  // Jump to a paragraph from the ledger and bring it into view on the page
  async function jump(id) {
    select(id)
    await tick()
    document.querySelector(`[data-line="${id}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }

  // After a decision, move on to the next paragraph nobody has decided yet
  function advance(line) {
    const next = nextOpen(line)
    if (next) jump(next.id)
  }

  function ondecide(decision) {
    if (decision === 'ubah') {
      editingId = selected.id
      return
    }
    decide(selected, decision)
    editingId = null
    advance(selected)
  }

  function onsave(line, text) {
    saveEdit(line, text)
    editingId = null
    advance(line)
  }
</script>

<div class="page">
  <PageHeader
    size="sm"
    kicker="Langkah 3 dari 6"
    title="Script & Sumber"
    lede="AI menyusun script dari brief dan bank informasi. Setiap paragraf disorot dengan warna dokumen yang dikutip. Klik paragraf atau label sumbernya untuk melihat kutipan aslinya."
  />

  <HumanNote>
    Setiap paragraf harus Anda putuskan: <strong>Setuju</strong>, <strong>Ubah</strong> atau <strong>Buang</strong>.
    Sorotan dan garis bawah hanya membantu. Mesin bisa mencocokkan kata dengan sumber, tapi makna tetap Anda yang menilai.
  </HumanNote>

  {#if !flow.scriptReady}
    <div class="writing">
      <p class="kicker">AI sedang menyusun script</p>
      <ProcessStages {stages} current={stage} />
    </div>
  {:else}
    <ReviewLedger {selectedId} onselect={jump} />

    <div class="layout">
      <ScriptDoc {selectedId} {editingId} onselect={select} {onsave} oncancel={() => (editingId = null)} />
      <SourcePanel line={selected} {focusId} {ondecide} />
    </div>
  {/if}
</div>

<style>
  .page {
    max-width: 1180px;
    display: grid;
    gap: 20px;
  }

  .writing {
    max-width: 560px;
    display: grid;
    gap: 8px;
  }

  .kicker {
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1.55fr) minmax(300px, 1fr);
    gap: 20px;
    align-items: start;
  }

  @media (max-width: 960px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }
</style>
