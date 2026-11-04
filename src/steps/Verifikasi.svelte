<script>
  import { script } from '../lib/data.js'
  import { flow, findSource, auditInfo, decisionLabel } from '../lib/flow.svelte.js'

  let selectedId = $state(script[0].id)
  let editingId = $state(null)
  let draft = $state('')
  let panel = $state()
  let focusId = $state(null) // source chip the journalist clicked, if any

  let selected = $derived(script.find((l) => l.id === selectedId))
  let openCount = $derived(script.filter((l) => !flow.decisions[l.id]).length)
  let tally = $derived(
    Object.keys(auditInfo).map((key) => ({ key, count: script.filter((l) => l.audit === key).length })),
  )

  // Group the selected line's sources by bank item, so each passage shows inside its document.
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

  // Bring the clicked source (or the first highlighted passage) into view whenever the selection changes.
  // scrollIntoView moves both the panel and the page, since the panel is not stuck yet near the top of the page.
  let firstRun = true
  $effect(() => {
    selectedId, focusId
    // Don't move the page when the screen first opens
    if (firstRun) return void (firstRun = false)
    const hit = panel?.querySelector(focusId ? `[data-src="${focusId}"]` : '.hit')
    if (hit) hit.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    else panel?.scrollTo({ top: 0, behavior: 'smooth' })
  })

  function decide(line, decision) {
    selectedId = line.id
    if (decision === 'ubah') {
      editingId = line.id
      draft = flow.edits[line.id] ?? line.text
      return
    }
    // Approving keeps the AI wording, so drop any earlier edit
    if (decision === 'setuju') delete flow.edits[line.id]
    flow.decisions[line.id] = decision
    editingId = null
  }

  function saveEdit(line) {
    flow.edits[line.id] = draft.trim()
    flow.decisions[line.id] = 'ubah'
    editingId = null
  }
</script>

<div class="screen-head">
  <h2>3b · Perencanaan Konten AI: Script & Sumber</h2>
  <p class="muted">
    AI menulis naskah Image Slides dari bank informasi. Setiap baris membawa ID sumber dan warna hasil audit otomatis.
    Klik baris atau chip sumber untuk melihat kutipan aslinya.
  </p>
  <p class="human">
    <strong>Keputusan jurnalis:</strong> setiap baris harus Anda putuskan, Setuju, Ubah atau Buang. Warna hanya
    membantu: mesin bisa mencocokkan kata dengan sumber, tapi makna tetap Anda yang menilai.
  </p>
</div>

<div class="counter card" class:clear={openCount === 0}>
  <div>
    {#if openCount > 0}
      <strong>{openCount} dari {script.length} baris belum dicek</strong>
    {:else}
      <strong>Semua {script.length} baris sudah diputuskan</strong>
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
  <section class="lines">
    {#each script as line (line.id)}
      {@const decision = flow.decisions[line.id]}
      <article
        class="line {line.audit}"
        class:selected={line.id === selectedId}
        class:discarded={decision === 'buang'}
      >
        <div class="top small">
          <span class="muted">Slide {line.slide}</span>
          <span class="status {line.audit}">{auditInfo[line.audit].icon} {auditInfo[line.audit].label}</span>
          {#if decision}
            <span class="decision {decision}">✓ {decisionLabel[decision]}</span>
          {/if}
        </div>

        {#if editingId === line.id}
          <textarea rows="3" bind:value={draft}></textarea>
          <div class="actions">
            <button class="primary" disabled={!draft.trim()} onclick={() => saveEdit(line)}>Simpan perubahan</button>
            <button onclick={() => (editingId = null)}>Batal</button>
          </div>
        {:else}
          <button class="text" onclick={() => ((selectedId = line.id), (focusId = null))}>
            {flow.edits[line.id] ?? line.text}
          </button>
          {#if flow.edits[line.id]}
            <p class="small muted original">Versi AI: {line.text}</p>
          {/if}
        {/if}

        <div class="sources small">
          <span class="muted">Sumber:</span>
          {#each line.sources as id (id)}
            <button
              class="chip"
              class:focused={line.id === selectedId && focusId === id}
              onclick={() => ((selectedId = line.id), (focusId = id))}>{id}</button
            >
          {:else}
            <span class="chip none">tanpa sumber</span>
          {/each}
        </div>

        {#if line.note}
          <p class="note small {line.audit}"><strong>Catatan auditor:</strong> {line.note}</p>
        {/if}

        {#if editingId !== line.id}
          <div class="actions">
            <button class="ok" aria-pressed={decision === 'setuju'} onclick={() => decide(line, 'setuju')}>Setuju</button>
            <button class="edit" aria-pressed={decision === 'ubah'} onclick={() => decide(line, 'ubah')}>Ubah</button>
            <button class="drop" aria-pressed={decision === 'buang'} onclick={() => decide(line, 'buang')}>Buang</button>
          </div>
        {/if}

        {#if decision === 'setuju' && line.audit === 'merah'}
          <p class="warn small">⚠ Baris tanpa sumber disetujui. Keputusan ini tercatat di Jejak Sumber.</p>
        {/if}
      </article>
    {/each}
  </section>

  <aside class="panel card" bind:this={panel}>
    <p class="small muted">Sumber untuk slide {selected.slide}</p>
    <p class="quote">"{flow.edits[selected.id] ?? selected.text}"</p>

    {#each panelGroups as group (group.item.id)}
      <div class="doc" data-src={group.item.id}>
        <div class="doc-head">
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
            <p class="part" class:hit={group.cited.includes(part.id)} data-src={part.id}>
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
          <div class="media hit">[{group.item.type}] {group.item.label}</div>
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

<style>
  .counter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
    border-color: var(--kuning);
    background: var(--kuning-bg);
  }

  .counter.clear {
    border-color: var(--hijau);
    background: var(--hijau-bg);
  }

  .bar {
    width: 260px;
    max-width: 100%;
    height: 6px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    margin-top: 6px;
    overflow: hidden;
  }

  .bar span {
    display: block;
    height: 100%;
    background: var(--hijau);
    transition: width 0.2s;
  }

  .tally {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
    gap: 20px;
    align-items: start;
  }

  .lines {
    display: grid;
    gap: 10px;
  }

  .line {
    background: var(--card);
    border: 1px solid var(--border);
    border-left: 6px solid;
    border-radius: 8px;
    padding: 12px 14px;
    display: grid;
    gap: 8px;
  }

  .line.hijau {
    border-left-color: var(--hijau);
  }
  .line.kuning {
    border-left-color: var(--kuning);
  }
  .line.merah {
    border-left-color: var(--merah);
  }

  .line.selected {
    outline: 2px solid var(--accent);
    outline-offset: -1px;
  }

  .line.discarded .text {
    text-decoration: line-through;
    color: var(--muted);
  }

  .top {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }

  .status {
    font-weight: 600;
  }
  .status.hijau {
    color: var(--hijau);
  }
  .status.kuning {
    color: var(--kuning);
  }
  .status.merah {
    color: var(--merah);
  }

  .decision {
    margin-left: auto;
    font-weight: 600;
    padding: 1px 8px;
    border-radius: 999px;
    background: var(--human-bg);
    color: var(--human);
  }

  .text {
    border: 0;
    padding: 0;
    background: none;
    text-align: left;
    font-size: 17px;
    line-height: 1.45;
  }

  .original {
    text-decoration: line-through;
  }

  .sources {
    display: flex;
    gap: 6px;
    align-items: center;
    flex-wrap: wrap;
  }

  button.chip {
    cursor: pointer;
    padding: 4px 6px;
  }

  button.chip.focused {
    border-color: var(--accent);
    background: var(--accent-bg);
    color: var(--accent);
  }

  button.chip:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .chip.none {
    background: var(--merah-bg);
    color: var(--merah);
  }

  .note {
    padding: 6px 10px;
    border-radius: 6px;
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
    font-size: 14px;
    padding: 4px 12px;
  }

  .ok[aria-pressed='true'] {
    background: var(--hijau);
    border-color: var(--hijau);
    color: #fff;
  }
  .edit[aria-pressed='true'] {
    background: var(--human);
    border-color: var(--human);
    color: #fff;
  }
  .drop[aria-pressed='true'] {
    background: var(--muted);
    border-color: var(--muted);
    color: #fff;
  }

  .warn {
    color: var(--merah);
    font-weight: 600;
  }

  .panel {
    position: sticky;
    top: 12px;
    max-height: calc(100vh - 96px);
    overflow: auto;
    display: grid;
    gap: 12px;
  }

  .quote {
    font-style: italic;
    border-bottom: 1px solid var(--border);
    padding-bottom: 10px;
  }

  .doc {
    display: grid;
    gap: 6px;
  }

  /* Keep scrolled-to sources clear of the sticky footer */
  [data-src] {
    scroll-margin: 40px 0 90px;
  }

  .doc-head {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .part {
    font-size: 15px;
    padding: 6px 8px;
    border-radius: 6px;
    color: var(--muted);
  }

  .part.hit {
    background: #fff1a8;
    color: var(--text);
    box-shadow: inset 3px 0 0 #e0b400;
  }

  .kind {
    font-weight: 600;
    color: var(--human);
  }

  .vcheck {
    color: var(--kuning);
    font-weight: 600;
  }

  .vcheck.ok {
    color: var(--hijau);
  }

  .media {
    border: 2px dashed var(--border);
    border-radius: 6px;
    padding: 24px 12px;
    text-align: center;
    font-size: 14px;
  }

  .media.hit {
    border-color: #e0b400;
    background: #fffbe0;
  }

  .nosource {
    background: var(--merah-bg);
    color: var(--merah);
    padding: 12px;
    border-radius: 6px;
    display: grid;
    gap: 4px;
  }

  @media (max-width: 860px) {
    .layout {
      grid-template-columns: 1fr;
    }
    .panel {
      position: static;
      max-height: none;
    }
  }
</style>
