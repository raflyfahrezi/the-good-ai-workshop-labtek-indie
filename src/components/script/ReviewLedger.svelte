<script>
  // One cell per paragraph. The machine verdict is the top edge, the journalist's decision fills the cell.
  import { auditMark, auditTally, ledger } from '../../lib/script.js'
  import { decisionLabel } from '../../lib/flow.svelte.js'

  /** @type {{ selectedId: string, onselect: (id: string) => void }} */
  let { selectedId, onselect } = $props()

  let cells = $derived(ledger())
  let open = $derived(cells.filter((c) => !c.decision).length)
  let tally = $derived(auditTally())

  const mark = { setuju: '✓', ubah: '✎', buang: '✕' }
</script>

<section class="ledger" class:clear={open === 0} aria-label="Status pemeriksaan paragraf">
  <div class="status">
    <p class="kicker">Pemeriksaan jurnalis</p>
    <p class="big">
      {#if open > 0}
        <strong>{open}</strong> dari {cells.length} paragraf belum diputuskan
      {:else}
        Semua {cells.length} paragraf sudah diputuskan
      {/if}
    </p>
  </div>

  <ol class="cells">
    {#each cells as c (c.id)}
      <li>
        <button
          class="cell {c.audit} {c.decision ?? 'open'}"
          class:selected={c.id === selectedId}
          aria-label="Paragraf {c.slide}, {auditMark[c.audit].label}, {c.decision ? decisionLabel[c.decision] : 'belum diputuskan'}"
          aria-current={c.id === selectedId ? 'true' : undefined}
          onclick={() => onselect(c.id)}
        >
          <span class="n">¶{c.slide}</span>
          <span class="m" aria-hidden="true">{c.decision ? mark[c.decision] : ''}</span>
        </button>
      </li>
    {/each}
  </ol>

  <ul class="tally">
    {#each tally as t (t.key)}
      <li><span class="code {t.key}">{auditMark[t.key].code}</span>{t.count} {auditMark[t.key].label.toLowerCase()}</li>
    {/each}
  </ul>
</section>

<style>
  .ledger {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-areas: 'status cells' 'tally tally';
    gap: 12px 24px;
    align-items: center;
    border: 1.5px solid var(--border);
    background: var(--card);
    padding: 14px 18px;
  }

  .status {
    grid-area: status;
    display: grid;
    gap: 4px;
  }

  .kicker {
    font: 400 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--muted);
  }

  .big {
    font: 400 20px/1.2 var(--font-display);
  }

  .big strong {
    font-weight: 600;
    color: var(--kuning);
  }

  .clear .big {
    color: var(--hijau);
  }

  .cells {
    grid-area: cells;
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(44px, 1fr));
    gap: 4px;
  }

  .cell {
    width: 100%;
    height: 46px;
    padding: 4px 6px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    border-top-width: 5px;
    transition: background 0.2s;
  }

  .cell.hijau {
    border-top-color: var(--hijau);
  }
  .cell.kuning {
    border-top-color: var(--kuning);
  }
  .cell.merah {
    border-top-color: var(--merah);
  }

  .cell.open {
    background: repeating-linear-gradient(-45deg, transparent 0 5px, var(--fl) 5px 6px), var(--card);
  }
  .cell.setuju {
    background: var(--hijau-bg);
  }
  .cell.ubah {
    background: var(--kuning-bg);
  }
  .cell.buang {
    background: var(--fl);
    color: var(--muted);
  }

  .cell.selected {
    outline: 2px solid var(--text);
    outline-offset: 2px;
  }

  .n {
    font: 600 11px/1 var(--font-mono);
  }

  .m {
    align-self: flex-end;
    font: 600 14px/1 var(--font-mono);
  }

  .tally {
    grid-area: tally;
    list-style: none;
    margin: 0;
    padding: 10px 0 0;
    border-top: 1px dashed var(--border);
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
    font-size: 12px;
    color: var(--muted);
  }

  .tally li {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .code {
    font: 600 10px/1 var(--font-mono);
    padding: 2px 4px;
    border: 1px solid currentColor;
  }
  .code.hijau {
    color: var(--hijau);
  }
  .code.kuning {
    color: var(--kuning);
  }
  .code.merah {
    color: var(--merah);
  }

  @media (max-width: 760px) {
    .ledger {
      grid-template-columns: 1fr;
      grid-template-areas: 'status' 'cells' 'tally';
    }
  }
</style>
