<script>
  // Step 2, Brief & Guideline: the journalist sets the goal, the format and the rules the AI must follow
  import { flow } from '../lib/flow.svelte.js'
  import { briefSummary, laterFormats, togglePlatform } from '../lib/brief.js'
  import PageHeader from '../components/PageHeader.svelte'
  import HumanNote from '../components/HumanNote.svelte'
  import FormField from '../components/brief/FormField.svelte'
  import FormatPicker from '../components/brief/FormatPicker.svelte'
  import PlatformPicker from '../components/brief/PlatformPicker.svelte'
  import SlideCount from '../components/brief/SlideCount.svelte'
  import RuleBook from '../components/brief/RuleBook.svelte'
  import BriefSummary from '../components/brief/BriefSummary.svelte'

  let later = $derived(laterFormats())
  let summary = $derived(briefSummary())
</script>

<div class="page">
  <PageHeader
    size="sm"
    kicker="Langkah 2 dari 6"
    title="Brief & Guideline"
    lede="Tentukan tujuan, format, audiens dan platform, lalu aturan main yang wajib dipatuhi AI saat menyusun script."
  />

  <HumanNote>
    Aturan main ditetapkan jurnalis. AI mengikuti brief dan guideline ini, dan QC otomatis memeriksa hasilnya terhadap
    aturan yang sama. Tulis aturan dengan kata-kata Anda sendiri.
  </HumanNote>

  <div class="layout">
    <section class="sheet" aria-label="Brief">
      <header class="sheet-head">
        <h3>Brief</h3>
        <span class="meta">6 isian</span>
      </header>

      <FormField n={1} label="Tujuan konten">
        <textarea rows="2" bind:value={flow.brief.objective} aria-label="Tujuan konten"></textarea>
      </FormField>

      <FormField n={2} label="Format media" hint="Boleh lebih dari satu.">
        <FormatPicker bind:value={flow.brief.formats} />
        {#if later.length}
          <p class="warn">
            {later.map((f) => f.label).join(' dan ')} dicatat di brief, tapi demo ini hanya membuat Image Slides (sesuai MVP).
          </p>
        {/if}
      </FormField>

      <FormField n={3} label="Platform tujuan">
        <PlatformPicker selected={flow.brief.platforms} ontoggle={togglePlatform} />
      </FormField>

      <FormField n={4} label="Audiens">
        <input type="text" bind:value={flow.brief.audience} aria-label="Audiens" />
      </FormField>

      <FormField n={5} label="Tone of voice">
        <input type="text" bind:value={flow.brief.tone} aria-label="Tone of voice" />
      </FormField>

      <FormField n={6} label="Jumlah slide" hint="AI akan memberi catatan bila bahan di bank tidak cukup untuk jumlah ini.">
        <SlideCount bind:value={flow.brief.length} />
      </FormField>
    </section>

    <aside class="side">
      <RuleBook />
      <BriefSummary rows={summary} />
    </aside>
  </div>
</div>

<style>
  .page {
    max-width: 1080px;
    display: grid;
    gap: 20px;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    gap: 24px;
    align-items: start;
  }

  .sheet {
    background: var(--card);
    border: 1.5px solid var(--border);
  }

  .sheet-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 16px 18px 10px;
    border-bottom: 1.5px solid var(--border);
  }

  h3 {
    font: 500 22px/1.1 var(--font-display);
  }

  .meta {
    font: 400 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--muted);
  }

  textarea {
    field-sizing: content;
    resize: vertical;
    font: 400 17px/1.4 var(--font-display);
  }

  .warn {
    font-size: 12px;
    color: var(--kuning);
    background: var(--kuning-bg);
    padding: 6px 10px;
  }

  .side {
    display: grid;
    gap: 16px;
  }

  @media (max-width: 900px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }
</style>
