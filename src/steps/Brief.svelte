<script>
  import { formats, guidelineTemplates, platforms } from '../lib/data.js'
  import { flow, log } from '../lib/flow.svelte.js'

  let newRule = $state('')
  let template = $state(guidelineTemplates[0].id)

  function addRule() {
    if (!newRule.trim()) return
    flow.brief.guardrails.push(newRule.trim())
    newRule = ''
  }

  function loadTemplate() {
    const t = guidelineTemplates.find((g) => g.id === template)
    flow.brief.guardrails = [...t.rules]
    log(`Template guideline dimuat: ${t.label}`)
  }

  function togglePlatform(p) {
    const list = flow.brief.platforms
    if (list.includes(p)) list.splice(list.indexOf(p), 1)
    else list.push(p)
  }
</script>

<div class="screen-head">
  <h2>2 · Brief & Guideline</h2>
  <p class="muted">Tentukan tujuan, format, audiens, platform dan aturan yang wajib dipatuhi AI.</p>
  <p class="human">
    <strong>Keputusan jurnalis:</strong> aturan main ditetapkan jurnalis. AI mengikuti guideline ini, dan QC otomatis di
    langkah 4 memeriksa hasilnya terhadap aturan yang sama. Tulis aturan dengan kata-kata Anda sendiri.
  </p>
</div>

<div class="cols">
  <section class="card">
    <h3>Brief</h3>

    <label class="field">
      <span class="label">Tujuan konten</span>
      <input type="text" bind:value={flow.brief.objective} />
    </label>

    <p class="label">Format media <span class="muted small">(boleh lebih dari satu)</span></p>
    <div class="formats">
      {#each formats as f (f.id)}
        <label class="format" class:active={flow.brief.formats.includes(f.id)}>
          <input type="checkbox" value={f.id} bind:group={flow.brief.formats} />
          <span>
            <strong>{f.label}</strong>
            {#if f.mvp}<span class="tag mvp">dibuat di demo</span>{:else}<span class="tag later">fase berikutnya</span>{/if}
            <span class="small muted hint">{f.hint}</span>
          </span>
        </label>
      {/each}
    </div>
    {#if flow.brief.formats.some((id) => !formats.find((f) => f.id === id).mvp)}
      <p class="small warn">Video Reels dan Audio dicatat di brief, tapi demo ini hanya membuat Image Slides (sesuai MVP).</p>
    {/if}

    <p class="label">Platform tujuan</p>
    <div class="chips">
      {#each platforms as p (p)}
        <button aria-pressed={flow.brief.platforms.includes(p)} onclick={() => togglePlatform(p)}>{p}</button>
      {/each}
    </div>

    <label class="field">
      <span class="label">Audiens</span>
      <input type="text" bind:value={flow.brief.audience} />
    </label>
    <label class="field">
      <span class="label">Tone of voice</span>
      <input type="text" bind:value={flow.brief.tone} />
    </label>
    <label class="field short">
      <span class="label">Jumlah slide</span>
      <input type="number" min="3" max="12" bind:value={flow.brief.length} />
    </label>
  </section>

  <section class="card">
    <h3>Guideline</h3>
    <div class="template">
      <select bind:value={template} aria-label="Template guideline">
        {#each guidelineTemplates as t (t.id)}
          <option value={t.id}>{t.label}</option>
        {/each}
      </select>
      <button onclick={loadTemplate}>Muat template</button>
    </div>
    <p class="small muted">Template mengganti daftar di bawah. Setiap aturan tetap bisa diubah, dihapus atau ditambah.</p>
    {#each flow.brief.guardrails as _, i (i)}
      <div class="rule">
        <span class="small muted">{i + 1}.</span>
        <input type="text" bind:value={flow.brief.guardrails[i]} aria-label="Aturan {i + 1}" />
        <button class="remove" aria-label="Hapus aturan {i + 1}" onclick={() => flow.brief.guardrails.splice(i, 1)}>×</button>
      </div>
    {/each}
    <form class="rule" onsubmit={(e) => (e.preventDefault(), addRule())}>
      <span class="small muted">+</span>
      <input type="text" bind:value={newRule} placeholder="Tulis aturan baru, misalnya: Jangan sebut nama desa tetangga" />
      <button type="submit" disabled={!newRule.trim()}>Tambah</button>
    </form>
  </section>
</div>

<style>
  .cols {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 20px;
    align-items: start;
  }

  section {
    display: grid;
    gap: 10px;
  }

  .label {
    font-size: 14px;
    font-weight: 600;
  }

  .formats {
    display: grid;
    gap: 6px;
  }

  .format {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    border: 1.5px solid var(--border);
    border-radius: 0;
    padding: 8px 10px;
    cursor: pointer;
  }

  .format.active {
    border-color: var(--accent);
    background: var(--accent-bg);
  }

  .format input {
    margin-top: 5px;
  }

  .hint {
    display: block;
  }

  .tag {
    font-size: 11px;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 0;
    margin-left: 6px;
  }

  .tag.mvp {
    background: var(--hijau-bg);
    color: var(--hijau);
  }

  .tag.later {
    background: var(--fl);
    color: var(--muted);
  }

  .chips {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .chips button {
    font-size: 13px;
    padding: 3px 12px;
    border-radius: 999px;
  }

  .chips button[aria-pressed='true'] {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--on-solid);
  }

  .field {
    display: grid;
    gap: 4px;
  }

  .field.short {
    max-width: 140px;
  }

  .template {
    display: flex;
    gap: 8px;
  }

  select {
    font: inherit;
    flex: 1;
    border: 1.5px solid var(--border);
    border-radius: 0;
    padding: 6px 8px;
    background: var(--card);
  }

  .rule {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .rule > span {
    width: 18px;
    text-align: right;
  }

  .remove {
    padding: 4px 10px;
  }

  .warn {
    color: var(--kuning);
    font-weight: 600;
  }

  @media (max-width: 760px) {
    .cols {
      grid-template-columns: 1fr;
    }
  }
</style>
