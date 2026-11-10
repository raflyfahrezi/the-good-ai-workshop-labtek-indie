<script>
  // The proofing slip next to the page: the selected paragraph, the journalist's decision, and its cited sources
  import { script } from '../../lib/data.js'
  import { flow } from '../../lib/flow.svelte.js'
  import { auditMark, citedDocs, decisions, docColor, textOf } from '../../lib/script.js'
  import CitedDoc from './CitedDoc.svelte'

  /** @type {{ line: any, focusId: string | null, ondecide: (decision: string) => void }} */
  let { line, focusId, ondecide } = $props()

  let panel = $state()
  let decision = $derived(flow.decisions[line.id])
  let docs = $derived(citedDocs(line))

  // Bring the clicked source, or the first highlighted passage, into view when the selection changes
  let firstRun = true
  $effect(() => {
    line.id, focusId
    if (firstRun) return void (firstRun = false)
    const hit = panel?.querySelector(focusId ? `[data-src="${focusId}"]` : '.hit')
    if (hit) hit.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    else panel?.scrollTo({ top: 0, behavior: 'smooth' })
  })
</script>

<aside class="slip" bind:this={panel} aria-label="Pemeriksaan paragraf {line.slide}">
  <header>
    <span class="pos">Paragraf {line.slide} / {script.length}</span>
    <span class="audit {line.audit}">{auditMark[line.audit].code} · {auditMark[line.audit].label}</span>
  </header>

  <blockquote>{textOf(line)}</blockquote>
  {#if flow.edits[line.id]}
    <p class="original"><span>Versi AI</span> {line.text}</p>
  {/if}

  {#if line.note}
    <p class="note {line.audit}"><span>Catatan auditor</span>{line.note}</p>
  {/if}

  <div class="decide" role="group" aria-label="Keputusan jurnalis">
    <p class="ask">Keputusan Anda</p>
    <div class="buttons">
      {#each decisions as d (d.id)}
        <button class={d.id} aria-pressed={decision === d.id} onclick={() => ondecide(d.id)}>{d.label}</button>
      {/each}
    </div>
    {#if decision === 'setuju' && line.audit === 'merah'}
      <p class="risk">Paragraf tanpa sumber disetujui. Keputusan ini tercatat di Jejak Sumber.</p>
    {/if}
  </div>

  <h3>Dokumen yang dikutip <span>{docs.length}</span></h3>
  {#each docs as group (group.item.id)}
    <CitedDoc item={group.item} cited={group.cited} color={docColor(group.item.id)} />
  {:else}
    <div class="nosource">
      <strong>Tidak ada sumber di bank informasi.</strong>
      <p>Klaim ini tidak bisa ditelusuri. Buang, atau tambahkan sumbernya ke Bank Informasi dulu.</p>
    </div>
  {/each}
</aside>

<style>
  .slip {
    position: sticky;
    top: 16px;
    max-height: calc(100vh - 96px);
    overflow: auto;
    display: grid;
    align-content: start;
    gap: 12px;
    background: var(--card);
    border: 1.5px solid var(--border);
    padding: 14px 16px 16px;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding-bottom: 10px;
    border-bottom: 1.5px solid var(--border);
  }

  .pos {
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .audit {
    font: 600 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.4px;
    padding: 3px 6px;
    border: 1px solid currentColor;
  }

  .audit.hijau {
    color: var(--hijau);
  }
  .audit.kuning {
    color: var(--kuning);
    background: var(--kuning-bg);
  }
  .audit.merah {
    color: var(--on-solid);
    background: var(--merah);
    border-color: var(--merah);
  }

  blockquote {
    margin: 0;
    font: italic 400 19px/1.45 var(--font-display);
  }

  .original {
    font-size: 12px;
    color: var(--muted);
    text-decoration: line-through;
  }

  .original span,
  .note span {
    display: block;
    font: 600 10px/1.6 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    text-decoration: none;
  }

  .note {
    font-size: 12.5px;
    padding: 8px 10px;
    border-left: 3px solid currentColor;
  }

  .note.kuning {
    color: var(--kuning);
    background: var(--kuning-bg);
  }

  .note.merah {
    color: var(--merah);
    background: var(--merah-bg);
  }

  .decide {
    display: grid;
    gap: 6px;
    border: 1.5px dashed var(--border);
    padding: 10px;
  }

  .ask {
    font: 600 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .buttons {
    display: flex;
  }

  .buttons button {
    flex: 1;
    padding: 8px 6px;
  }

  .buttons button + button {
    margin-left: -1.5px;
  }

  .buttons button[aria-pressed='true'] {
    position: relative;
    font-weight: 600;
    color: var(--on-solid);
  }

  .setuju[aria-pressed='true'] {
    background: var(--hijau);
    border-color: var(--hijau);
  }

  .ubah[aria-pressed='true'] {
    background: var(--kuning);
    border-color: var(--kuning);
  }

  .buang[aria-pressed='true'] {
    background: var(--merah);
    border-color: var(--merah);
    text-decoration: line-through;
  }

  .risk {
    font-size: 12px;
    font-weight: 600;
    color: var(--merah);
  }

  h3 {
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-top: 4px;
  }

  h3 span {
    color: var(--muted);
    margin-left: 4px;
  }

  .nosource {
    display: grid;
    gap: 4px;
    font-size: 13px;
    color: var(--merah);
    background: var(--merah-bg);
    border-left: 3px solid var(--merah);
    padding: 10px 12px;
  }

  @media (max-width: 960px) {
    .slip {
      position: static;
      max-height: none;
    }
  }
</style>
