<script>
  // Shown on the step a QC revision was routed to (PRD 6.1)
  /** @type {{ type: string, note: string }} */
  let { type, note } = $props()
</script>

<div class="revision" role="status">
  <span class="tag">Revisi dari QC Editorial · {type}</span>
  <p>{note}</p>
  <p class="keep">Bagian lain yang sudah disetujui tetap dipertahankan.</p>
</div>

<style>
  .revision {
    border: 1.5px dashed var(--border);
    background: var(--kuning-bg);
    padding: 10px 14px;
    margin-bottom: 18px;
    display: grid;
    gap: 4px;
  }

  .tag {
    font: 600 11px/1.3 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .keep {
    font-size: 12px;
    color: var(--muted);
  }
</style>
