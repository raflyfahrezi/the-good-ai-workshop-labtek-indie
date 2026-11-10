<script>
  import { onMount, tick } from 'svelte'
  import { briefFeedback, script, story } from '../lib/data.js'
  import { flow, findSource, auditInfo, decisionLabel, log } from '../lib/flow.svelte.js'

  // Each cited document gets its own highlight colour, in order of first appearance in the script
  const docOf = (sourceId) => findSource(sourceId)?.item
  const docOrder = [...new Set(script.flatMap((l) => l.sources).map((id) => docOf(id)?.id))].filter(Boolean)
  const docColor = (itemId) => `var(--src-${(docOrder.indexOf(itemId) % 6) + 1})`

  let selectedId = $state(script[0].id)
  let focusId = $state(null) // source tag the journalist clicked, if any
  let editingId = $state(null)
  let draft = $state('')
  let panel = $state()
  let page = $state()

  let selected = $derived(script.find((l) => l.id === selectedId))
  let openCount = $derived(script.filter((l) => !flow.decisions[l.id]).length)
  let tally = $derived(
    Object.keys(auditInfo).map((key) => ({ key, count: script.filter((l) => l.audit === key).length })),
  )

  // Group the selected paragraph's sources by bank item, so each passage shows inside its document
  let panelGroups = $derived.by(() => {
    const groups = []
    for (const id of selected.sources) {
      const src = findSource(id)
      if (!src) continue
      let group = groups.find((g) => g.item.id === src.item.id)
      if (!group) groups.push((group = { item: src.item, cited: [] }))
      group.cited.push(id)
    }
    return groups
  })

  // Fake the AI writing the script from the brief, the first time this step opens
  const stages = [
    'Membaca bank informasi (publik di model cloud, sensitif di model lokal)',
    `Menerapkan ${flow.brief.guardrails.filter((r) => r.trim()).length} aturan guideline dari brief`,
    'Menulis paragraf, setiap kalimat diberi sumber',
    'Audit otomatis: mencocokkan kutipan dengan sumber',
  ]
  let stage = $state(0)

  onMount(() => {
    if (flow.scriptReady) return
    const timer = setInterval(() => {
      stage += 1
      if (stage >= stages.length) {
        clearInterval(timer)
        flow.scriptReady = true
        log('Script digenerate dari brief dan bank informasi')
      }
    }, 600)
    return () => clearInterval(timer)
  })

  // Bring the clicked source (or the first highlighted passage) into view whenever the selection changes.
  // scrollIntoView moves both the panel and the page, since the panel is not stuck yet near the top of the page.
  let firstRun = true
  $effect(() => {
    selectedId, focusId
    if (firstRun) return void (firstRun = false)
    const hit = panel?.querySelector(focusId ? `[data-src="${focusId}"]` : '.hit')
    if (hit) hit.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    else panel?.scrollTo({ top: 0, behavior: 'smooth' })
  })

  function select(id, source = null) {
    selectedId = id
    focusId = source
  }

  // After a decision, move to the next paragraph nobody has checked yet
  async function advance(line) {
    const i = script.indexOf(line)
    const nextOpen = [...script.slice(i + 1), ...script.slice(0, i)].find((l) => !flow.decisions[l.id])
    if (!nextOpen) return
    select(nextOpen.id)
    await tick()
    page?.querySelector(`[data-line="${nextOpen.id}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }

  function decide(line, decision) {
    if (decision === 'ubah') {
      select(line.id)
      editingId = line.id
      draft = flow.edits[line.id] ?? line.text
      return
    }
    // Approving keeps the AI wording, so drop any earlier edit
    if (decision === 'setuju') delete flow.edits[line.id]
    flow.decisions[line.id] = decision
    editingId = null
    advance(line)
  }

  function saveEdit(line) {
    flow.edits[line.id] = draft.trim()
    flow.decisions[line.id] = 'ubah'
    editingId = null
    advance(line)
  }

  function onKey(e, id) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      select(id)
    }
  }
</script>

<div class="screen-head">
  <h2>3 · Script & Sumber</h2>
  <p class="muted">
    AI langsung menyusun script dari brief dan bank informasi, dalam bentuk dokumen. Setiap paragraf disorot dengan warna
    dokumen yang dikutip. Klik paragraf atau label sumbernya untuk melihat kutipan aslinya.
  </p>
  <p class="human">
    <strong>Keputusan jurnalis:</strong> setiap paragraf harus Anda putuskan, Setuju, Ubah atau Buang. Sorotan dan garis
    bawah hanya membantu: mesin bisa mencocokkan kata dengan sumber, tapi makna tetap Anda yang menilai.
  </p>
</div>

{#if !flow.scriptReady}
  <div class="card progress">
    {#each stages as label, i (i)}
      <p class:done={i < stage} class:now={i === stage}>
        {i < stage ? '✓' : i === stage ? '…' : '○'}
        {label}
      </p>
    {/each}
  </div>
{:else}
  <div class="counter card" class:clear={openCount === 0}>
    <div>
      {#if openCount > 0}
        <strong>{openCount} dari {script.length} paragraf belum dicek</strong>
      {:else}
        <strong>Semua {script.length} paragraf sudah diputuskan</strong>
      {/if}
      <div class="bar"><span style:width="{((script.length - openCount) / script.length) * 100}%"></span></div>
    </div>
    <div class="tally small">
      {#each tally as t (t.key)}
        <span>{auditInfo[t.key].icon} {t.count} {auditInfo[t.key].label.toLowerCase()}</span>
      {/each}
    </div>
  </div>

  <div class="layout">
    <section class="docwrap">
      <div class="toolbar small">
        <span class="file">📄 script-image-slides.docx</span>
        <span class="legend">
          <span class="muted">Sorotan = dokumen sumber:</span>
          {#each docOrder as id (id)}
            <span class="key"><span class="swatch" style:background={docColor(id)}></span>{id}</span>
          {/each}
          <span class="key"><span class="squiggle kuning">abc</span> cek makna</span>
          <span class="key"><span class="squiggle merah">abc</span> tanpa sumber</span>
        </span>
      </div>

      <article class="page" bind:this={page}>
        <h1 class="doc-title">{story.title}</h1>
        <p class="doc-meta">Script Image Slides · disusun AI dari bank informasi · nada: {flow.brief.tone}</p>

        <aside class="ai-notes">
          <strong>Catatan AI saat menyusun script</strong>
          <ul>
            {#each briefFeedback as note, i (i)}<li>{note}</li>{/each}
          </ul>
        </aside>

        {#each script as line (line.id)}
          {@const decision = flow.decisions[line.id]}
          {@const primary = docOf(line.sources[0])}
          <div
            class="para {line.audit}"
            class:selected={line.id === selectedId}
            class:discarded={decision === 'buang'}
            data-line={line.id}
          >
            <span class="gutter" title={auditInfo[line.audit].label}>
              {auditInfo[line.audit].icon}
              <span class="small muted">{line.slide}</span>
            </span>

            {#if editingId === line.id}
              <textarea rows="3" bind:value={draft}></textarea>
              <div class="edit-actions">
                <button class="primary" disabled={!draft.trim()} onclick={() => saveEdit(line)}>Simpan perubahan</button>
                <button onclick={() => (editingId = null)}>Batal</button>
              </div>
            {:else}
              <p class="ptext">
                <span
                  class="mark"
                  class:edited={flow.edits[line.id]}
                  style:background={primary && line.audit !== 'merah' ? docColor(primary.id) : null}
                  role="button"
                  tabindex="0"
                  onclick={() => select(line.id)}
                  onkeydown={(e) => onKey(e, line.id)}>{flow.edits[line.id] ?? line.text}</span
                >{#each line.sources as id (id)}<sup
                    ><button class="ref" style:background={docColor(docOf(id).id)} onclick={() => select(line.id, id)}
                      >{id}</button
                    ></sup
                  >{:else}<sup><span class="ref none">tanpa sumber</span></sup>{/each}
                {#if decision}<span class="decided {decision}">✓ {decisionLabel[decision]}</span>{/if}
                {#if decision === 'setuju' && line.audit === 'merah'}<span class="decided warn">⚠ tanpa sumber</span>{/if}
              </p>
            {/if}
          </div>
        {/each}
      </article>
    </section>

    <aside class="panel card" bind:this={panel}>
      <p class="small muted">
        Paragraf {selected.slide} · {auditInfo[selected.audit].icon}
        {auditInfo[selected.audit].label}
      </p>
      <p class="quote">"{flow.edits[selected.id] ?? selected.text}"</p>
      {#if flow.edits[selected.id]}
        <p class="small muted original">Versi AI: {selected.text}</p>
      {/if}
      {#if selected.note}
        <p class="note small {selected.audit}"><strong>Catatan auditor:</strong> {selected.note}</p>
      {/if}

      <div class="actions">
        {#each [['setuju', 'Setuju'], ['ubah', 'Ubah'], ['buang', 'Buang']] as [key, label] (key)}
          <button class={key} aria-pressed={flow.decisions[selected.id] === key} onclick={() => decide(selected, key)}>
            {label}
          </button>
        {/each}
      </div>
      {#if flow.decisions[selected.id] === 'setuju' && selected.audit === 'merah'}
        <p class="warn small">⚠ Paragraf tanpa sumber disetujui. Keputusan ini tercatat di Jejak Sumber.</p>
      {/if}

      <h3 class="docs-title">Dokumen yang dikutip</h3>
      {#each panelGroups as group (group.item.id)}
        <div class="doc" data-src={group.item.id}>
          <div class="doc-head">
            <span class="swatch" style:background={docColor(group.item.id)}></span>
            <span class="chip">{group.item.id}</span>
            <span class="badge {flow.sensitivity[group.item.id]}">{flow.sensitivity[group.item.id]}</span>
            {#if flow.sensitivity[group.item.id] === 'sensitif'}
              <span class="small muted">diproses lokal</span>
            {/if}
          </div>
          <p class="small"><strong>{group.item.label}</strong></p>

          {#if group.item.parts}
            {#if group.cited.includes(group.item.id)}
              <p class="small muted">Merujuk ke seluruh dokumen.</p>
            {/if}
            {#each group.item.parts as part (part.id)}
              {@const hit = group.cited.includes(part.id)}
              <p class="part" class:hit style:background={hit ? docColor(group.item.id) : null} data-src={part.id}>
                <span class="chip">{part.id}</span>
                {#if part.kind}<span class="small kind">{part.kind === 'visual' ? '👁 Visual' : '🔊 Suara'}</span>{/if}
                {#if part.time}<span class="small muted">{part.time}</span>{/if}
                {#if part.page}<span class="small muted">hlm. {part.page}</span>{/if}
                {part.text}
              </p>
            {/each}
            {#if group.item.type === 'video'}
              <p class="small vcheck" class:ok={flow.videoChecked[group.item.id]}>
                {flow.videoChecked[group.item.id]
                  ? '✓ Deskripsi visual sudah dicocokkan jurnalis dengan rekaman.'
                  : '⚠ Deskripsi visual dibuat AI dan belum dicocokkan dengan rekaman.'}
              </p>
            {/if}
          {:else}
            <div class="media ph hit" style:background={docColor(group.item.id)}>[{group.item.type}] {group.item.label}</div>
          {/if}
        </div>
      {:else}
        <div class="nosource">
          <strong>🔴 Tidak ada sumber di bank informasi.</strong>
          <p class="small">Klaim ini tidak bisa ditelusuri. Buang, atau tambahkan sumbernya ke Bank Informasi dulu.</p>
        </div>
      {/each}
    </aside>
  </div>
{/if}

<style>
  .progress {
    display: grid;
    gap: 8px;
    max-width: 560px;
  }

  .progress p {
    color: var(--muted);
  }

  .progress .done {
    color: var(--hijau);
  }

  .progress .now {
    color: var(--text);
    font-weight: 600;
  }

  .counter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 14px;
    background: var(--kuning-bg);
  }

  .counter.clear {
    background: var(--hijau-bg);
  }

  .bar {
    width: 260px;
    max-width: 100%;
    height: 6px;
    background: var(--fl);
    margin-top: 6px;
    overflow: hidden;
  }

  .bar span {
    display: block;
    height: 100%;
    background: var(--text);
    transition: width 0.2s;
  }

  .tally {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    gap: 16px;
    align-items: start;
  }

  /* Word-style document */
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px 12px;
    border: 1.5px solid var(--border);
    border-bottom: 0;
    background: var(--fl);
    padding: 6px 10px;
  }

  .file {
    font-weight: 600;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 10px;
    align-items: center;
  }

  .key {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-family: ui-monospace, Consolas, monospace;
    font-size: 11px;
  }

  .swatch {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 1px solid var(--border);
  }

  .squiggle {
    text-decoration: underline wavy;
    text-underline-offset: 2px;
  }
  .squiggle.kuning {
    text-decoration-color: var(--kuning);
  }
  .squiggle.merah {
    text-decoration-color: var(--merah);
  }

  .page {
    background: var(--card);
    border: 1.5px solid var(--border);
    padding: 36px 40px 40px 64px;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 16px;
    line-height: 1.75;
  }

  .doc-title {
    font-size: 22px;
    line-height: 1.3;
    margin-bottom: 4px;
  }

  .doc-meta {
    font-size: 13px;
    color: var(--muted);
    font-style: italic;
    margin-bottom: 16px;
  }

  .ai-notes {
    font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
    font-size: 12px;
    line-height: 1.45;
    border: 1.5px dashed var(--border);
    padding: 8px 12px;
    margin-bottom: 20px;
  }

  .ai-notes ul {
    margin: 4px 0 0;
    padding-left: 18px;
    color: var(--muted);
  }

  .para {
    position: relative;
    margin-bottom: 14px;
  }

  .para.selected {
    outline: 1.5px solid var(--text);
    outline-offset: 6px;
  }

  .gutter {
    position: absolute;
    left: -46px;
    top: 2px;
    width: 34px;
    text-align: right;
    font-size: 13px;
    line-height: 1.2;
    display: grid;
    justify-items: end;
  }

  .mark {
    cursor: pointer;
    padding: 1px 2px;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }

  .mark:focus-visible {
    outline: 2px solid var(--text);
  }

  .para.kuning .mark {
    text-decoration: underline wavy var(--kuning);
    text-underline-offset: 4px;
  }

  .para.merah .mark {
    text-decoration: underline wavy var(--merah);
    text-underline-offset: 4px;
  }

  .mark.edited {
    border-bottom: 1.5px dashed var(--text);
  }

  .para.discarded .mark {
    text-decoration: line-through;
    color: var(--muted);
    background: none !important;
  }

  sup {
    line-height: 0;
  }

  .ref {
    font: 600 10px/1 ui-monospace, Consolas, monospace;
    padding: 2px 4px;
    margin-left: 3px;
    border: 1px solid var(--border);
    color: var(--text);
  }

  .ref.none {
    display: inline-block;
    background: var(--merah-bg);
  }

  .decided {
    font: 600 11px/1 'Segoe UI', Helvetica, Arial, sans-serif;
    margin-left: 8px;
    padding: 2px 6px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    background: var(--fl);
    white-space: nowrap;
  }

  .decided.setuju {
    background: var(--hijau-bg);
  }

  .decided.ubah {
    background: var(--kuning-bg);
  }

  .decided.warn {
    background: var(--merah-bg);
  }

  .edit-actions {
    display: flex;
    gap: 6px;
    margin-top: 4px;
    font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
    font-size: 13px;
  }

  .para textarea {
    font: inherit;
  }

  /* Side panel: like a comment pane next to the document */
  .panel {
    position: sticky;
    top: 12px;
    max-height: calc(100vh - 96px);
    overflow: auto;
    display: grid;
    gap: 10px;
  }

  .quote {
    font-family: Georgia, 'Times New Roman', serif;
    font-style: italic;
  }

  .original {
    text-decoration: line-through;
  }

  .note {
    padding: 6px 10px;
  }

  .note.kuning {
    background: var(--kuning-bg);
  }

  .note.merah {
    background: var(--merah-bg);
  }

  .actions {
    display: flex;
    gap: 6px;
  }

  .actions button {
    flex: 1;
  }

  .actions button[aria-pressed='true'] {
    border-color: var(--text);
    font-weight: 600;
  }

  .setuju[aria-pressed='true'] {
    background: var(--hijau-bg);
  }

  .ubah[aria-pressed='true'] {
    background: var(--kuning-bg);
  }

  .buang[aria-pressed='true'] {
    background: var(--fl);
    text-decoration: line-through;
  }

  .warn {
    color: var(--merah);
    font-weight: 600;
  }

  .docs-title {
    border-top: 1.5px solid var(--border);
    padding-top: 10px;
  }

  .doc {
    display: grid;
    gap: 6px;
  }

  [data-src] {
    scroll-margin: 40px 0 90px;
  }

  .doc-head {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .part {
    font-size: 13px;
    padding: 6px 8px;
    color: var(--muted);
  }

  .part.hit {
    color: var(--text);
    border-left: 3px solid var(--text);
  }

  .kind {
    font-weight: 600;
  }

  .vcheck {
    color: var(--kuning);
    font-weight: 600;
  }

  .vcheck.ok {
    color: var(--hijau);
  }

  .media {
    padding: 24px 12px;
    color: var(--text);
  }

  .nosource {
    background: var(--merah-bg);
    padding: 12px;
    display: grid;
    gap: 4px;
  }

  @media (max-width: 960px) {
    .layout {
      grid-template-columns: 1fr;
    }
    .panel {
      position: static;
      max-height: none;
    }
    .page {
      padding: 24px 18px 24px 52px;
    }
  }
</style>
