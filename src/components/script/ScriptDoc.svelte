<script>
  // The script as a galley proof: a document page with a margin for marks, the AI's notes, and a highlight key
  import { briefFeedback, script, story } from '../../lib/data.js'
  import { flow } from '../../lib/flow.svelte.js'
  import { docOrder, docColor } from '../../lib/script.js'
  import ScriptParagraph from './ScriptParagraph.svelte'

  /**
   * @type {{
   *   selectedId: string, editingId: string | null,
   *   onselect: (id: string, source?: string | null) => void,
   *   onsave: (line: any, text: string) => void, oncancel: () => void
   * }}
   */
  let { selectedId, editingId, onselect, onsave, oncancel } = $props()
</script>

<section class="galley" aria-label="Script">
  <div class="bar">
    <span class="file">script-image-slides.docx</span>
    <span class="ver">Draf AI · {script.length} paragraf</span>
  </div>

  <div class="key" aria-label="Keterangan sorotan">
    <span class="muted">Sorotan = dokumen sumber</span>
    {#each docOrder as id (id)}
      <span class="k"><span class="swatch" style:background={docColor(id)}></span>{id}</span>
    {/each}
    <span class="k"><span class="squiggle kuning">abc</span> cek makna</span>
    <span class="k"><span class="squiggle merah">abc</span> tanpa sumber</span>
  </div>

  <article class="page">
    <header class="doc-head">
      <p class="doc-kicker">Script Image Slides · disusun AI dari bank informasi</p>
      <h1>{story.title}</h1>
      <p class="doc-meta">Nada: {flow.brief.tone}</p>
    </header>

    <aside class="ai-notes">
      <p class="tag">Catatan AI saat menyusun</p>
      <ol>
        {#each briefFeedback as note, i (i)}<li>{note}</li>{/each}
      </ol>
    </aside>

    {#each script as line (line.id)}
      <ScriptParagraph
        {line}
        selected={line.id === selectedId}
        editing={line.id === editingId}
        onselect={(source) => onselect(line.id, source)}
        onsave={(text) => onsave(line, text)}
        {oncancel}
      />
    {/each}

    <p class="end" aria-hidden="true">· selesai ·</p>
  </article>
</section>

<style>
  .galley {
    min-width: 0;
  }

  .bar {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    background: var(--accent);
    color: var(--on-solid);
    padding: 7px 12px;
    font: 400 11px/1 var(--font-mono);
    letter-spacing: 0.4px;
  }

  .file {
    font-weight: 600;
  }

  .key {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 12px;
    border: 1.5px solid var(--border);
    border-top: 0;
    border-bottom: 0;
    background: var(--fl);
    padding: 7px 12px;
    font: 400 11px/1.3 var(--font-mono);
  }

  .muted {
    color: var(--muted);
  }

  .k {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .swatch {
    width: 12px;
    height: 12px;
    border: 1px solid var(--border);
  }

  .squiggle {
    font-family: var(--font-display);
    font-size: 13px;
    text-decoration: underline wavy;
    text-underline-offset: 3px;
  }
  .squiggle.kuning {
    text-decoration-color: var(--kuning);
  }
  .squiggle.merah {
    text-decoration-color: var(--merah);
  }

  /* The page: a ruled margin on the left holds the proof marks */
  .page {
    background:
      linear-gradient(to right, transparent 79px, var(--fl) 79px 80px, transparent 80px),
      var(--card);
    border: 1.5px solid var(--border);
    padding: 36px 40px 28px 104px;
    font: 400 18px/1.7 var(--font-display);
  }

  .doc-head {
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--fl);
  }

  .doc-kicker,
  .doc-meta {
    font: 400 11px/1.4 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--muted);
  }

  h1 {
    font: 500 26px/1.2 var(--font-display);
    letter-spacing: -0.3px;
    margin: 6px 0;
  }

  .ai-notes {
    font: 400 12.5px/1.45 var(--font-ui);
    border: 1.5px dashed var(--border);
    padding: 10px 14px;
    margin-bottom: 22px;
  }

  .tag {
    font: 600 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 6px;
  }

  .ai-notes ol {
    margin: 0;
    padding-left: 18px;
    color: var(--muted);
    display: grid;
    gap: 2px;
  }

  .end {
    margin: 18px 0 0;
    text-align: center;
    font: 400 11px/1 var(--font-mono);
    letter-spacing: 2px;
    color: var(--muted);
  }

  @media (max-width: 560px) {
    .page {
      background:
        linear-gradient(to right, transparent 54px, var(--fl) 54px 55px, transparent 55px),
        var(--card);
      padding: 24px 16px 20px 62px;
      font-size: 16px;
    }
  }
</style>
